import { Handler, Router } from 'express';
import { Methods } from '../../Methods';

export abstract class BaseRouter {
  router: Router;

  constructor() {
    this.router = Router();
  }

  /**
   * Get the router.
   * @returns {e.Router}
   */
  getRouter() {
    return this.router;
  }

  /**
   * Add a router to the user
   * @param {string} path
   * @param {Methods} method
   * @param {e.Handler} handler
   */
  addRoute(path: string, method: Methods, handler: Handler) {
    switch (method) {
      case 'get':
        this.router.get(path, handler);
        break;
      case 'post':
        this.router.post(path, handler);
        break;
      case 'put':
        this.router.put(path, handler);
        break;
      case 'delete':
        this.router.delete(path, handler);
    }
  }

  /**
   * Add middleware to the router.
   * @param {e.Handler} handler
   */
  addMiddleware(handler: Handler) {
    this.router.use(handler);
  }
}
