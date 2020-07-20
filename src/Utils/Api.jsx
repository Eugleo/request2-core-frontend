import { useState, useEffect } from 'react';

import { useAuth } from './Auth';

const hostname = 'http://localhost:9080';

export function urlWithParams(url, params) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

export function useLoadResourcesWithLimit(url, limit, offset, setTotal, transform = x => x) {
  const { authGet } = useAuth();
  const [items, setItems] = useState({ data: undefined, error: undefined, status: 'loading' });

  useEffect(() => {
    const urlWithLimit = urlWithParams(url, { limit, offset });
    authGet(urlWithLimit)
      .then(r => r.json())
      .then(json => {
        if (json.data && json.data.values && json.data.total) {
          setItems({
            ...json,
            data: { ...json.data, values: transform(json.data.values) },
            status: 'loaded',
          });
          setTotal(json.data.total);
        } else {
          setItems({ ...json, status: 'loaded' });
          setTotal(0);
        }
      });
  }, [authGet, setTotal, limit, offset]);

  return items;
}

// The server returns either { error: ... } or { data: ... }
export function useLoadResources(url) {
  const { authGet } = useAuth();
  const [item, setItem] = useState({ status: 'loading', data: undefined, error: undefined });

  useEffect(() => {
    if (url) {
      authGet(url)
        .then(r => r.json())
        .then(json => setItem({ ...json, status: 'loaded' }));
    }
  }, [authGet, setItem, url]);

  return item;
}

export function get(url, headers = {}) {
  return fetch(hostname + url, { method: 'GET', headers });
}

export function post(url, data, headers = {}) {
  return fetch(hostname + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
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
