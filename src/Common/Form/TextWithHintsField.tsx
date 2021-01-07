import c from 'classnames';
import { useField } from 'formik';
import React, { ReactNode } from 'react';
import { components, ControlProps, PlaceholderProps } from 'react-select';
import Creatable from 'react-select/creatable';

import { createTextWithHintsValue, TextWithHintsFieldValue } from '../../Request/FieldValue';
import { comparing } from '../../Utils/Func';
import { ChoicesFieldProps } from './Field';
import { Description, Field, FieldHeader } from './General';

type OptionType = { value: string; label: string };

export function TextWithHints({
  path: name,
  description,
  label,
  choices,
  hint,
}: ChoicesFieldProps): JSX.Element {
  const [field, meta, helpers] = useField<TextWithHintsFieldValue>({
    name,
    type: 'text',
  });

  const classes = [
    'border',
    'shadow-sm',
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
    'flex',
    'flex-row',
    'text-gray-300',
  ];

  const options = choices.sort(comparing(s => s)).map(h => ({ label: h, value: h }));

  function Placeholder({
    children,
    ...props
  }: { children: ReactNode } & PlaceholderProps<{ value: string; label: string }, false>) {
    return (
      <components.Placeholder {...props} className="text-gray-500">
        {children}
      </components.Placeholder>
    );
  }

  function Control({
    children,
    ...props
  }: { children: ReactNode } & ControlProps<{ value: string; label: string }, false>) {
    return (
      <components.Control {...props} className={c(classes)}>
        {children}
      </components.Control>
    );
  }

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <Creatable
        name={name}
        placeholder="Select or type..."
        components={{ Control, Placeholder }}
        styles={{
          control: () => ({}),
          placeholder: () => ({ paddingLeft: '2px', position: 'absolute' }),
          singleValue: (base, state) => ({
            ...base,
            color: state.selectProps.menuIsOpen ? '#8795A1' : base.color,
          }),
        }}
        // eslint-disable-next-line react/jsx-handler-names
        onBlur={field.onBlur}
        onChange={option => {
          if (option) {
            helpers.setValue(createTextWithHintsValue((option as OptionType).value));
          } else {
            helpers.setValue(createTextWithHintsValue());
          }
        }}
        options={options}
        isClearable
        defaultValue={{
          label: meta.initialValue?.content ?? '',
          value: meta.initialValue?.content ?? '',
        }}
      />
      <Description>{description}</Description>
    </Field>
  );
}
