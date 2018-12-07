import * as dotenv from 'dotenv';
import * as path from 'path';
// Load environment variables.
dotenv.config({
  path: path.join(__dirname, '../.env'),
});

import { SpotifyAPI } from './SpotifyAPI';
import { createConnection } from 'typeorm';
import { dbOptions } from './web/config/ORM';
import { UserRepository } from './web/repositories/UserRepository';
import { User } from './web/entities/User';
import { BasePlaylistBuilder } from './builders/BasePlaylistBuilder';
import { SubscriptionRepository } from './web/repositories/SubscriptionRepository';
import { Subscription } from './web/entities/Subscription';
import { Playlist } from './web/entities/Playlist';
import { GenericRepository } from './web/repositories/GenericRepository';
import PlaylistBuilderFactory from './builders/PlaylistBuilderFactory';

const spotify: SpotifyAPI = new SpotifyAPI();
let users: User[];

/**
 *
 * @returns {Promise<void>}
 */
async function main() {
  // Create a connection to the database.
  createConnection(dbOptions).then(async (connection) => {
    console.log('Connected to DB', connection.isConnected);
    const userSubPromises: Promise<Subscription[]>[] = [];
    const playlists: Playlist[] = await (new GenericRepository<Playlist>(Playlist)).getAll();
    const playlistBuilderFactory: PlaylistBuilderFactory = new PlaylistBuilderFactory();
    const subscriptionRepository: SubscriptionRepository = new SubscriptionRepository();
    let allSubscriptions: Subscription[][];

    // Get all users and playlists.
    users = await (new UserRepository()).getAll();

    // Get a list of sub queries.
    users.forEach((user) => {
      userSubPromises.push(subscriptionRepository.getUserSubscriptions(user));
    });
    try {
      allSubscriptions = await Promise.all(userSubPromises);
    } catch (e) {
      console.error(e);
    }

    // Attach users subscriptions to each user.
    allSubscriptions.forEach((subs, index) => {
      users[index].subscriptions = subs;
    });

    // Close the database connection.
    connection.close();

    // Initialise all playlist builders.
    await playlistBuilderFactory.initialisePlaylistBuilders();

    // Join playlist to associated builder.
    const executors: Map<number, BasePlaylistBuilder> = new Map<number, BasePlaylistBuilder>();
    playlists.forEach((playlist) => {
      executors
        .set(
          playlist.id,
          playlistBuilderFactory.getPlaylistBuilder(playlist.name.split(' ').join('')),
        );
    });

    // Get a list of executors for each user.
    users.forEach(async (user: User) => {
      const userExecutors: Promise<void>[] = [];
      const accessToken = await spotify.fetchAuthToken(user.refreshToken);
      user.subscriptions.forEach((sub) => {
        executors.get(parseInt(`${sub.playlist}`, 10)).setAccessToken(accessToken);
        userExecutors.push(executors.get(parseInt(`${sub.playlist}`, 10)).execute());
        console.log(
          `Executing: ${executors.get(parseInt(`${sub.playlist}`, 10))
            .toString()}, for ${user.email}`);
      });

      await Promise.all(userExecutors);
    });
  }).catch(error => console.log('TypeORM connection error: ', error));
}

main();
