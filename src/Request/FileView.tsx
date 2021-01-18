import c from 'classnames';
import React from 'react';
import { File } from 'react-feather';

import { apiBase } from '../Utils/ApiBase';
import { stringToFileInfo } from '../Utils/File';
import { WithID } from '../Utils/WithID';
import { FileProperty } from './Request';

export function FilesView({
  files,
  isEven,
}: {
  files: WithID<FileProperty>[];
  isEven: boolean;
}): JSX.Element {
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
          <FileView key={f.value} file={f} />
        ))}
      </dd>
    </div>
  );
}

export function FileView({ file }: { file: FileProperty }): JSX.Element {
  const { hash, name } = stringToFileInfo(file.value);

  return (
    <a href={`${apiBase}/files/${hash}`} className="text-gray-800">
      <div className="flex flex-row items-center py-1 px-2 rounded-sm hover:text-gray-600">
        <File className="h-3 w-3 text-gray-700 mr-2" />
        <p>{name}</p>
      </div>
    </a>
  );
}
