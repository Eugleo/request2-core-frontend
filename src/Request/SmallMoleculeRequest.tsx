import { FieldValue, isEmpty } from './FieldValue';

export function fieldTransformSM(values: { [_: string]: FieldValue }): { [_: string]: string } {
  const err: { [_: string]: string } = {};

  const key = 'structure-or-gel-image/image-file';
  if (values.Polarity?.content === "Operator's Choice" && isEmpty(values[key])) {
    err[key] = "This field is required, because Polarity is set on Operator's Choice";
  }

  return err;
}
