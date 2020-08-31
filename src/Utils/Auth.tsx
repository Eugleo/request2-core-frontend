import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router';

import { Role, UserDetails } from '../User/User';
import { apiBase } from './ApiBase';
import { Maybe } from './Maybe';

export type UserAction =
  | { type: 'LOGIN'; payload: { apiKey: string; user: UserDetails } }
  | { type: 'LOGOUT' };

export type LoginDispatch = (state: Auth, action: UserAction) => Auth;

export type Auth = { loggedIn: false } | { loggedIn: true; apiKey: string; user: UserDetails };

const AuthContext = React.createContext<{
  auth: Auth;
  dispatch: Maybe<React.Dispatch<UserAction>>;
}>({ auth: { loggedIn: false }, dispatch: null });
export default AuthContext;

export function authHeaders(apiKey: string) {
  return { Authorization: `Bearer ${apiKey}` };
}

export function useAuth<T>(): {
  auth: { loggedIn: true; apiKey: string; user: UserDetails };
  authGet: (url: string) => Promise<Response>;
  authPut: (url: string, data: T) => Promise<Response>;
  authPost: (url: string, data: T) => Promise<Response>;
  authDel: (url: string) => Promise<Response>;
} {
  const { auth } = useContext(AuthContext);
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
    url => withUser(fetch(apiBase + url, { method: 'GET', headers: authHeaders(auth.apiKey) })),
    [auth.apiKey, withUser]
  );

  const authPost = useCallback(
    (url, data) => {
      return withUser(
        fetch(apiBase + url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders(auth.apiKey) },
          body: JSON.stringify(data),
        })
      );
    },
    [auth.apiKey, withUser]
  );

  const authDel = useCallback(
    url => withUser(fetch(apiBase + url, { method: 'DELETE', headers: authHeaders(auth.apiKey) })),
    [auth.apiKey, withUser]
  );

  const authPut = useCallback(
    (url, data) => {
      return withUser(
        fetch(apiBase + url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders(auth.apiKey) },
          body: JSON.stringify(data),
        })
      );
    },
    [auth.apiKey, withUser]
  );

  return {
    authGet,
    authPost,
    authDel,
    authPut,
    auth,
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
}) {
  return <Authorized otherwise={children}>{otherwise}</Authorized>;
}

export function Authorized({
  roles = [],
  otherwise = null,
  children,
}: {
  otherwise?: JSX.Element | JSX.Element[] | null;
  children: JSX.Element | JSX.Element[] | null;
  roles?: Array<Role>;
}) {
  const { auth } = useContext(AuthContext);

  console.log(auth);

  if (!auth.loggedIn || !roles.every(r => auth.user.roles.includes(r))) {
    return <>{otherwise}</>;
  }

  return <>{children}</>;
}
