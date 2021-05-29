import React, { createContext, PropsWithRef, ReactNode, useContext } from 'react';
import * as Icon from 'react-feather';
import { DeepMap, FieldError } from 'react-hook-form';
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

export function Description({ children }: { children: React.ReactNode }): JSX.Element {
  if (typeof children === 'string') {
    return <p className="text-xs text-gray-400 mt-1">{children}</p>;
  }
  return <>{children}</>;
}

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
  showIcons = true,
  number = false,
  children,
}: {
  children: ReactNode;
  required?: boolean | string;
  multiple?: boolean;
  hasCustom?: boolean;
  number?: boolean;
  showIcons?: boolean;
}): JSX.Element {
  return (
    <div className="flex flex-row space-x-2 items-center mb-2 relative">
      <p className="text-md text-gray-900 font-semibold text-sm">{children}</p>

      {showIcons ? (
        <>
          {typeof required !== 'string' && !required ? <Required /> : null}
          {hasCustom ? <Custom multiple={multiple} /> : null}
          {multiple ? <Multiple hasCustom={hasCustom} /> : null}
          {number ? <NumberIcon /> : null}
        </>
      ) : null}
    </div>
  );
}

function Required() {
  return (
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
  );
}

function Custom({ multiple }: { multiple: boolean }) {
  return (
    <>
      <Icon.PenTool
        style={{ top: '1px' }}
        className="text-pink-400 w-3.5 relative"
        data-tip={`You can type in your own option${multiple ? 's' : ''}`}
      />
      <ReactTooltip
        type="light"
        effect="solid"
        backgroundColor="rgba(243, 244, 246, 1)"
        className="white-tooltip"
      />
    </>
  );
}

function Multiple({ hasCustom }: { hasCustom: boolean }) {
  return (
    <>
      <Icon.Grid
        style={{ top: '1px' }}
        className="text-purple-400 w-3.5 relative mr-1"
        data-tip={`You can select ${hasCustom ? 'or type in ' : ''}multiple options`}
      />
      <ReactTooltip
        type="light"
        effect="solid"
        backgroundColor="rgba(243, 244, 246, 1)"
        className="white-tooltip"
      />
    </>
  );
}

function NumberIcon() {
  return (
    <>
      <Icon.PieChart
        style={{ top: '1px' }}
        className="text-green-600 w-3.5 relative mr-1"
        data-tip="You have to enter a number"
      />
      <ReactTooltip
        type="light"
        effect="solid"
        backgroundColor="rgba(243, 244, 246, 1)"
        className="white-tooltip"
      />
    </>
  );
}

export function reqRule(
  required: boolean | string = true,
  msg = 'This field is required'
): {} | { required: string } {
  return required ? { required: typeof required === 'string' ? required : msg } : {};
}
