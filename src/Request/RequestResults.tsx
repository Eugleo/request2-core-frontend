import c from 'classnames';
import React from 'react';

import { Card } from '../Common/Layout';
import { parseFieldName } from '../Utils/FieldPath';
import { WithID } from '../Utils/WithID';
import { Property, ResultProperty } from './Request';

export default function RequestResults({ properties }: { properties: WithID<ResultProperty>[] }) {
  return (
    <div>
      <Card className="mb-4 border border-green-300 shadow-none">
        <Section title="Results" properties={properties.filter(p => p.propertyData !== '')} />
      </Card>
    </div>
  );
}

function Section({ title, properties }: { title: string; properties: WithID<Property>[] }) {
  return (
    <div>
      <div className={c('px-6 py-6 flex items-center border-green-300')}>
        <h2 className="text-lg font-medium text-green-700">{title}</h2>
      </div>
      <dl style={{ gridAutoRows: 'minmax(1fr, auto)' }} className="border-green-300">
        {properties.map((p, ix) => (
          <PropertyView
            name={parseFieldName(p.propertyName).field}
            propertyData={p.propertyData}
            isEven={ix % 2 === 0}
            key={p._id}
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
      className={c('gap-10 py-4 px-6 grid grid-cols-2', isEven ? 'bg-green-100' : 'bg-white')}
    >
      <dt className="text-sm font-medium text-green-500 flex-grow leading-5">{name}</dt>
      {propertyData.includes(';;;') ? (
        <dd className="flex flex-row flex-wrap">
          {propertyData
            .split(';;;')
            .map(txt => (
              <span key={txt} className="text-sm leading-5 text-green-700">
                {txt}
              </span>
            ))
            .intersperse(ix => (
              <span key={ix} className="text-sm text-green-500 px-4">
                /
              </span>
            ))}
        </dd>
      ) : (
        <dd className="break-words text-sm text-green-700">{propertyData}</dd>
      )}
    </div>
  );
}
