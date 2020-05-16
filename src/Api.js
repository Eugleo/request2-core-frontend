let hostname = "http://localhost:9080";

export async function get(url) {
  return await fetch(hostname + url, { method: "GET" });
}

async function post(url, data) {
  return await fetch(hostname + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function urlWithParams(url, params) {
  let strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join("&")}`;
}

export async function del(url) {
  return await fetch(hostname + url, { method: "DELETE" });
}

export async function put(url, data) {
  return await fetch(hostname + url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
