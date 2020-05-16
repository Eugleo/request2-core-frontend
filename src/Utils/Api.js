const hostname = 'http://localhost:9080';

export function get(url, headers = {}) {
  return fetch(hostname + url, { method: 'GET', headers });
}

export function post(url, data) {
  return fetch(hostname + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function urlWithParams(url, params) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

export function del(url) {
  return fetch(hostname + url, { method: 'DELETE' });
}

export function put(url, data) {
  return fetch(hostname + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
