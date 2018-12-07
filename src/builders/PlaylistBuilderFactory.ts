import { BasePlaylistBuilder } from './BasePlaylistBuilder';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

/**
 * Get an instance of a playlist builder
 */
export default class PlaylistBuilderFactory {
  readdir = promisify(fs.readdir);
  playlistBuilders: Map<string, BasePlaylistBuilder> = new Map<string, BasePlaylistBuilder>();

  /**
   * Get a playlist builder by name
   * @param {string} playlistName
   * @returns {BasePlaylistBuilder}
   */
  getPlaylistBuilder(playlistName: string): BasePlaylistBuilder {
    if (this.playlistBuilders.size < 1) {
      throw new Error('Factory must be initialised, ' +
        'call Prototype.PlaylistBuilderFactory.initialisePlaylistBuilders ' +
        'after creating an instance of PlaylistBuilderFactory');
    }
    return this.playlistBuilders.get(playlistName);
  }

  /**
   * Dynamically load playlistBuilders from directory
   * @returns {Promise<BasePlaylistBuilder[]>}
   */
  async initialisePlaylistBuilders(): Promise<void> {
    const playlistPath: string = path.join(__dirname, './');
    let directory: string[];

    try {
      directory = await this.readdir(playlistPath);
    } catch (e) {
      console.error(e);
    }

    if (!directory) return;
    const playlistImportPromises: Promise<any>[] = [];

    directory.forEach(async (fileName: string) => {
      if (fileName === 'BasePlaylistBuilder.js' || fileName === 'PlaylistBuilderFactory.js') return;
      playlistImportPromises.push(this.getImport(`./${fileName}`));
    });

    await Promise.all(playlistImportPromises);
  }

  /**
   * Import and return a new instance of each playlist.
   * @param {string} path
   * @returns {Promise<void>}
   */
  private getImport(path: string): Promise<void> {
    return new Promise<any>(((resolve, reject) => {
      import(path)
        .then((value: any) => {
          const builder: BasePlaylistBuilder = value.default();
          this.playlistBuilders
            .set(path.split('/')[path.split('/').length - 1].split('.js')[0], builder);
          resolve();
        })
        .catch(e => reject(e));
    }));
  }
}
