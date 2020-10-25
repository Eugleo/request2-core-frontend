/* eslint-disable react/jsx-handler-names */
import { useField } from 'formik';
import React from 'react';

import { ChoicesFieldProps } from './Field';
import { Description, Field, FieldHeader } from './General';

export function SingleChoice({
  path: name,
  description,
  label,
  hint,
  choices,
}: ChoicesFieldProps): JSX.Element {
  const [field, meta, helpers] = useField<{ type: 'single-choice'; content: string }>({
    name,
    type: 'radio',
  });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <div>
        {choices.map(choice => (
          <ChoiceField key={choice}>
            <input
              name={field.name}
              onBlur={field.onBlur}
              onChange={e => helpers.setValue({ content: e.target.value, type: 'single-choice' })}
              type="radio"
              id={`${name}/${choice}`}
              value={choice}
              key={choice}
              defaultChecked={meta.initialValue?.content === choice}
            />
            <ChoiceLabel htmlFor={`${name}/${choice}`}>{choice}</ChoiceLabel>
          </ChoiceField>
        ))}
      </div>
      <Description>{description}</Description>
    </Field>
  );
}

export function MultipleChoice({
  path: name,
  description,
  label,
  choices,
  hint,
}: ChoicesFieldProps): JSX.Element {
  const [field, meta, helpers] = useField<{ type: 'multiple-choice'; content: string[] }>({
    name,
    type: 'checkbox',
  });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <div>
        {choices.map(choice => (
          <ChoiceField key={choice}>
            <input
              name={field.name}
              onBlur={field.onBlur}
              onChange={e =>
                helpers.setValue({
                  content: e.target.checked
                    ? meta.value.content.concat(e.target.value)
                    : meta.value.content.filter(s => s !== e.target.value),
                  type: 'multiple-choice',
                })
              }
              id={`${name}/${choice}`}
              type="checkbox"
              value={choice}
              checked={meta.value.content.includes(choice)}
            />
            <ChoiceLabel htmlFor={`${name}/${choice}`}>{choice}</ChoiceLabel>
          </ChoiceField>
        ))}
      </div>
      <Description>{description}</Description>
    </Field>
  );
}

function ChoiceField({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center px-2 rounded-md hover:bg-gray-200">{children}</div>
  );
}

function ChoiceLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="w-full ml-2 py-1 text-gray-800">
      {children}
    </label>
  );
}
