import { ResourceRouter } from './ResourceRouter';
import { NextFunction, Request, Response } from 'express';
import { GenericRepository } from '../repositories/GenericRepository';
import { Playlist } from '../entities/Playlist';
import { Reply } from '../Reply';

export class PlaylistRouter extends ResourceRouter {
  constructor() {
    super();
    this.addDefaultRoutes();
  }

  destroy(req: Request, res: Response, next: NextFunction): void | Promise<Response | void> {
    return next(new Error('501'));
  }

  edit(req: Request, res: Response, next: NextFunction): void | Promise<Response | void> {
    return next(new Error('501'));
  }

  get(req: Request, res: Response, next: NextFunction): void | Promise<Response | void> {
    return next(new Error('501'));
  }

  async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const playlistRepository: GenericRepository<Playlist> =
      new GenericRepository<Playlist>(Playlist);
    let playlists: Playlist[];

    try {
      playlists = await playlistRepository.getAll();
    } catch (e) {
      e.status = '500';
      return next(e);
    }

    return res.json(new Reply(200, false, null, playlists));
  }

  store(req: Request, res: Response, next: NextFunction): void | Promise<Response | void> {
    return next(new Error('501'));
  }

}
