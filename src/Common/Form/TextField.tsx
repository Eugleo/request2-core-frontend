/* eslint-disable react/jsx-handler-names */
import c from 'classnames';
import { useField } from 'formik';
import React from 'react';

import { LongTextFieldValue } from '../../Request/FieldValue';
import { StyledFieldProps } from './Field';
import { Description, Field, FieldHeader } from './General';

const textFieldClasses = [
  'border',
  'shadow-sm',
  'text-md',
  'border-gray-300',
  'text-gray-900',
  'rounded-md',
  'py-1',
  'px-2',
  'focus:outline-none',
  'focus:shadow-outline-blue',
  'focus:border-blue-600',
  'focus:z-10',
  'font-normal',
];

export function ShortText({
  path: name,
  description,
  hint,
  label,
  className,
  onChange,
  type = 'text',
  ...props
}: StyledFieldProps & { type?: string } & React.PropsWithoutRef<
    JSX.IntrinsicElements['input']
  >): JSX.Element {
  const [field, meta, helpers] = useField<{ type: 'text-short'; content: string }>({ name, type });
  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <input
        type={type}
        name={field.name}
        onBlur={field.onBlur}
        value={field.value.content}
        onChange={e => {
          if (onChange) {
            onChange(e);
          }
          helpers.setValue({ content: e.target.value, type: 'text-short' });
        }}
        {...props}
        className={c(textFieldClasses, className)}
      />
      <Description>{description}</Description>
    </Field>
  );
}

export function LongText({
  path: name,
  description,
  hint,
  label,
  className,
  ...props
}: StyledFieldProps & React.PropsWithoutRef<JSX.IntrinsicElements['textarea']>): JSX.Element {
  const [field, meta, helpers] = useField<LongTextFieldValue>({ name });
  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <textarea
        style={{ minHeight: '5rem' }}
        className={c(textFieldClasses, 'h-20', className)}
        name={field.name}
        onBlur={field.onBlur}
        value={field.value.content}
        onChange={e => helpers.setValue({ content: e.target.value, type: 'text-long' })}
        {...props}
      />
      <Description>{description}</Description>
    </Field>
  );
}
