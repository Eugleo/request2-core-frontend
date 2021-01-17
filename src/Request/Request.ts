import { Code } from 'react-feather';

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

export type NewRequest = {
  title: string;
  teamId: number;
  requestType: string;
};

export type PropertyType =
  | 'Comment'
  | 'Note'
  | 'Result'
  | 'General'
  | 'Detail'
  | 'File'
  | 'ResultFile';

export type Property = {
  requestId: number;
  authorId: number;
  propertyType: PropertyType;
  propertyName: string;
  propertyData: string;
  dateAdded: number;
  active: boolean;
};

export type NewProperty = {
  name: string;
  value: string;
};

export type Comment = {
  requestId: number;
  authorId: number;
  content: string;
};

export type ResultProperty = Property & { propertyType: 'Result' | 'ResultFile' };
export type FileProperty = Property & { propertyType: 'ResultFile' | 'File' };
export type DetailProperty = Property & { propertyType: 'Detail' | 'File' };

export function isResultProperty(p: WithID<Property>): p is WithID<ResultProperty> {
  return p?.propertyType === 'Result' || p?.propertyType === 'ResultFile';
}

export function isDetailProperty(p: WithID<Property>): p is WithID<DetailProperty> {
  return p?.propertyType === 'Detail';
}

export type BareProperty = {
  authorId: number;
  propertyType: PropertyType;
  propertyName: string;
  propertyData: string;
  dateAdded: number;
  active: boolean;
};

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
