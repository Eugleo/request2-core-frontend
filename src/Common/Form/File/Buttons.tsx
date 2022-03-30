import { asUploadButton } from '@rpldy/upload-button';
import { forwardRef } from 'react';
import * as Icon from 'react-feather';

import { apiBase } from '../../../Utils/ApiBase';
import { useAuth } from '../../../Utils/Auth';
import { FileInfo } from '../../../Utils/File';
import { Secondary } from '../../Buttons';

export const UploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <div ref={ref} {...props} className="cursor-pointer ">
      <p className="text-sm text-gray-500 hover:text-gray-700">Add more files</p>
    </div>
  ))
);

export const UploadButton2 = asUploadButton(
  forwardRef((props, ref) => (
    <div ref={ref} {...props}>
      <Secondary
        title="Choose files"
        onClick={() => {
          console.log('Choosing files');
        }}
      />
    </div>
  ))
);

export function PreviewButton({ file }: { file: FileInfo }): JSX.Element {
  return (
    <a href={`${apiBase}/files/${file.hash}`}>
      <Icon.Eye className="stroke-2 text-gray-500 w-4 h-4 hover:text-gray-600" />
    </a>
  );
}

export function RemoveButton({
  file,
  onRemove,
  removeOnServer,
}: {
  file: FileInfo;
  removeOnServer: boolean;
  onRemove: (file: FileInfo) => void;
}): JSX.Element {
  const { authDel } = useAuth<FileInfo>();
  return (
    <button
      type="button"
      onClick={async () => {
        if (removeOnServer) {
          const r = await authDel(`/files/${file.hash}`, file);
          if (r.ok) {
            onRemove(file);
          }
        } else {
          onRemove(file);
        }
      }}
    >
      <Icon.X className="stroke-2 text-red-800 w-4 h-4 hover:text-red-500" />
    </button>
  );
}
