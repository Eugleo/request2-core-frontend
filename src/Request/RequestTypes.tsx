import type { FieldValue, Schema } from './RequestSchema';
import { isSchema } from './RequestSchema';
import { fieldTransformSM } from './SmallMoleculeRequest';

const req = require.context('./RequestTypes', true, /^.*\.rcfg\.json$/imu);
export const requestTypes: Map<string, Schema> = new Map(
  req
    .keys()
    .map(req)
    .filter(isSchema)
    .map(sch => [sch.type, sch])
);

type FieldValidate = (values: { [_: string]: FieldValue }) => { [_: string]: FieldValue };

export const requestValidations = new Map<string, FieldValidate>([
  ['small-molecule', fieldTransformSM],
]);
