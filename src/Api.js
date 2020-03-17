// TODO Change when going into production
let hostname = "http://localhost:9080";

export async function get(what, fetchArgs = {}) {
  fetchArgs.method = "GET";
  return await fetch(hostname + what, fetchArgs);
}
