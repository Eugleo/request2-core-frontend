import { FileInfo, fileInfoToString, stringToFileInfo } from '../Utils/File';
import { comparing } from '../Utils/Func';
import { New, Property, PropertyJSON, Selection } from './Request';

export type FieldValue = string | number | Selection | Selection[] | FileInfo[];

export function fieldToProperty(
  acc: New<Property>[],
  [name, value]: [string, FieldValue]
): New<Property>[] {
  if (typeof value === 'string') {
    return acc.concat([{ name, value }]);
  } else if (typeof value === 'number') {
    return acc.concat([{ name, value: value.toString() }]);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return acc.concat([{ name, value: '' }]);
    }

    if ('mime' in value[0]) {
      return acc.concat(
        (value as FileInfo[]).map((f, i) => ({ name: `${name}${i}`, value: fileInfoToString(f) }))
      );
    } else if ('label' in value[0]) {
      return acc.concat([{ name, value: (value as Selection[]).map(s => s.value).join(';;;') }]);
    }
  } else if (typeof value === 'object' && 'label' in value) {
    return acc.concat([{ name, value: value.value }]);
  }
  throw new TypeError(`Field -> Property conversion failed: name=${name}, value is above`);
}

// Only groups active properties
export function groupFiles(props: PropertyJSON[]): PropertyJSON[] {
  return props
    .filter(p => p.active)
    .sort(comparing(p => p.name))
    .reduce<[string | null, PropertyJSON | null, PropertyJSON[]]>(
      ([name, q, acc], p) => {
        if (q && p.name === name) {
          return [name, { ...q, value: `${q.value};;;${p.value}` }, acc];
        }
        return [p.name, p, q ? acc.concat(q) : acc];
      },
      [null, null, []]
    )[2];
}
