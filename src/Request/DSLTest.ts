import React from 'react';

import { File as FileObject } from '../Utils/File';
import { Maybe } from '../Utils/Maybe';

function Branches(
  id: Id,
  title: string,
  choices: string[]
): Constructor<FieldBase & (SingleChoice | MultipleChoice)> {
  return f => {
    const val = value(id)(f) as string;
    return {
      choices,
      description: '',
      id,
      options: [],
      title,
      type: 'single-choice',
      value: val ?? '',
    };
  };
}

type ItemObject =
  | (FieldBase & (MultipleChoice | ShortText | LongText | HintedText | File | SingleChoice))
  | Note;

type ShortText = { type: 'short-text'; value: string };
type LongText = { type: 'long-text'; value: string };
type HintedText = { type: 'hinted-text'; value: string };
type File = { type: 'file'; value: FileObject[] };
type SingleChoice = { type: 'single-choice'; value: string };
type MultipleChoice = { type: 'multiple-choice'; value: string[] };
type Note = { type: 'note'; value: string };

type FieldOptions = 'required' | 'manually-checked';

type FieldBase = {
  id: Id;
  title: string;
  description: string;
  options: FieldOptions[];
};

type Constructor<T> = (f: FormObject) => T;

type FormObject = { title: string; sections: SectionObject[] };

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

function choice(
  id: Id,
  title: string,
  choices: string[]
): Constructor<FieldBase & (SingleChoice | MultipleChoice)> {
  return f => {
    const val = value(id)(f) as string;
    return {
      choices,
      description: '',
      id,
      options: [],
      title,
      type: 'single-choice',
      value: val ?? '',
    };
  };
}

function multipleChoice(
  id: Id,
  title: string,
  choices: string[]
): Constructor<FieldBase & (SingleChoice | MultipleChoice)> {
  return f => {
    const val = value(id)(f) as string[];
    return {
      choices,
      description: '',
      id,
      options: [],
      title,
      type: 'multiple-choice',
      value: val ?? [],
    };
  };
}

function note(value: string): Constructor<Note> {
  return _ => ({
    type: 'note',
    value,
  });
}

function text(id: Id, title: string): Constructor<FieldBase & ShortText> {
  return f => {
    const val = value(id)(f) as string;
    return {
      description: '',
      id,
      options: [],
      title,
      type: 'short-text',
      value: val ?? '',
    };
  };
}

function longText(id: Id, title: string): Constructor<FieldBase & LongText> {
  return f => {
    const val = value(id)(f) as string;
    return {
      description: '',
      id,
      options: [],
      title,
      type: 'long-text',
      value: val ?? '',
    };
  };
}

function hintedText(id: Id, title: string): Constructor<FieldBase & HintedText> {
  return f => {
    const val = value(id)(f) as string;
    return {
      description: '',
      id,
      options: [],
      title,
      type: 'hinted-text',
      value: val ?? '',
    };
  };
}

function image(id: Id, title: string): Constructor<FieldBase & File> {
  return f => {
    const val = value(id)(f) as FileObject[];
    return {
      description: '',
      id,
      options: [],
      title,
      type: 'file',
      value: val ?? [],
    };
  };
}

type FieldValue = string | string[] | FileObject[];

type Value = Maybe<FieldValue>;

type Case = Constructor<(pred: Value) => ItemObject[]>;

function when(v: Constructor<Value>, ...items: Case[]): Items {
  return f => {
    const val = v(f);
    return items.flatMap(constructor => constructor(f)(val));
  };
}

// TODO Reference types in FieldValue could be a problem
function equals(val: FieldValue): { then: (...items: (Item | Items)[]) => Case } {
  return {
    then(...items) {
      return f => {
        return v => {
          if (v === val) {
            return items.flatMap(constructor => constructor(f));
          }
          return [];
        };
      };
    },
  };
}

function value(id: string): Constructor<Value> {
  return f => {
    const fields = f.sections.flatMap(s => s.fields);
    const field = fields.find(field => 'id' in field && field.id === id);
    return field ? field.value : null;
  };
}

question('tag_strategy', 'What TAG strategy did you use?').withChoices(
  choice('Anti TAG Ab').then(
    question('anti_tag_ab_strategy', 'Which Anti TAG Ab strategy did you use?')
      .withChoices(
        choice('FLAG'),
        choice('GFP'),
        choice('HA'),
        choice('Myc'),
        choice('Other').then(text('anti_tag_ab_strategy_specification', 'Please specify'))
      )
      .withOptions([Opt.Requred, Opt.Warning]),

    when(value('ANTI TAG AB STRATEGY').equals('Other')).then(
      text('ANTI TAG AB STRATEGY SPECIFICATION', 'Please specify')
    )
  ),
  choice('nanobody'),
  choice('Polyclonal Ab'),
  choice('Monoclonal Ab'),
  choice('Streptavidin'),
  choice('Tandem IP')
);

// form(
//     section(
//       'Scope of the experiment',
//       choice('ANALYSIS TYPE', 'What type of the analysis do you want to perform?', [
//         'Identification of all proteins in my sample',
//         'Protein quantification',
//         'Intact Protein Mass measurement',
//       ]),
//       question('tag_strategy', 'What TAG strategy did you use?').withChoices(
//         choice('Anti TAG Ab').then(
//           question('anti_tag_ab_strategy', 'Which Anti TAG Ab strategy did you use?')
//             .withChoices(
//               choice('FLAG'),
//               choice('GFP'),
//               choice('HA'),
//               choice('Myc'),
//               choice('Other').then(text('anti_tag_ab_strategy_specification', 'Please specify'))
//             )
//             .withOptions([Opt.Requred, Opt.Warning]),

//           when(value('ANTI TAG AB STRATEGY').equals('Other')).then(
//             text('ANTI TAG AB STRATEGY SPECIFICATION', 'Please specify')
//           )
//         ),
//         choice('nanobody'),
//         choice('Polyclonal Ab'),
//         choice('Monoclonal Ab'),
//         choice('Streptavidin'),
//         choice('Tandem IP')
//       );
//     )
//   );

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
