import { useEffect, useState } from 'react';

import { useAuth } from './Auth';
import { Maybe } from './Maybe';
import { WithID } from './WithID';
import { apiBase } from './ApiBase';

export function urlWithParams(url: string, params: Record<string, any>) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

type Resource<T> = {
  data: Maybe<T>;
  error: Maybe<string>;
  pending: boolean;
};

export function useAsyncGetMany<T>(
  url: string,
  limit: number,
  offset: number,
  transform = (x: Array<WithID<T>>) => x
): Resource<{ values: Array<WithID<T>>; total: number }> {
  const { authGet } = useAuth();
  const [pending, setPending] = useState<boolean>(true);
  const [error, setError] = useState<Maybe<string>>(null);
  const [data, setData] = useState<Maybe<{ values: Array<WithID<T>>; total: number }>>(null);

  useEffect(() => {
    const urlWithLimit = urlWithParams(url, { limit, offset });
    authGet(urlWithLimit)
      .then(r => r.json())
      .then(json => {
        setError(json.error);
        setData(json.data);
        setPending(false);
      });
  }, [authGet, url, limit, offset]);

  return {
    error,
    pending,
    data: data && { total: data.total, values: transform(data.values) },
  };
}

// The server returns either { error: ... } or { data: ... }
export function useAsyncGet<T>(url: Maybe<string>): Resource<WithID<T>> {
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
  return fetch(apiBase + url, { method: 'GET', headers });
}

export function post(url: string, data: any, headers = {}) {
  return fetch(apiBase + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
}

export function del(url: string) {
  return fetch(apiBase + url, { method: 'DELETE' });
}

export function put(url: string, data: RequestInit) {
  return fetch(apiBase + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
