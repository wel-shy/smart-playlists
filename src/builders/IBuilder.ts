/**
 * Playlist interface
 */
export abstract class IBuilder {
  accessToken: string;

  // All builders must have an execute function.
  abstract execute(): Promise<void>;
  abstract getInstance(): IBuilder;

  /**
   * Set the access token
   * @param {string} accessToken
   */
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
}
