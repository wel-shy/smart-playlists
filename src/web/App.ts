//
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { dbOptions } from './config/ORM';
import * as path from 'path';
import { getServer } from './config/Config';

dotenv.config(
  {
    path: path.join(__dirname, '../../.env'),
  },
);

const app = getServer();

// Create a connection to the database.
createConnection(dbOptions).then(async (connection) => {
  console.log('Connected to DB', connection.isConnected);

  app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
  });

}).catch(error => console.log('TypeORM connection error: ', error));
