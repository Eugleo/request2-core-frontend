import c from 'classnames';
import React from 'react';
import { File } from 'react-feather';

import { apiBase } from '../Utils/ApiBase';
import { FileInfo } from '../Utils/File';

export function FilesView({ files }: { files: FileInfo[] }): JSX.Element {
  return (
    <>
      {files.map(f => (
        <a key={f.hash} href={`${apiBase}/files/${f.hash}`} className="text-gray-800">
          <div className="flex flex-row items-center py-1 px-2 rounded-sm hover:bg-gray-50">
            <File className="h-3 w-3 text-gray-700 mr-2" />
            <p className="text-gray-800 text-sm">{f.name}</p>
          </div>
        </a>
      ))}
    </>
  );
}
