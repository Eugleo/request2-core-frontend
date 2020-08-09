import { FieldValue, isSchema, Schema } from './RequestSchema';
import fieldTransformSM from './SmallMoleculeRequest';

const requestTypes: Map<string, Schema> = new Map();
const req = require.context('./RequestTypes', true, /^.*\.rcfg\.json$/im);
req.keys().forEach(fileName => {
  const maybeSchema = req(fileName);
  if (isSchema(maybeSchema)) {
    requestTypes.set(maybeSchema.type, maybeSchema);
  }
});
export default requestTypes;

type FieldValidate = (values: { [_: string]: FieldValue }) => { [_: string]: FieldValue };

export const requestValidations = new Map<string, FieldValidate>();
requestValidations.set('small-molecule', fieldTransformSM);
