//
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config(
  {
    path: path.join(__dirname, '../../.env'),
  },
);

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { dbOptions } from './config/ORM';
import { getServer } from './config/Config';

const app = getServer();

// Create a connection to the database.
createConnection(dbOptions).then(async (connection) => {
  console.log('Connected to DB', connection.isConnected);

  app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
  });

}).catch(error => console.log('TypeORM connection error: ', error));
