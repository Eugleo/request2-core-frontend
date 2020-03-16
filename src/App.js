import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Api from "./Api.js";

import { Link, Route, Switch, Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { AnnouncementFromUrl, Announcements } from "./Announcements.js";

import { AtomSpinner } from "react-epic-spinners";

function App() {
  let [backendAvailable, setBackendAvailable] = useState(null);

  useEffect(() => {
    Api.get("/capability")
      .then(r => r.json())
      .then(js => {
        if (js.includes("request2")) {
          setBackendAvailable(true);
        } else {
          throw "Unsupported backend";
        }
      })
      .catch(e => {
        console.log(e);
        setBackendAvailable(false);
      });
  }, [backendAvailable]);

  // TODO Replace the footer
  // TODO Correctly set `active` on the active nav item
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="navbar-expand-md">
        <Navbar.Brand>
          <Link to="/" className="no-style">
            <span style={{ fontVariant: "small-caps" }}>re</span>
            Quest<sup>2</sup>
          </Link>
        </Navbar.Brand>

        <Nav className="mr-auto">
          <Nav.Link active>
            <Link to="/announcements" className="no-style">
              Announcements
            </Link>
          </Nav.Link>
        </Nav>

        <Nav>
          <Nav.Link>
            <Link to="/login" className="no-style">
              <Icon.LogIn className="inline-icon" />
            </Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/register" className="no-style">
              <Icon.UserPlus className="inline-icon" />
            </Link>
          </Nav.Link>
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
          // TODO Replace with something else maybe?
          <Route path="/login">Login page.</Route>
          <Route path="/register">Registration page.</Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      );

    case false:
      return (
        <>
          <h1>Error</h1>
          <p>Something seems to be wrong with the server. Try again later.</p>
        </>
      );
  }
}

export default App;
