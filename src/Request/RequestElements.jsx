import React from 'react';
import c from 'classnames';
import Page from '../Page/Page';

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

// TODO Add request title to the backend
export default function Request({ request, properties }) {
  return (
    <Page width="max-w-2xl" title={request.name}>
      {properties.map((p, ix) => (
        <Item index={ix} key={p.propertyType} name={p.propertyType} value={p.propertyData} />
      ))}
    </Page>
  );
}
