export function maybe(x, f, def = undefined) {
  return x ? f(x) : def || x;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function comparator(f) {
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
