export type Maybe<T> = T | null | undefined;

export function maybe<T, U>(x: Maybe<T>, f: (x: T) => U, def?: U): U | undefined {
  return x ? f(x) : def;
}
