export async function get(what, fetchArgs = {}) {
  fetchArgs.method = "GET";
  return await fetch(what, fetchArgs);
}
