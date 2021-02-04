import '../styles/index.css';

import c from 'classnames';
import { To } from 'history';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import * as Icon from 'react-feather';
import { Link, NavLink as RouterNavLink, useMatch } from 'react-router-dom';

import { Authentized, Authorized, useAuth } from '../Utils/Auth';
import logoSrc from '../assets/logo2.svg';

export function Sidebar(): JSX.Element {
  return (
    <nav className={c('top-0 z-20 bg-gray-100 px-6 sticky')}>
      <div className="border-b border-gray-200 flex flex-row items-stretch">
        <div className="flex flex-row items-center py-4 mr-6">
          <img alt="Request 2 logo" src={logoSrc} className="flex-grow-0 w-7" />
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
      <div className="flex flex-row items-center hover:bg-indigo-100 rounded-lg py-2 px-3">
        <div className="mr-4 text-right">
          <p className="flex-grow text-sm text-indigo-900 font-medium">{auth.user.name}</p>
          <p className="flex-grow text-xs text-indigo-400 ">View profile</p>
        </div>
        <div className="bg-indigo-200 rounded-full p-2">
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
        doesMatch ? 'bg-indigo-200 text-indigo-800' : 'hover:text-indigo-500 text-indigo-400',
        className
      )}
    >
      <div className="flex flex-row items-center font-semibold h-full">
        <p className="text-md font-medium text-opacity-90">{text}</p>
      </div>
    </RouterNavLink>
  );
}
