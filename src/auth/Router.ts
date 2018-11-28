import { Express } from 'express';
import Home from './routes/Home';

export const addRoutes = (app: Express) => {
  app.use('/', Home());
  return app;
};
