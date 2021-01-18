import { capitalize } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { FieldValue } from './FieldValue';
import { Status } from './Status';

export type Selection = { label: string; value: string };

export type Request = {
  title: string;
  authorId: number;
  teamId: number;
  status: Status;
  requestType: string;
  dateCreated: number;
};

export type NewRequest = New<Request>;

export type PropertyJSON = Omit<Property, 'value'> & { value: string };

export type Property = {
  requestId: number;
  authorId: number;
  name: string;
  value: FieldValue;
  dateAdded: number;
  shouldLog: boolean;
  active: boolean;
};

export type NewProperty = New<Property>;

export type Comment = {
  requestId: number;
  authorId: number;
  content: string;
  dateAdded: number;
};

export type New<T> = Omit<
  T,
  'dateAdded' | 'authorId' | 'active' | 'shouldLog' | 'requestId' | 'status'
>;

// DON'T CHANGE THIS UNLESS YOU CHANGE Api.Query.Request AS WELL
export function idToCode(id: number): string {
  const table = [...'123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'.split('')];
  const k = table.length;

  function helper([dgs, rst]: [number[], number], n: number): [number[], number] {
    return [[...dgs, Math.floor(rst / k ** n)], rst % k ** n];
  }

  const code = [...new Array(10).keys()]
    .reverse()
    .reduce(helper, [[], id])[0]
    .map((i: number) => table[i])
    .join('');

  return code.replace(/^1+(?=\w{3})/u, '');
}

export function idToStr(request: WithID<{ requestType: string }>): { type: string; code: string } {
  return { code: idToCode(request._id), type: capitalize(request.requestType)[0] };
}
