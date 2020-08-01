import React, { ReactNode } from 'react';
import { NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import { To } from 'history';
import c from 'classnames';
import { Authentized, NotAuthentized, Authorized } from '../Utils/Auth';
import UserView from './UserView';
import '../styles/tailwind.css';

export default function Sidebar() {
  return (
    <nav className="h-screen w-20 bg-green-700 fixed border-gray-300 border-b top-0 left-0 p-4 z-10">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col items-center justify-center">
          <span className="text-green-900 font-extrabold text-xl mb-16">
            rQ<sup>2</sup>
          </span>
          <Authentized otherwise={<Navigate to="/login" />}>
            <Authorized roles={['Client']}>
              <NavLink to="/me/requests">
                <Icon.FileText className="text-white" />
              </NavLink>
            </Authorized>
            <Authorized roles={['Operator']}>
              <NavLink to="/requests">
                <Icon.List className="text-white" />
              </NavLink>
            </Authorized>
            <NavLink to="/announcements">
              <Icon.Globe className="text-white" />
            </NavLink>
            <NavLink to="/teams">
              <Icon.Users className="text-white" />
            </NavLink>
          </Authentized>
        </div>
        <div className="flex items-center justify-right">
          <Authentized otherwise={<Navigate to="/login" />}>
            <UserView />
          </Authentized>
          <NotAuthentized>
            <NavLink to="/register/new">Register</NavLink>
            <NavLink to="/login">Log in</NavLink>
          </NotAuthentized>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ className, to, children }: { to: To; children: ReactNode; className?: string }) {
  return (
    <RouterNavLink
      to={to}
      className={c('mb-6 px-3 py-2 rounded-md text-sm hover:bg-green-600', className)}
      activeClassName="bg-green-800"
    >
      {children}
    </RouterNavLink>
  );
}
