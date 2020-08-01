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
