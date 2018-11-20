export class Playlist {
  id: string;
  name: string;
  uri: string;

  constructor(id: string, name: string, uri: string) {
    this.id = id;
    this.name = name;
    this.uri = uri;
  }
}
