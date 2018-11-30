import { Express } from 'express';
import HomeRouter from './routes/HomeRouter';
import UserRouter from './routes/UserRouter';

export const addRoutes = (app: Express) => {
  app.use('/', HomeRouter());
  app.use('/api/user', new UserRouter().getRouter());
  return app;
};
