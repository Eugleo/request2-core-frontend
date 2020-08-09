type NormalFieldType = 'text-short' | 'text-long' | 'image';
type ChoiceFieldType = 'multiple-choice' | 'single-choice' | 'text-with-hints';

export type FieldValue = string | string[] | { value: string; label: string };

export type IndirectField = {
  include: string;
};

type BaseField = {
  name: string;
  description?: string;
  hint?: string;
  required?: boolean;
};

type ChoiceField = BaseField & { type: ChoiceFieldType; choices: string[] };
type NormalField = BaseField & { type: NormalFieldType };
export type Field = ChoiceField | NormalField;
export type DetailField = Field & { path: string };

export function isEmpty(val: FieldValue): boolean {
  if (typeof val === 'string' || val instanceof Array) {
    return val.length === 0;
  }
  return val.value === '';
}

export function stringify(value: FieldValue) {
  if (Array.isArray(value)) {
    return value.map(v => v.toString()).join(';;;');
  }
  if (typeof value === 'object') {
    return value.value;
  }
  return value.toString();
}

export type Section = {
  title: string;
  fields: Array<Field | IndirectField>;
};

export type Schema = {
  title: string;
  type: string;
  typeAbbreviation: string;
  sections: Section[];
};

// TODO Check that sections is an Array
export function isSchema(x: any): x is Schema {
  const s = x as Schema;
  return (
    s.title !== undefined &&
    s.sections !== undefined &&
    s.type !== undefined &&
    s.typeAbbreviation !== undefined &&
    s.sections.every(isSection)
  );
}

// TODO Check that fields is an Array
function isSection(x: any): x is Section {
  const s = x as Section;
  return (
    s.title !== undefined &&
    s.fields !== undefined &&
    s.fields.every(f => isField(f) || isIndirectField(f))
  );
}

export function isField(x: any): x is Field {
  const f = x as Field;
  return f.name !== undefined && f.type !== undefined;
}

export function isIndirectField(x: any): x is IndirectField {
  return (x as IndirectField).include !== undefined;
}
