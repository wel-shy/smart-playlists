import { Request, Response, Router } from 'express';
import { generateRandomString, writeToFile } from '../../Utils';
import * as querystring from 'querystring';
import * as request from 'request';
import * as path from 'path';

/**
 * Get routes
 * @return Router
 */
function home(): Router {
  const router = Router();

  const stateKey = 'spotify_auth_state';

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
        const redirectUrl: string = `${process.env.HOST}?`;
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;

            // store token to file
          if (access_token) {
            try {
              await writeToFile(refresh_token, 'refresh_token.txt');
            } catch (e) {
              console.error(e);
            }
          }
          res.redirect(redirectUrl +
              querystring.stringify({
                access_token,
                refresh_token,
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

  router.get('/refresh_token/:token', (req: Request, res: Response) => {
    // requesting access token from refresh token
    const refreshToken: string = req.query.refresh_token || req.params.token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${(new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)
          .toString('base64'))}`,
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const accessToken = body.access_token;
        res.send({
          access_token: accessToken,
        });
      }
    });
  });

  return router;
}

export default home;
