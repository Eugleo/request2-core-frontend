import { useFormContext } from 'react-hook-form';

import { FilesView } from '../../../Request/FileView';
import { stringToFileInfo } from '../../../Utils/File';
import { FieldProps, Question, QuestionProps, useFieldContext } from '../Question';
import { FileInput } from './Input';

export function Files({
  id,
  q,
  optional = false,
  errorMsg = 'You have to upload at least one file',
}: QuestionProps): JSX.Element {
  const required = !optional && errorMsg;
  const { state, values } = useFieldContext();
  const files = values[id] ? values[id].split(';;;').map(stringToFileInfo) : [];

  if (state === 'edit') {
    return <FilesField name={id} question={q} required={required} defaultValue={values[id]} />;
  }
  return (
    <div>
      <Question required={required}>{q}</Question>
      <FilesView files={files} />
    </div>
  );
}

function FilesField({
  name,
  question,
  required = false,
  defaultValue,
}: FieldProps & { defaultValue: string }) {
  const form = useFormContext();

  const currentValue = form.watch(name, null);

  return (
    <div>
      <Question required={required}>{question}</Question>
      <FileInput
        name={name}
        {...form}
        value={currentValue}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  );
}
