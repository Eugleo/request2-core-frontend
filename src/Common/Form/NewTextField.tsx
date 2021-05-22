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

export function ShortText({
  id,
  q,
  optional = false,
  errorMsg = 'This field is required',
}: QuestionProps): JSX.Element {
  const required = !optional && errorMsg;
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
      <Question required={required}>{q}</Question>
      {values[id] && values[id].length > 0 ? (
        <p className="text-sm text-gray-800">{values[id]}</p>
      ) : (
        <p className="text-sm text-gray-400">[no value given]</p>
      )}
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
      <Question required={required}>{question}</Question>
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
        className={c(
          className,
          'border',
          baseClasses,
          err && errorClasses,
          !props.disabled && !err && normalClasses
        )}
        ref={reg}
        {...props}
      />
      <ErrorMessage error={err} />
    </div>
  );
}

export function LongText({
  id,
  q,
  optional = false,
  errorMsg = 'This field is required',
}: QuestionProps): JSX.Element {
  const required = !optional && errorMsg;
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <LongTextField name={id} question={q} required={required} defaultValue={values[id] ?? null} />
    );
  }
  return (
    <div>
      <Question required={required}>{q}</Question>
      {values[id] && values[id].length > 0 ? (
        <p className="text-sm text-gray-800">{values[id]}</p>
      ) : (
        <p className="text-sm text-gray-400">[no value given]</p>
      )}
    </div>
  );
}

function LongTextField({
  name,
  question,
  required = false,
  defaultValue,
}: FieldProps & { defaultValue: string }) {
  const { register, errors } = useFormContext();
  return (
    <div>
      <Question required={required}>{question}</Question>
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
  const err = errors && name && errors[name]?.message;

  return (
    <div className="h-full">
      <textarea
        name={name}
        className={c(
          className,
          baseClasses,
          err && errorClasses,
          !props.disabled && !err && normalClasses
        )}
        ref={reg}
        {...props}
        style={{ ...style, minHeight: '7rem' }}
      />
      <ErrorMessage error={err} />
    </div>
  );
}

export function Number({
  id,
  q,
  optional = false,
  errorMsg = 'You have to enter a number',
}: QuestionProps): JSX.Element {
  const required = !optional && errorMsg;
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <NumberField name={id} question={q} required={required} defaultValue={values[id] ?? null} />
    );
  }
  return (
    <div>
      <Question required={required}>{q}</Question>
      {values[id] && values[id].length > 0 ? (
        <p className="text-sm text-gray-800">{values[id]}</p>
      ) : (
        <p className="text-sm text-gray-400">[no value given]</p>
      )}
    </div>
  );
}

function NumberField({
  name,
  question,
  required = false,
  defaultValue,
}: FieldProps & { defaultValue: string }) {
  const { register, errors } = useFormContext();

  return (
    <div>
      <Question required={required}>{question}</Question>
      <NumberInput
        errors={errors}
        name={name}
        reg={register({ ...reqRule(required) })}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function NumberInput({
  name,
  errors,
  className,
  reg,
  ...props
}: InputProps<'input'>): JSX.Element {
  return (
    <ShortTextInput
      name={name}
      errors={errors}
      className={className}
      reg={reg}
      type="number"
      step="any"
      {...props}
    />
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
  'disabled:text-gray-400 disabled:bg-gray-100 disabled:shadow-none',
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
