import { isJust, Maybe } from './Maybe';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function comparator<T, U>(f: (x: T) => U): (a: T, b: T) => -1 | 0 | 1 {
  return (a, b) => {
    if (f(a) < f(b)) {
      return -1;
    }
    if (f(a) === f(b)) {
      return 0;
    }
    return 1;
  };
}

declare global {
  interface Array<T> {
    mapMaybe<U>(f: (x: T) => Maybe<U>): Array<U>;
    intersperse(mkT: (ix: number) => T): Array<T>;
  }
}

function mapMaybe<T, U>(this: T[], f: (x: T) => Maybe<U>): U[] {
  return this.map(f)
    .filter(isJust)
    .map(x => x as U);
}

function intersperse<T>(this: T[], mkT: (ix: number) => T): T[] {
  return this.reduce((acc: T[], d, ix) => [...acc, mkT(ix), d], []).slice(1);
}

/* eslint no-extend-native: "off" */
if (!Array.prototype.mapMaybe) {
  Array.prototype.mapMaybe = mapMaybe;
  Array.prototype.intersperse = intersperse;
}
