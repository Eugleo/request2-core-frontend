/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';

import * as Icon from 'react-feather';
import * as Button from '../Common/Buttons';
import AuthContext from '../Utils/Auth';

import formatDate from '../Utils/Date';
import useOnClickOutside from '../Common/Hooks';

// TODO Fix accessibility
export default function UserView() {
  const [showDetails, setShowDetails] = useState(false);
  const ref = useOnClickOutside(() => setShowDetails(false));

  return (
    <div className="relative" ref={showDetails ? ref : null}>
      <button
        type="button"
        className="p-2 bg-gray-600 text-white rounded-full hover:text-gray-200 focus:outline-none"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Icon.User className="h-5 w-5" />
      </button>
      {showDetails ? <UserDetails /> : null}
    </div>
  );
}

function UserDetails() {
  const { auth, dispatch } = useContext(AuthContext);
  const { user } = auth;

  return (
    <div
      className={
        'details-dropdown absolute flex text-sm flex-col w-56 right-0 border border-gray-300 ' +
        'bg-white text-gray-900 shadow-md rounded-md mt-2 transition duration-150'
      }
    >
      <div className="font-semibold px-4 py-2 mb-2 border-b border-gray-300">{user.name}</div>
      <div className="px-4 mb-4">
        <Section title="Team">{user.team.name}</Section>
        <Section title="Roles">
          <div className="flex flex-row flex-wrap">
            {user.roles.map(d => (
              <span key={d} className="px-2 py-1 text-sm bg-gray-100 border rounded-sm mr-2 mb-2">
                {d}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Joined">{formatDate(user.created)}</Section>
        <Button.Primary
          title="Log out"
          status="Danger"
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
