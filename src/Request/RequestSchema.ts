export type FieldType = NormalFieldType | ChoiceFieldType;
type NormalFieldType = 'text-short' | 'text-long' | 'files';
type ChoiceFieldType = 'multiple-choice' | 'single-choice' | 'text-with-hints';

type ChoiceField = BaseField & { type: ChoiceFieldType; choices: string[] };
type NormalField = BaseField & { type: NormalFieldType };
export type Field = ChoiceField | NormalField;
export type DetailField = Field & { path: string };

export type IndirectField = {
  include: string;
};

type BaseField = {
  name: string;
  description?: string;
  hint?: string;
  required?: boolean;
};

export type Section = {
  title: string;
  fields: (Field | IndirectField)[];
};

export type Schema = {
  title: string;
  type: string;
  typeAbbreviation: string;
  sections: Section[];
};

// TODO Check that sections is an Array
export function isSchema(x: Object): x is Schema {
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
function isSection(x: Object): x is Section {
  const s = x as Section;
  return (
    s.title !== undefined &&
    s.fields !== undefined &&
    s.fields.every(f => isField(f) || isIndirectField(f))
  );
}

export function isField(x: Object): x is Field {
  const f = x as Field;
  return f.name !== undefined && f.type !== undefined;
}

export function isIndirectField(x: Object): x is IndirectField {
  return (x as IndirectField).include !== undefined;
}
