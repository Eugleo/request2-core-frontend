import React, { useContext, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Team } from '../Team/Team';

type Role = 'Admin' | 'Operator' | 'Client';
type UserInfo = {
  name: string;
  roles: Array<Role>;
  team: Team;
  dateCreated: Date;
  apiKey: string;
  userId: number;
};
type Auth = { loggedIn: boolean; user: UserInfo };

const AuthContext = React.createContext<{ auth: Auth; dispatch: Function } | null>(null);
const hostname = 'http://localhost:9080';
export default AuthContext;

function headers(apiKey: string) {
  return { Authorization: apiKey };
}

// TODO Save apiKey into localStorage
export function useAuth(): {
  auth: Auth;
  authGet: (url: string) => Promise<Response>;
  authPut: (url: string, data: any) => Promise<Response>;
  authPost: (url: string, data: any) => Promise<Response>;
  authDel: (url: string, data: any) => Promise<Response>;
} {
  const maybeAuth = useContext(AuthContext);

  const auth = maybeAuth?.auth;
  if (!auth) {
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
    url => withUser(fetch(hostname + url, { method: 'GET', headers: headers(auth.user.apiKey) })),
    [withUser, auth.user.apiKey]
  );

  const authPost = useCallback(
    (url, data) => {
      return withUser(
        fetch(hostname + url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers(auth.user.apiKey) },
          body: JSON.stringify(data),
        })
      );
    },
    [withUser, auth.user.apiKey]
  );

  const authDel = useCallback(
    url =>
      withUser(fetch(hostname + url, { method: 'DELETE', headers: headers(auth.user.apiKey) })),
    [withUser, auth.user.apiKey]
  );

  const authPut = useCallback(
    (url, data) => {
      return withUser(
        fetch(hostname + url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...headers(auth.user.apiKey) },
          body: JSON.stringify(data),
        })
      );
    },
    [withUser, auth.user.apiKey]
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
  otherwise = <Navigate to="/login" />,
  children,
}: {
  otherwise?: JSX.Element | JSX.Element[] | null;
  children: JSX.Element | JSX.Element[] | null;
  roles?: Array<Role>;
}) {
  const auth = useContext(AuthContext)?.auth;

  if (!auth?.loggedIn || !roles.every(r => auth.user.roles.includes(r))) {
    return <>{otherwise}</>;
  }

  return <>{children}</>;
}
