import { useFormContext } from 'react-hook-form';

import { FieldValue } from '../../Request/FieldValue';
import { Maybe } from '../../Utils/Maybe';
import { useFieldContext } from './Question';

type Retriever = (key: string) => Maybe<FieldValue>;

export function If({
  condition,
  children,
  orElse = null,
}: {
  condition: (retriever: Retriever) => boolean;
  children: React.ReactNode;
  orElse?: React.ReactNode;
}): JSX.Element {
  const { state, values } = useFieldContext();
  if (state === 'edit') {
    return (
      <IfSecondary condition={condition} orElse={orElse}>
        {children}
      </IfSecondary>
    );
  }
  if (condition(key => values[key])) {
    return <>{children}</>;
  }
  return <>{orElse}</>;
}

function IfSecondary({
  condition,
  children,
  orElse,
}: {
  condition: (retriever: Retriever) => boolean;
  children: React.ReactNode;
  orElse: React.ReactNode;
}) {
  const { watch } = useFormContext();
  if (condition(watch)) {
    return <>{children}</>;
  }
  return <>{orElse}</>;
}
