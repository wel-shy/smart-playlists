import { Request, Response, Router } from "express"
import { generateRandomString, saveTokenToFile, getRefreshToken } from '../../utils'
import * as querystring from 'querystring'
import * as request from 'request'
import * as path from 'path'

/**
 * Get routes
 * @param  app Express.express
 * @return     Router
 */
function home(): Router {
  const router = Router()

  let stateKey = 'spotify_auth_state'

  // Serve static html
  router.get('/', function(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../../index.html'))
  })

  router.get('/login', function(req: Request, res: Response) {
    let state = generateRandomString(16);

    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state'
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URL,
      state: state
    }))
  })

  router.get('/callback', function(req: Request, res: Response) {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
      res.redirect('/#' + querystring.stringify({
        error: 'state_mismatch'
      }))
    } else {
      res.clearCookie(stateKey)
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: process.env.REDIRECT_URL,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        json: true
      }

      request.post(authOptions, async function(error: Error, response: request.RequestResponse, body: any) {
        const redirectUrl: string = 'http://localhost:8888?'
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token, refresh_token = body.refresh_token

          // store token to file
          if(access_token) {
            try {
              await saveTokenToFile(refresh_token)
              const token = await getRefreshToken()
            } catch(e) {
              console.error(e)
            }
          }
          res.redirect(redirectUrl +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }))
        } else {
          res.redirect(redirectUrl +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      })
    }
  })

  router.get('/refresh_token/:token', function(req, res) {
    // requesting access token from refresh token
    const refresh_token: string = req.query.refresh_token || req.params.token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });

  return router
}

export default home
