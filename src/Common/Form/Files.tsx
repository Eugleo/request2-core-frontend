/* eslint-disable jsx-a11y/control-has-associated-label */
import { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import { useField } from 'formik';
import React, { forwardRef, useState } from 'react';
import * as Icon from 'react-feather';

import { FilesFieldValue } from '../../Request/FieldValue';
import { apiBase } from '../../Utils/ApiBase';
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

export function Files({ name, className = '' }: { name: string; className?: string }): JSX.Element {
  const [field, meta, helpers] = useField<FilesFieldValue>({ name });
  const [inProgress, setInProgress] = useState<number>(0);

  const removeFile = (file: File) =>
    helpers.setValue({ content: field.value.content.filter(f => f !== file), type: 'files' });

  useItemStartListener(() => {
    setInProgress(n => n + 1);
  });

  useItemFinishListener(item => {
    // Uwrap the response from Proxy
    const r = JSON.parse(JSON.stringify(item.uploadResponse));
    const items = r?.data?.files;
    if (items) {
      setInProgress(n => n - items.length);
      helpers.setValue({ content: field.value.content.concat(items), type: 'files' });
    }
  });

  const initialHashes = meta.initialValue?.content.map(f => f.hash) ?? [];

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
        <div className="ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
          <div className="pt-3 pb-3 px-4 ">
            {meta.value.content.length > 0 ? (
              meta.value.content.map(f => (
                <FileComponent
                  editable={!initialHashes.includes(f.hash)}
                  onRemove={removeFile}
                  file={f}
                  key={f.hash}
                />
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

function FileComponent({
  file,
  onRemove,
  editable,
}: {
  file: File;
  onRemove: (file: File) => void;
  editable: boolean;
}) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  function SideButton() {
    return editable ? (
      <RemoveButton file={file} onRemove={onRemove} />
    ) : (
      <PreviewButton file={file} />
    );
  }

  return (
    <div
      ref={hoverRef}
      className="rounded-sm text-sm px-2 py-1 flex flex-row items-center hover:bg-gray-100"
    >
      <Icon.File className={c('h-3 w-3 mr-2', editable ? 'text-gray-700' : 'text-gray-500')} />
      <p className={c(editable ? 'text-gray-900' : 'text-gray-600')}>{file.name}</p> <Spacer />
      {isHovered ? <SideButton /> : null}
    </div>
  );
}

function PreviewButton({ file }: { file: File }) {
  return (
    <a href={`${apiBase}/files/${file.hash}`}>
      <Icon.Eye className="stroke-2 text-gray-500 w-4 h-4 hover:text-gray-600" />
    </a>
  );
}

function RemoveButton({ file, onRemove }: { file: File; onRemove: (file: File) => void }) {
  const { authDel } = useAuth<File>();
  return (
    <button
      type="button"
      onClick={async () => {
        const r = await authDel(`/files/${file.hash}`, file);
        if (r.ok) {
          onRemove(file);
        }
      }}
    >
      <Icon.X className="stroke-2 text-red-800 w-4 h-4 hover:text-red-500" />
    </button>
  );
}
