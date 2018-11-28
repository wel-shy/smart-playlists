import * as request from 'request';
import { Track } from './Track';
import { Playlist } from './Playlist';
import axios from 'axios';

/**
 * Emulate the spotify api.
 */
export class SpotifyAPI {
  /**
   * Get an auth token
   * @param {string} refreshToken
   * @returns {Promise<string>}
   */
  async fetchAuthToken(refreshToken: string): Promise<string> {
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
   * Get the user's playlists
   * @param {string} accessToken
   * @returns {Promise<Playlist[]>}
   */
  getUserPlaylists(accessToken: string): Promise<Playlist[]> {
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
   * Get the user's last tracks.
   * @param {string} accessToken
   * @returns {Promise<Track[]>}
   */
  getUserLastTracks(accessToken: string): Promise<Track[]> {
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
   * Add tracks to a playlist.
   * @param {string} playlistId
   * @param {Track[]} tracks
   * @param {string} accessToken
   * @returns {Promise<void>}
   */
  async addTracksToPlaylist(
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
   * Remove tracks from a playlist.
   * @param {string} playlistId
   * @param {Track[]} tracks
   * @param {string} accessToken
   * @returns {Promise<void>}
   */
  async removeTracksFromPlaylist(
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

  /**
   * Get tracks in a playlist
   * @param {string} playlistId
   * @param {string} accessToken
   * @returns {Promise<Track[]>}
   */
  getTracksInPlaylist(
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
}
