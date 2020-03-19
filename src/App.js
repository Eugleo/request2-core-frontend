import React, { useState, useEffect, useReducer, useContext } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import * as Api from "./Api.js";
import NavBar from "./Navbar.js";
import Footer from "./Footer.js";

import { Route, Switch, Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import { AnnouncementFromUrl, Announcements } from "./Announcements.js";
import { AtomSpinner } from "react-epic-spinners";
import Login from "./Login.js";

import AuthContext from "./AuthContext.js";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        loggedIn: true,
        user: action.payload
      };
    case "LOGOUT":
      Api.post("/logout", { api_key: state.user.apiKey }, { Authorization: state.user.apiKey });
      return {
        loggedIn: false,
        user: null
      };
    default:
      return state;
  }
}

function App() {
  let initialAuth = {
    loggedIn: false,
    user: null
  };

  let [backendAvailable, setBackendAvailable] = useState(null);
  let [auth, dispatch] = useReducer(reducer, initialAuth);

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
    <AuthContext.Provider value={{ state: auth, dispatch }}>
      <div className="App">
        <NavBar />
        <Container className="mt-5">
          <AppBody backendAvailable={backendAvailable} />
        </Container>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

function AppBody(props) {
  // TODO Add timeout
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
