export function maybe(x, f, def = undefined) {
  return x ? f(x) : def || x;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
