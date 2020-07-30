import { capitalize } from './Func';

export function makeFieldPath(section, propertyName) {
  const normalize = str => str.toLowerCase().replace(/\s+/g, '-');
  return `${normalize(section)}/${normalize(propertyName)}`;
}

export function parseFieldName(name) {
  const denormalize = str => str && capitalize(str.split('-').join(' '));

  const [field, section] = name.split('/').reverse();
  return { section: denormalize(section), field: denormalize(field) };
}
