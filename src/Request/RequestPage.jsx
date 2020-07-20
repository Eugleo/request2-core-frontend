import React from 'react';
import c from 'classnames';
import { useParams, Navigate } from 'react-router-dom';
import moment from 'moment';
import { Section } from '../Common/Forms';
import formatDate from '../Utils/Date';
import { useAuth, Authorized } from '../Utils/Auth';
import * as Button from '../Common/Buttons';
import ResultReportCard from './Operator/ResultReportCard';
import { useLoadResources } from '../Utils/Api';

import { maybe } from '../Utils/Func';
import { parseFieldPath } from '../Utils/FieldPath';

function Property({ name, property: { propertyData, dateAdded } }) {
  return (
    <div className="flex flex-col mb-1">
      <div className="w-full flex flex-row mb-2 items-center">
        <h3 className="font-bold flex-grow">{name}</h3>
        <span className="text-gray-700 text-xs">{formatDate(dateAdded)}</span>
      </div>
      {propertyData.includes(';;;') ? (
        <div className="flex flex-row flex-wrap">
          {propertyData.split(';;;').map(d => (
            <span key={d} className="px-2 py-1 text-sm bg-gray-100 border rounded-sm mr-2 mb-2">
              {d}
            </span>
          ))}
        </div>
      ) : (
        <p className="break-words text-sm">{propertyData}</p>
      )}
    </div>
  );
}

function HeaderItem({ label, contents }) {
  return (
    <div className="mb-4 col-span-1">
      <h3 className="font-medium text-gray-600">{label}</h3>
      <p className="text-gray-800">{contents}</p>
    </div>
  );
}

function RequestHeader({ request, author, lastChange }) {
  return (
    <div className="col-span-4 grid grid-cols-4">
      <div className="col-span-3">
        <div className="flex flex-row items-center mb-2">
          <h1 className="text-3xl font-bold leading-tight text-black">{request.name}</h1>
          <span className="ml-4 text-3xl text-gray-500">#{request.code}</span>
        </div>
        <div className="flex flex-row items-center">
          <StatusLabel status={request.status} />
          <p className="ml-4 text-gray-700 text-sm">
            <span className="font-semibold">{author.name}</span> has requested this item{' '}
            <span>{moment.unix(lastChange).fromNow()}</span>
          </p>
        </div>
      </div>
      <ButtonArray request={request} />
    </div>
  );
}

function ButtonArray({ request }) {
  const { auth, authPut } = useAuth();
  const buttons = [];

  if (auth.user.roles.includes('Operator') && !request.assigneeId) {
    buttons.push(
      <Button.Primary
        title="Assign to me"
        onClick={() => {
          authPut(`/requests/${request._id}`, {
            props: [],
            req: { ...request, assigneeId: auth.userId },
          });
        }}
      />
    );
  }

  if (request.assigneeId === auth.userId) {
    buttons.push(
      <Button.Danger
        title="Unassign me"
        onClick={() => {
          authPut(`/requests/${request._id}`, {
            props: [],
            req: { ...request, assigneeId: undefined },
          });
        }}
      />
    );
  }

  buttons.push(
    <Button.NormalLinked to={`/requests/${request._id}/edit`} title="Edit" classNames={['mr-2']} />
  );

  return <div className="col-span-1 flex flex-row-reverse items-center">{buttons}</div>;
}

function RequestProperties({ properties, title }) {
  return (
    <Card title={title}>
      {properties
        .filter(p => p.active && p.propertyData !== '')
        .reduce((acc, p, ix) => {
          if (ix > 0 && acc[acc.length - 1].name === p.section) {
            acc[acc.length - 1].fields.push(p);
            return acc;
          }
          return acc.concat([{ name: p.section, fields: [p] }]);
        }, [])
        .map(s => {
          return (
            <Section key={s.name} title={s.name}>
              {s.fields.map(f => (
                <Property key={f.propertyType} name={f.field} property={f} />
              ))}
            </Section>
          );
        })
        .flatMap((s, ix) => [<div key={ix} className="border-t-2 bg-gray-400 w-full" />, s])
        .slice(1)}
    </Card>
  );
}

function RequestDetails({ request, author, team }) {
  const type = request.requestType.split(/-/g).join(' ');

  return (
    <div className="flex flex-col items-start row-span-2">
      <HeaderItem label="Author" contents={`${author.name} @ ${team.name}`} />
      <HeaderItem label="Date requested" contents={formatDate(request.dateCreated)} />
      <HeaderItem label="Type" contents={type.charAt(0).toUpperCase() + type.slice(1)} />
    </div>
  );
}

function StatusLabel({ status }) {
  if (status === 'Done') {
    return <div className="bg-green-200 py-2 px-4 rounded-full text-xs text-green-700">Done</div>;
  }
  if (status === 'WIP') {
    return (
      <div className="bg-yellow-200 py-2 px-4 rounded-full text-xs text-yellow-700">
        In progress
      </div>
    );
  }
  if (status === 'Requested') {
    return (
      <div className="bg-gray-400 py-2 px-4 rounded-full text-xs text-gray-800">Requested</div>
    );
  }
}

function Card({ title, children }) {
  return (
    <div
      style={{ height: 'fit-content' }}
      className="col-span-3 w-full shadow-md rounded-md bg-white"
    >
      <div>
        <h2 className="px-6 text-2xl border-b border-gray-200 py-6 mb-8 font-bold w-full">
          {title}
        </h2>
      </div>
      <div className="px-6 pb-6 grid grid-cols-1 gap-8">{children}</div>
    </div>
  );
}

export default function RequestPage() {
  const { id } = useParams();
  const { auth } = useAuth();
  const { data: payload, error, status } = useLoadResources(`/requests/${id}`);
  const request = payload && payload.request;
  const properties = payload && payload.properties;

  const { data: team } = useLoadResources(maybe(request, r => `/teams/${r.teamId}`));
  const { data: author } = useLoadResources(maybe(request, r => `/users/${r.authorId}`));
  const shouldFetchAssignee = request && auth.userId !== request.assigneeId;
  const { data: assignee } = useLoadResources(
    maybe(shouldFetchAssignee, r => `/users/${r.assigneeId}`)
  );

  if (error) {
    console.log(error);
    return <Navigate to="/404" />;
  }
  if (status === 'loading') {
    return <Page />;
  }

  const lastChange = Math.max(
    ...properties.filter(p => p.active).map(p => p.dateAdded),
    request.dateCreated
  );

  const propertiesWithSections = properties.map(p => {
    return { ...p, ...parseFieldPath(p.propertyType) };
  });

  if (propertiesWithSections.find(p => p.namespace === 'operator')) {
    return (
      <Page>
        <RequestHeader request={request} author={author || {}} lastChange={lastChange} />
        <RequestProperties
          title="Results report"
          properties={propertiesWithSections.filter(p => p.namespace === 'operator')}
        />

        <RequestDetails
          request={request}
          author={author || {}}
          assignee={assignee}
          team={team || {}}
          lastChange={lastChange}
        />

        <RequestProperties
          title="Request details"
          properties={propertiesWithSections.filter(p => p.namespace !== 'operator')}
        />
        <Authorized roles={['Operator']}>
          {request.assigneeId === auth.userId && <ResultReportCard request={request} />}
        </Authorized>
      </Page>
    );
  }

  return (
    <Page>
      <RequestHeader request={request} author={author || {}} lastChange={lastChange} />
      <Authorized roles={['Operator']}>
        <ResultReportCard request={request} />
      </Authorized>

      <RequestDetails
        request={request}
        author={author || {}}
        team={team || {}}
        lastChange={lastChange}
      />

      <RequestProperties title="Request details" properties={propertiesWithSections} />
    </Page>
  );
}

function Page({ children }) {
  const classes = [
    'max-w-6xl',
    'px-6',
    'pt-6',
    'flex-grow',
    'mx-auto',
    'grid',
    'grid-cols-4',
    'gap-8',
    'mb-10',
  ];

  return <div className={c(classes)}>{children}</div>;
}
