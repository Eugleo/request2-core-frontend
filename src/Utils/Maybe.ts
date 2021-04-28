export type Maybe<T> = T | null | undefined;

export function maybe<T, U>(x: Maybe<T>, f: (x: T) => U, def: U): U {
  return x ? f(x) : def;
}

export function isJust<T>(x: Maybe<T>): x is T {
  return x !== null && x !== undefined;
}
