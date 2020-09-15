import { FieldValue, isEmpty } from './RequestSchema';

export function fieldTransformSM(values: { [_: string]: FieldValue }) {
  const err: { [_: string]: FieldValue } = {};

  const key = 'structure-or-gel-image/image-file';
  if (values.Polarity === "Operator's Choice" && isEmpty(values[key])) {
    err[key] = "This field is required, because Polarity is set on Operator's Choice";
  }

  return err;
}
