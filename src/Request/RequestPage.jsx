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
import { idToCode, StatusLabel } from './RequestElements';

import { maybe, capitalize } from '../Utils/Func';
import { parseFieldName } from '../Utils/FieldPath';
import StatusSelect from './Operator/StatusSelector';

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

function HeaderItem({ label, children }) {
  return (
    <div className="text-sm mb-4 col-span-1">
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      {children}
    </div>
  );
}

function RequestHeader({ request, author, lastChange }) {
  return (
    <div className="col-span-4 grid grid-cols-4">
      <div className="col-span-3">
        <div className="flex flex-row items-center mb-2">
          <h1 className="text-3xl font-bold leading-tight text-black">{request.name}</h1>
          <span className="ml-4 text-3xl text-gray-500">
            #{request.requestType.charAt(0).toUpperCase()}/{idToCode(request._id)}
          </span>
        </div>
        <div className="flex flex-row items-center">
          <Authorized roles={['Operator']} or={<StatusLabel status={request.status} />}>
            <StatusSelect request={request} />
          </Authorized>
          <p className="ml-4 text-gray-700 text-sm">
            <span className="font-semibold">{author.name}</span> has updated this item{' '}
            <span>{moment.unix(lastChange).fromNow()}</span>
          </p>
        </div>
      </div>
      <ButtonArray request={request} />
    </div>
  );
}

function ButtonArray({ request }) {
  const buttons = [];

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
                <Property key={f.propertyName} name={f.field} property={f} />
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
      <HeaderItem label="Author">
        <p className="text-sm text-gray-800">
          {author.name} @ {team.name}
        </p>
      </HeaderItem>
      <HeaderItem label="Date requested">
        <p className="text-sm text-gray-800">{formatDate(request.dateCreated)}</p>
      </HeaderItem>
      <HeaderItem label="Type">
        <p className="text-sm text-gray-800">{capitalize(type)}</p>
      </HeaderItem>
    </div>
  );
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
    return { ...p, ...parseFieldName(p.propertyName) };
  });

  console.log(propertiesWithSections);

  if (propertiesWithSections.find(p => p.propertyType === 'Result')) {
    return (
      <Page>
        <RequestHeader request={request} author={author || {}} lastChange={lastChange} />
        <RequestProperties
          title="Results report"
          properties={propertiesWithSections.filter(p => p.propertyType === 'Result')}
        />

        <RequestDetails request={request} author={author || {}} team={team || {}} />

        <RequestProperties
          title="Request details"
          properties={propertiesWithSections.filter(p => p.propertyType === 'Detail')}
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

      <RequestDetails request={request} author={author || {}} team={team || {}} />

      <RequestProperties
        title="Request details"
        properties={propertiesWithSections.filter(p => p.propertyType === 'Detail')}
      />
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
