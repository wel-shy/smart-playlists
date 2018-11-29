/**
 * Data class for formatting a spotify user from an API request.
 */
export class SpotifyUser {
  email: string;
  displayName: string;

  constructor(displayName: string, email: string) {
    this.displayName = displayName;
    this.email = email;
  }
}
