export class Track {
  id: string;
  title: string;
  album: string;
  artist: string;
  added: Date;
  uri: string;

  constructor(id: string, title: string, album: string, artist: string, added: Date, uri: string) {
    this.id = id;
    this.title = title;
    this.album = album;
    this.artist = artist;
    this.added = added;
    this.uri = uri;
  }
}
