import { Track } from './track';

export function compareTracksTo(a: Track, b: Track): number {
  if (+a.added > +b.added) {
    return 1;
  }
  if (+a.added < +b.added) {
    return -1;
  }
  return 0;
}
