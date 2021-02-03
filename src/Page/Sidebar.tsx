import '../styles/index.css';

import c from 'classnames';
import { To } from 'history';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
import { NavLink as RouterNavLink } from 'react-router-dom';

import { Tertiary } from '../Common/Buttons';
import { Spacer } from '../Common/Layout';
import { Authentized, Authorized, NotAuthentized, useAuth } from '../Utils/Auth';
import { useAuthDispatch } from '../Utils/AuthContext';
import logoSrc from '../assets/logoII.svg';

export function Sidebar(): JSX.Element {
  const { authPost } = useAuth();
  const dispatch = useAuthDispatch();

  return (
    <nav className="h-full sticky bg-green-800 border-gray-300 w-64 py-4 px-2 z-10 items-start">
      <div className="mb-10 flex flex-row items-center pl-2">
        <img alt="Request II logo" src={logoSrc} className="flex-grow-0 w-10 mr-4" />
        <p className="text-2xl font-bold text-white">Request 2</p>
      </div>
      <div className="space-y-2 flex flex-col">
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
        <Spacer />
        <Authentized>
          <Tertiary
            className="hover:bg-green-900 rounded-md"
            onClick={async () => {
              const r = await authPost('/logout', {});
              if (r.ok) {
                localStorage.removeItem('apiKey');
                dispatch({ type: 'LOGOUT' });
              } else {
                const body = await r.text();
                console.log(`Couldn't log out, response body was ${body}`);
              }
            }}
          >
            <div className="w-full flex flex-row items-center">
              <span className="mr-4 w-6 text-green-600">
                <Icon.LogOut />
              </span>
              <p className="text-md font-semibold text-green-400 text-opacity-90">Log out</p>
            </div>
          </Tertiary>
          <NavLink to="/me" end icon={<Icon.User />} text="My profile" />
        </Authentized>
      </div>
    </nav>
  );
}

function NavLink({
  className,
  to,
  icon,
  text,
  end = false,
}: {
  to: To;
  icon: ReactNode;
  text: string;
  className?: string;
  end?: boolean;
}) {
  return (
    <RouterNavLink
      end={end}
      to={to}
      className={c(
        'w-full px-3 py-2 rounded-md text-sm hover:bg-green-900 text-green-300',
        className
      )}
      activeClassName="bg-green-900 text-white"
    >
      <div className="flex flex-row items-center font-semibold">
        <span className="mr-4 w-6 text-green-600">{icon}</span>
        <p className="text-md font-semibold text-opacity-90">{text}</p>
      </div>
    </RouterNavLink>
  );
}
