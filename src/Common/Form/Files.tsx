import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import { useField } from 'formik';
import React, { ReactNode, useState } from 'react';
import * as Icon from 'react-feather';

import { FilesFieldValue } from '../../Request/FieldValue';

function DivWithTitle({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">{title}</h3>
      <div className={c('shadow-xs rounded-sm', className)}>{children}</div>
    </div>
  );
}

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

  const dndClasses = c('flex flex-col justify-center text-center text-gray-800 p-4', className);

  return (
    <div className="grid grid-cols-3 gap-4">
      <DivWithTitle title="Upload zone">
        <UploadDropZone onDragOverClassName="bg-green-100" grouped={false} className={dndClasses}>
          <span>Drag & drop your files here</span>
        </UploadDropZone>
      </DivWithTitle>
      <DivWithTitle title="In progress">
        <div className="p-4 flex flex-col justify-center text-sm text-center text-gray-500">
          {inProgress === 0 ? (
            <p>No item is being uploaded</p>
          ) : (
            <p>
              <span className="font-medium">{inProgress}</span> items being uploaded
            </p>
          )}
        </div>
      </DivWithTitle>
      <DivWithTitle title="Uploaded">
        <div className="p-4">
          {meta.value.content.map(f => (
            <div className="rounded-sm text-sm hover:bg-gray-100 px-2 py-1 flex flex-row items-center">
              <Icon.File className="h-5 w-5 text-gray-700 mr-2" /> <p>{f.name}</p>
            </div>
          ))}
        </div>
      </DivWithTitle>
    </div>
  );
}
