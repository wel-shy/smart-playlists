import { Track } from '../Track';
import { SpotifyAPI } from '../SpotifyAPI';
import { Playlist } from '../Playlist';
import { BasePlaylistBuilder } from './BasePlaylistBuilder';
import { SpotifyUser } from '../SpotifyUser';

/**
 * Create a recently added playlist
 * Create a new instance of this object through the PlaylistBuilderFactory.
 * Use Prototype.PlaylistBuilderFactory.getPlaylistBuilder('RecentlyAdded');
 */
export class RecentlyAdded extends BasePlaylistBuilder{
  private limit: number = 25;
  spotify: SpotifyAPI = new SpotifyAPI();

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
    const recentlyAddedTracks: Track[] =
      await this.spotify.getTracksInPlaylist(playlistId, this.accessToken);
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
      return lastAdded.reverse().splice(0, this.limit);
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
    const spotifyUser: SpotifyUser = await this.spotify.getUserInfo(this.accessToken);
    const usersLastAddedSongs: Track[] = (await this.getUsersLastTracks()).reverse();
    let recentlyAddedPlaylist: Playlist = await this.getRecentlyAddedPlaylist();

    if (!recentlyAddedPlaylist) {
      recentlyAddedPlaylist = await this.spotify.createPlaylist(
        'Recently Added',
        'Your top 25 most recently saved songs. ' +
        'Manage your subscription at https://smart-lists.dwelsh.uk',
        spotifyUser.spotifyId,
        this.accessToken,
      );
    }

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

  toString(): string {
    return 'Recently Added';
  }

  getInstance(): RecentlyAdded {
    return new RecentlyAdded();
  }
}

/**
 * Default function must return an instance of the class.
 * This is to allow the PlaylistBuilderFactory to initialise.
 * @returns {RecentlyAdded}
 */
export default function getInstance(): RecentlyAdded {
  return new RecentlyAdded();
}
