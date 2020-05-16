import React, { useState, useEffect, useReducer } from "react";

import * as Api from "./Api.js";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";
import { AtomSpinner } from "react-epic-spinners";

import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Page from "./Page.js";
import AuthContext from "./Auth.js";
import NotFound404 from "./NotFound404.js";

import { AnnouncementFromUrl, Announcements } from "./Announcements.js";
import { NewRegistrationPage, RegisterPage } from "./Registration.js";
import LoginPage from "./LoginPage.js";

import { Teams } from "./Teams.js";
import EditTeam from "./EditTeam.js";
import NewTeam from "./NewTeam.js";
import NewAnnouncement from "./NewAnnouncement.js";
import EditAnnouncement from "./EditAnnouncement.js";
import { useAuth } from "./Auth.js";

function reducer(state, action) {
  const { authPost, authGet } = useAuth();
  switch (action.type) {
    case "LOGIN":
      return {
        loggedIn: true,
        user: action.payload,
      };
    case "LOGOUT":
      //TODO check that the logout succeeded
      authPost("/logout", { api_key: state.user.apiKey });
      return {
        loggedIn: false,
        user: null,
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
      apiKey: "QoQDUskRXisjpRktY0f.yhh0U/Of0B5r/0j9Nivicw4",
      name: "Evžen",
      roles: ["Admin", "Client", "Operator"],
      team: { name: "Evženův supertým" },
      created: 115151,
    },
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

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      <div className="App bg-gray-100 min-h-screen flex flex-col">
        <Router>
          <Navbar />
          <AppBody backendAvailable={backendAvailable} />
        </Router>
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
        <div className="m-auto">
          <AtomSpinner color="forest-green" />
        </div>
      );
    case true:
      return (
        <Switch>
          <Route path="/announcements/new">
            <NewAnnouncement />
          </Route>
          <Route path="/announcements/:id/edit">
            <EditAnnouncement />
          </Route>
          <Route path="/announcements/:id">
            <AnnouncementFromUrl />
          </Route>
          <Route path="/announcements">
            <Announcements />
          </Route>
          <Route path="/teams/new">
            <NewTeam />
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
          <Route path="/register/new">
            <NewRegistrationPage />
          </Route>
          <Route path="/register/:email/:token">
            <RegisterPage />
          </Route>
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
