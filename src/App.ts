import * as dotenv from 'dotenv';
import { getTextFromFile } from './Utils';
import { RecentlyAdded } from './builders/RecentlyAdded';
import { SpotifyAPI } from './SpotifyAPI';

// Load environment variables.
dotenv.load();

let refreshToken: string;
let accessToken: string;
const spotify: SpotifyAPI = new SpotifyAPI();

async function main() {
  refreshToken = await getTextFromFile('refresh_token.txt');
  accessToken = await spotify.fetchAuthToken(refreshToken);

  const recentlyAdded: RecentlyAdded = new RecentlyAdded(accessToken);
  await recentlyAdded.execute();
}

main();
