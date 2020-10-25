import { FieldValue } from './FieldValue';
import type { Schema } from './RequestSchema';
import { isSchema } from './RequestSchema';
import { fieldTransformSM } from './SmallMoleculeRequest';

const req = require.context('./RequestTypes', true, /^.*\.rcfg\.json$/imu);
export const requestSchemas: Map<string, Schema> = new Map(
  req
    .keys()
    .map<Object>(req)
    .filter(isSchema)
    .map(sch => [sch.type, sch])
);

type FieldValidate = (values: { [_: string]: FieldValue }) => { [_: string]: string };

export const requestValidations = new Map<string, FieldValidate>([
  ['small-molecule', fieldTransformSM],
]);
