import React, { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext({ auth: {}, dispatch: null });
const hostname = 'http://localhost:9080';
export default AuthContext;

function headers(apiKey) {
  return { Authorization: apiKey };
}

// TODO Save apiKey into localStorage
export function useAuth() {
  const { auth } = useContext(AuthContext);

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

export function Authentized({ children, or: otherwise }) {
  return <Authorized noUser={otherwise}>{children}</Authorized>;
}

export function NotAuthentized({ or = null, children }) {
  return <Authorized noUser={children}>{or}</Authorized>;
}

export function Authorized({ noUser = '/login', roles = [], or = null, children }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth.loggedIn) {
    navigate(noUser);
  }

  if (!roles.every(r => auth.user.roles.includes(r))) {
    return or;
  }
  return children;
}
