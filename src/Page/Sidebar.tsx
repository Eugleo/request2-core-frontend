import '../styles/tailwind.css';

import c from 'classnames';
import { To } from 'history';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Navigate, NavLink as RouterNavLink } from 'react-router-dom';

import logoSrc from '../assets/logoII.svg';
import { Spacer } from '../Common/Layout';
import { Authentized, Authorized, NotAuthentized } from '../Utils/Auth';
import UserView from './UserView';

export default function Sidebar() {
  return (
    <div className="h-screen sticky border-gray-300 w-20">
      <nav className="h-full bg-teal-500 border-gray-300 py-4 px-2 z-10">
        <div className="flex flex-col items-center h-full">
          <span className="mb-10 flex-grow-0 px-3">
            <img alt="Request II logo" src={logoSrc} className="flex-grow-0" />
          </span>
          <Authentized otherwise={<Navigate to="/login" />}>
            <Authorized roles={['Client']}>
              <NavLink to="/me/requests">
                <Icon.FileText />
              </NavLink>
            </Authorized>
            <Authorized roles={['Operator']}>
              <NavLink to="/requests">
                <Icon.List />
              </NavLink>
            </Authorized>
            <NavLink to="/announcements">
              <Icon.Globe />
            </NavLink>
            <NavLink to="/teams">
              <Icon.Users />
            </NavLink>
          </Authentized>
          <Spacer />
          <Authentized otherwise={<Navigate to="/login" />}>
            <UserView />
          </Authentized>
          <NotAuthentized>
            <NavLink to="/register/new">Register</NavLink>
            <NavLink to="/login">Log in</NavLink>
          </NotAuthentized>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ className, to, children }: { to: To; children: ReactNode; className?: string }) {
  return (
    <RouterNavLink
      to={to}
      className={c('text-white mb-6 px-3 py-2 rounded-md text-sm hover:bg-teal-600', className)}
      activeClassName="bg-teal-800"
    >
      {children}
    </RouterNavLink>
  );
}
