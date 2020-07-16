import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

import { Authentized, NotAuthentized, Authorized } from '../Utils/Auth';
import UserView from './UserView';

import '../styles/tailwind.css';

export default function Navbar() {
  return (
    <nav className="w-full bg-white sticky border-gray-300 border-b top-0 p-4 z-10">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-left">
            <span className="text-green-600 font-extrabold text-xl mr-6">
              rQ<sup>2</sup>
            </span>
            <Authentized or="/login">
              <Authorized roles={['Client']}>
                <NavLink to="/requests">My Requests</NavLink>
              </Authorized>
              <Authorized roles={['Operator']}>
                <NavLink to="/operator/requests">Client's Requests</NavLink>
              </Authorized>
              <NavLink to="/announcements">Announcements</NavLink>
              <NavLink to="/teams">Teams</NavLink>
            </Authentized>
          </div>
          <div className="flex items-center justify-right">
            <Authentized or="/login">
              <UserView />
            </Authentized>
            <NotAuthentized>
              <NavLink to="/register/new">Register</NavLink>
              <NavLink to="/login">Log in</NavLink>
            </NotAuthentized>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ className = null, to, children }) {
  return (
    <RouterNavLink
      to={to}
      className={className || 'ml-2 px-3 py-2 rounded-md text-sm hover:bg-gray-200'}
      activeClassName="bg-gray-200"
    >
      {children}
    </RouterNavLink>
  );
}
