import { capitalize } from './Func';

export function makeFieldPath(namespace, section, propertyName) {
  const normalize = str => str.toLowerCase().replace(/\s+/g, '-');
  return `${namespace}:${normalize(section)}/${normalize(propertyName)}`;
}

export function parseFieldPath(fp) {
  const match = fp.match(/^(.+):(.+)\/(.+)$/);
  const namespace = match[1];
  const section = match[2].replace(/-/g, ' ');
  const field = match[3].replace(/-/g, ' ');
  return { namespace, section: capitalize(section), field: capitalize(field) };
}
