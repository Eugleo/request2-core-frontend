/* eslint-disable jsx-a11y/control-has-associated-label */
import { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import { useField } from 'formik';
import React, { forwardRef, useState } from 'react';
import * as Icon from 'react-feather';

import { FilesFieldValue } from '../../Request/FieldValue';
import { useAuth } from '../../Utils/Auth';
import { File } from '../../Utils/File';
import * as Button from '../Buttons';
import { useHover } from '../Hooks';
import { Spacer } from '../Layout';

const UploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <div ref={ref} {...props} className="cursor-pointer ">
      <p className="text-sm text-gray-500 hover:text-gray-700">Add more files</p>
    </div>
  ))
);

const UploadButton2 = asUploadButton(
  forwardRef((props, ref) => (
    <div ref={ref} {...props}>
      <Button.Secondary title="Choose files" onClick={() => console.log('Choosing files')} />
    </div>
  ))
);

export function Files({ name, className = '' }: { name: string; className?: string }) {
  const [field, meta, helpers] = useField<FilesFieldValue>({ name });
  const [inProgress, setInProgress] = useState<number>(0);

  const removeFile = (file: File) =>
    helpers.setValue({ type: 'files', content: field.value.content.filter(f => f !== file) });

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
        <div className="flex flex-row justify-between items-baseline mb-1">
          <h4 className="font-medium text-gray-800">File upload</h4>
          {meta.value.content.length > 0 ? <UploadButton /> : null}
        </div>
        <div className="shadow-xs rounded-lg overflow-hidden">
          <div className="pt-3 pb-3 px-4 ">
            {meta.value.content.length > 0 ? (
              meta.value.content.map(f => (
                <FileComponent onRemove={removeFile} file={f} key={f.hash} />
              ))
            ) : (
              <div className="h-32 flex flex-row items-center justify-center text-sm text-gray-700">
                <p className="mr-2">Drag & Drop or</p>
                <UploadButton2 />
              </div>
            )}
          </div>
          <div className="py-2 px-4 bg-gray-100">
            {inProgress > 0 ? (
              <p className="text-xs text-gray-500">{inProgress} uploads in progress</p>
            ) : (
              <p className="text-xs text-gray-500">No uploads in progress</p>
            )}
          </div>
        </div>
      </div>
    </UploadDropZone>
  );
}

function FileComponent({ file, onRemove }: { file: File; onRemove: (file: File) => void }) {
  const { authDel } = useAuth<File>();
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  return (
    <div
      ref={hoverRef}
      className="rounded-sm text-sm hover:bg-gray-100 px-2 py-1 flex flex-row items-center"
    >
      <Icon.File className="h-3 w-3 text-gray-700 mr-2" /> <p>{file.name}</p> <Spacer />
      <button
        type="button"
        onClick={async () => {
          const r = await authDel(`/files/${file.hash}`, file);
          if (r.ok) {
            onRemove(file);
          }
        }}
      >
        {isHovered ? <Icon.X className="stroke-2 text-red-800 w-4 h-4 hover:text-red-500" /> : null}
      </button>
    </div>
  );
}
