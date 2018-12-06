import { Express } from 'express';
import HomeRouter from './routes/HomeRouter';
import UserRouter from './routes/UserRouter';
import { SubscriptionRouter } from './routes/SubscriptionRouter';
import { PlaylistRouter } from './routes/PlaylistRouter';

export const addRoutes = (app: Express) => {
  app.use('/', HomeRouter());
  app.use('/api/user', new UserRouter().getRouter());
  app.use('/api/subs', new SubscriptionRouter().getRouter());
  app.use('/api/playlists', new PlaylistRouter().getRouter());
  return app;
};
