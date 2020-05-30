import React, { useContext, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

const AuthContext = React.createContext({ auth: {}, dispatch: null });
const hostname = 'http://localhost:9080';
export default AuthContext;

// TODO Save apiKey into localStorage
export function useAuth() {
  const { auth } = useContext(AuthContext);

  const headers = { Authorization: auth.user.apiKey };

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
    url => {
      return withUser(fetch(hostname + url, { method: 'GET', headers }));
    },
    [headers]
  );

  const authPost = useCallback(
    (url, data) => {
      return withUser(
        fetch(hostname + url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify(data),
        })
      );
    },
    [headers]
  );

  const authDel = useCallback(
    url => {
      return withUser(fetch(hostname + url, { method: 'DELETE', headers }));
    },
    [headers]
  );

  const authPut = useCallback(
    (url, data) => {
      return withUser(
        fetch(hostname + url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify(data),
        })
      );
    },
    [headers]
  );

  return {
    authGet,
    authPost,
    authDel,
    authPut,
    auth,
  };
}

export function Authentized({ children, or }) {
  return <Authorized noUser={or}>{children}</Authorized>;
}

export function NotAuthentized({ or = null, children }) {
  return <Authorized noUser={children}>{or}</Authorized>;
}

export function Authorized({ noUser = <Redirect to="/login" />, roles = [], or = null, children }) {
  const { auth } = useContext(AuthContext);

  if (!auth.loggedIn) {
    return noUser;
  }

  if (!roles.every(r => auth.user.roles.includes(r))) {
    return or;
  }
  return children;
}
