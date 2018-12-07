import { describe } from 'mocha';
import { SpotifyAPI } from '../../SpotifyAPI';
import { getTextFromFile } from '../../Utils';
import { expect } from 'chai';
import { Playlist } from '../../Playlist';
import { Track } from '../../Track';
import { SpotifyUser } from '../../SpotifyUser';

describe('Spotify API', () => {
  let spotify: SpotifyAPI;
  before(() => {
    spotify = new SpotifyAPI();
  });

  describe('Authenticate', () => {
    describe('Fetch an web token from the Spotify API', () => {
      it('Should get a token from Spotify', (done) => {
        getTextFromFile('refresh_token.txt')
          .then((refreshToken) => {
            spotify.fetchAuthToken(refreshToken)
              .then((accessToken) => {
                expect(accessToken).to.be.a('string');
                expect(accessToken.length).to.be.greaterThan(1);
                done();
              });
          });
      });
    });
  });

  describe('User', () => {
    let refreshToken: string;
    let accessToken: string;
    before(async () => {
      refreshToken = await getTextFromFile('refresh_token.txt');
      accessToken = await spotify.fetchAuthToken(refreshToken);
    });

    describe('Get the users profile', () => {
      it('Should return the users details', (done) => {
        spotify.getUserInfo(accessToken).then((user: SpotifyUser) => {
          expect(user.spotifyId).not.equal(null);
          expect(user.displayName).not.equal(null);
          expect(user.email).not.equal(null);
          done();
        });
      });
    });
  });

  describe('Tracks and Playlists', () => {
    let refreshToken: string;
    let accessToken: string;
    let user: SpotifyUser;
    before(async () => {
      refreshToken = await getTextFromFile('refresh_token.txt');
      accessToken = await spotify.fetchAuthToken(refreshToken);
      user = await spotify.getUserInfo(accessToken);
    });

    describe('Fetch a users playlists', () => {
      it('Should return a users playlists', (done) => {
        spotify.getUserPlaylists(accessToken)
          .then((playlists: Playlist[]) => {
            expect(playlists.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    describe('Get users last added tracks', () => {
      it('Should return the last tracks the user added', (done) => {
        spotify.getUserLastTracks(accessToken)
          .then((tracks: Track[]) => {
            expect(tracks.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    describe('Create a playlist', () => {
      it('Should create a playlist', (done) => {
        spotify.createPlaylist(
          'Test Playlist',
          'This is a test playlist',
          user.spotifyId,
          accessToken,
        )
          .then((id) => {
            expect(id).not.equal(null);
            done();
          });
      });
    });

    describe('Tracks', () => {
      let playlistId: string;
      let playlistTracks: Track[];

      before(async () => {
        playlistId = (await spotify.getUserPlaylists(accessToken))
          .find(playlist => playlist.name === 'Test').id;
      });

      describe('Get tracks in a playlist', () => {
        it('Should return all tracks in a playlist', ((done) => {
          spotify.getTracksInPlaylist(playlistId, accessToken)
            .then((tracks: Track[]) => {
              expect(tracks.length).to.be.greaterThan(0);
              playlistTracks = tracks;
              done();
            });
        }));
      });

      describe('Add and remove tracks from a playlist', () => {
        describe('Remove a track from a playlist', () => {
          it('Should remove a track from a playlist', (done) => {
            spotify.removeTracksFromPlaylist(playlistId, [playlistTracks[0]], accessToken)
              .then(() => {
                done();
              });
          });
        });

        describe('Add a track from a playlist', () => {
          it('Should remove a track from a playlist', (done) => {
            spotify.addTracksToPlaylist(playlistId, [playlistTracks[0]], accessToken)
              .then(() => {
                done();
              })
              .catch((e) => {
                console.error(e);
                throw e;
              });
          });
        });
      });
    });
  });
});
