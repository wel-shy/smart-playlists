//
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { dbOptions } from './config/ORM';
import * as path from 'path';
import { UserRepository } from './repositories/UserRepository';
import { getServer } from './config/Config';
import { SubscriptionRepository } from './repositories/SubscriptionRepository';

dotenv.config(
  {
    path: path.join(__dirname, '../../.env'),
  },
);

const app = getServer();

// Create a connection to the database.
createConnection(dbOptions).then(async (connection) => {
  console.log('Connected to DB', connection.isConnected);

  const userController = new UserRepository();
  const users = await userController.getAll();

  console.log(users);

  const subscriptionController = new SubscriptionRepository();
  const subs = await subscriptionController.getAll();
  console.log(subs);

  app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
  });

}).catch(error => console.log('TypeORM connection error: ', error));
