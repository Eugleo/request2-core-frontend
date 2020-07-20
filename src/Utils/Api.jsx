import { useState, useEffect } from 'react';

import { useAuth } from './Auth';

const hostname = 'http://localhost:9080';

export function urlWithParams(url, params) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

export function useGetWitLimit(url, limit, offset, setTotal, transform = x => x) {
  const { authGet } = useAuth();
  const [items, setItems] = useState([]);

  // TODO Add error handling
  useEffect(() => {
    const urlWithLimit = urlWithParams(url, { limit, offset });
    authGet(urlWithLimit)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(`Unable to retrieve the items from ${url}`);
      })
      .then(json => {
        setTotal(json.total);
        setItems(transform(json.values));
      })
      .catch(console.log);
  }, [authGet, setTotal, limit, offset]);

  return items;
}

export function useGet(url, def = undefined) {
  const { authGet } = useAuth();
  const [item, setItem] = useState(def);

  // TODO Add error handling
  useEffect(() => {
    if (url) {
      authGet(url)
        .then(r => {
          if (r.ok) {
            return r.json();
          }
          throw new Error(`Unable to retrieve the items from ${url}`);
        })
        .then(json => setItem(json))
        .catch(err => {
          console.log(err);
          setItem(null);
        });
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
