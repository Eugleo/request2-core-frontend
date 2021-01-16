import c from 'classnames';
import { useFormContext } from 'react-hook-form';

import { ErrorMessage, QuestionProps, reqRule } from './Question';

const baseClasses = [
  'border',
  'w-full',
  'shadow-sm',
  'text-md',
  'text-gray-900',
  'rounded-md',
  'py-2',
  'px-3',
  'font-normal',
  'disabled:text-gray-400 disabled:bg-gray-200 disabled:shadow-none',
  'transition-colors',
];

const normalClasses = [
  'border-gray-300',
  'hover:border-gray-400',
  'focus:border-blue-400',
  'focus:outline-none',
  'focus:ring-4',
  'focus:ring-opacity-50',
  'focus:ring-blue-300',
];

const errorClasses = [
  'border-red-300',
  'hover:border-red-400',
  'focus:border-red-400',
  'focus:outline-none',
  'focus:ring-4',
  'focus:ring-opacity-50',
  'focus:ring-red-300',
];

export function ShortText({ id, className, required = false }: QuestionProps): JSX.Element {
  const { register, errors } = useFormContext();
  const err = errors[id]?.message;

  return (
    <div className="w-full">
      <input
        name={id}
        ref={register(reqRule(required))}
        className={c(className, 'border', baseClasses, err ? errorClasses : normalClasses)}
      />
      <ErrorMessage error={err} />
    </div>
  );
}

export function LongText({ id, className, required = false }: QuestionProps): JSX.Element {
  const { register, errors } = useFormContext();
  const err = errors[id];

  return (
    <div>
      <textarea
        name={id}
        ref={register(reqRule(required))}
        style={{ minHeight: '7rem' }}
        className={c(baseClasses, className, err ? errorClasses : normalClasses)}
      />
      <ErrorMessage error={err} />
    </div>
  );
}
