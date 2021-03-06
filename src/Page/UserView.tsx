/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import Avatar from 'boring-avatars';
import c from 'classnames';
import React, { useState } from 'react';

import * as Button from '../Common/Buttons';
import { useOnClickOutside } from '../Common/Hooks';
import { useAuth } from '../Utils/Auth';
import { useAuthDispatch } from '../Utils/AuthContext';
import { formatDate } from '../Utils/Date';

export function RandomAvatar({
  userEmail,
  size,
  border = true,
}: {
  userEmail: string;
  size: string;
  border?: boolean;
}): JSX.Element {
  return (
    <div className={c(border && 'rounded-full border border-pink-200', 'p-0.5')}>
      <Avatar
        size={size}
        name={userEmail}
        variant="beam"
        colors={['#BFDBFE', '#A5B4FC', '#C4B5FD', '#FBCFE8', '#FECACA']}
      />
    </div>
  );
}

// TODO Fix accessibility
export function UserView(): JSX.Element {
  const [showDetails, setShowDetails] = useState(false);
  const ref = useOnClickOutside<HTMLDivElement>(() => {
    setShowDetails(false);
  });
  const { auth } = useAuth();

  return (
    <div>
      <div className="relative mx-2" ref={showDetails ? ref : null}>
        {showDetails ? <UserDetails /> : null}
      </div>
      <button
        type="button"
        className="hover:text-gray-200 focus:outline-none"
        onClick={() => {
          if (!showDetails) {
            setShowDetails(true);
          }
        }}
      >
        <RandomAvatar userEmail={auth.user.email} size="2.25rem" />
      </button>
    </div>
  );
}

function UserDetails() {
  const { auth, authPost } = useAuth();
  const dispatch = useAuthDispatch();

  return (
    <div
      className={
        'details-dropdown absolute flex text-sm flex-col w-56 left-0 bottom-0 border border-gray-300 ' +
        'bg-white text-gray-900 shadow-md rounded-md mt-2 transition duration-150 z-50'
      }
    >
      <div className="font-semibold px-4 py-2 mb-2 border-b border-gray-300">{auth.user.name}</div>
      <div className="px-4 mb-4">
        <Section title="Teams">{auth.user.teams.map(t => t.name).intersperse(() => ', ')}</Section>
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
