import { Express } from 'express';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { addRoutes } from '../Router';

export function getServer(): Express {
  let app = express();

// Add cors
  app.use(cors({
    origin: '*',
  }));

  app.use(express.static('public'));

// Add cookie parser
  app.use(cookieParser());

// Body parser for post and put routes
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

// Add routes, pass websocket server to api router
  app = addRoutes(app);

  return app;
}
