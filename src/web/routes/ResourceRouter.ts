import { NextFunction, Request, Response } from 'express';
import { BaseRouter } from './BaseRouter';
import { Methods } from '../../Methods';

/**
 * Generic Resource Router.
 */
export abstract class ResourceRouter extends BaseRouter{
  abstract store(req: Request, res: Response, next: NextFunction): void | Promise<Response | void>;
  abstract index(req: Request, res: Response, next: NextFunction): void | Promise<Response | void>;
  abstract get(req: Request, res: Response, next: NextFunction): void | Promise<Response | void>;
  abstract edit(req: Request, res: Response, next: NextFunction): void | Promise<Response | void>;
  abstract destroy(req: Request, res: Response, next: NextFunction):
    void | Promise<Response | void>;

  addDefaultRoutes(): void {
    this.addRoute('/:id', Methods.GET, this.get);
    this.addRoute('/edit', Methods.POST, this.edit);
    this.addRoute('/:id', Methods.DELETE, this.destroy);
    this.addRoute('/', Methods.POST, this.store);
    this.addRoute('/', Methods.GET, this.index);
  }
}
