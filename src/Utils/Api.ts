import { useState, useEffect } from 'react';

import { useAuth } from './Auth';

const hostname = 'http://localhost:9080';

export function urlWithParams(url: string, params: Record<string, any>) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

type Resource<T> = {
  data: { values: Array<T>; total: number } | null;
  error: string | null;
  pending: boolean;
};

export function useLoadResourcesWithLimit<T>(
  url: string,
  limit: number,
  offset: number,
  setTotal: Function,
  transform = (x: Array<T>) => x
): Resource<T> {
  const { authGet } = useAuth();
  const [items, setItems] = useState<Resource<T>>({ data: null, error: null, pending: true });

  useEffect(() => {
    const urlWithLimit = urlWithParams(url, { limit, offset });
    authGet(urlWithLimit)
      .then(r => r.json())
      .then(json => {
        if (json.data && json.data.values && json.data.total) {
          setItems({
            ...json,
            data: { ...json.data, values: json.data.values },
            status: 'loaded',
          });
          setTotal(json.data.total);
        } else {
          setItems({ ...json, pending: false });
          setTotal(0);
        }
      });
  }, [authGet, limit, url, offset, setTotal]);

  return {
    ...items,
    data: items.data &&
      items.data.values && { ...items.data, values: transform(items.data.values) },
  };
}

// The server returns either { error: ... } or { data: ... }
export function useAsyncGet<T>(url: string): Resource<T> {
  const { authGet } = useAuth();
  const [item, setItem] = useState({ pending: true, data: null, error: null });

  useEffect(() => {
    if (url) {
      authGet(url)
        .then(r => r.json())
        .then(json => setItem({ ...json, pending: false }));
    }
  }, [authGet, url]);

  return item;
}

export function get(url: string, headers = {}) {
  return fetch(hostname + url, { method: 'GET', headers });
}

export function post(url: string, data: any, headers = {}) {
  return fetch(hostname + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
}

export function del(url: string) {
  return fetch(hostname + url, { method: 'DELETE' });
}

export function put(url: string, data: RequestInit) {
  return fetch(hostname + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
