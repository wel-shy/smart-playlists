/**
 * Playlist interface
 */
export interface IBuilder {
  // All builders must have an execute function.
  execute(accessToken: string): Promise<void>;
}
