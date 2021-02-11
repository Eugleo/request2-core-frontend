import { useMemo } from 'react';

import { FileInfo, fileInfoToString, stringToFileInfo } from '../Utils/File';
import { comparing } from '../Utils/Func';
import { New, Property, PropertyJSON, Selection } from './Request';

export type FieldValue = string | number | Selection | Selection[] | FileInfo[] | null;

export function fieldToProperty(
  acc: New<Property>[],
  [name, value]: [string, FieldValue]
): New<Property>[] {
  if (!value) {
    return [...acc, { name, value: '' }];
  } else if (typeof value === 'string') {
    return [...acc, { name, value }];
  } else if (typeof value === 'number') {
    return [...acc, { name, value: value.toString() }];
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return [...acc, { name, value: '' }];
    }

    if ('mime' in value[0]) {
      return [
        ...acc,
        ...(value as FileInfo[]).map((f, i) => ({
          // TODO This is fragile, add propertyType to the table
          name: `${name} (${i})`,
          value: fileInfoToString(f),
        })),
      ];
    } else if ('label' in value[0]) {
      return [...acc, { name, value: (value as Selection[]).map(s => s.value).join(';;;') }];
    }
  } else if (typeof value === 'object' && 'label' in value) {
    return [...acc, { name, value: value.value }];
  }
  throw new Error(`Field -> Property conversion failed: name=${name}, value is above`);
}

// Only groups active properties
function groupFiles(props: PropertyJSON[]): PropertyJSON[] {
  const properties = props
    .filter(p => p.active)
    .sort(comparing(p => p.name))
    // TODO This is fragile, add propertyType to the table
    .map(p => {
      const m = /^(.*) \(\d+\)$/u.exec(p.name);
      const name = m ? m[1] : p.name;
      return { ...p, name };
    })
    .reduce<[string | null, PropertyJSON | null, PropertyJSON[]]>(
      ([name, q, acc], p) => {
        if (q && p.name === name) {
          return [name, { ...q, value: `${q.value};;;${p.value}` }, acc];
        }
        return [p.name, p, q ? [...acc, q] : acc];
      },
      [null, null, []]
    );

  return properties[1] ? [...properties[2], properties[1]] : properties[2];
}

export function getDefaultValues(properties: PropertyJSON[]): Record<string, string> {
  return groupFiles(properties).reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {});
}
