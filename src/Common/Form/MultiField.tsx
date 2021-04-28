import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { ShortText, ShortTextInput } from './NewTextField';
import { ErrorMessage, FieldProps, Question, QuestionProps, useFieldContext } from './Question';

export function MultiField({
  q,
  id,
  optional = false,
  errorMsg = 'You have to input a number',
  children,
}: QuestionProps & { children: (id: number) => ReactNode }): JSX.Element {
  const required = !optional && errorMsg;

  const { state, values } = useFieldContext();
  const countId = `${id} Count`;
  const maybeCount = Number.parseInt(values[countId] ?? 0);
  const count = Number.isNaN(maybeCount) ? 0 : maybeCount;

  if (state === 'edit') {
    return (
      <MultiFieldField question={q} name={countId} required={required} defaultValue={count}>
        {children}
      </MultiFieldField>
    );
  }

  const fields = Array.from({ length: count })
    .fill(null)
    .map((_, i) => i)
    .map(children);

  return (
    <div className="space-y-2 rounded-lg">
      <Question required={required}>Details about each sample</Question>
      {fields.length > 0 ? (
        fields.map((f, ix) => (
          <div key={ix} className="rounded-lg bg-gray-50 py-3 px-4">
            {f}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">[no values have been entered]</p>
      )}
    </div>
  );
}

function MultiFieldField({
  question,
  name,
  required,
  children,
  defaultValue,
}: FieldProps & { children: (id: number) => ReactNode; defaultValue: number }) {
  const { watch, errors, register } = useFormContext();
  const maybeCount = Number.parseInt(watch(name, defaultValue));
  const count = Number.isNaN(maybeCount) ? 0 : maybeCount;

  return (
    <div className="space-y-6">
      <div>
        <Question required={required}>{question}</Question>
        <ShortTextInput
          defaultValue={defaultValue}
          name={name}
          errors={errors}
          reg={register({
            required,
            validate: val => {
              const n = Number.parseInt(val);
              if (Number.isNaN(n) || n < 0 || n > 15) {
                return 'Enter a valid whole number betweeen 0 and 15';
              }
              return true;
            },
          })}
        />
      </div>
      {count > 0 ? (
        <div>
          <Question required={required}>Details about each sample</Question>
          <div className="space-y-2">
            {Array.from({ length: Math.min(Math.max(count, 0), 15) })
              .fill(null)
              .map((_, i) => i)
              .map(i => (
                <div key={i} className="rounded-lg bg-gray-50 py-3 px-4">
                  {children(i)}
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
