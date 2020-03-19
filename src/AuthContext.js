import React from "react";

const AuthContext = React.createContext({
  loggedIn: false,
  user: null
});

export default AuthContext;
