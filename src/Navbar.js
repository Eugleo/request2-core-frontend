import React from "react";

import { Authentized } from "./Auth.js";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { LinkContainer } from "react-router-bootstrap";
import LogoutButton from "./LogoutButton.js";
import LoginNavLinks from "./LoginNavLinks.js";

// TODO Show current user
export default function NavBar() {
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
        <Authentized or={<LoginNavLinks />}>
          <LogoutButton />
        </Authentized>
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
