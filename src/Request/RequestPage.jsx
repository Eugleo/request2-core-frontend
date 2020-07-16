import React, { useEffect, useState, useCallback } from 'react';
import c from 'classnames';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Section } from '../Common/Forms';
import formatDate from '../Utils/Date';
import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';

function Item({ index, name, value }) {
  return (
    <div
      className={c(
        'px-4',
        'py-5',
        'grid',
        'grid-cols-3',
        'gap-4',
        index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
      )}
    >
      <dt className="font-medium text-gray-500">{name}</dt>
      <dd className="col-span-2">{value}</dd>
    </div>
  );
}

function parseFieldPath(fp) {
  const section = fp.match(/^[^/]+/)[0].replace(/-/g, ' ');
  const name = fp.match(/[^/]+$/)[0].replace(/-/g, ' ');
  return [
    section.charAt(0).toUpperCase() + section.slice(1),
    name.charAt(0).toUpperCase() + name.slice(1),
  ];
}

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
            <span className="px-2 py-1 text-sm bg-gray-100 border rounded-sm mr-2 mb-2">{d}</span>
          ))}
        </div>
      ) : (
        <p>{propertyData}</p>
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

function RequestHeader({ request, properties, author, lastChange, setRequest }) {
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
      <ButtonArray request={request} properties={properties} setRequest={setRequest} />
    </div>
  );
}

function ButtonArray({ request, properties, setRequest }) {
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
          setRequest({ ...request, assigneeId: auth.userId });
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
          setRequest({ ...request, assigneeId: undefined });
        }}
      />
    );
  }

  buttons.push(
    <Button.NormalLinked to={`/requests/${request._id}/edit`} title="Edit" classNames={['mr-2']} />
  );

  return <div className="col-span-1 flex flex-row-reverse items-center">{buttons}</div>;
}

function RequestProperties({ properties }) {
  return (
    <div className="bg-white rounded-lg shadow-md mb-12 p-8 grid grid-cols-1 gap-10 col-span-3">
      {properties
        .filter(p => p.active && p.propertyData !== '')
        .reduce((acc, p, ix) => {
          const [section, name] = parseFieldPath(p.propertyType);
          if (ix > 0 && acc[acc.length - 1].name === section) {
            acc[acc.length - 1].fields.push({ ...p, name });
            return acc;
          }
          return acc.concat([{ name: section, fields: [{ ...p, name }] }]);
        }, [])
        .map(s => {
          return (
            <Section key={s.name} title={s.name}>
              {s.fields.map(f => (
                <Property key={f.propertyType} name={f.name} property={f} />
              ))}
            </Section>
          );
        })
        .flatMap((s, ix) => [<div key={ix} className="border-t-2 bg-gray-400 w-full" />, s])
        .slice(1)}
    </div>
  );
}

function RequestDetails({ request, author, assignee, team, lastChange }) {
  const { auth } = useAuth();

  const type = request.requestType.split(/-/g).join(' ');
  let assigneeName = 'Nobody yet';
  if (request.assigneeId) {
    assigneeName = request.assigneeId === auth.userId ? 'Me' : (assignee && assignee.name) || '';
  }

  return (
    <div className="flex flex-col items-start">
      <HeaderItem label="Author" contents={`${author.name} @ ${team.name}`} />
      <HeaderItem label="Date requested" contents={formatDate(request.dateCreated)} />
      <HeaderItem label="Last change" contents={moment.unix(lastChange).fromNow()} />
      <HeaderItem label="Type" contents={type.charAt(0).toUpperCase() + type.slice(1)} />
      <HeaderItem label="Assigned to" contents={assigneeName} />
    </div>
  );
}

function StatusLabel({ status }) {
  if (status === 'Done') {
    return (
      <div className="bg-green-200 py-2 px-4 rounded-full text-xs text-green-700">Show results</div>
    );
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

export default function RequestPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [properties, setProperties] = useState(null);
  const { authGet } = useAuth();
  const [team, setTeam] = useState(null);
  const [author, setAuthor] = useState(null);
  const [assignee, setAssignee] = useState(undefined);
  const { auth } = useAuth();

  useEffect(() => {
    if (request && request.assigneeId && auth.userId !== request.assigneeId) {
      authGet(`/users/${request.assigneeId}`)
        .then(r => {
          if (r.ok) {
            return r.json();
          }
          throw Error(`Can't retrieve information about author with ID ${request.authorId}`);
        })
        .then(js => {
          setAssignee(js);
        })
        .catch(err => console.log(err));
    }
  }, [authGet, request, setAssignee]);

  useEffect(() => {
    if (request) {
      authGet(`/users/${request.authorId}`)
        .then(r => {
          if (r.ok) {
            return r.json();
          }
          throw Error(`Can't retrieve information about author with ID ${request.authorId}`);
        })
        .then(js => {
          setAuthor(js);
        })
        .catch(err => console.log(err));
    }
  }, [authGet, request, setAuthor]);

  useEffect(() => {
    if (request) {
      authGet(`/teams/${request.teamId}`)
        .then(r => {
          if (r.ok) {
            return r.json();
          }
          throw Error(`Can't retrieve information about team with ID ${request.authorId}`);
        })
        .then(js => {
          setTeam(js);
        })
        .catch(err => console.log(err));
    }
  }, [authGet, request, setTeam]);

  useEffect(() => {
    authGet(`/requests/${id}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw Error(`Can't retrieve announcement with ID ${id}`);
      })
      .then(js => {
        setRequest(js.request);
        setProperties(js.properties);
      })
      .catch(err => console.log(err));
  }, [id, authGet, setRequest, setProperties]);

  if (request === null || properties === null) {
    return <Page />;
  }

  const lastChange = Math.max(
    ...properties.filter(p => p.active).map(p => p.dateAdded),
    request.dateCreated
  );

  return (
    <Page>
      <RequestHeader
        request={request}
        properties={properties}
        author={author || {}}
        lastChange={lastChange}
        setRequest={setRequest}
      />
      <RequestProperties properties={properties} />
      <RequestDetails
        request={request}
        author={author || {}}
        assignee={assignee}
        team={team || {}}
        lastChange={lastChange}
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
  ];

  return <div className={c(classes)}>{children}</div>;
}
