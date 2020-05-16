import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

const AuthContext = React.createContext({ auth: {}, dispatch: null });
const hostname = "http://localhost:9080";
export default AuthContext;

export function useAuth() {
  const { auth } = useContext(AuthContext);
  if (!auth.loggedIn) {
  }
  const headers = { Authorization: auth.user.apiKey };

  async function withUser(func) {
    if (!auth.loggedIn) {
      return () => Promise.reject("User isn't logged in");
    } else {
      return func;
    }
  }

  async function authGet(url) {
    return await withUser(fetch(hostname + url, { method: "GET", headers }));
  }

  async function authPost(url, data) {
    return await withUser(
      fetch(hostname + url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      })
    );
  }

  async function authDel(url) {
    return await withUser(fetch(hostname + url, { method: "DELETE", headers }));
  }

  async function authPut(url, data) {
    return await withUser(
      fetch(hostname + url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      })
    );
  }

  return { authGet, authPost, authDel, authPut };
}

export function Authentized(props) {
  return (
    <Authorized noUser={props.or} roles={[]}>
      {props.children}
    </Authorized>
  );
}

export function NotAuthentized(props) {
  let { auth } = useContext(AuthContext);

  return auth.loggedIn ? null : props.children;
}

export function Authorized(props) {
  let { auth } = useContext(AuthContext);

  if (!auth.loggedIn) {
    return props.noUser || <Redirect to="/login" />;
  }

  let roles = props.roles || [];

  if (!roles.every(r => auth.user.roles.includes(r))) {
    return props.or || null;
  } else {
    return props.children;
  }
}
