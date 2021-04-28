import React, {
  createContext,
  Fragment,
  PropsWithRef,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';
import * as Icon from 'react-feather';
import { Controller, DeepMap, FieldError, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import ReactTooltip from 'react-tooltip';

import { Maybe } from '../../Utils/Maybe';

export type FieldContext = { values: Record<string, string>; state: 'show' | 'edit' };
export const FieldContext = createContext<FieldContext>({ values: {}, state: 'show' });

export type FieldProps = {
  name: string;
  question: string;
  required: boolean | string;
  description?: Maybe<React.ReactNode>;
};

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
  optional?: boolean | string;
  errorMsg?: string;
  description?: string;
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

// export function Question({ children }: { children: ReactNode }): JSX.Element {
//   return <p className="text-md text-gray-900 font-semibold mb-2 text-sm">{children}</p>;
// }

export function Question({
  hasCustom = false,
  required = false,
  multiple = false,
  children,
}: {
  children: ReactNode;
  required: boolean | string;
  multiple?: boolean;
  hasCustom?: boolean;
}): JSX.Element {
  return (
    <div className="flex flex-row space-x-2 items-center mb-2 relative">
      <p className="text-md text-gray-900 font-semibold text-sm">{children}</p>
      {typeof required !== 'string' && !required ? (
        <>
          <Icon.Coffee
            style={{ top: '1px' }}
            className="text-blue-400 w-3.5 relative"
            data-tip="This field is optional"
          />
          <ReactTooltip
            type="light"
            effect="solid"
            backgroundColor="rgba(243, 244, 246, 1)"
            className="white-tooltip"
          />
        </>
      ) : null}
      {hasCustom ? (
        <>
          <Icon.PenTool
            style={{ top: '1px' }}
            className="text-pink-400 w-3.5 relative"
            data-tip={`You can type in your own option${multiple ? 's' : ''}`}
          />
          {/* <div
            className="rounded-full bg-pink-100 text-xs text-pink-500 py-0.5 px-2 flex flex-row items-center"
            data-tip={`You can select ${hasCustom ? 'or type in ' : ''}multiple options`}
          >
            <p className="cursor-default">custom</p>
          </div> */}
          <ReactTooltip
            type="light"
            effect="solid"
            backgroundColor="rgba(243, 244, 246, 1)"
            className="white-tooltip"
          />
        </>
      ) : null}
      {multiple ? (
        <>
          <Icon.Grid
            style={{ top: '1px' }}
            className="text-purple-400 w-3.5 relative mr-1"
            data-tip={`You can select ${hasCustom ? 'or type in ' : ''}multiple options`}
          />
          {/* <div
            className="rounded-full bg-purple-100 text-xs text-purple-500 py-0.5 px-2 flex flex-row items-center"
            data-tip={`You can select ${hasCustom ? 'or type in ' : ''}multiple options`}
          >

            <p className="cursor-default">multi</p>
          </div> */}
          <ReactTooltip
            type="light"
            effect="solid"
            backgroundColor="rgba(243, 244, 246, 1)"
            className="white-tooltip"
          />
        </>
      ) : null}
    </div>
  );
}

export function reqRule(
  required: boolean | string = true,
  msg = 'This field is required'
): {} | { required: string } {
  return required ? { required: typeof required === 'string' ? required : msg } : {};
}
