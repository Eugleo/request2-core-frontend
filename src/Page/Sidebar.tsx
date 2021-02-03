import '../styles/index.css';

import c from 'classnames';
import { To } from 'history';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Link, NavLink as RouterNavLink, useMatch } from 'react-router-dom';

import { Authentized, Authorized, useAuth } from '../Utils/Auth';
import logoSrc from '../assets/logoII.svg';

export function Sidebar(): JSX.Element {
  return (
    <nav className="h-full sticky bg-gray-50 border-gray-200 border-r w-64 z-10 flex flex-col items-stretch">
      <div className="mb-8 flex flex-row items-center px-4 mt-4">
        <img alt="Request II logo" src={logoSrc} className="flex-grow-0 w-9 mr-4" />
        <p className="text-2xl font-bold text-black">Request 2</p>
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="space-y-3 flex flex-col px-2">
          <Authentized>
            <Authorized roles={['Client']}>
              <NavLink to="/me/requests" icon={<Icon.FileText />} text="My requests" />
            </Authorized>
            <Authorized roles={['Operator']}>
              <NavLink to="/requests" icon={<Icon.List />} text="Client's request" />
            </Authorized>
            <NavLink to="/announcements" icon={<Icon.Globe />} text="Announcements" />
            <Authorized roles={['Operator', 'Admin']}>
              <NavLink to="/teams" icon={<Icon.Users />} text="Teams" />
            </Authorized>
          </Authentized>
          <Authorized roles={['Operator', 'Admin']}>
            <NavLink to="/admin/users" icon={<Icon.UserPlus />} text="Users" />
          </Authorized>
        </div>
        <div className="space-y-2 flex flex-col">
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
      <div className="px-4 hover:bg-gray-100 flex flex-row items-center py-4 border-t border-gray-200">
        <div className="bg-gray-200 rounded-full p-2 mr-4">
          <Icon.User className="text-gray-600 h-6 w-6" />
        </div>
        <div>
          <p className="flex-grow text-sm text-gray-700 font-medium">{auth.user.name}</p>
          <p className="text-gray-400 text-xs">View profile</p>
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
        'w-full px-3 py-2 rounded-md text-sm',
        doesMatch ? 'bg-gray-200 text-gray-600' : 'hover:bg-gray-100 text-gray-400',
        className
      )}
    >
      <div className="flex flex-row items-center font-semibold">
        <span className={c('mr-4 w-6', doesMatch ? 'text-gray-500' : 'text-gray-400')}>{icon}</span>
        <p className="text-md font-medium text-opacity-90">{text}</p>
      </div>
    </RouterNavLink>
  );
}
