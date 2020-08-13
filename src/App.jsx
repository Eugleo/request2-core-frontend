import React, { useEffect, useReducer, useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import AnnouncementRouter from './Announcement/AnnouncementList';
import { Page } from './Common/Layout';
import LoginPage from './Page/LoginPage';
import NotFound404 from './Page/NotFound404';
import { NewRegistrationPage, RegisterPage } from './Page/Registration';
import Sidebar from './Page/Sidebar';
import RequestsAsClient from './Request/Client/RequestList';
import RequestsAsOperator from './Request/Operator/RequestList';
import TeamRouter from './Team/TeamList';
import * as Api from './Utils/Api';
import AuthContext from './Utils/Auth';

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        loggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      // TODO check that the logout succeeded
      Api.post('/logout', { Authorization: state.user.apiKey });
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
    userId: 1,
    user: {
      apiKey: 'QoQDUskRXisjpRktY0f.yhh0U/Of0B5r/0j9Nivicw4',
      name: 'Evžen Wybitul',
      roles: ['Admin', 'Client', 'Operator'],
      team: { name: 'Jiří Vondrášek', _id: 2 },
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
      <div
        style={{ gridTemplateColumns: 'auto 1fr' }}
        className="App bg-white h-screen max-h-screen w-screen grid grid-cols-2"
      >
        <Router>
          <Sidebar />
          <AppBody backendAvailable={backendAvailable} />
        </Router>
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
        <Routes>
          <Route path="/me/*">
            <Route path="requests/*" element={<RequestsAsClient />} />
          </Route>
          <Route path="/requests/*" element={<RequestsAsOperator />} />
          <Route path="/announcements/*" element={<AnnouncementRouter />} />
          <Route path="/teams/*" element={<TeamRouter />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register">
            <Route path="new" element={<NewRegistrationPage />} />
            <Route path=":email/:token" element={<RegisterPage />} />
          </Route>
          <Route path="/" element={<LoginPage />} />
          <Route path="/*" element={<NotFound404 />} />
        </Routes>
      );
    default:
      return (
        <Page title="Error" width="max-w-lg">
          <p className="text-gray-800">
            Something seems to be wrong with the server. Try again later.
          </p>
        </Page>
      );
  }
}

export default App;
