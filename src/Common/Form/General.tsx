import c from 'classnames';
import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

import { Maybe } from '../../Utils/Maybe';

export function Field({
  touched,
  error,
  children,
}: {
  touched: boolean;
  error: Maybe<string>;
  children: React.ReactNode;
}): JSX.Element {
  const classNames = ['flex', 'flex-col', 'w-full', 'h-full', 'rounded-md', 'px-4', 'py-2'];
  return (
    <div className={c('flex', 'flex-row', 'w-full', error && touched && 'bg-yellow-100')}>
      <div className={c('w-1', 'bg-transparent', error && touched && 'bg-yellow-500')} />
      <div className="flex flex-col w-full h-full">
        <div className={c(classNames)}>{children}</div>
        {error && touched && <span className="px-4 py-2 text-yellow-800">{error}</span>}
      </div>
    </div>
  );
}

export function Description({
  children,
}: {
  children: Maybe<React.ReactNode>;
}): JSX.Element | null {
  return children ? <p className="font-normal mt-2 text-sm text-gray-500">{children}</p> : null;
}

export function FieldHeader({ hint, label }: { hint: Maybe<string>; label: string }): JSX.Element {
  return (
    <div className="flex flex-row items-center mb-1">
      <FieldLabel text={label} />
      <Hint hint={hint} />
    </div>
  );
}

export function FieldLabel({ text }: { text: string }): JSX.Element {
  return (
    <label htmlFor={text} className="font-medium text-gray-800 mr-2">
      {text}
    </label>
  );
}

export function Hint({ hint }: { hint: Maybe<string> }): JSX.Element | null {
  return hint ? (
    <>
      <Icon.HelpCircle data-tip={hint} className="h-5 text-gray-500" />
      <ReactTooltip className="bg-gray-600" />
    </>
  ) : null;
}
