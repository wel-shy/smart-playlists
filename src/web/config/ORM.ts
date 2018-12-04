import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';
import { User } from '../entities/User';
import { Subscription } from '../entities/Subscription';
import { Builder } from '../entities/Builder';

export const dbOptions: ConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'secret',
  database: 'smartlist',
  entities: [
    User,
    Subscription,
    Builder,
  ],
  synchronize: true,
};
