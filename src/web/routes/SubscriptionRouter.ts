import { BaseRouter } from './BaseRouter';
import { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/Auth';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { Reply } from '../Reply';
import { Playlist } from '../entities/Playlist';
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
    this.addRoute('/', Methods.GET, this.index);
    this.addRoute('/:id', Methods.DELETE, this.destroy);
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
    const playlistRepository = new GenericRepository<Playlist>(Playlist);
    const builderId = req.body.builderId;
    let user: User;
    let builder: Playlist;

    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userRepository.get(res.locals.user.id);
      builder = await playlistRepository.get(builderId);
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
    const subscriptionRepository = new SubscriptionRepository();
    let user: User;
    let subs: Subscription[];

    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userController.get(res.locals.user.id);
      subs = await subscriptionRepository.getUserSubscriptions(user);
      if (!user) {
        return next(new Error('404'));
      }
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    return res.json(new Reply(200, false, null, subs));
  }

  /**
   * Destroy a subscription to a playlist
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  async destroy(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userController = new UserRepository();
    const subscriptionRepository = new SubscriptionRepository();
    const playlistId: string = req.params.id;
    let user: User;
    let subs: Subscription[];

    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }

    // Fetch the user.
    try {
      user = await userController.get(res.locals.user.id);
      subs = await subscriptionRepository.getUserSubscriptions(user);
      if (!user) {
        return next(new Error('404'));
      }
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    const subsToDelete: Subscription[] = subs.filter((sub) => {
      return parseInt(`${sub.playlist}`, 10) === parseInt(playlistId, 10);
    });

    subsToDelete.forEach(async (sub) => {
      await sub.remove();
    });

    return res.json(new Reply(200, false, null, null));
  }
}
