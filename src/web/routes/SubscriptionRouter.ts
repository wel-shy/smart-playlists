import { BaseRouter } from './BaseRouter';
import { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/Auth';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { Reply } from '../Reply';
import { Builder } from '../entities/Builder';
import { GenericRepository } from '../repositories/GenericRepository';
import { Subscription } from '../entities/Subscription';
import { Methods } from '../../Methods';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';

/**
 * Router to manage the user's subscriptions.
 */
export class SubscriptionRouter extends BaseRouter {
  constructor() {
    super();
    this.addMiddleware(isAuthenticated);
    this.addRoute('/', Methods.POST, this.store);
  }

  /**
   * Store the subscription
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userRepository = new UserRepository();
    const builderRepository = new GenericRepository<Builder>(Builder);
    const builderId = req.body.builderId;
    let user: User;
    let builder: Builder;

    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userRepository.get(res.locals.user.id);
      builder = await builderRepository.get(builderId);
      if (!user || !builder) {
        return next(new Error('404'));
      }
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    const subscription = new Subscription(user, builder);
    try {
      await subscription.save();
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    return res.json(new Reply(200, false, null, subscription));
  }

  /**
   * Get all of the user's subscriptions
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userController = new UserRepository();
    const subscriptionController = new SubscriptionRepository();
    let user: User;
    let subscriptions: Subscription[];

    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userController.get(res.locals.user.id);
      subscriptions = await subscriptionController.getUserSubscriptions(user);
      if (!user) {
        return next(new Error('404'));
      }
    } catch (e) {
      e.status = '500';
      return next(e);
    }
    return res.json(new Reply(200, false, null, subscriptions));
  }
}
