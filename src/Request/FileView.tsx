import c from 'classnames';
import React from 'react';
import { File } from 'react-feather';

import { apiBase } from '../Utils/ApiBase';
import { FileInfo } from '../Utils/File';
import { comparing } from '../Utils/Func';

const PLACEHOLDERS = [
  'https://c.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif',
  'https://c.tenor.com/27-GDSe8tRkAAAAM/zolw-sobie-tanczy.gif',
  'https://www.tom-archer.com/wp-content/uploads/2018/06/milford-sound-night-fine-art-photography-new-zealand.jpg',
];

export function FilesView({ files }: { files: FileInfo[] }): JSX.Element {
  if (files.length > 0) {
    return (
      <div className="pt-2 grid grid-cols-3 gap-4">
        {files
          .map(f => ({ ...f, isImage: /image\/*/u.test(f.mime) }))
          .sort(comparing(f => f.isImage))
          .map(f => {
            return (
              <div
                key={f.hash}
                className={c(
                  'text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50',
                  f.isImage && 'col-span-3'
                )}
              >
                <a href={`${apiBase}/files/${f.hash}`} className="px-4 py-3 block">
                  <div className="flex flex-row items-center gap-3">
                    {f.isImage ? null : (
                      <div className="rounded-full w-10 h-10 flex flex-row items-center justify-center bg-indigo-100">
                        <File className="h-5 w-5 text-indigo-800 stroke-3" />
                      </div>
                    )}
                    {f.isImage ? (
                      <div className="flex flex-row justify-center bg-gray-50 mb-2">
                        <img
                          className="block"
                          alt="placeholder"
                          src={PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]}
                        />
                      </div>
                    ) : null}
                    <p className="text-gray-800 text-sm">{f.name}</p>
                  </div>
                </a>
              </div>
            );
          })}
      </div>
    );
  }
  return <p className="text-sm text-gray-400">[no files have been uploaded]</p>;
}
