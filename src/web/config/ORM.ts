import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';
import { User } from '../entities/User';
import { Subscription } from '../entities/Subscription';
import { Playlist } from '../entities/Playlist';

export const dbOptions: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    User,
    Subscription,
    Playlist,
  ],
  synchronize: true,
};
