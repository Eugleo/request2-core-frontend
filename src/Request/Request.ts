import { capitalize } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { Status } from './Status';

export type Request = {
  name: string;
  authorId: number;
  teamId: number;
  status: Status;
  requestType: string;
  dateCreated: number;
};

export type PropertyType = 'Comment' | 'Note' | 'Result' | 'General' | 'Detail';

export type Property = {
  requestId: number;
  authorId: number;
  propertyType: PropertyType;
  propertyName: string;
  propertyData: string;
  dateAdded: number;
  active: boolean;
};

export type DetailProperty = Property & { propertyType: 'Detail' };

export type BareProperty = {
  authorId: number;
  propertyType: PropertyType;
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
