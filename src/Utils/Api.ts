import { useCallback } from 'react';

import { useRefresh } from '../Common/Hooks';
import { apiBase } from './ApiBase';
import { useAuth } from './Auth';
import { useAsync } from './Loader';

export function urlWithParams(url: string, params: Record<string, any>) {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

export function useAsyncGetMany<T>(url: string, limit: number, offset: number) {
  const { authGet } = useAuth();

  const getThings = useCallback(async () => {
    const urlWithLimit = urlWithParams(url, { limit, offset });
    const r = await authGet(urlWithLimit);
    const json = await r.json();

    if (json.error) {
      throw new Error(json.error);
    }
    return json.data;
  }, [authGet, url, limit, offset]);

  return useAsync<{ values: T[]; total: number }>(getThings);
}

// The server returns either { error: ... } or { data: ... }
export function useAsyncGet<T>(url: string) {
  const { authGet } = useAuth();
  const refresh = useRefresh();

  const getThing = useCallback(() => {
    return authGet(url)
      .then(r => r.json())
      .then(json => {
        if (json.data) {
          return json.data;
        }
        throw new Error(json.error);
      });
  }, [authGet, url]);
  const thing = useAsync<T>(getThing);

  return { ...thing, refresh };
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
