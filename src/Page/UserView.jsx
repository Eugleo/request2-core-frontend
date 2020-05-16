/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';

import * as Icon from 'react-feather';
import * as Button from '../Common/Buttons';
import AuthContext from '../Utils/Auth';

import formatDate from '../Utils/Date';

// TODO Fix accessibility
export default function UserView() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails ? (
        <div
          role="button"
          className="cursor-default w-screen h-screen absolute left-0 top-0"
          onClick={() => setShowDetails(!showDetails)}
        />
      ) : null}
      <div className="h-full w-full relative">
        <button
          type="button"
          className="p-2 bg-gray-400 text-white rounded-full hover:text-gray-200 focus:outline-none"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Icon.User className="h-5 w-5" />
        </button>
        {showDetails ? <UserDetails /> : null}
      </div>
    </>
  );
}

function UserDetails() {
  const { auth, dispatch } = useContext(AuthContext);
  const { user } = auth;

  return (
    <div
      className={
        'details-dropdown absolute flex text-sm flex-col w-40 right-0 border border-gray-300 ' +
        'bg-white text-gray-900 shadow-md rounded-md mt-2 transition duration-150'
      }
    >
      <div className="font-semibold px-4 py-2 mb-2 border-b border-gray-300">{user.name}</div>
      <div className="px-4 mb-4">
        <Section title="Team">{user.team.name}</Section>
        <Section title="Roles">{user.roles.join(', ')}</Section>
        <Section title="Joined">{formatDate(user.created)}</Section>
        <Button.Danger
          title="Log out"
          onClick={() => dispatch({ type: 'LOGOUT' })}
          classNames={['mt-2', 'w-full', 'flex', 'justify-center']}
        />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-2">
      <h4 className="text-xs text-gray-600">{title}</h4>
      {children}
    </div>
  );
}
