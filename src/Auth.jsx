import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

const AuthContext = React.createContext({ auth: {}, dispatch: null });
const hostname = 'http://localhost:9080';
export default AuthContext;

export function useAuth() {
  const { auth } = useContext(AuthContext);

  const headers = { Authorization: auth.user.apiKey };

  function withUser(func) {
    if (!auth.loggedIn) {
      return () => Promise.reject(new Error("User isn't logged in"));
    }
    return func;
  }

  function authGet(url) {
    return withUser(fetch(hostname + url, { method: 'GET', headers }));
  }

  function authPost(url, data) {
    return withUser(
      fetch(hostname + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
    );
  }

  function authDel(url) {
    return withUser(fetch(hostname + url, { method: 'DELETE', headers }));
  }

  function authPut(url, data) {
    return withUser(
      fetch(hostname + url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
    );
  }

  return { authGet, authPost, authDel, authPut, auth };
}

export function Authentized({ children, or }) {
  return (
    <Authorized noUser={or} roles={[]}>
      {children}
    </Authorized>
  );
}

export function NotAuthentized(props) {
  const { auth } = useContext(AuthContext);

  return auth.loggedIn ? null : props.children;
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
