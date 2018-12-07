/**
 * Data class for formatting a spotify user from an API request.
 */
export class SpotifyUser {
  email: string;
  displayName: string;
  spotifyId: string;

  constructor(displayName: string, email: string, spotifyId: string) {
    this.displayName = displayName;
    this.email = email;
    this.spotifyId = spotifyId;
  }
}
