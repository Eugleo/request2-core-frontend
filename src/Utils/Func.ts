import { isJust, Maybe } from './Maybe';

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function comparing<T, U>(f: (x: T) => U): (a: T, b: T) => -1 | 0 | 1 {
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

export function padWithSpace(s: string): string {
  if (s.endsWith(' ')) {
    return s;
  }
  return `${s} `;
}

/* eslint-disable no-extend-native */
declare global {
  // The next disable clause is very important, do not remove
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Array<T> {
    mapMaybe<U>(f: (x: T) => Maybe<U>): U[];
    intersperse(mkT: (ix: number) => T): T[];
  }
}

if ('mapMaybe' in Array.prototype) {
  throw new Error('mapMaybe has already be defined, check the usage sites if nothing broke');
} else {
  Object.defineProperty(Array.prototype, 'mapMaybe', {
    configurable: false,
    enumerable: false,
    value: function mapMaybe<T, U>(this: T[], f: (x: T) => Maybe<U>): U[] {
      return this.map(f)
        .filter(isJust)
        .map(x => x);
    },
    writable: false,
  });
}

if ('intersperse' in Array.prototype) {
  throw new Error('mapMaybe has already be defined, check the usage sites if nothing broke');
} else {
  Object.defineProperty(Array.prototype, 'intersperse', {
    configurable: false,
    enumerable: false,
    value: function intersperse<T>(this: T[], mkT: (ix: number) => T): T[] {
      return this.reduce((acc: T[], d, ix) => [...acc, mkT(ix), d], []).slice(1);
    },
    writable: false,
  });
}
