import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { NumberInput, ShortText, ShortTextInput } from './NewTextField';
import {
  Description,
  ErrorMessage,
  FieldProps,
  Question,
  QuestionProps,
  useFieldContext,
} from './Question';

export function MultiField({
  q,
  id,
  optional = false,
  errorMsg = 'You have to input a number',
  children,
  description,
}: QuestionProps & { children: (id: number) => ReactNode }): JSX.Element {
  const required = !optional && errorMsg;

  const { state, values } = useFieldContext();
  const countId = `${id}`;
  const maybeCount = Number.parseInt(values[countId] ?? 1);
  const count = Number.isNaN(maybeCount) ? 1 : maybeCount;

  if (state === 'edit') {
    return (
      <MultiFieldField
        question={q}
        name={countId}
        required={required}
        defaultValue={count}
        description={description}
      >
        {children}
      </MultiFieldField>
    );
  }

  if (state === 'print') {
    const fields = Array.from({ length: count })
      .fill(null)
      .map((_, i) => i)
      .map(children);

    return (
      <div className="space-y-1 py-1 grid grid-cols-2 auto-cols-fr gap-4">
        <div className="flex flex-col gap-y-2">
          {fields.length > 0 ? (
            fields.map((f, ix) => <div key={ix}>{f}</div>)
          ) : (
            <p className="text-gray-400 text-xs">[no values have been entered]</p>
          )}
        </div>
      </div>
    );
  }

  const fields = Array.from({ length: count })
    .fill(null)
    .map((_, i) => i)
    .map(children);

  return (
    <div className="space-y-4">
      {fields.length > 0 ? (
        fields.map((f, ix) => <div key={ix}>{f}</div>)
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
  description,
}: FieldProps & { children: (id: number) => ReactNode; defaultValue: number }) {
  const { watch, errors, register } = useFormContext();
  const maybeCount = Number.parseInt(watch(name, defaultValue));
  const count = Number.isNaN(maybeCount) ? 0 : maybeCount;

  return (
    <div className="space-y-4">
      <div>
        <Question number required={required}>
          {question}
        </Question>
        <ShortTextInput
          defaultValue={defaultValue}
          name={name}
          errors={errors}
          reg={register({
            required,
            validate: val => {
              const n = Number.parseInt(val);
              if (Number.isNaN(n) || n <= 0 || n > 50) {
                return 'Enter a valid whole number betweeen 1 and 50';
              }
              return true;
            },
          })}
        />
        <Description>Enter a number between 1 and 50</Description>
      </div>
      {count > 0 ? (
        <div>
          <div className="space-y-4">
            {Array.from({ length: Math.min(Math.max(count, 0), 50) })
              .fill(null)
              .map((_, i) => i)
              .map(i => (
                <div key={i}>{children(i)}</div>
              ))}
          </div>
          <Description>{description}</Description>
        </div>
      ) : null}
    </div>
  );
}
