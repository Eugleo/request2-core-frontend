import React, { useCallback, useEffect } from 'react';
import { AtomSpinner, TrinityRingsSpinner } from 'react-epic-spinners';
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
import { Authentized } from './Utils/Auth';
import { AuthProvider, useAuthDispatch } from './Utils/AuthContext';
import { useAsync } from './Utils/Loader';

type BackendState = 'available' | 'unavailable' | 'loading';

async function getAvailability() {
  return Api.get('/capability').then(r => r.json());
}

function useBackendState(): BackendState {
  const { result } = useAsync<string>(getAvailability);

  switch (result.status) {
    case 'Pending':
      return 'loading';
    case 'Success':
      if (result.data.includes('request2')) {
        return 'available';
      }
      throw Error('Unsupported backend');
    default:
      return 'unavailable';
  }
}

function useLogin() {
  const apiKey = localStorage.getItem('apiKey');
  const dispatch = useAuthDispatch();

  const getUserDetails = useCallback(() => {
    if (apiKey) {
      return getUserInfo(apiKey).then(userDetails => {
        dispatch({
          type: 'LOGIN',
          payload: { apiKey, user: userDetails },
        });
        return null;
      });
    }
    return Promise.resolve(null);
  }, [apiKey, dispatch]);

  const { result } = useAsync<null>(getUserDetails);

  useEffect(() => {
    if (result.status === 'Error') {
      localStorage.removeItem('apiKey');
    }
  }, [result.status]);

  return result;
}

function App() {
  return (
    <AuthProvider>
      <div
        style={{ gridTemplateColumns: 'auto 1fr' }}
        className="App bg-white h-screen max-h-screen w-screen grid grid-cols-2"
      >
        <Router>
          <Sidebar />
          <AppBody />
        </Router>
      </div>
    </AuthProvider>
  );
}

function AppBody() {
  const backendState = useBackendState();
  const login = useLogin();

  // TODO Add timeout
  switch (backendState) {
    case 'loading':
      return (
        <div className="m-auto">
          <AtomSpinner color="forest-green" />
        </div>
      );
    case 'available':
      if (login.status === 'Pending') {
        return <LoadingRoutes />;
      }
      if (login.status === 'Error') {
        return <LoadingRoutes />;
      }
      return <NormalRoutes />;
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

function LoadingRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<TrinityRingsSpinner />} />
    </Routes>
  );
}

function NormalRoutes() {
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
}

export default App;
