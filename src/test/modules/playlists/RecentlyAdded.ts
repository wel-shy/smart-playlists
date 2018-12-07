import { describe } from 'mocha';
import  RecentlyAdded  from '../../../builders/RecentlyAdded';
import { getTextFromFile } from '../../../Utils';
import { SpotifyAPI } from '../../../SpotifyAPI';

describe('Recently Added', () => {
  let accessToken: string;
  const spotify: SpotifyAPI = new SpotifyAPI();

  before(async () => {
    const refreshToken: string = await getTextFromFile('refresh_token.txt');
    accessToken = await spotify.fetchAuthToken(refreshToken);
  });

  //it('Should execute',  (done) => {
  //  const recentlyAdded: RecentlyAdded = new RecentlyAdded(accessToken);
  //  recentlyAdded.execute().then(() => {
  //    done();
  //  });
  //});
});
