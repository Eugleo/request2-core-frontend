import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";

import "bootstrap/dist/css/bootstrap.min.css";
import * as Api from "./Api.js";

import { Route, Switch, Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { LinkContainer } from "react-router-bootstrap";

import { AnnouncementFromUrl, Announcements } from "./Announcements.js";

import { AtomSpinner } from "react-epic-spinners";
import { Login } from "./Login.js";

function App() {
  let [backendAvailable, setBackendAvailable] = useState(null);

  useEffect(() => {
    Api.get("/capability")
      .then(r => r.json())
      .then(js => {
        if (js.includes("request2")) {
          setBackendAvailable(true);
        } else {
          throw Error("Unsupported backend");
        }
      })
      .catch(e => {
        console.log(e);
        setBackendAvailable(false);
      });
  }, []);

  // TODO Replace the footer
  return (
    <div className="App">
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
          <LinkContainer to="/announcements" className="no-style">
            <Nav.Link active={false}>Announcements</Nav.Link>
          </LinkContainer>
        </Nav>

        <Nav>
          <LinkContainer to="/login" className="no-style">
            <Nav.Link active={false}>
              <Icon.LogIn className="inline-icon" color="white" />
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/register" className="no-style">
            <Nav.Link active={false}>
              <Icon.UserPlus className="inline-icon" color="white" />
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
      <Container className="mt-3">
        <AppBody backendAvailable={backendAvailable} />
      </Container>
      <footer className="footer">
        <Container>
          <Row>
            <Col>Neco vlevo</Col>
            <Col>Neco vpravo, asi loga</Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

function AppBody(props) {
  switch (props.backendAvailable) {
    // TODO Replace with something else maybe?
    case null:
      return (
        <center>
          <AtomSpinner color="forest-green" />
        </center>
      );
    case true:
      return (
        <Switch>
          <Route path="/announcements/:id">
            <AnnouncementFromUrl />
          </Route>
          <Route path="/announcements">
            <Announcements />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">Registration page.</Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      );
    default:
      return (
        <>
          <h1>Error</h1>
          <p>Something seems to be wrong with the server. Try again later.</p>
        </>
      );
  }
}

export default App;
