import * as dotenv from 'dotenv';
import {
  getRefreshToken,
  fetchAuthToken,
  getUserLastTracks,
  getUserPlaylists,
  getTracksInPlaylist,
  removeTracksFromPlaylist,
  addTracksToPlaylist,
} from './utils';
import { Track } from './track';
import { Playlist } from './playlist';
import { compareTracksTo } from './comparator';

dotenv.load();

let refreshToken: string;
let accessToken: string;
const playlistLimit: number = 25;

async function main() {
  refreshToken = await getRefreshToken();
  accessToken = await fetchAuthToken(refreshToken);

  let tracks: Track[];
  let playlists: Playlist[];
  let recentlyAdded: Playlist;

  try {
    tracks = await getUserLastTracks(accessToken);
    playlists = await getUserPlaylists(accessToken);
  } catch (e) {
    console.error(e);
  }

  for (const playlist of playlists) {
    if (playlist.name === 'Recently Added') recentlyAdded = playlist;
  }

  let recentlyAddedTracks: Track[];

  try {
    recentlyAddedTracks = await getTracksInPlaylist(recentlyAdded.id, accessToken);
  } catch (e) {
    console.error(e);
  }

  recentlyAddedTracks = recentlyAddedTracks.sort((a: Track, b: Track) => compareTracksTo(a, b));
  console.log(recentlyAddedTracks.length);

  let tracksToAdd: Track[] = [];
  let tracksToRemove: Track[] = [];

  // add to start of playlist
  let numAdded: number = 0;

  if (recentlyAddedTracks.length === 0) {
    tracksToAdd = tracks.splice(0, playlistLimit);
  } else {
    tracks = tracks.reverse();
    tracks.forEach((track, index) => {
      if (+(track.added) > +(recentlyAddedTracks[0].added)) {
        recentlyAddedTracks.unshift(tracks[index]);
        tracksToAdd.push(tracks[index]);
        numAdded += 1;
      }
    });
  }

  if (recentlyAddedTracks.length > playlistLimit) {
    tracksToRemove = recentlyAddedTracks.splice(
      playlistLimit,
      recentlyAddedTracks.length - playlistLimit);
  }

  console.log(tracksToAdd);

  try {
    await removeTracksFromPlaylist(recentlyAdded.id, tracksToRemove, accessToken);
    await addTracksToPlaylist(recentlyAdded.id, tracksToAdd, accessToken);
  } catch (e) {
    console.error(e);
    console.log(e.data.error);
  }
}

main();
