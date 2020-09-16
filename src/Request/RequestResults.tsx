import c from 'classnames';
import React from 'react';
import { File } from 'react-feather';

import { Card } from '../Common/Layout';
import { apiBase } from '../Utils/ApiBase';
import { stringToFile } from '../Utils/File';
import { capitalize } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { Property, ResultFileProperty, ResultProperty } from './Request';

export default function RequestResults({
  properties,
  files,
}: {
  properties: WithID<ResultProperty>[];
  files: WithID<ResultFileProperty>[];
}) {
  return (
    <div>
      <Card className="mb-4 border border-green-300 shadow-none">
        <Section
          title="Results"
          properties={properties.filter(p => p.propertyData !== '')}
          files={files}
        />
      </Card>
    </div>
  );
}

function Section({
  title,
  properties,
  files,
}: {
  title: string;
  properties: WithID<Property>[];
  files: WithID<ResultFileProperty>[];
}) {
  const prettifyName = (name: string) => capitalize(name.replaceAll('-', ' '));
  return (
    <div>
      <div className={c('px-6 py-6 flex items-center border-green-300')}>
        <h2 className="text-lg font-medium text-green-500">{title}</h2>
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
        <FilesView files={files} isEven={properties.length % 2 !== 1}></FilesView>
      </dl>
    </div>
  );
}

function FilesView({ files, isEven }: { files: WithID<ResultFileProperty>[]; isEven: boolean }) {
  return (
    <div
      style={{ gridTemplateColumns: '1fr 2fr' }}
      className={c('gap-10 py-4 px-6 grid grid-cols-2', isEven ? 'bg-gray-100' : 'bg-white')}
    >
      <dt className="text-sm font-medium text-gray-600 flex-grow leading-5 flex flex-col justify-center">
        Files
      </dt>
      <dd className="break-words text-sm text-gray-700">
        {files.map(f => (
          <FileView key={f.propertyData} file={f} />
        ))}
      </dd>
    </div>
  );
}

function FileView({ file }: { file: ResultFileProperty }) {
  const { hash, name } = stringToFile(file.propertyData);

  return (
    <a href={`${apiBase}/files/${hash}`} className="text-gray-800">
      <div className="flex flex-row items-center py-1 px-2 rounded-sm hover:bg-gray-100">
        <File className="w-4 h-4 text-gray-500 mr-1"></File>
        <p className="mr-2">{name}</p>
      </div>
    </a>
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
