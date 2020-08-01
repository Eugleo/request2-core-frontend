import React, { ReactNode } from 'react';
import * as Button from './Buttons';
import useOnClickOutside from './Hooks';

export default function Modal({
  title,
  closeText,
  onClose,
  children,
}: {
  title: string;
  closeText: string;
  onClose: () => null;
  children: ReactNode;
}) {
  return (
    <div className="w-full h-full fixed bg-gray-200 bg-transparent flex justify-center items-center content-center z-50 left-0 top-0">
      <div
        ref={useOnClickOutside(onClose)}
        className="pt-6 bg-white shadow-md rounded-lg overflow-hidden max-w-lg flex flex-col"
      >
        <h1 className="text-xl font-medium px-6">{title}</h1>
        <div className="px-6">{children}</div>
        <div className="flex flex-row-reverse bg-gray-100 py-2 px-6">
          <Button.Plain title={closeText} onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
