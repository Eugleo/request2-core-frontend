import { useFormContext } from 'react-hook-form';

import { FieldValue } from '../../Request/FieldValue';
import { Maybe } from '../../Utils/Maybe';
import { useFieldContext } from './Question';

type Retriever<T> = (key: string) => Maybe<T>;

export function If<T>({
  condition,
  children,
  decode,
  orElse = null,
}: {
  condition: (retriever: Retriever<T>) => boolean;
  children: React.ReactNode;
  orElse?: React.ReactNode;
  decode: (content: string) => T;
}): JSX.Element {
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <IfSecondary condition={condition} orElse={orElse}>
        {children}
      </IfSecondary>
    );
  }

  if (condition(key => (values[key] ? decode(values[key]) : null))) {
    return <>{children}</>;
  }
  return <>{orElse}</>;
}

function IfSecondary<T>({
  condition,
  children,
  orElse,
}: {
  condition: (retriever: Retriever<T>) => boolean;
  children: React.ReactNode;
  orElse: React.ReactNode;
}) {
  const { watch } = useFormContext();
  if (condition(watch)) {
    return <>{children}</>;
  }
  return <>{orElse}</>;
}
