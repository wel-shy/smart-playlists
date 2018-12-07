/**
 * Playlist interface
 */
export abstract class BasePlaylistBuilder {
  accessToken: string;

  // All builders must have an execute function.
  abstract execute(): Promise<void>;
  abstract getInstance(): BasePlaylistBuilder;

  /**
   * Set the access token
   * @param {string} accessToken
   */
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
}
