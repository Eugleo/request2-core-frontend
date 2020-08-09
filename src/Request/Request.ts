import { capitalize } from '../Utils/Func';
import { Status } from './Status';
import { WithID } from '../Utils/WithID';

export type Request = {
  name: string;
  authorId: number;
  teamId: number;
  status: Status;
  requestType: string;
  dateCreated: number;
};

export type Property = {
  requestId: number;
  authorId: number;
  propertyType: 'Comment' | 'Note' | 'Result' | 'General' | 'Detail';
  propertyName: string;
  propertyData: string;
  dateAdded: number;
  active: boolean;
};

export function idToCode(id: number) {
  const table = [...'123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'.split('')];
  const k = table.length;

  function helper([dgs, rst]: [number[], number], n: number): [number[], number] {
    return [[...dgs, Math.floor(rst / k ** n)], rst % k ** n];
  }

  const code = [...Array(10).keys()]
    .reverse()
    .reduce(helper, [[], id])[0]
    .map((i: number) => table[i])
    .join('');

  return code.replace(/^1+(?=\w\w\w)/, '');
}

export function idToStr(request: WithID<{ requestType: string }>) {
  return `${capitalize(request.requestType)[0]}/${idToCode(request._id)}`;
}
