import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as request from 'request';
import { Track } from './Track';
import { Playlist } from './Playlist';
import axios from 'axios';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

/**
 * Generate a random string
 * @param  length length of random string
 * @return        [description]
 */
export function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let count = 0;
  while (count > 0) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    count += 1;
  }

  return text;
}

/**
 * Save a token to file
 * @param  token [description]
 * @return       [description]
 */
export async function saveTokenToFile(token: string): Promise<void> {
  const filePath = path.join(__dirname, '/../refresh_token.txt');
  await writeFile(filePath, token);
}

/**
 * Get a token from a file
 * @return [description]
 */
export async function getRefreshToken(): Promise<string> {
  const filePath = path.join(__dirname, '/../refresh_token.txt');

  let token: string = await readFile(filePath, 'utf8');
  token = token.trim();
  return token;
}

/**
 * Get an access token from spotify
 * @param  refreshToken [description]
 * @return              [description]
 */
export async function fetchAuthToken(refreshToken: string): Promise<string> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        `Basic ${(new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)
          .toString('base64'))}`,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  return new Promise<string>((resolve, reject) => {
    request.post(authOptions, (error, response: request.Response, body: any) => {
      if (error) {
        console.log('error');
        reject(error);
      } else if (!error && response.statusCode === 200) {
        const access_token: string = body.access_token;
        resolve(access_token);
      } else {
        console.log(response);
      }
    });
  });
}

/**
 * Get a user's playlists
 * @param  accessToken [description]
 * @return             [description]
 */
export async function getUserPlaylists(accessToken: string): Promise<Playlist[]> {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise<Playlist[]>((resolve, reject) => {
    request.get(options, (error: Error, response: request.RequestResponse, body: any) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        const playlists: Playlist[] = [];
        for (const item of body.items) {
          const playlist = new Playlist(item.id, item.name, item.uri);
          playlists.push(playlist);
        }
        resolve(playlists);
      } else {
        reject(response);
      }
    });
  });
}

/**
 * Get a users last 50 added tracks.
 * @param  accessToken
 * @return
 */
export async function getUserLastTracks(accessToken: string): Promise<Track[]> {
  const options = {
    url: 'https://api.spotify.com/v1/me/tracks?offset=0&limit=50',
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise<Track[]>((resolve, reject) => {
    request.get(options, (error: Error, response: request.RequestResponse, body: any) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        const tracks: Track[] = [];
        for (const item of response.body.items) {
          const artist: string = item.track.artists.length > 1 ?
            item.track.artists.map((track: any) => track.name).join(', ') :
            item.track.artists[0].name;
          const track = new Track(
            item.track.id,
            item.track.name,
            item.track.album.name,
            artist,
            new Date(item.added_at),
            item.track.uri,
          );
          tracks.push(track);
        }
        resolve(tracks);
      } else {
        reject(response);
      }
    });
  });
}

/**
 * Get an access token from spotify
 * @return              [description]
 * @param accessToken
 * @param playlistId
 * @param tracks
 */
export async function addTracksToPlaylist(
  playlistId: string,
  tracks: Track[],
  accessToken: string):
  Promise<void> {
  const uriList: any = { uris: [] };
  uriList.uris = tracks.map(track => track.uri);

  await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, uriList,  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Get tracks in a playlist
 * @param  playlistId  [playlist id]
 * @param  accessToken [access token]
 * @return             [Promise<Track[]>]
 */
export async function getTracksInPlaylist(
  playlistId: string,
  accessToken: string):
  Promise<Track[]> {
  const fields: string = 'items(added_at,track(name,uri,id,album.name,artists))';
  const limit: number = 100;
  const options = {
    url:
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&fields=${fields}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise<Track[]>((resolve, reject) => {
    request.get(options, (error: Error, response: request.RequestResponse, body: any) => {
      if (error) {
        reject(error);
      } else if (response.statusCode === 200) {
        const tracks: Track[] = [];
        for (const item of body.items) {
          const track = new Track(
            item.track.id,
            item.track.name,
            item.track.album.name,
            item.track.artists[0].name,
            new Date(item.added_at),
            item.track.uri,
          );
          tracks.push(track);
        }
        resolve(tracks);
      } else {
        reject(response);
      }
    });
  });
}

/**
 * Remove an array of tracks from a playlist
 * @param {string} playlistId
 * @param {Track[]} tracks
 * @param {string} accessToken
 * @returns {Promise<void>}
 */
export async function removeTracksFromPlaylist(
  playlistId: string,
  tracks: Track[],
  accessToken: string):
  Promise<void> {
  const uriList: any = { tracks: [] };
  uriList.tracks = tracks.map((track) => {
    return { uri: track.uri };
  });

  await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: uriList,
  });
}
