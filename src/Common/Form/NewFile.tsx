/* eslint-disable jsx-a11y/control-has-associated-label */
import { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { useItemFinishListener, useItemStartListener } from '@rpldy/uploady';
import c from 'classnames';
import React, { forwardRef, useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { useFormContext } from 'react-hook-form';

import { FilesView } from '../../Request/FileView';
import { apiBase } from '../../Utils/ApiBase';
import { useAuth } from '../../Utils/Auth';
import { FileInfo, stringToFileInfo } from '../../Utils/File';
import * as Button from '../Buttons';
import { useHover } from '../Hooks';
import { Spacer } from '../Layout';
import {
  ErrorMessage,
  FieldProps,
  FormErrors,
  Question,
  QuestionProps,
  useFieldContext,
} from './Question';

export function Files({ id, q, required = false }: QuestionProps): JSX.Element {
  const { state, values } = useFieldContext();
  const files = values[id] ? values[id].split(';;;').map(stringToFileInfo) : [];

  if (state === 'edit') {
    return <FilesField name={id} question={q} required={required} defaultValue={files} />;
  }
  return (
    <div>
      <Question>{q}</Question>
      <FilesView files={files} />
    </div>
  );
}

function FilesField({
  name,
  question,
  required = false,
  defaultValue,
}: FieldProps & { defaultValue: FileInfo[] }) {
  const form = useFormContext();

  const currentValue = form.watch(name, null);

  return (
    <div>
      <Question>{question}</Question>
      <FileInput
        name={name}
        {...form}
        value={currentValue === null ? defaultValue : currentValue}
        required={required}
      />
    </div>
  );
}

export function FileInput({
  name,
  required = false,
  value = [],
  errors,
  register,
  setValue,
  unregister,
}: {
  register: Function;
  errors: FormErrors;
  value?: FileInfo[];
  setValue: Function;
  unregister: Function;
  name: string;
  required?: string | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): JSX.Element {
  const [inProgress, setInProgress] = useState<number>(0);
  const [removableFiles, setRemovableFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const msg = typeof required === 'string' ? required : 'You have to upload at least one file';
    register(name, {
      validate: (val: FileInfo[] | null) => !required || (val && val.length > 0) || msg,
    });
    return () => unregister(name);
  }, [register, unregister, required, name]);

  const removeFile = (file: FileInfo) => {
    // Possible bug, we're not removing the file from removableFiles
    setValue(
      name,
      value.filter(f => f !== file),
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
      setValue(name, [...value, ...items], { shouldValidate: true });
    }
  });

  const err = errors[name]?.message;

  return (
    <UploadDropZone onDragOverClassName="bg-green-100" grouped={false} className="rounded-md">
      <div>
        {value.length > 0 ? (
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
            {value.length > 0 ? (
              value.map(f => (
                <FileComponent
                  editable={removableFiles.has(f.hash)}
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
  onRemove,
  editable,
}: {
  file: FileInfo;
  onRemove: (file: FileInfo) => void;
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
      <p
        className={c(
          'whitespace-nowrap overflow-hidden',
          editable ? 'text-gray-900' : 'text-gray-600'
        )}
      >
        {file.name}
      </p>{' '}
      <Spacer />
      {isHovered ? <SideButton /> : null}
    </div>
  );
}

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
      <Button.Secondary
        title="Choose files"
        onClick={() => {
          console.log('Choosing files');
        }}
      />
    </div>
  ))
);

function PreviewButton({ file }: { file: FileInfo }) {
  return (
    <a href={`${apiBase}/files/${file.hash}`}>
      <Icon.Eye className="stroke-2 text-gray-500 w-4 h-4 hover:text-gray-600" />
    </a>
  );
}

function RemoveButton({ file, onRemove }: { file: FileInfo; onRemove: (file: FileInfo) => void }) {
  const { authDel } = useAuth<FileInfo>();
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
