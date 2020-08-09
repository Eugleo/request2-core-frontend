import React from 'react';
import { Navigate } from 'react-router';
import c from 'classnames';
import { Property, Request } from './Request';
import { parseFieldName, makeFieldPath } from '../Utils/FieldPath';
import requestTypes from './RequestTypes';
import { Card } from '../Common/Layout';
import { resolveInclude } from './RequestDetailForm';

export default function RequestDetails({
  request,
  properties,
}: {
  request: Request;
  properties: Property[];
}) {
  // TODO Is there a better way?
  const schema = requestTypes.get(request.requestType);

  if (!schema) {
    // TODO Handle this better
    console.log("Can't find schema for the provided request.requestType: ");
    return <Navigate to="/404" />;
  }

  const relevantProperties = properties.filter(p => p.active && p.propertyType === 'Detail');
  const sections: Array<{ title: string; properties: Property[] }> = schema.sections
    .map(s => ({
      title: s.title,
      properties: s.fields
        .mapMaybe(f => resolveInclude(f))
        .map(f => ({ ...f, fieldPath: makeFieldPath(s.title, f.name) }))
        .mapMaybe(f => relevantProperties.find(p => p.propertyName === f.fieldPath))
        .filter(p => p.propertyData !== ''),
    }))
    .filter(s => s.properties.length > 0);

  return (
    <div>
      {sections.map(s => (
        <Card className="mb-4">
          <Section title={s.title} properties={s.properties} />
        </Card>
      ))}
    </div>
  );
}

function Section({ title, properties }: { title: string; properties: Property[] }) {
  return (
    <div>
      <div className={c('px-6 py-6 flex items-center border-b border-gray-300')}>
        <h2 className="text-lg font-medium text-black">{title}</h2>
      </div>
      <dl style={{ gridAutoRows: 'minmax(1fr, auto)' }} className="grid border-b border-gray-300">
        {properties.map((p, ix) => (
          <PropertyView
            name={parseFieldName(p.propertyName).field}
            propertyData={p.propertyData}
            isEven={ix % 2 === 0}
          />
        ))}
      </dl>
    </div>
  );
}

function PropertyView({
  name,
  propertyData,
  isEven,
}: {
  name: string;
  propertyData: Property['propertyData'];
  isEven: boolean;
}) {
  return (
    <div
      style={{ gridTemplateColumns: '1fr 2fr' }}
      className={c('gap-10 py-4 px-6 grid grid-cols-2', isEven ? 'bg-gray-100' : 'bg-white')}
    >
      <dt className="text-sm font-medium text-gray-600 flex-grow leading-5">{name}</dt>
      {propertyData.includes(';;;') ? (
        <dd className="flex flex-row flex-wrap">
          {propertyData
            .split(';;;')
            .map(txt => (
              <span key={txt} className="text-sm leading-5">
                {txt}
              </span>
            ))
            .intersperse(ix => (
              <span key={ix} className="text-sm text-gray-500 px-4">
                /
              </span>
            ))}
        </dd>
      ) : (
        <dd className="break-words text-sm">{propertyData}</dd>
      )}
    </div>
  );
}
