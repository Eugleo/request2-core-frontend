import React, { useState, useEffect, useReducer } from 'react';

import { AtomSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Page/Navbar';
import * as Api from './Utils/Api';
import Footer from './Page/Footer';

import Page from './Page/Page';
import AuthContext, { useAuth } from './Utils/Auth';
import NotFound404 from './Page/NotFound404';

import { AnnouncementFromUrl, Announcements } from './Announcement/Announcements';
import { NewRegistrationPage, RegisterPage } from './Page/Registration';
import LoginPage from './Page/LoginPage';

import Teams from './Team/Teams';
import EditTeam from './Team/EditTeam';
import NewTeam from './Team/NewTeam';
import NewAnnouncement from './Announcement/NewAnnouncement';
import EditAnnouncement from './Announcement/EditAnnouncement';

function reducer(state, action) {
  const { authPost } = useAuth();
  switch (action.type) {
    case 'LOGIN':
      return {
        loggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      // TODO check that the logout succeeded
      authPost('/logout', { api_key: state.user.apiKey });
      return {
        loggedIn: false,
        user: null,
      };
    default:
      return state;
  }
}

function App() {
  const initialAuth = {
    loggedIn: true,
    userID: 1,
    user: {
      apiKey: 'QoQDUskRXisjpRktY0f.yhh0U/Of0B5r/0j9Nivicw4',
      name: 'Evžen',
      roles: ['Admin', 'Client', 'Operator'],
      team: { name: 'Evženův supertým' },
      created: 115151,
    },
  };

  const [backendAvailable, setBackendAvailable] = useState(null);
  const [auth, dispatch] = useReducer(reducer, initialAuth);

  useEffect(() => {
    Api.get('/capability')
      .then(r => r.json())
      .then(js => {
        if (js.includes('request2')) {
          setBackendAvailable(true);
        } else {
          throw Error('Unsupported backend');
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
