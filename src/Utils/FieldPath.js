import { capitalize } from './Func';

export function makeFieldPath(section, propertyName) {
  const normalize = str => str.toLowerCase().replace(/\s+/g, '-');
  return `${normalize(section)}/${normalize(propertyName)}`;
}

export function parseFieldName(name) {
  const pieces = name.split('/');
  return { section: pieces.length > 1 && capitalize(pieces[1]), field: capitalize(pieces[0]) };
}
