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
    const playlistImportPromises: Promise<any>[] = [];

    // Files to be ignored. Do not want to create builders from the base or factory classes.
    const ignoredFiles: string[] = [
      'BasePlaylistBuilder.js',
      'PlaylistBuilderFactory.js',
    ];

    // Get all files in builder directory.
    try {
      directory = await this.readdir(playlistPath);
    } catch (e) {
      console.error(e);
    }

    // If null return
    if (!directory) return;

    // Filter out ignored files.
    directory = directory.filter((fileName: string) => {
      return ignoredFiles.indexOf(fileName) === -1;
    });

    // Create a promise to import each file.
    directory.forEach(async (fileName: string) => {
      playlistImportPromises
        .push(import(`./${fileName}`));
    });

    // Import each file.
    const values: any[] = await Promise.all(playlistImportPromises);

    // For each imported file.
    values.forEach((value) => {
      /*
       * Create the builder by calling the default function of the file.
       * The default function should return an instance of the class held in the file.
       */
      const builder: BasePlaylistBuilder = value.default();

      // Add the playlist to the map. The class name becomes the index.
      this.playlistBuilders.set(builder.getName(), builder);
    });
  }
}
