import { Fragment, ReactElement, ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { Maybe } from '../../Utils/Maybe';

export function Note({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="bg-white rounded-md border border-blue-300 overflow-hidden">
      <div className="flex bg-blue-100 px-3 py-2 items-center">
        <Icon.Info className="text-blue-900 w-5 mr-2" />
        <h3 className="font-medium text-sm text-blue-900">Note</h3>
      </div>
      <div className="p-4">
        {typeof children === 'string' ? (
          <p className="text-sm text-gray-700">{children}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export type QuestionProps = { q?: string; id: string; className?: string; required?: boolean };

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function ErrorMessage({ error }: { error: Maybe<string> }): JSX.Element | null {
  if (error) {
    return (
      <div className="flex items-center mt-1">
        <span className="mr-1">
          <Icon.AlertCircle className="w-4 text-red-600" />
        </span>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }
  return null;
}

export function Question({ children }: { children: ReactNode }): JSX.Element {
  return <p className="text-md text-gray-700 font-semibold mb-2 text-sm">{children}</p>;
}

export function reqRule(
  required: boolean,
  msg = 'This field is required'
): {} | { required: string } {
  return required ? { required: msg } : {};
}
