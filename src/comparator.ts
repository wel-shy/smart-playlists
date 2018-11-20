import {Track} from "./track";

export function compareTracksTo(a: Track, b: Track): number {
  if (+a.added > +b.added) {
    return 1
  } else if (+a.added < +b.added) {
    return -1
  } else {
    return 0
  }
}