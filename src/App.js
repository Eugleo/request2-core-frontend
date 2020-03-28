import React, { useState, useEffect, useReducer } from "react";

import * as Api from "./Api.js";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";

import { Route, Switch, Redirect } from "react-router-dom";

import { AnnouncementFromUrl, Announcements } from "./Announcements.js";
import { AtomSpinner } from "react-epic-spinners";
import LoginPage from "./LoginPage.js";
import NotFound404 from "./NotFound404.js";

import Page from "./Page.js";

import AuthContext from "./Auth.js";
import { Teams } from "./Teams.js";
import EditTeam from "./EditTeam.js";

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
    loggedIn: true,
    userID: 1,
    user: {
      apiKey: "0CZ6LZC/IIJoLJl8PYpVyzVETnytc1D5X4vxr6bjVk8",
      name: "Evžen",
      roles: ["Admin", "Client", "Operator"],
      team: { name: "Evženův supertým" },
      created: 115151
    }
  };

  // let initialAuth = {
  //   loggedIn: false,
  //   user: null
  // };

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
    <AuthContext.Provider value={{ auth, dispatch }}>
      <div className="App bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <AppBody backendAvailable={backendAvailable} />
        <div className="flex-none">
          <Footer />
        </div>
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
          <Route path="/teams/:id/edit">
            <EditTeam />
          </Route>
          <Route path="/teams">
            <Teams />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">Registration page.</Route>
          <Route path="/404">
            <NotFound404 />
          </Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      );
    default:
      return (
        <Page title="Error" width="lg">
          <p className="text-gray-800">
            Something seems to be wrong with the server. Try again later.
          </p>
        </Page>
      );
  }
}

export default App;
