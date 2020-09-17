import React from 'react';
import { File } from 'react-feather';
import { apiBase } from '../Utils/ApiBase';
import { stringToFile } from '../Utils/File';
import { WithID } from '../Utils/WithID';
import { FileProperty } from './Request';
import c from 'classnames';

export function FilesView({ files, isEven }: { files: WithID<FileProperty>[]; isEven: boolean }) {
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

export function FileView({ file }: { file: FileProperty }) {
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
