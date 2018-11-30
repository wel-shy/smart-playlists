import * as express from 'express';
import { Reply } from '../reply';

export const handleError: express.ErrorRequestHandler = (err: Error, req: express.Request,
                                                         res: express.Response,
                                                         next: express.NextFunction) => {
  let code: number = parseInt(err.message, 10);

  if (isNaN(code)) {
    code = 500;
  }

  const response: Reply = getError(code);
  if (res.locals.customErrorMessage) {
    response.messages = res.locals.customErrorMessage;
  }

  if (process.env.DEBUG === 'true') {
    response.payload = err.stack;
  }

  if (process.env.TEST !== 'true') {
    console.error(err.stack);
  }
  res.status(code);
  return res.json(response);
};

/**
 * Get message from error code
 * @param  code number
 * @return      Reply
 */
function getError(code: number): Reply {
  let message;
  switch (code) {
    case 400:
      message = 'bad request';
      break;
    case 401:
      message = 'unauthorised';
      break;
    case 403:
      message = 'forbidden';
      break;
    case 404:
      message = 'not found';
      break;
    case 500:
      message = 'server error';
      break;
    case 501:
      message = 'not implemented';
      break;
    default:
      message = 'server error';
      break;
  }

  return new Reply(code, true, message, null);
}
