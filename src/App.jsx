import React, { useState, useEffect, useReducer } from 'react';

import { AtomSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Page/Navbar';
import * as Api from './Utils/Api';
import Footer from './Page/Footer';

import Page from './Page/Page';
import AuthContext from './Utils/Auth';
import NotFound404 from './Page/NotFound404';

import { Announcements } from './Announcement/Announcements';
import { NewRegistrationPage, RegisterPage } from './Page/Registration';
import LoginPage from './Page/LoginPage';

import Teams from './Team/Teams';
import RequestsAsOperator from './Request/Operator/Requests';
import RequestsAsClient from './Request/Client/Requests';
import RequestPage from './Request/RequestPage';

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
        <Routes>
          <Route path="/me/*">
            <Route path="requests" element={<RequestsAsClient />} />
            <Route path="requests/:id" element={<RequestPage />} />
          </Route>
          <Route path="/requests/*" element={<RequestsAsOperator />} />
          <Route path="/announcements/*" element={<Announcements />} />
          <Route path="/teams/*" element={<Teams />} />
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
