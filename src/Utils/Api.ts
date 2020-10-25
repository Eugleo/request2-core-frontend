import { useCallback } from 'react';

import { useRefresh } from '../Common/Hooks';
import { apiBase } from './ApiBase';
import { useAuth } from './Auth';
import { Result, useAsync } from './Loader';

export function urlWithParams(url: string, params: Record<string, string | number>): string {
  const strParams = Object.keys(params).map(k => `${k}=${params[k]}`);
  return `${url}?${strParams.join('&')}`;
}

export function useAsyncGetMany<T>(
  url: string,
  limit: number,
  offset: number
): {
  result: Result<{
    values: T[];
    total: number;
  }>;
  Loader: ({
    children,
  }: {
    children: (data: { values: T[]; total: number }) => JSX.Element;
  }) => JSX.Element;
} {
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
export function useAsyncGet<T>(
  url: string
): {
  result: Result<T>;
  Loader: ({ children }: { children: (data: T) => JSX.Element }) => JSX.Element;
  refresh: () => void;
} {
  const { authGet } = useAuth();
  const [ref, refresh] = useRefresh();

  const getThing = useCallback(async () => {
    const r = await authGet(url);
    const js: { error: string } | { data: T } = await r.json();
    if ('data' in js) {
      return js.data;
    }
    // ref needs to stay in deps array
    // Otherwise this won't work
    throw new Error(`Error: ${js.error}, ref: ${ref}`);
  }, [authGet, ref, url]);
  const thing = useAsync<T>(getThing);

  return { ...thing, refresh };
}

export async function get(url: string, headers = {}): Promise<Response> {
  return fetch(apiBase + url, { headers, method: 'GET' });
}

export async function post(url: string, data: Object, headers = {}): Promise<Response> {
  return fetch(apiBase + url, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...headers },
    method: 'POST',
  });
}

export async function del(url: string): Promise<Response> {
  return fetch(apiBase + url, { method: 'DELETE' });
}

export async function put(url: string, data: RequestInit): Promise<Response> {
  return fetch(apiBase + url, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });
}
