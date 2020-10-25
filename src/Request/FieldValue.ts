import { File, stringToFile } from '../Utils/File';
import { Maybe } from '../Utils/Maybe';

export type ShortTextFieldValue = { type: 'text-short'; content: string };
export type LongTextFieldValue = { type: 'text-long'; content: string };
export type TextWithHintsFieldValue = { type: 'text-with-hints'; content: string };
export type SingleChoiceFieldValue = { type: 'single-choice'; content: string };

export type TextFieldValue =
  | ShortTextFieldValue
  | LongTextFieldValue
  | TextWithHintsFieldValue
  | SingleChoiceFieldValue;
export type MultipleChoiceFieldValue = { type: 'multiple-choice'; content: string[] };
export type FilesFieldValue = { type: 'files'; content: File[] };

export type FieldValue = TextFieldValue | MultipleChoiceFieldValue | FilesFieldValue;

export function isEmpty(val: FieldValue): boolean {
  if (typeof val === 'string' || Array.isArray(val)) {
    return val.length === 0;
  }
  return val.content === '';
}

export function isFilesField(val: FieldValue): val is { type: 'files'; content: File[] } {
  return val.type === 'files';
}

export function createShortTextValue(def?: Maybe<string>): ShortTextFieldValue {
  return { content: def ?? '', type: 'text-short' };
}

export function createLongTextValue(def?: string): LongTextFieldValue {
  return { content: def ?? '', type: 'text-long' };
}

export function createSingleChoiceValue(def?: string): SingleChoiceFieldValue {
  return { content: def ?? '', type: 'single-choice' };
}

export function createMultipleChoiceValue(def?: string): MultipleChoiceFieldValue {
  return { content: def?.split(';;;') ?? [], type: 'multiple-choice' };
}

export function createTextWithHintsValue(def?: string): TextWithHintsFieldValue {
  return { content: def ?? '', type: 'text-with-hints' };
}

export function createFilesValue(def?: string): FilesFieldValue {
  return { content: def?.split(';;;').map(stringToFile) ?? [], type: 'files' };
}

export function fieldValueToString(field: FieldValue): string {
  switch (field.type) {
    case 'single-choice':
    case 'text-long':
    case 'text-short':
    case 'text-with-hints':
      return field.content;
    case 'multiple-choice':
      return field.content.map(v => v.toString()).join(';;;');
    default:
      throw new Error('Trying to stringify files');
  }
}
