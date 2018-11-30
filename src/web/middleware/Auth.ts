import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token : string =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.params.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err: Error, user: {}) => {
      if (err) {
        res.locals.customErrorMessage = 'invalid token';
        res.locals.error = 401;
        next();
      } else {
        res.locals.user = user;
        return next();
      }
    });
  } else {
    res.locals.customErrorMessage = 'token not provided';
    res.locals.error = 401;
    next();
  }
}
