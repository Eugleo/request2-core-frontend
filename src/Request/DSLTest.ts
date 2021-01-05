import { File as FileObject } from '../Utils/File';
import { Maybe } from '../Utils/Maybe';

type ItemObject =
  | (FieldBase & (MultipleChoice | ShortText | LongText | Selection | File | SingleChoice | Number))
  | Note;

type ShortText = { type: 'short-text' };
type Number = { type: 'number' };
type LongText = { type: 'long-text' };
type Selection = { type: 'selection'; choices: string[] };
type File = { type: 'file' };
type SingleChoice = { type: 'single-choice'; choices: string[] };
type MultipleChoice = { type: 'multiple-choice'; choices: string[] };
type Note = { type: 'note' };

type FieldOptions = 'required' | 'manually-checked';

type FieldBase = {
  id: Id;
  title: string;
  description: string;
  options: FieldOptions[];
};

type Constructor<T> = (f: FormObject) => T;

type FormObject = { title: string; sections: SectionObject[]; get: (id: Id) => Maybe<FieldValue> };

type SectionObject = { title: string; fields: ItemObject[] };

type Form = Constructor<FormObject>;

type Section = Constructor<SectionObject>;

function form(...sections: Section[]): Form {
  return f => ({ ...f, sections: sections.map(constructor => constructor(f)) });
}

function section<K extends string>(title: K, ...fields: (Item | Items)[]): Section {
  return f => ({ fields: fields.flatMap(construct => construct(f)), title });
}

type Id = string;

type Item = Constructor<ItemObject>;

type Items = Constructor<ItemObject[]>;

function note(value: string): Constructor<Note> {
  return field({
    type: 'note',
    value,
  });
}

type FieldValue = number | string | string[] | FileObject[];

type Value = Maybe<FieldValue>;

type Predicate = Constructor<boolean>;

function when(pred: Predicate): { then: (...items: (Item | Items)[]) => Items } {
  return {
    then(...items) {
      return f => {
        if (pred(f)) {
          items.flatMap(constructor => constructor(f));
        }
        return [];
      };
    },
  };
}

function value(id: Id): { equals: (val: FieldValue) => Predicate } {
  return {
    equals(val) {
      return f => f.get(id) === val;
    },
  };
}

// function get(id: Id): Constructor<Value> {
//   return f => {
//     const fields = f.sections.flatMap(s => s.fields);
//     const field = fields.find(field => 'id' in field && field.id === id);
//     return field ? field.value : null;
//   };
// }

type QuestionStub = {
  id: Id;
  title: string;
  withChoices: (...choices: Choice[]) => Items;
  withSelection: (...choices: string[]) => Constructor<FieldBase & Selection>;
  withTextField: (
    type?: 'short-text' | 'long-text'
  ) => Constructor<FieldBase & (ShortText | LongText)>;
  withFileInput: () => Constructor<FieldBase & File>;
};

function question(id: Id, title: string, description = '', options = []): QuestionStub {
  return {
    id,
    title,
    withChoices(...choices) {
      return f => {
        const thisQuestion: FieldBase & SingleChoice = {
          choices: choices.map(c => c.value),
          description,
          id,
          options,
          title,
          type: 'single-choice',
        };
        return [thisQuestion, ...choices.flatMap(c => c.equal(id)(f))];
      };
    },
    withFileInput: (description = '', options = []) =>
      field({
        description,
        id,
        options,
        title,
        type: 'file',
      }),
    withSelection: (...choices) =>
      field({
        choices,
        description,
        id,
        options,
        title,
        type: 'selection',
      }),
    withTextField: (type = 'short-text') =>
      field({
        description,
        id,
        options,
        title,
        type,
      }),
  };
}

function field<T>(obj: T): Constructor<T> {
  return _ => obj;
}

type Choice = { value: string; equal: (id: Id) => (f: FormObject) => ItemObject[] };

type ChoiceStub = {
  then: (...items: (Item | Items)[]) => Choice;
  value: string;
  equal: (id: Id) => (f: FormObject) => ItemObject[];
};

function choice(thisVal: string): ChoiceStub {
  return {
    equal(_) {
      return _ => [];
    },
    then(...items) {
      return {
        equal(id) {
          return f => {
            const val = f.get(id) as string;
            if (thisVal === val) {
              return items.flatMap(constructor => constructor(f));
            }
            return [];
          };
        },
        value: thisVal,
      };
    },
    value: thisVal,
  };
}

form(
  section(
    'Scope of the experiment',
    question('analysis_type', 'What type of the analysis do you want to perform?').withChoices(
      choice('Identification of all proteins in my sample'),
      choice('Protein quantification'),
      choice('Intact Protein Mass measurement')
    ),
    question('tag_strategy', 'What TAG strategy did you use?').withChoices(
      choice('Anti TAG Ab').then(
        question('anti_tag_ab_strategy', 'Which Anti TAG Ab strategy did you use?').withChoices(
          choice('FLAG'),
          choice('GFP'),
          choice('HA'),
          choice('Myc'),
          choice('Other').then(
            question('anti_tag_ab_strategy_specification', 'Please specify').withTextField()
          )
        ),
        when(value('anti_tag_ab_strategy').equals('Other')).then(note('Please specify'))
      ),
      choice('nanobody'),
      choice('Polyclonal Ab'),
      choice('Monoclonal Ab'),
      choice('Streptavidin'),
      choice('Tandem IP')
    )
  )
);

// form(
//   section(
//     'Scope of the experiment',
//     choice('ANALYSIS TYPE', 'What type of the analysis do you want to perform?', [
//       'Identification of all proteins in my sample',
//       'Protein quantification',
//       'Intact Protein Mass measurement',
//     ]),
//     when(
//       value('ANALYSIS TYPE'),
//       equals('Identification of all proteins in my sample').then(
//         choice('PROTEIN FORM', 'What form are your proteins in?', [
//           'Purified proteins',
//           'Cell lysate',
//           'Tissue lysate',
//           'Immunoprecipitated proteins',
//         ]),
//         when(
//           value('PROTEIN FORM'),
//           equals('Purified proteins').then(
//             choice('PURIFICATION TYPE', 'What type of purification did you use?', [
//               'SDS PAGE',
//               'SEC chromatography',
//               'TAG purification',
//               'Native PAGE',
//               'Other',
//             ]),
//             when(
//               value('PURIFICATION TYPE'),
//               equals('SDS PAGE').then(
//                 note('We only accept Coomasie blue stained gels'),
//                 choice('HAS SDS PAGE IMAGE', 'Do you have the image of the gel?', ['Yes', 'No']),
//                 when(
//                   value('HAS SDS PAGE IMAGE'),
//                   equals('Yes').then(
//                     image('PROTEIN SDS PAGE IMAGE', 'Upload the image with marked band(s)')
//                   )
//                 )
//               ),
//               equals('TAG purification').then(
//                 choice('TAG STRATEGY', 'What TAG strategy did you use?', [
//                   'Anti TAG Ab',
//                   'nanobody',
//                   'Polyclonal Ab',
//                   'Monoclonal Ab',
//                   'Streptavidin',
//                   'Tandem IP',
//                 ]),
//                 when(
//                   value('TAG STRATEGY'),
//                   equals('Anti TAG Ab').then(
//                     choice('ANTI TAG AB STRATEGY', 'Which Anti TAG Ab strategy did you use?', [
//                       'FLAG',
//                       'GFP',
//                       'HA',
//                       'Myc',
//                       'Other',
//                     ]),
//                     when(
//                       value('ANTI TAG AB STRATEGY'),
//                       equals('Other').then(
//                         text('ANTI TAG AB STRATEGY SPECIFICATION', 'Please specify')
//                       )
//                     )
//                   )
//                 )
//               ),
//               equals('Native PAGE').then(
//                 choice('HAS NATIVE PAGE IMAGE', 'Do you have the image of the gel?', ['Yes', 'No']),
//                 when(
//                   value('HAS NATIVE PAGE IMAGE'),
//                   equals('Yes').then(
//                     image('PROTEIN NATIVE PAGE IMAGE', 'Upload the image with marked band(s)')
//                   )
//                 )
//               ),
//               equals('Other').then(text('PURIFICATION TYPE SPECIFICATION', 'Please specify'))
//             )
//           ),
//           equals('Cell lysate').then(
//             text('CELL LYSATE TYPE', 'What cell type did you use?'),
//             longText('CELL LYSATE BUFFER', 'What buffer conditions did you use for lysis?')
//           ),
//           equals('Tissue lysate').then(
//             text('TISSUE LYSATE TYPE', 'What tissue did you use?'),
//             longText('TISSUE LYSATE BUFFER', 'What buffer conditions did you use for lysis?')
//           )
//         )
//       )
//     )
//   )
// );
