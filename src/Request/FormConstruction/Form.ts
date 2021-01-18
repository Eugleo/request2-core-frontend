import { FileInfo } from '../../Utils/File';
import { Maybe } from '../../Utils/Maybe';

export type Form = {
  title: string;
  sections: Section[];
  get: (id: Id) => Maybe<FieldValue>;
};

export type Section = { title: string; items: Item[] };

export type FieldValue = number | string | string[] | FileInfo[];

export type Item =
  | ShortTextInput
  | LongTextInput
  | NumberInput
  | SelectionInput
  | FileInput
  | SingleChoiceInput
  | MultipleChoiceInput
  | Note;

export type ShortTextInput = { type: 'short-text' } & ItemBase;
export type NumberInput = { type: 'number' } & ItemBase;
export type LongTextInput = { type: 'long-text' } & ItemBase;
export type SelectionInput = { type: 'selection'; choices: string[] } & ItemBase;
export type FileInput = { type: 'file' } & ItemBase;
export type SingleChoiceInput = { type: 'single-choice'; choices: string[] } & ItemBase;
export type MultipleChoiceInput = { type: 'multiple-choice'; choices: string[] } & ItemBase;
export type Note = { type: 'note'; value: string };

type Options = 'required' | 'manually-checked';

export type Id = string;

type ItemBase = {
  id: Id;
  title: string;
  description: string;
  options: Options[];
};
