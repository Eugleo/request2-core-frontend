import c from 'classnames';
import { File } from 'react-feather';

import { useAsyncGet } from '../Utils/Api';
import { apiBase } from '../Utils/ApiBase';
import { FileInfo } from '../Utils/File';
import { comparing } from '../Utils/Func';

export function FilesView({
  files,
  isPrint,
}: {
  files: FileInfo[];
  isPrint: boolean;
}): JSX.Element {
  if (files.length > 0) {
    return (
      <div className={c('pt-2 grid gap-4 items-start', isPrint ? 'grid-cols-4' : 'grid-cols-2')}>
        {files
          .map(f => ({ ...f, isImage: /image\/*/u.test(f.mime) }))
          .sort(comparing(f => f.isImage))
          .map(f =>
            f.isImage ? (
              <BigImagePreview wide={isPrint} key={f.hash} file={f} />
            ) : (
              <SmallFilePreview key={f.hash} file={f} />
            )
          )}
      </div>
    );
  }
  return (
    <p className={c(isPrint ? 'text-xs' : 'text-sm', 'text-gray-400')}>
      [no files have been uploaded]
    </p>
  );
}

function SmallFilePreview({ file }: { file: FileInfo }) {
  return (
    <div className="text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50">
      <a href={`${apiBase}/files/${file.hash}`} className="px-4 py-3 block">
        <div className="grid grid-cols-5 gap-2">
          <div className="rounded-full w-7 h-7 flex flex-row items-center justify-center bg-indigo-100">
            <File className="h-4 w-4 text-indigo-800 stroke-3" />
          </div>
          <p className="text-gray-800 text-sm col-span-4 flex flex-col justify-center">
            {file.name}
          </p>
        </div>
      </a>
    </div>
  );
}

function BigImagePreview({ file, wide }: { file: FileInfo; wide: boolean }) {
  const { Loader } = useAsyncGet<{ url: string }>(`/files/${file.hash}/url`);

  return (
    <div
      className={c(
        'text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50',
        wide ? 'col-span-4' : 'col-span-2'
      )}
    >
      <a href={`${apiBase}/files/${file.hash}`} className="p-4 block">
        <p className="text-gray-800 text-sm mb-3">{file.name}</p>
        <div className="flex flex-row justify-center bg-gray-50 overflow-hidden rounded-lg">
          <Loader>{data => <img className="block" alt="placeholder" src={data.url} />}</Loader>
        </div>
      </a>
    </div>
  );
}
