import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

const AuthContext = React.createContext();
export default AuthContext;

export function Authentized(props) {
  return (
    <Authorized noUser={props.or} roles={[]}>
      {props.children}
    </Authorized>
  );
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
