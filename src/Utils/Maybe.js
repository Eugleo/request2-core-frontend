export default function maybe(x, f, def = undefined) {
  return x ? f(x) : def || x;
}
