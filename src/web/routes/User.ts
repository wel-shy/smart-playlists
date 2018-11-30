import { BaseRouter } from './Base';
import { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { User } from '../entities/User';
import { Reply } from '../Reply';
import { Methods } from '../../Methods';
import { isAuthenticated } from '../middleware/Auth';

export default class UserRouter extends BaseRouter {
  userController: UserController;

  /**
   * Create the router:
   * Add middleware ensure user is authenticated.
   * Add routes.
   */
  constructor() {
    super();

    this.userController = new UserController();
    this.addMiddleware(isAuthenticated);
    this.addRoute('/', Methods.DELETE, this.destroyUser);
  }

  /**
   * Delete user record.
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  async destroyUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let user: User;
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await this.userController.getUser(res.locals.user.id);

      if (!user) {
        return next(new Error('404'));
      }

      // Delete user.
      await user.remove();
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    return res.json(new Reply(200, false, null, null));
  }
}
