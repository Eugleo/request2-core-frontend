import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { ShortText } from './NewTextField';
import { FieldProps, Question, QuestionProps, useFieldContext } from './Question';

export function MultiField({
  q,
  id,
  required = false,
  children,
}: QuestionProps & { children: (id: number) => ReactNode }): JSX.Element {
  const { state, values } = useFieldContext();
  const countId = `${id} Count`;

  if (state === 'edit') {
    return (
      <MultiFieldField question={q} name={countId} required={required}>
        {children}
      </MultiFieldField>
    );
  }

  const maybeCount = Number.parseInt(values[countId] ?? 0);
  const count = Number.isNaN(maybeCount) ? 0 : maybeCount;
  const fields = Array.from({ length: count })
    .fill(null)
    .map((_, i) => i)
    .map(children);

  return (
    <div className="space-y-2 rounded-lg">
      <Question>Details about each sample</Question>
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
}: FieldProps & { children: (id: number) => ReactNode }) {
  const { watch, errors } = useFormContext();
  const maybeCount = Number.parseInt(watch(name, 0));
  const count = Number.isNaN(maybeCount) ? 0 : maybeCount;

  return (
    <div className="space-y-6">
      <ShortText id={name} q={question} required={required} />
      {count > 0 ? (
        <div>
          <Question>Details about each sample</Question>
          <div className="space-y-2">
            {Array.from({ length: count })
              .fill(null)
              .map((_, i) => i)
              .map(i => (
                <div className="rounded-lg bg-gray-50 py-3 px-4">{children(i)}</div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
