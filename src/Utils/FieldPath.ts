import { capitalize } from './Func';

function normalize(str: string) {
  return str.toLowerCase().replace(/\s+/gu, '-');
}

export function makeFieldPath(section: string, propertyName: string): string {
  return `${normalize(section)}/${normalize(propertyName)}`;
}

function denormalize(str: string) {
  return str && capitalize(str.split('-').join(' '));
}

export function parseFieldName(name: string): { field: string; section: string } {
  const [field, section] = name.split('/').reverse();
  return { field: denormalize(field), section: denormalize(section) };
}
