import React, { useContext, useReducer } from 'react';

import { UserDetails } from '../User/User';
import { Maybe } from './Maybe';

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

export type UserAction =
  | { type: 'LOGIN'; payload: { apiKey: string; user: UserDetails } }
  | { type: 'LOGOUT' };

export type LoginDispatch = (state: Auth, action: UserAction) => Auth;

export type Auth = { loggedIn: false } | { loggedIn: true; apiKey: string; user: UserDetails };

const AuthStateContext = React.createContext<Auth>({ loggedIn: false });
const AuthDispatchContext = React.createContext<Maybe<React.Dispatch<UserAction>>>(undefined);

export function useAuthState() {
  return useContext(AuthStateContext);
}

export function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext);
  if (dispatch) {
    return dispatch;
  }
  throw new Error('Attempted to use auth dispatch out of auth context');
}

export function useAuthContext() {
  const auth = useAuthState();
  const dispatch = useAuthDispatch();
  return { auth, dispatch };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<LoginDispatch>(reducer, { loggedIn: false });
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
