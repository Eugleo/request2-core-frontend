import { capitalize } from './Func';

export function makeFieldPath(section: string, propertyName: string) {
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
  return `${normalize(section)}/${normalize(propertyName)}`;
}

export function parseFieldName(name: string) {
  const denormalize = (str: string) => str && capitalize(str.split('-').join(' '));

  const [field, section] = name.split('/').reverse();
  return { section: denormalize(section), field: denormalize(field) };
}
