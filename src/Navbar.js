import React, { useState, useEffect, useReducer, useContext } from "react";

import AuthContext from "./AuthContext.js";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import * as Icon from "react-feather";

import { LinkContainer } from "react-router-bootstrap";
import LogoutButton from "./LogoutButton.js";

// TODO Show current user
export default function NavBar() {
  let { state } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" className="navbar-expand-md">
      <Navbar.Brand>
        <LinkContainer to="/">
          <Nav.Link active={false} className="no-style">
            <span style={{ fontVariant: "small-caps" }}>re</span>
            Quest<sup>2</sup>
          </Nav.Link>
        </LinkContainer>
      </Navbar.Brand>

      <Nav className="mr-auto">
        <Link to="/announcements">Announcements</Link>
      </Nav>
      <Nav>
        {!state.loggedIn ? (
          <>
            <Link to="/login">
              <Icon.LogIn className="inline-icon" color="white" />
            </Link>
            <Link to="/register">
              <Icon.UserPlus className="inline-icon" color="white" />
            </Link>
          </>
        ) : (
          <LogoutButton />
        )}
      </Nav>
    </Navbar>
  );
}

function Link(props) {
  return (
    <LinkContainer to={props.to} className="no-style">
      <Nav.Link active={false}>{props.children}</Nav.Link>
    </LinkContainer>
  );
}
