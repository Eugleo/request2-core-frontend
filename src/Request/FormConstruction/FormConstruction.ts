import {
  FieldValue,
  FileInput,
  Form,
  Id,
  Item,
  LongTextInput,
  MultipleChoiceInput,
  Note,
  Section,
  SelectionInput,
  ShortTextInput,
  SingleChoiceInput,
} from './Form';

type Constructor<T> = (f: Form) => T;

type Block = Constructor<Item> | Constructor<Item[]>;

export function form(...sections: Constructor<Section>[]): Constructor<Form> {
  return f => ({ ...f, sections: sections.map(constructor => constructor(f)) });
}

export function section<K extends string>(
  title: K
): { withItems: (...fields: Block[]) => Constructor<Section> } {
  return {
    withItems(...fields) {
      return f => ({ items: fields.flatMap(construct => construct(f)), title });
    },
  };
}

export function note(value: string): Constructor<Note> {
  return field({
    type: 'note',
    value,
  });
}

type Predicate = Constructor<boolean>;

export function when(pred: Predicate): { then: (...blocks: Block[]) => Constructor<Item[]> } {
  return {
    then(...blocks) {
      return f => {
        if (pred(f)) {
          blocks.flatMap(constructor => constructor(f));
        }
        return [];
      };
    },
  };
}

export function value(id: Id): { equals: (val: FieldValue) => Predicate } {
  return {
    equals(val) {
      return f => f.get(id) === val;
    },
  };
}

type QuestionStub = {
  id: Id;
  title: string;
  withChoices: (...choices: Choice[]) => Constructor<Item[]>;
  withMultipleChoices: (...choices: string[]) => Constructor<MultipleChoiceInput>;
  withSelection: (...choices: string[]) => Constructor<SelectionInput>;
  withTextField: (type?: 'short-text' | 'long-text') => Constructor<ShortTextInput | LongTextInput>;
  withFileInput: () => Constructor<FileInput>;
};

export function question(id: Id, title: string, description = '', options = []): QuestionStub {
  return {
    id,
    title,
    withChoices(...choices) {
      return f => {
        const value = f.get(id) as string;
        const choicesStr = choices.map(c => c.value);
        const chosenIndex = value ? choicesStr.indexOf(value) : null;
        const block = chosenIndex ? choices[chosenIndex].block(f) : [];

        const thisQuestion: SingleChoiceInput = {
          choices: choicesStr,
          description,
          id,
          options,
          title,
          type: 'single-choice',
        };

        return [thisQuestion, ...block];
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
    withMultipleChoices: (...choices) =>
      field({
        choices,
        description,
        id,
        options,
        title,
        type: 'multiple-choice',
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

type Choice = { value: string; block: Constructor<Item[]> };

export function choice(value: string): Choice & { whenChosen: (...blocks: Block[]) => Choice } {
  return {
    block: _ => [],
    value,
    whenChosen(...blocks) {
      return {
        block: f => blocks.flatMap(constructor => constructor(f)),
        value,
      };
    },
  };
}
