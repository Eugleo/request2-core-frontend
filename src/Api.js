// TODO Change when going into production
let hostname = "http://localhost:9080";

export async function get(url) {
  return await fetch(hostname + url, { method: "GET" });
}

export async function post(url, data) {
  return await fetch(hostname + url, {
    method: "POST",
    // TODO Change in production to `cors`
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
