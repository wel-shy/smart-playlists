import { BaseRouter } from './BaseRouter';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { User } from '../entities/User';
import { Subscription } from '../entities/Subscription';
import { Reply } from '../Reply';
import { Methods } from '../../Methods';
import { isAuthenticated } from '../middleware/Auth';

export default class UserRouter extends BaseRouter {
  /**
   * Create the router:
   * Add middleware ensure user is authenticated.
   * Add routes.
   */
  constructor() {
    super();
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
    const userController = new UserRepository();
    const subscriptionRepository = new SubscriptionRepository();
    let user: User;
    let subscriptions: Subscription[];
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userController.get(res.locals.user.id);
      if (!user) {
        return next(new Error('404'));
      }
      subscriptions = await subscriptionRepository.getUserSubscriptions(user);
      subscriptions.forEach(async (sub) => {
        await sub.remove();
      });

      // Delete user.
      await user.remove();
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    return res.json(new Reply(200, false, null, null));
  }
}
