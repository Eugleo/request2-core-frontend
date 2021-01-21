import c from 'classnames';
import { useFormContext } from 'react-hook-form';

import { ResultWidget } from '../../Request/Operator/ResultComponent';
import {
  ErrorMessage,
  Question,
  QuestionProps,
  reqRule,
  useFieldContext,
  FieldProps,
  InputProps,
} from './Question';

export function ShortText({ id, q, required = false }: QuestionProps): JSX.Element {
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <ShortTextField
        name={id}
        question={q}
        required={required}
        defaultValue={values[id] ?? null}
      />
    );
  }
  return (
    <div>
      <Question>{q}</Question>
      <p className="text-sm text-gray-800">{values[id]}</p>
    </div>
  );
}

function ShortTextField({
  name,
  question,
  required = false,
  defaultValue,
}: FieldProps & { defaultValue: string }) {
  const { register, errors } = useFormContext();

  return (
    <div>
      <Question>{question}</Question>
      <ShortTextInput
        errors={errors}
        name={name}
        reg={register(reqRule(required))}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function ShortTextInput({
  name,
  errors,
  className,
  reg,
  ...props
}: InputProps<'input'>): JSX.Element {
  const err = errors && name && errors[name]?.message;

  return (
    <div>
      <input
        name={name}
        className={c(className, 'border', baseClasses, err ? errorClasses : normalClasses)}
        ref={reg}
        {...props}
      />
      <ErrorMessage error={err} />
    </div>
  );
}

export function LongText({ id, q, required = false }: QuestionProps): JSX.Element {
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <LongTextField name={id} question={q} required={required} defaultValue={values[id] ?? null} />
    );
  }
  return (
    <div>
      <Question>{q}</Question>
      <p className="text-sm text-gray-800">{values[id]}</p>
    </div>
  );
}

function LongTextField({
  name,
  question,
  required,
  defaultValue,
}: FieldProps & { defaultValue: string }) {
  const { register, errors } = useFormContext();
  return (
    <div>
      <Question>{question}</Question>
      <LongTextInput
        name={name}
        errors={errors}
        reg={register(reqRule(required))}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function LongTextInput({
  name,
  className,
  style,
  errors,
  reg,
  ...props
}: InputProps<'textarea'>): JSX.Element {
  const err = errors && name && errors[name];

  return (
    <div>
      <textarea
        name={name}
        className={c(className, baseClasses, err ? errorClasses : normalClasses)}
        ref={reg}
        {...props}
        style={{ ...style, minHeight: '7rem' }}
      />
      <ErrorMessage error={err} />
    </div>
  );
}

export const baseClasses = [
  'border',
  'w-full',
  'shadow-sm',
  'text-sm',
  'text-gray-900',
  'rounded-md',
  'py-2',
  'px-3',
  'font-normal',
  'disabled:text-gray-400 disabled:bg-gray-200 disabled:shadow-none',
  'transition-colors',
];

export const normalClasses = [
  'border-gray-300',
  'hover:border-gray-400',
  'focus:border-blue-400',
  'focus:outline-none',
  'focus:ring-4',
  'focus:ring-opacity-50',
  'focus:ring-blue-300',
];

export const errorClasses = [
  'border-red-300',
  'hover:border-red-400',
  'focus:border-red-400',
  'focus:outline-none',
  'focus:ring-4',
  'focus:ring-opacity-50',
  'focus:ring-red-300',
];
