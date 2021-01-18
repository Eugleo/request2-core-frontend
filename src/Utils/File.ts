export type FileInfo = { hash: string; name: string; mime: string };

export function fileInfoToString(f: FileInfo): string {
  return `${f.hash}:${f.mime}:${f.name}`;
}

export function stringToFileInfo(s: string): FileInfo {
  const fields = s.split(':');
  return { hash: fields[0], mime: fields[1], name: fields[2] };
}
