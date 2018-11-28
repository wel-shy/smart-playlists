import { Track } from '../Track';
import { SpotifyAPI } from '../SpotifyAPI';
import { Playlist } from '../Playlist';

/**
 * Create a recently added playlist
 */
export class RecentlyAdded {
  accessToken: string;
  private limit: number = 25;
  spotify: SpotifyAPI = new SpotifyAPI();

  /**
   * Give the smart playlist an access token.
   * @param {string} accessToken
   */
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get the users last added tracks.
   * @returns {Promise<void>}
   */
  private async getUsersLastTracks() {
    return await this.spotify.getUserLastTracks(this.accessToken);
  }

  /**
   * Get the users recently added playlist.
   * @returns {Promise<Playlist>}
   */
  private async getRecentlyAddedPlaylist(): Promise<Playlist> {
    const usersPlaylists = await this.spotify.getUserPlaylists(this.accessToken);
    return usersPlaylists.find(playlist => playlist.name === 'Recently Added');
  }

  /**
   * Get the tracks in the recently added playlist.
   * Returns playlist sorted by date added by
   * @param {string} playlistId
   * @returns {Promise<Track[]>}
   */
  private async getTracksInRecentlyAddedPlaylist(playlistId: string): Promise<Track[]> {
    const recentlyAddedTracks: Track[] = await this.spotify.getTracksInPlaylist(playlistId, this.accessToken);
    return recentlyAddedTracks.sort(((a, b) => {
      if (+a.added > +b.added) {
        return 1;
      }
      if (+a.added < +b.added) {
        return -1;
      }
      return 0;
    }));
  }

  /**
   * Get a list of tracks to add.
   * @param {Track[]} lastAdded
   * @param {Track[]} recentlyAdded
   * @returns {Track[]}
   */
  private getTracksToAdd(lastAdded: Track[], recentlyAdded: Track[]): Track[] {
    const tracksToAdd: Track[] = [];

    if (recentlyAdded.length < this.limit) {
      return lastAdded.splice(0, this.limit);
    }

    lastAdded.forEach((track, index) => {
      if (+(track.added) > +(recentlyAdded[0].added)) {
        tracksToAdd.push(lastAdded[index]);
      }
    });

    return tracksToAdd;
  }

  /**
   * Get a list of tracks to remove.
   * @param {Track[]} tracksToAdd
   * @param {Track[]} recentlyAdded
   * @returns {Track[]}
   */
  private getTracksToRemove(tracksToAdd: Track[], recentlyAdded: Track[]): Track[] {
    tracksToAdd.forEach(track => recentlyAdded.unshift(track));
    if (recentlyAdded.length > this.limit) {
      return recentlyAdded.splice(this.limit, recentlyAdded.length - this.limit);
    }
    return [];
  }

  /**
   * Execute the program
   * Update the user's recently added playlist.
   * @returns {Promise<void>}
   */
  async execute(): Promise<void> {
    const usersLastAddedSongs: Track[] = (await this.getUsersLastTracks()).reverse();
    const recentlyAddedPlaylist: Playlist = await this.getRecentlyAddedPlaylist();
    const recentlyAddedTracks: Track[] =
      await this.getTracksInRecentlyAddedPlaylist(recentlyAddedPlaylist.id);
    const tracksToAdd: Track[] = this.getTracksToAdd(usersLastAddedSongs, recentlyAddedTracks);
    const tracksToRemove: Track[] = this.getTracksToRemove(tracksToAdd, recentlyAddedTracks);

    try {
      await this.spotify.removeTracksFromPlaylist(
        recentlyAddedPlaylist.id,
        tracksToRemove,
        this.accessToken);
      await this.spotify.addTracksToPlaylist(
        recentlyAddedPlaylist.id,
        tracksToAdd,
        this.accessToken);
    } catch (e) {
      console.error(e);
    }
  }
}
