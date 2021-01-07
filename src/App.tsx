import React, { useCallback, useEffect } from 'react';
import { AtomSpinner, TrinityRingsSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { AnnouncementRouter } from './Announcement/AnnouncementList';
import { Page } from './Common/Layout';
import { getUserInfo, LoginPage } from './Page/LoginPage';
import { NewRegistrationPage } from './Page/NewRegistrationPage';
import { NotFound404 } from './Page/NotFound404';
import { PasswordResetPage, PasswordResetPageWithEmail } from './Page/PasswordRecoveryPage';
import { RegisterPage } from './Page/RegisterPage';
import { Sidebar } from './Page/Sidebar';
import { Requests as RequestsAsClient } from './Request/Client/RequestList';
import { Requests as RequestsAsOperator } from './Request/Operator/RequestList';
import { TeamRouter } from './Team/TeamList';
import { UserRouter } from './User/UserRouter';
import { get } from './Utils/Api';
import { Authentized } from './Utils/Auth';
import { AuthProvider, useAuthDispatch } from './Utils/AuthContext';
import { useAsync } from './Utils/Loader';

type BackendState = 'available' | 'unavailable' | 'loading';

async function getAvailability() {
  const r = await get('/capability');
  return r.json();
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
      throw new Error('Unsupported backend');
    default:
      return 'unavailable';
  }
}

function useLogin() {
  const apiKey = localStorage.getItem('apiKey');
  const dispatch = useAuthDispatch();

  const getUserDetails = useCallback(async () => {
    if (apiKey) {
      const userDetails = await getUserInfo(apiKey);
      dispatch({
        payload: { apiKey, user: userDetails },
        type: 'LOGIN',
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

export function App(): JSX.Element {
  return (
    <AuthProvider>
      <div className="App bg-white h-screen max-h-screen w-screen">
        <Router>
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
          <Route path="/password-reset" element={<PasswordResetPage email={null} />} />
          <Route path="/password-reset/:email" element={<PasswordResetPageWithEmail />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      }
    >
      <div
        className="grid grid-cols-2 h-screen w-screen"
        style={{ gridTemplateColumns: 'auto 1fr' }}
      >
        <Sidebar />
        <Routes>
          <Sidebar />
          <Route path="/login" element={<Navigate to="/me/requests" />} />
          <Route path="/admin/users/*" element={<UserRouter />} />
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
      </div>
    </Authentized>
  );
}
