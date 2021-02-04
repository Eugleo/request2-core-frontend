import '../styles/index.css';

import c from 'classnames';
import { To } from 'history';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Link, NavLink as RouterNavLink, useMatch } from 'react-router-dom';

import { Authentized, Authorized, useAuth } from '../Utils/Auth';
import logoSrc from '../assets/logo2.svg';

export function Sidebar(): JSX.Element {
  return (
    <nav className="top-0 z-20 bg-indigo-800 px-6 sticky">
      <div className="border-b border-gray-600 flex flex-row items-stretch">
        <div className="flex flex-row items-center py-4 mr-6">
          <img alt="Request II logo" src={logoSrc} className="flex-grow-0 w-9" />
        </div>
        <div className="flex flex-row justify-between flex-grow items-center">
          <div className="space-x-4 flex flex-row py-2 items-center">
            <Authentized>
              <Authorized roles={['Client']}>
                <NavLink
                  to="/me/requests"
                  icon={<Icon.FileText className="w-5 h-5" />}
                  text="My requests"
                />
              </Authorized>
              <Authorized roles={['Operator']}>
                <NavLink
                  to="/requests"
                  icon={<Icon.List className="w-5 h-5" />}
                  text="Client's request"
                />
              </Authorized>
              <NavLink
                to="/announcements"
                icon={<Icon.Globe className="w-5 h-5" />}
                text="Announcements"
              />
              <Authorized roles={['Operator', 'Admin']}>
                <NavLink to="/teams" icon={<Icon.Users className="w-5 h-5" />} text="Teams" />
              </Authorized>
            </Authentized>
            <Authorized roles={['Operator', 'Admin']}>
              <NavLink
                to="/admin/users"
                icon={<Icon.UserPlus className="w-5 h-5" />}
                text="Users"
              />
            </Authorized>
          </div>
          <Authentized>
            <UserButton />
          </Authentized>
        </div>
      </div>
    </nav>
  );
}

function UserButton() {
  const { auth } = useAuth();
  return (
    <Link to="/me">
      <div className="flex flex-row items-center">
        <div className="mr-4 text-right">
          <p className="flex-grow text-sm text-indigo-200 font-medium">{auth.user.name}</p>
        </div>
        <div className="bg-indigo-400 rounded-full p-1">
          <Icon.User className="text-indigo-900 w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}

function NavLink({
  className,
  to,
  icon,
  text,
  end = false,
}: {
  to: string;
  icon: ReactNode;
  text: string;
  className?: string;
  end?: boolean;
}) {
  const doesMatch = useMatch({ path: to, end });
  return (
    <RouterNavLink
      end={end}
      to={to}
      className={c(
        'px-3 py-2 rounded-md text-sm',
        doesMatch ? 'bg-indigo-900 text-white' : 'hover:text-indigo-100 text-indigo-200',
        className
      )}
    >
      <div className="flex flex-row items-center font-semibold h-full">
        <p className="text-md font-medium text-opacity-90">{text}</p>
      </div>
    </RouterNavLink>
  );
}
