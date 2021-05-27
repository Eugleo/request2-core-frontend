import c from 'classnames';
import moment from 'moment';
import React from 'react';
import { Calendar } from 'react-feather';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { SecondaryLinked } from '../Common/Buttons';
import * as Page from '../Common/Layout';
import { Pill } from '../Common/Table';
import { useAsyncGet } from '../Utils/Api';
import { Authorized, useAuth } from '../Utils/Auth';
import { useAuthState } from '../Utils/AuthContext';
import { Result } from '../Utils/Loader';
import { UserDetails, UserName } from './User';

export function LinkToProfile({
  userId,
  className = 'hover:text-indigo-800 text-black i',
}: {
  userId: number;
  className?: string;
}): JSX.Element {
  const { result } = useAsyncGet<UserName>(`/users/${userId}/name`);
  return (
    <Link to={`/users/${userId}/profile`} className={c('inline-block', className)}>
      <p className="font-medium">
        {result.status === 'Success' ? <span>° {result.data.name}</span> : 'Anonymous User'}
      </p>
    </Link>
  );
}

function Descriptor({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}

export function GeneralUserProfile(): JSX.Element {
  const { id } = useParams();
  return <UserProfile id={id} />;
}

type Loader = ({ children }: { children: (data: UserDetails) => JSX.Element }) => JSX.Element;

export function UserProfileHeader({
  result,
  Loader,
}: {
  result: Result<UserDetails>;
  Loader: Loader;
}): JSX.Element {
  return (
    <div className="py-8 space-y-2">
      <div className="flex flex-row space-x-4 items-center">
        <Page.Title>{result.status === 'Success' ? result.data.name : 'User profile'}</Page.Title>
        {result.status === 'Success' && result.data.roles.filter(r => r !== 'Client').length > 0
          ? result.data.roles
              .filter(r => r !== 'Client')
              .map(r => (
                <Pill key={r} className="bg-gray-200 text-gray-600 font-medium text-sm" text={r} />
              ))
          : null}
        <Page.Spacer />
        {result.status === 'Success' ? <EditButton userId={result.data._id} /> : null}
      </div>
      <Loader>
        {({ dateCreated }) => (
          <div className="flex flex-row items-center space-x-2">
            <Calendar className="w-3 h-3 text-gray-700" />
            <p className="text-sm text-gray-600">
              Joined {moment.unix(dateCreated).format('MMM YYYY')}
            </p>
          </div>
        )}
      </Loader>
    </div>
  );
}

export function UserContactInfo({ Loader }: { Loader: Loader }): JSX.Element {
  return (
    <Page.Card className="p-6 mb-8">
      <div className="space-y-6">
        <Descriptor name="Email Address">
          <Loader>{({ email }) => <>{email}</>}</Loader>
        </Descriptor>
        <Descriptor name="Telephone Number">
          <Loader>{({ telephone }) => <>{telephone}</>}</Loader>
        </Descriptor>
        <Descriptor name="Room">
          <Loader>{({ room }) => <>{room}</>}</Loader>
        </Descriptor>
      </div>
    </Page.Card>
  );
}

export function UserProfile({ id }: { id: string }): JSX.Element {
  const { Loader, result } = useAsyncGet<UserDetails>(`/users/${id}/profile`);

  return (
    <Page.ContentWrapper>
      <div className="max-w-2xl mx-auto w-full">
        <UserProfileHeader Loader={Loader} result={result} />
        <Page.Body>
          <UserContactInfo Loader={Loader} />
          <Authorized roles={['Operator', 'Admin']}>
            {result.status === 'Success' ? (
              <ShowAllRequestsLink authorName={result.data.name} />
            ) : null}
          </Authorized>
        </Page.Body>
      </div>
    </Page.ContentWrapper>
  );
}

function ShowAllRequestsLink({ authorName }: { authorName: string }) {
  const query = new URLSearchParams({ query: `author:"${authorName}"` }).toString();
  return (
    <Link
      className="rounded-full shadow-smooth text-sm bg-white text-gray-500 hover:text-gray-600 py-2 px-4"
      to={`/requests?${query}`}
    >
      Show all requests
    </Link>
  );
}

function EditButton({ userId }: { userId: number }) {
  const { auth } = useAuth();

  if (auth.user._id === userId) {
    return <SecondaryLinked to="/me/edit">Edit</SecondaryLinked>;
  } else if (auth.user.roles.includes('Admin')) {
    return <SecondaryLinked to={`/admin/users/${userId}/edit`}>Edit</SecondaryLinked>;
  }
  return null;
}
