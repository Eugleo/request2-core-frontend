import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import { useField } from 'formik';
import React, { useState } from 'react';
import * as Icon from 'react-feather';

import { FilesFieldValue } from '../../Request/FieldValue';

export function Files({ name, className = '' }: { name: string; className?: string }) {
  const [field, meta, helpers] = useField<FilesFieldValue>({ name });
  const [inProgress, setInProgress] = useState<number>(0);

  useItemStartListener(() => {
    setInProgress(n => n + 1);
  });

  useItemFinishListener(item => {
    // Uwrap the response from Proxy
    const r = JSON.parse(JSON.stringify(item.uploadResponse));
    const items = r?.data?.files;
    if (items) {
      setInProgress(n => n - items.length);
      helpers.setValue({ type: 'files', content: field.value.content.concat(items) });
    }
  });

  return (
    <UploadDropZone
      onDragOverClassName="bg-green-100"
      grouped={false}
      className={c('rounded-md p-2', className)}
    >
      <div>
        <div className="flex flex-row justify-between">
          <h4 className="font-medium text-gray-800 mb-1">File upload</h4>
        </div>
        <div className="shadow-xs rounded-lg overflow-hidden">
          <div className="pt-4 pb-2 px-4 h-32">
            {meta.value.content.length > 0 ? (
              meta.value.content.map(f => (
                <div className="rounded-sm text-sm hover:bg-gray-100 px-2 py-1 flex flex-row items-center">
                  <Icon.File className="h-5 w-5 text-gray-700 mr-2" /> <p>{f.name}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full mx-auto text-gray-500">
                No files have been uploaded yet
              </div>
            )}
          </div>
          <div className="py-2 px-4 bg-gray-100">
            {inProgress > 0 ? (
              <p className="text-xs text-gray-500">Uploading {inProgress} files</p>
            ) : (
              <p className="text-xs text-gray-500">Not uploading any files</p>
            )}
          </div>
        </div>
      </div>
    </UploadDropZone>
  );
}
