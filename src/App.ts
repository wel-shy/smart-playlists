import * as dotenv from 'dotenv';
import { RecentlyAdded } from './builders/RecentlyAdded';
import { SpotifyAPI } from './SpotifyAPI';
import * as path from 'path';
import { createConnection } from 'typeorm';
import { dbOptions } from './web/config/ORM';
import { UserController } from './web/controllers/UserController';
import { User } from './web/entities/User';

// Load environment variables.
dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const spotify: SpotifyAPI = new SpotifyAPI();
let userController;

async function main() {
  // Create a connection to the database.
  createConnection(dbOptions).then(async (connection) => {
    console.log('Connected to DB', connection.isConnected);

    userController = new UserController();
    const users = await userController.getUsers();

    // For each user, update recently added playlist.
    users.forEach(async (user: User) => {
      console.log(`Updating playlist for: ${user.email}`);
      const accessToken = await spotify.fetchAuthToken(user.refreshToken);
      const recentlyAdded: RecentlyAdded = new RecentlyAdded(accessToken);
      await recentlyAdded.execute();
      console.log('Playlist updated');
    });

    connection.close();
  }).catch(error => console.log('TypeORM connection error: ', error));
}

main();
