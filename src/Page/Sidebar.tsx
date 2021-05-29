import '../styles/index.css';

import c from 'classnames';
import { ReactNode, useState } from 'react';
import { AtomSpinner } from 'react-epic-spinners';
import * as Icon from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link, NavLink as RouterNavLink, useLocation, useMatch } from 'react-router-dom';

import { LongTextInput } from '../Common/Form/NewTextField';
import { useOnClickOutside } from '../Common/Hooks';
import { Authentized, Authorized, useAuth } from '../Utils/Auth';
import logoSrc from '../assets/logo2new.svg';
import { RandomAvatar } from './UserView';

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
                  text="Client's requests"
                />
              </Authorized>
              <NavLink
                to="/announcements"
                icon={<Icon.Globe className="w-5 h-5" />}
                text="Announcements"
              />
              <Authorized roles={['Operator', 'Admin']}>
                <NavLink to="/admin/teams" icon={<Icon.Users className="w-5 h-5" />} text="Teams" />
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
            <div className="flex flex-row space-x-2 items-center">
              <UserButton />
              <FeedbackButton />
            </div>
          </Authentized>
        </div>
      </div>
    </nav>
  );
}

type Feedback = {
  path: string;
  content: string;
  datetime: number;
};

type State = 'minimised' | 'input' | 'waiting' | 'success' | 'error';

function FeedbackButton() {
  const [isMinimised, setIsMinimised] = useState<State>('minimised');
  const { authPost, auth } = useAuth<Feedback>();
  const ref = useOnClickOutside<HTMLDivElement>(() => {
    setIsMinimised('minimised');
  });
  const form = useForm();
  const { pathname } = useLocation();

  let buttonChildren;
  switch (isMinimised) {
    case 'input':
      buttonChildren = 'Send';
      break;
    case 'error':
      buttonChildren = (
        <div className="flex flex-row">
          <Icon.AlertTriangle className="text-white mr-2 w-5 h-5" />
          Error
        </div>
      );
      break;
    case 'waiting':
      buttonChildren = (
        <div>
          <AtomSpinner color="white" size={30} />
        </div>
      );
      break;
    case 'success':
      buttonChildren = (
        <div className="flex flex-row">
          <Icon.Check className="text-white mr-2 w-5 h-5" />
          Success
        </div>
      );
  }

  return (
    <div>
      <button
        className="bg-indigo-500 text-white font-medium text-sm rounded-md py-2 px-4 hover:bg-indigo-600"
        onClick={() => {
          setIsMinimised(m => (m === 'minimised' ? 'input' : m));
        }}
      >
        One click to send feedback
      </button>
      {isMinimised === 'minimised' ? null : (
        <div ref={ref} className="bg-white shadow-lg p-6 absolute top-14 rounded-lg w-64 right-8">
          <form
            onSubmit={form.handleSubmit(async ({ content }) => {
              setIsMinimised('waiting');
              const r = await authPost('/feedback', {
                path: pathname,
                content,
                datetime: Date.now() / 1000,
              });
              if (r.ok) {
                setIsMinimised('success');
              } else {
                setIsMinimised('error');
              }
            })}
          >
            <LongTextInput
              name="content"
              placeholder="I noticed that..."
              reg={form.register()}
              className="mb-2"
            />
            <div className="flex flex-row justify-between">
              <button
                type="submit"
                disabled={isMinimised !== 'input'}
                className={c(
                  'rounded-lg px-4 py-2 font-medium text-sm text-white',
                  isMinimised === 'input' && 'bg-indigo-500 hover:bg-indigo-600',
                  isMinimised !== 'input' && 'bg-indigo-400 cursor-default'
                )}
              >
                {buttonChildren}
              </button>
              {isMinimised === 'error' || isMinimised === 'success' ? (
                <button
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium px-2"
                  onClick={() => {
                    setIsMinimised('input');
                    form.reset();
                  }}
                >
                  Try again
                </button>
              ) : null}
            </div>
          </form>
        </div>
      )}
    </div>
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
        <RandomAvatar userEmail={auth.user.email} size="2.25rem" />
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
