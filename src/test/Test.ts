import { describe } from 'mocha';
import * as dotenv from 'dotenv';

describe('App', () => {
  before(() => {
    dotenv.load();
  });

  /**
   * Import tests from files
   */
  require('./modules/Spotify');
  require('./modules/playlists/RecentlyAdded');
});
