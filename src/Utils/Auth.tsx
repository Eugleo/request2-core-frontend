/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Role, UserDetails } from '../User/User';
import { apiBase } from './ApiBase';
import { useAuthState } from './AuthContext';

export function authHeaders(apiKey: string): { Authorization: string } {
  return { Authorization: `Bearer ${apiKey}` };
}

export function useAuth<T>(): {
  auth: { loggedIn: true; apiKey: string; user: UserDetails };
  authGet: (url: string) => Promise<Response>;
  authPut: (url: string, data: T) => Promise<Response>;
  authPost: (url: string, data: T) => Promise<Response>;
  authDel: (url: string, data?: T) => Promise<Response>;
} {
  const auth = useAuthState();
  const navigate = useNavigate();

  if (!auth.loggedIn) {
    navigate('/login');
    throw new Error("The user isn't logged in, how do you want to authenticate");
  }

  const withUser = useCallback(
    func => {
      if (!auth.loggedIn) {
        return () => Promise.reject(new Error("User isn't logged in"));
      }
      return func;
    },
    [auth.loggedIn]
  );

  const authGet = useCallback(
    (url: string) =>
      withUser(fetch(apiBase + url, { headers: authHeaders(auth.apiKey), method: 'GET' })),
    [auth.apiKey, withUser]
  );

  const authPost = useCallback(
    (url: string, data) => {
      return withUser(
        fetch(apiBase + url, {
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json', ...authHeaders(auth.apiKey) },
          method: 'POST',
        })
      );
    },
    [auth.apiKey, withUser]
  );

  const authDel = useCallback(
    (url: string, data) =>
      withUser(
        fetch(apiBase + url, {
          body: data ? JSON.stringify(data) : undefined,
          headers: data
            ? { 'Content-Type': 'application/json', ...authHeaders(auth.apiKey) }
            : authHeaders(auth.apiKey),
          method: 'DELETE',
        })
      ),
    [auth.apiKey, withUser]
  );

  const authPut = useCallback(
    (url: string, data) => {
      return withUser(
        fetch(apiBase + url, {
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json', ...authHeaders(auth.apiKey) },
          method: 'PUT',
        })
      );
    },
    [auth.apiKey, withUser]
  );

  return {
    auth,
    authDel,
    authGet,
    authPost,
    authPut,
  };
}

export function Authentized({
  children,
  otherwise = null,
}: {
  children: JSX.Element | JSX.Element[];
  otherwise?: JSX.Element | JSX.Element[] | null;
}): JSX.Element {
  return <Authorized otherwise={otherwise}>{children}</Authorized>;
}

export function NotAuthentized({
  children,
  otherwise = null,
}: {
  children: JSX.Element | JSX.Element[] | null;
  otherwise?: JSX.Element | JSX.Element[] | null;
}): JSX.Element {
  return <Authorized otherwise={children}>{otherwise}</Authorized>;
}

export function Authorized({
  roles = [],
  otherwise = null,
  children,
}: {
  otherwise?: JSX.Element | JSX.Element[] | null;
  children: JSX.Element | JSX.Element[] | null;
  roles?: Role[];
}): JSX.Element | null {
  const auth = useAuthState();

  if (!auth.loggedIn || !roles.every(r => auth.user.roles.includes(r))) {
    return <>{otherwise}</>;
  }

  return <>{children}</>;
}
