import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as request from 'request'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

/**
 * Generate a random string
 * @param  length length of random string
 * @return        [description]
 */
export function generateRandomString(length: number): string {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return text
}

/**
 * Save a token to file
 * @param  token [description]
 * @return       [description]
 */
export async function saveTokenToFile(token: string): Promise<void> {
	const filePath = path.join(__dirname, '/../refresh_token.txt')
	await writeFile(filePath, token)
}

/**
 * Get a token from a file
 * @return [description]
 */
export async function getRefreshToken(): Promise<string> {
	const filePath = path.join(__dirname, '/../refresh_token.txt')

	let token: string = await readFile(filePath, 'utf8')
  token = token.trim()
	return token
}

/**
 * Get an access token from spotify
 * @param  refreshToken [description]
 * @return              [description]
 */
export async function fetchAuthToken(refreshToken: string): Promise<string> {
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		},
		json: true
	};

  return new Promise<string>((resolve, reject) => {
    request.post(authOptions, function(error, response: request.Response, body: any) {
      if (error) {
        console.log('error')
        reject(error)
      }
      else if (!error && response.statusCode === 200) {
        const access_token: string = body.access_token;
        resolve(access_token)
      }
      else {
        console.log(response)
      }
    });
  })
}

/**
 * Get a user's playlists
 * @param  accessToken [description]
 * @return             [description]
 */
export async function getUserPlaylists(accessToken: string): Promise<{}[]> {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { 'Authorization': 'Bearer ' + accessToken},
    json: true
  }

  return new Promise<{}[]>((resolve, reject) => {
    request.get(options, (error: Error, response: request.RequestResponse, body: any) => {
      if (error) {
        reject(error)
      } else if (response.statusCode === 200) {
        resolve(body.items)
      } else {
        reject(response)
      }
    })
  })
}
