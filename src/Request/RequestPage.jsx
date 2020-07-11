import React, { useEffect, useState } from 'react';
import c from 'classnames';
import { useParams } from 'react-router-dom';
import Page from '../Page/Page';
import { Section } from '../Common/Forms';
import formatDate from '../Utils/Date';
import { useAuth } from '../Utils/Auth';

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

export default function RequestPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [properties, setProperties] = useState(null);
  const { authGet } = useAuth();

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
    return <Page width="max-w-2xl" title="Request" />;
  }

  console.log(properties);

  return (
    <Page width="max-w-4xl" title={request.name}>
      <div className="bg-white rounded-lg shadow-md mb-8 p-8 grid grid-cols-1 gap-12">
        {properties
          .filter(p => p.active && p.propertyData !== '')
          .reduce((acc, p, ix) => {
            console.log(p);
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
    </Page>
  );
}
