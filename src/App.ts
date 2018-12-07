import * as dotenv from 'dotenv';
import * as path from 'path';
// Load environment variables.
dotenv.config({
  path: path.join(__dirname, '../.exec.env'),
});

import { SpotifyAPI } from './SpotifyAPI';
import { createConnection } from 'typeorm';
import { dbOptions } from './web/config/ORM';
import { UserRepository } from './web/repositories/UserRepository';
import { User } from './web/entities/User';
import { IBuilder } from './builders/IBuilder';
import { SubscriptionRepository } from './web/repositories/SubscriptionRepository';
import { Subscription } from './web/entities/Subscription';
import * as fs from 'fs';
import { promisify } from 'util';
import { Playlist } from './web/entities/Playlist';
import { GenericRepository } from './web/repositories/GenericRepository';

const readdir = promisify(fs.readdir);

const spotify: SpotifyAPI = new SpotifyAPI();
const playlistBuilders: Map<string, IBuilder> = new Map<string, IBuilder>();
let users: User[];

async function main() {
  // Create a connection to the database.
  createConnection(dbOptions).then(async (connection) => {
    console.log('Connected to DB', connection.isConnected);
    const userSubPromises: Promise<Subscription[]>[] = [];
    const playlists: Playlist[] = await (new GenericRepository<Playlist>(Playlist)).getAll();
    let allSubscriptions: Subscription[][];

    // Get all users and playlists.
    users = await (new UserRepository()).getAll();

    // Get a list of sub queries.
    users.forEach((user) => {
      userSubPromises.push(getUsersSubscriptions(user));
    });
    try {
      allSubscriptions = await Promise.all(userSubPromises);
    } catch (e) {
      console.error(e);
    }

    // Attach users subscriptions to each user.
    allSubscriptions.forEach((subs, index) => {
      users[index].subscriptions = subs;
      console.log(users[index]);
    });

    // Close the database connection.
    connection.close();

    // Get all builders from file.
    await initialisePlaylistBuilders();

    // Join playlist to associated builder.
    const executors: Map<number, IBuilder> = new Map<number, IBuilder>();
    playlists.forEach((playlist) => {
      executors.set(playlist.id, playlistBuilders.get(playlist.name.split(' ').join('')));
    });

    // Get a list of executors for each user.
    users.forEach(async (user: User) => {
      const userExecutors: Promise<void>[] = [];
      const accessToken = await spotify.fetchAuthToken(user.refreshToken);
      user.subscriptions.forEach((sub) => {
        const playlistBuilder: IBuilder =
          executors.get(parseInt(`${sub.playlist}`, 10)).getInstance();
        playlistBuilder.setAccessToken(accessToken);
        userExecutors.push(playlistBuilder.execute());
        console.log(
          `Executing: ${executors.get(parseInt(`${sub.playlist}`, 10))
            .toString()}, for ${user.email}`);
      });

      await Promise.all(userExecutors);
    });
  }).catch(error => console.log('TypeORM connection error: ', error));
}

/**
 * Get the users subscriptions.
 * @param {User} user
 * @returns {Promise<Subscription[]>}
 */
async function getUsersSubscriptions(user: User): Promise<Subscription[]> {
  return new Promise<Subscription[]>((async (resolve, reject) => {
    try {
      const subs: Subscription[] = await (new SubscriptionRepository()).getUserSubscriptions(user);
      resolve(subs);
    } catch (e) {
      reject(e);
    }
  }));
}

/**
 * Import and return a new instance of each playlist.
 * @param {string} path
 * @returns {Promise<void>}
 */
function getImport(path: string): Promise<void> {
  return new Promise<any>(((resolve, reject) => {
    import(path)
      .then((value: any) => {
        const builder: IBuilder = value.default();
        playlistBuilders.set(path.split('/')[path.split('/').length - 1].split('.js')[0], builder);
        resolve();
      })
      .catch(e => reject(e));
  }));
}

/**
 * Dynamically load playlistBuilders from directory
 * @returns {Promise<IBuilder[]>}
 */
async function initialisePlaylistBuilders(): Promise<void> {
  const playlistPath: string = path.join(__dirname, '/builders');
  let directory: string[];

  try {
    directory = await readdir(playlistPath);
  } catch (e) {
    console.error(e);
  }

  if (!directory) return;
  const playlistImportPromises: Promise<any>[] = [];

  directory.forEach(async (fileName: string) => {
    if (fileName === 'IBuilder.js') return;
    playlistImportPromises.push(getImport(`./builders/${fileName}`));
  });

  await Promise.all(playlistImportPromises);
}

main();
