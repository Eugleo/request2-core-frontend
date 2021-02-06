import { createContext, Fragment, PropsWithRef, ReactElement, ReactNode, useContext } from 'react';
import * as Icon from 'react-feather';
import { Controller, DeepMap, FieldError, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { Maybe } from '../../Utils/Maybe';

export type FieldContext = { values: Record<string, string>; state: 'show' | 'edit' };
export const FieldContext = createContext<FieldContext>({ values: {}, state: 'show' });

export type FieldProps = { name: string; question: string; required: boolean | string };

export function useFieldContext(): FieldContext {
  return useContext(FieldContext);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormErrors = DeepMap<Record<string, any>, FieldError>;

export type InputProps<T extends keyof JSX.IntrinsicElements> = PropsWithRef<
  JSX.IntrinsicElements[T]
> & {
  name?: string;
  reg?: PropsWithRef<JSX.IntrinsicElements[T]>['ref'];
  errors?: FormErrors;
};

export function Warning({ children }: { children: ReactNode }): JSX.Element | null {
  const { state } = useFieldContext();

  if (state === 'edit') {
    return (
      <div className="bg-white rounded-md border border-yellow-300 overflow-hidden">
        <div className="flex bg-yellow-100 px-3 py-2 items-center">
          <Icon.AlertTriangle className="text-yellow-900 w-5 mr-2" />
          <h3 className="font-medium text-sm text-yellow-900">Beware!</h3>
        </div>
        <div className="p-4 text-sm text-gray-700">
          {typeof children === 'string' ? <p>{children}</p> : children}
        </div>
      </div>
    );
  }

  return null;
}

export function Note({ children }: { children: ReactNode }): JSX.Element | null {
  const { state } = useFieldContext();

  if (state === 'edit') {
    return (
      <div className="bg-white rounded-md border border-blue-300 overflow-hidden">
        <div className="flex bg-blue-100 px-3 py-2 items-center">
          <Icon.Info className="text-blue-900 w-5 mr-2" />
          <h3 className="font-medium text-sm text-blue-900">Note</h3>
        </div>
        <div className="p-4 text-sm text-gray-700">
          {typeof children === 'string' ? <p>{children}</p> : children}
        </div>
      </div>
    );
  }

  return null;
}

export type QuestionProps = {
  q: string;
  id: string;
  className?: string;
  required?: boolean | string;
};

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
  return <p className="text-md text-gray-900 font-semibold mb-2 text-sm">{children}</p>;
}

export function reqRule(
  required: boolean | string = true,
  msg = 'This field is required'
): {} | { required: string } {
  return required ? { required: typeof required === 'string' ? required : msg } : {};
}
