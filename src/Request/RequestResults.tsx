import c from 'classnames';
import React from 'react';
import { Download, File } from 'react-feather';

import { Card } from '../Common/Layout';
import { apiBase } from '../Utils/ApiBase';
import { useAuth } from '../Utils/Auth';
import { parseFieldName } from '../Utils/FieldPath';
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
        <FilesView files={files} isEven={false}></FilesView>
      </dl>
    </div>
  );
}

function FilesView({ files, isEven }: { files: WithID<ResultFileProperty>[]; isEven: boolean }) {
  return (
    <div
      style={{ gridTemplateColumns: '1fr 2fr' }}
      className={c('gap-10 py-4 px-6 grid grid-cols-2', isEven ? 'bg-green-100' : 'bg-white')}
    >
      <dt className="text-sm font-medium text-green-500 flex-grow leading-5">Files</dt>
      <dd className="break-words text-sm text-green-700">
        {files.map(f => (
          <FileView key={f.propertyData} file={f} />
        ))}
      </dd>
    </div>
  );
}

// TODO Make this safer
function stringToFileDesc(str: string) {
  const fields = str.split(':');
  return { hash: fields[0], mime: fields[1], name: fields[2] };
}

function FileView({ file }: { file: ResultFileProperty }) {
  const { hash, name } = stringToFileDesc(file.propertyData);

  return (
    <div className="flex flex-row py-1 px-2 rounded-sm hover:bg-gray-100">
      <File className="w-5 h-5 text-green-500 mr-2"></File>
      <p className="mr-2">{name}</p>
      <a href={`${apiBase}/file/${hash}`} className="text-blue-500 hover:text-blue-700">
        <Download className="w-5 h-5"></Download>
      </a>
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
