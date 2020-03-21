import React, { useContext } from "react";

import * as Icon from "react-feather";
import AuthContext from "./Auth.js";

import Button from "react-bootstrap/Button";

export default function LogoutButton() {
  let { dispatch } = useContext(AuthContext);

  return (
    <Button variant="success" onClick={() => dispatch({ type: "LOGOUT" })}>
      <Icon.LogOut className="inline-icon" color="white" /> Logout
    </Button>
  );
}
