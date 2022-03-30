/* eslint-disable jsx-a11y/control-has-associated-label */
import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import { useEffect, useState } from 'react';
import * as Icon from 'react-feather';

import { FileInfo, stringToFileInfo } from '../../../Utils/File';
import { Maybe } from '../../../Utils/Maybe';
import { useHover } from '../../Hooks';
import { Spacer } from '../../Layout';
import { ErrorMessage, FormErrors } from '../Question';
import { PreviewButton, RemoveButton, UploadButton, UploadButton2 } from './Buttons';

function stringToFiles(s: Maybe<string> | FileInfo[]) {
  switch (s) {
    case '':
    case undefined:
    case null:
      return [];
    default:
      if (typeof s === 'string') {
        return s.split(';;;').map(stringToFileInfo);
      }
      return s;
  }
}

export function FileInput({
  name,
  required = false,
  value = [],
  errors,
  register,
  setValue,
  unregister,
  defaultValue,
}: {
  register: Function;
  errors: FormErrors;
  defaultValue: Maybe<string>;
  value?: Maybe<FileInfo[]>;
  setValue: Function;
  unregister: Function;
  name: string;
  required?: string | boolean;
}): JSX.Element {
  const [inProgress, setInProgress] = useState<number>(0);
  const [removableFiles, setRemovableFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const msg = typeof required === 'string' ? required : 'You have to upload at least one file';
    register(name, {
      validate: (val: FileInfo[] | null) => {
        return !required || (val && val.length > 0) || msg;
      },
    });

    const initialValue: FileInfo[] = stringToFiles(defaultValue);

    setValue(name, initialValue, {
      shouldValidate: false,
    });
    return () => unregister(name);
  }, [register, unregister, required, name, setValue, defaultValue]);

  const currentValue = stringToFiles(value);

  const removeFile = (file: FileInfo) => {
    // Possible bug, we're not removing the file from removableFiles
    setValue(
      name,
      stringToFiles(value).filter(f => f !== file),
      { shouldValidate: true }
    );
  };

  useItemStartListener(() => {
    setInProgress(n => n + 1);
  });

  useItemFinishListener(item => {
    // Uwrap the response from Proxy
    const r = JSON.parse(JSON.stringify(item.uploadResponse));
    const items = r?.data?.files as FileInfo[];

    if (items) {
      setRemovableFiles(r => items.reduce((acc, f) => acc.add(f.hash), r));
      setInProgress(n => n - items.length);
      setValue(name, [...currentValue, ...items], { shouldValidate: true });
    }
  });

  const err = errors[name]?.message;

  return (
    <UploadDropZone onDragOverClassName="bg-green-100" grouped={false} className="rounded-md">
      <div>
        {currentValue.length > 0 ? (
          <div className="flex flex-row justify-between items-baseline mb-1">
            <UploadButton />
          </div>
        ) : null}
        <div
          className={c(
            'border rounded-md overflow-hidden',
            err ? 'border-red-300' : 'border-gray-300'
          )}
        >
          <div className="pt-3 pb-3 px-4 ">
            {currentValue.length > 0 ? (
              currentValue.map(f => (
                <FileComponent
                  removeOnServer={removableFiles.has(f.hash)}
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
          <div
            className={c(
              'py-2 px-4 text-xs',
              err ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'
            )}
          >
            {inProgress > 0 ? (
              <p>{inProgress} uploads in progress</p>
            ) : (
              <p>No uploads in progress</p>
            )}
          </div>
        </div>
      </div>
      <ErrorMessage error={err} />
    </UploadDropZone>
  );
}

function FileComponent({
  file,
  removeOnServer,
  onRemove,
}: {
  file: FileInfo;
  removeOnServer: boolean;
  onRemove: (file: FileInfo) => void;
}) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  function SideButton() {
    return (
      <div className="flex flex-row gap-2">
        <PreviewButton file={file} />
        <RemoveButton file={file} onRemove={onRemove} removeOnServer={removeOnServer} />
      </div>
    );
  }

  return (
    <div
      ref={hoverRef}
      className="rounded-sm text-sm px-2 py-1 flex flex-row items-center hover:bg-gray-100"
    >
      <Icon.File className={c('h-3 w-3 mr-2', 'text-gray-700')} />
      <p className={c('whitespace-nowrap overflow-hidden', 'text-gray-900')}>{file.name}</p>
      <Spacer />
      {isHovered ? <SideButton /> : null}
    </div>
  );
}
