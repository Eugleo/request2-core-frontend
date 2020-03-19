let hostname = "http://localhost:9080";

export async function get(url, data = {}) {
  return await fetch(hostname + url, { method: "GET", ...data });
}

export async function post(url, data, headers = {}) {
  return await fetch(hostname + url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data)
  });
}
