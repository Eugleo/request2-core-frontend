import React from "react";

import * as Icon from "react-feather";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

export default function LoginNavLinks() {
  return (
    <>
      <Link to="/login">
        <Icon.LogIn className="inline-icon" color="white" />
      </Link>
      <Link to="/register">
        <Icon.UserPlus className="inline-icon" color="white" />
      </Link>
    </>
  );
}

function Link(props) {
  return (
    <LinkContainer to={props.to} className="no-style">
      <Nav.Link active={false}>{props.children}</Nav.Link>
    </LinkContainer>
  );
}
