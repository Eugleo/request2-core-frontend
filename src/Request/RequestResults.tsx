import c from 'classnames';
import React from 'react';

import * as Button from '../Common/Buttons';
import { Card, Spacer } from '../Common/Layout';
import { isFileProperty } from '../Utils/File';
import { capitalize } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { FilesView } from './FileView';
import { FileProperty, Property, ResultProperty } from './Request';

export default function RequestResults({
  properties,
  startEditing,
}: {
  properties: WithID<ResultProperty>[];
  startEditing: () => void;
}) {
  const files = properties.map(p => p as WithID<Property>).filter(isFileProperty);
  return (
    <div>
      <Card className="mb-4 border border-green-300 shadow-none">
        <Section
          title="Results"
          properties={properties
            .filter(p => p.propertyType === 'Result')
            .filter(p => p.propertyData !== '')}
          files={files}
          startEditing={startEditing}
        />
      </Card>
    </div>
  );
}

function Section({
  title,
  properties,
  files,
  startEditing,
}: {
  title: string;
  properties: WithID<Property>[];
  files: WithID<FileProperty>[];
  startEditing: () => void;
}) {
  const prettifyName = (name: string) => capitalize(name.replaceAll('-', ' '));
  return (
    <div>
      <div className={c('px-6 py-6 flex items-center border-green-300')}>
        <h2 className="text-lg font-medium text-green-500">{title}</h2>
        <Spacer />
        <Button.Secondary onClick={startEditing}>Edit</Button.Secondary>
      </div>
      <dl style={{ gridAutoRows: 'minmax(1fr, auto)' }} className="border-green-300">
        {properties.map((p, ix) => (
          <PropertyView
            name={prettifyName(p.propertyName)}
            propertyData={p.propertyData}
            isEven={ix % 2 === 0}
            key={p._id}
          />
        ))}
        {files.length > 0 ? <FilesView files={files} isEven={properties.length % 2 !== 1} /> : null}
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
              <span key={txt} className="text-sm leading-5 text-gray-700">
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
        <dd className="break-words text-sm text-gray-700">{propertyData}</dd>
      )}
    </div>
  );
}
