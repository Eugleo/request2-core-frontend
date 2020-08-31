import React, { useEffect, useReducer, useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import NewUser from './Admin/NewUser';
import UserList from './Admin/UserList';
import AnnouncementRouter from './Announcement/AnnouncementList';
import { Page } from './Common/Layout';
import LoginPage, { getUserInfo } from './Page/LoginPage';
import NotFound404 from './Page/NotFound404';
import { NewRegistrationPage, RegisterPage } from './Page/Registration';
import Sidebar from './Page/Sidebar';
import RequestsAsClient from './Request/Client/RequestList';
import RequestsAsOperator from './Request/Operator/RequestList';
import TeamRouter from './Team/TeamList';
import * as Api from './Utils/Api';
import AuthContext, { Auth, Authentized, LoginDispatch, UserAction } from './Utils/Auth';

function reducer(state: Auth, action: UserAction): Auth {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('apiKey', action.payload.apiKey);
      return {
        ...action.payload,
        loggedIn: true,
      };
    case 'LOGOUT':
      return { loggedIn: false };
    default:
      return state;
  }
}

type BackendState = 'available' | 'unavailable' | 'loading';

function App() {
  // const initialAuth = {
  //   loggedIn: true,
  //   userId: 2,
  //   user: {
  //     apiKey: 'fYa5KGDOQdBNzw5wC7UMGjqhtkmGczG8tMG4jWOdmBY=',
  //     // the corresponding hash for DB: fb70583ce558ad846ed92991566a4beab3665ddb416c68953571d30c8b5cc266
  //     name: 'Evžen Wybitul',
  //     roles: ['Admin', 'Client', 'Operator'],
  //     team: { name: 'Jiří Vondrášek', _id: 2 },
  //     created: 115151,
  //   },
  // };

  const [backendState, setBackendState] = useState<BackendState>('loading');
  const [auth, dispatch] = useReducer<LoginDispatch>(reducer, { loggedIn: false });

  useEffect(() => {
    Api.get('/capability')
      .then(r => r.json())
      .then(js => {
        if (js.includes('request2')) {
          setBackendState('available');
        } else {
          throw Error('Unsupported backend');
        }
      })
      .catch(e => {
        console.log(e);
        setBackendState('unavailable');
      });
  }, []);

  const apiKey = localStorage.getItem('apiKey');
  useEffect(() => {
    if (apiKey) {
      console.log(apiKey);
      getUserInfo(apiKey)
        .then(userDetails => {
          dispatch({
            type: 'LOGIN',
            payload: { apiKey, user: userDetails },
          });
          console.log(userDetails);
        })
        .catch(e => localStorage.removeItem('apiKey'));
    }
  }, [apiKey]);

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      <div
        style={{ gridTemplateColumns: 'auto 1fr' }}
        className="App bg-white h-screen max-h-screen w-screen grid grid-cols-2"
      >
        <Router>
          <Sidebar />
          <AppBody backendState={backendState} />
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

function AppBody({ backendState }: { backendState: BackendState }) {
  // TODO Add timeout
  switch (backendState) {
    case 'loading':
      return (
        <div className="m-auto">
          <AtomSpinner color="forest-green" />
        </div>
      );
    case 'available':
      return (
        <Authentized
          otherwise={
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
          }
        >
          <Routes>
            <Route path="/login" element={<Navigate to="/me/requests" />} />
            <Route path="/admin/users">
              <UserList />
            </Route>
            <Route path="/admin/users/new">
              <NewUser />
            </Route>
            <Route path="/me/*">
              <Route path="requests/*" element={<RequestsAsClient />} />
            </Route>
            <Route path="/requests/*" element={<RequestsAsOperator />} />
            <Route path="/announcements/*" element={<AnnouncementRouter />} />
            <Route path="/teams/*" element={<TeamRouter />} />
            <Route path="/register">
              <Route path="new" element={<NewRegistrationPage />} />
              <Route path=":email/:token" element={<RegisterPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/me/requests" />} />
            <Route path="/*" element={<NotFound404 />} />
          </Routes>
        </Authentized>
      );
    default:
      // case unavailable
      return (
        <Page title="Error">
          <p className="text-gray-800">
            Something seems to be wrong with the server. Try again later.
          </p>
        </Page>
      );
  }
}

export default App;
