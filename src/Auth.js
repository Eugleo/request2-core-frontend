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

  if (!roles.every(auth.user.roles.includes)) {
    return props.forbidden || <div>You don't have enough privileges to view this content</div>;
  } else {
    return props.children;
  }
}
