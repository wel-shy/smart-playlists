import { Request, Response, Router } from 'express';
import { generateRandomString, generateToken } from '../../Utils';
import * as querystring from 'querystring';
import * as request from 'request';
import * as path from 'path';
import { SpotifyAPI } from '../../SpotifyAPI';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

/**
 * Get routes
 * @return Router
 */
function homeRouter(): Router {
  const router = Router();
  const stateKey = 'spotify_auth_state';
  const spotify = new SpotifyAPI();

  // Serve static html
  router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../index.html'));
  });

  router.get('/login', (req: Request, res: Response) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope: string = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' ');

    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
      scope,
      state,
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URL,
    })}`);
  });

  router.get('/callback', (req: Request, res: Response) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(`/#${querystring.stringify({
        error: 'state_mismatch',
      })}`);
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code,
          redirect_uri: process.env.REDIRECT_URL,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization:
            `Basic ${(new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)
              .toString('base64'))}`,
        },
        json: true,
      };

      request.post(authOptions, async (
        error: Error,
        response: request.RequestResponse,
        body: any) => {
        const redirectUrl: string = 'http://localhost:8080?'; /*`${process.env.HOST}?`*/
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;

          let authToken: string;
          let user: User;

            // store token to file
          if (access_token) {
            try {
              const spotifyUser = await spotify.getUserInfo(access_token);
              const userRepository = new UserRepository();

              user = new User(spotifyUser.email, spotifyUser.displayName, refresh_token);
              const storedUser = await userRepository.getUserByEmail(user.email);

              if (storedUser) {
                user = storedUser;
              } else {
                await user.save();
              }

              authToken = generateToken(user);

            } catch (e) {
              console.error(e);
              res.status(500);
              return res.json({
                error: e,
              });
            }
          }
          res.redirect(redirectUrl +
              querystring.stringify({
                authToken,
                user: user.displayName,
              }));
        } else {
          res.redirect(redirectUrl +
              querystring.stringify({
                error: 'invalid_token',
              }));
        }
      });
    }
  });

  return router;
}

export default homeRouter;
