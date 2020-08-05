import React, { ReactNode } from 'react';
import { NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { To } from 'history';
import c from 'classnames';
import { Authentized, NotAuthentized, Authorized } from '../Utils/Auth';
import UserView from './UserView';
import '../styles/tailwind.css';
import logoSrc from '../assets/logoII.svg';

export default function Sidebar() {
  return (
    <div className="h-screen sticky border-r border-gray-300 w-20">
      <nav className="h-full bg-gray-100 border-gray-300 p-4 border-b z-10">
        <div className="flex flex-col items-center h-full">
          <span className="mb-10 flex-grow-0">
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
          <span className="flex-grow" />
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
      className={c(
        'text-gray-600 mb-6 px-3 py-2 rounded-md text-sm hover:text-gray-800',
        className
      )}
      activeClassName="bg-gray-200"
    >
      {children}
    </RouterNavLink>
  );
}
