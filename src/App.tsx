import React, { useCallback, useEffect } from 'react';
import { AtomSpinner, TrinityRingsSpinner } from 'react-epic-spinners';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { AnnouncementRouter } from './Announcement/AnnouncementList';
import { NewForm } from './Common/Form/NewForm';
import { Page } from './Common/Layout';
import { getUserInfo, LoginPage } from './Page/LoggedOut/LoginPage';
import {
  PasswordResetInitPage,
  PasswordResetInitPageWithEmail,
  PasswordResetPage,
} from './Page/LoggedOut/PasswordResetPage';
import { RegisterInitPage } from './Page/LoggedOut/RegisterInitPage';
import { RegisterPage } from './Page/LoggedOut/RegisterPage';
import { NotFound404 } from './Page/NotFound404';
import { EditMyProfile, MyProfilePage } from './Page/ProfilePage';
import { Sidebar } from './Page/Sidebar';
import { Requests as RequestsAsClient } from './Request/Client/RequestList';
import { Requests as RequestsAsOperator } from './Request/Operator/RequestList';
import { TeamRouter } from './Team/TeamList';
import { GeneralUserProfile, UserProfile } from './User/UserProfile';
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
      try {
        const userDetails = await getUserInfo(apiKey);
        dispatch({
          payload: { apiKey, user: userDetails.data },
          type: 'LOGIN',
        });
      } catch (error) {
        localStorage.removeItem('apiKey');
        console.log(error);
        return Promise.resolve(null);
      }
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
      <div className="App bg-gray-100 w-screen flex flex-col h-screen">
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
  console.log(backendState);
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
          <Route path="/register" element={<RegisterInitPage />} />
          <Route path="/register/:email/:token" element={<RegisterPage />} />
          <Route path="/password-reset" element={<PasswordResetInitPage />} />
          <Route path="/password-reset/:email" element={<PasswordResetInitPageWithEmail />} />
          <Route path="/password-reset/:email/:token" element={<PasswordResetPage />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      }
    >
      <Sidebar />
      <Routes>
        <Route path="/me" element={<MyProfilePage />} />
        <Route path="/me/*">
          <Route path="edit" element={<EditMyProfile />} />
          <Route path="requests/*" element={<RequestsAsClient />} />
        </Route>
        <Route path="/login" element={<Navigate to="/me/requests" />} />
        <Route path="/admin/users/*" element={<UserRouter />} />
        <Route path="/users/:id/profile" element={<GeneralUserProfile />} />
        <Route path="/requests/*" element={<RequestsAsOperator />} />
        <Route path="/announcements/*" element={<AnnouncementRouter />} />
        <Route path="/admin/teams/*" element={<TeamRouter />} />
        <Route path="/" element={<Navigate to="/me/requests" />} />
        <Route path="/*" element={<NotFound404 />} />
      </Routes>
    </Authentized>
  );
}
