import * as dotenv from 'dotenv';
import { getRefreshToken, fetchAuthToken } from './Utils';
import { RecentlyAdded } from './builders/RecentlyAdded';

// Load environment variables.
dotenv.load();

let refreshToken: string;
let accessToken: string;

async function main() {
  refreshToken = await getRefreshToken();
  accessToken = await fetchAuthToken(refreshToken);

  const recentlyAdded: RecentlyAdded = new RecentlyAdded(accessToken);
  await recentlyAdded.execute();
}

main();
