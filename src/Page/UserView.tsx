/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { User } from 'react-feather';

import * as Button from '../Common/Buttons';
import { useOnClickOutside } from '../Common/Hooks';
import AuthContext, { useAuth } from '../Utils/Auth';
import formatDate from '../Utils/Date';

export function RandomAvatar() {
  return (
    <div className="bg-teal-700 rounded-full h-10 w-10 flex justify-center items-center">
      <User className="text-white" />
    </div>
  );
}

// TODO Fix accessibility
export default function UserView() {
  const [showDetails, setShowDetails] = useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => setShowDetails(false));

  return (
    <div>
      <div className="relative mx-2" ref={showDetails ? ref : null}>
        {showDetails ? <UserDetails /> : null}
      </div>
      <button
        type="button"
        className="hover:text-gray-200 focus:outline-none"
        onClick={() => !showDetails && setShowDetails(true)}
      >
        <div style={{ padding: '-1px' }} className="flex w-full h-full items-stretch">
          <RandomAvatar />
        </div>
      </button>
    </div>
  );
}

function UserDetails() {
  const { auth, authPost } = useAuth();
  const { dispatch } = useContext(AuthContext);

  if (!dispatch) {
    throw Error(
      "This shouldn't happen, ever: dispatch is null, but we're trying to show user details"
    );
  }

  return (
    <div
      className={
        'details-dropdown absolute flex text-sm flex-col w-56 left-0 bottom-0 border border-gray-300 ' +
        'bg-white text-gray-900 shadow-md rounded-md mt-2 transition duration-150 z-50'
      }
    >
      <div className="font-semibold px-4 py-2 mb-2 border-b border-gray-300">{auth.user.name}</div>
      <div className="px-4 mb-4">
        <Section title="Team">{auth.user.team.name}</Section>
        <Section title="Roles">
          <div className="flex flex-row flex-wrap">
            {auth.user.roles.map(d => (
              <span key={d} className="px-2 py-1 text-sm bg-gray-100 border rounded-sm mr-2 mb-2">
                {d}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Joined">{formatDate(auth.user.dateCreated.valueOf())}</Section>
        <Button.Primary
          title="Log out"
          status="Danger"
          onClick={() => {
            authPost('/logout', {})
              .then(r => {
                if (r.ok) {
                  localStorage.removeItem('apiKey');
                  dispatch({ type: 'LOGOUT' });
                }
                throw new Error(`Couldn't log out, response was ${r}`);
              })
              .catch(e => {
                console.log(e);
              });
          }}
        />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <h4 className="text-xs text-gray-600">{title}</h4>
      {children}
    </div>
  );
}
