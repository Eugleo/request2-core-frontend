import React, { useEffect } from 'react';
import { useField } from 'formik';
import c from 'classnames';
import { components } from 'react-select';
import Creatable from 'react-select/creatable';

export function InputField({ label, initValue = '', name, ...props }) {
  const [field, meta, helpers] = useField({ name, ...props });

  useEffect(() => {
    helpers.setValue(initValue);
  }, [initValue]);

  return (
    <div className="flex flex-col mb-6 w-full">
      <FieldLabel text={name} />
      <input
        {...field}
        {...props}
        className={
          'border text-sm border-gray-300 text-gray-900 rounded-md py-1 px-2 ' +
          'focus:outline-none focus:shadow-outline-blue focus:border-blue-600 focus:z-10 font-normal'
        }
      />
    </div>
  );
}

function TextField({ name, description, type = undefined, children, hint }) {
  const [field, meta] = useField({ name, type });

  const classes = [
    'border',
    'shadow-sm',
    'text-sm',
    'border-gray-300',
    'text-gray-900',
    'rounded-md',
    'py-1',
    'px-2',
    'focus:outline-none',
    'focus:shadow-outline-blue',
    'focus:border-blue-600',
    'focus:z-10',
    'font-normal',
  ];

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldLabel text={name} />
      {children(field, classes)}
      <Description>{description}</Description>
    </Field>
  );
}

export function MultipleChoice({ name, description, choices }) {
  const [field, meta] = useField({ name, type: 'checkbox' });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldLabel text={name} />
      <div>
        {choices.map(choice => (
          <ChoiceField key={choice}>
            <input
              {...field}
              id={`${name}/${choice}`}
              type="checkbox"
              value={choice}
              checked={meta.value.includes(choice)}
            />
            <ChoiceLabel htmlFor={`${name}/${choice}`}>{choice}</ChoiceLabel>
          </ChoiceField>
        ))}
      </div>
      <Description>{description}</Description>
    </Field>
  );
}

export function SingleChoice({ name, description, hint, choices }) {
  const [field, meta] = useField({ name, type: 'radio' });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldLabel text={name} />
      <div>
        {choices.map(choice => (
          <ChoiceField key={choice}>
            <input
              {...{ ...field, checked: undefined }}
              type="radio"
              id={`${name}/${choice}`}
              value={choice}
              key={choice}
            />
            <ChoiceLabel htmlFor={`${name}/${choice}`}>{choice}</ChoiceLabel>
          </ChoiceField>
        ))}
      </div>
      <Description>{description}</Description>
    </Field>
  );
}

export function ShortText({ name, description, hint }) {
  return (
    <TextField name={name} description={description} hint={hint} type="text">
      {(field, classes) => <input type="text" {...field} className={c(classes)} />}
    </TextField>
  );
}

export function LongText({ name, description, hint }) {
  return (
    <TextField name={name} description={description} hint={hint}>
      {(field, classes) => <textarea {...field} className={c(classes, 'h-20')} />}
    </TextField>
  );
}

export function TextWithHints({ name, description, hints }) {
  const [field, meta, helpers] = useField({ name, type: 'text' });

  const classes = [
    'border',
    'shadow-sm',
    'border-gray-300',
    'text-gray-900',
    'rounded-md',
    'py-1',
    'px-2',
    'focus:outline-none',
    'focus:shadow-outline-blue',
    'focus:border-blue-600',
    'focus:z-10',
    'font-normal',
    'flex',
    'flex-row',
    'text-gray-300',
  ];

  const sortedHints = hints.sort();

  const Placeholder = ({ children, ...props }) => {
    return (
      <components.Placeholder {...props} className="text-gray-500">
        {children}
      </components.Placeholder>
    );
  };

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props} className={c(classes)}>
        {children}
      </components.Control>
    );
  };

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldLabel text={name} />
      <Creatable
        name={name}
        placeholder="Select or type..."
        components={{ Control, Placeholder }}
        styles={{
          control: () => ({}),
          placeholder: () => ({ position: 'absolute', paddingLeft: '2px' }),
          singleValue: (base, state) => ({
            ...base,
            color: state.selectProps.menuIsOpen ? '#8795A1' : base.color,
          }),
        }}
        onBlur={field.onBlur}
        onChange={value => helpers.setValue(value)}
        isClearable
        options={sortedHints.map(h => ({ value: h, label: h }))}
      />
      <Description>{description}</Description>
    </Field>
  );
}

export function Image() {
  return (
    <Field>
      <div className="flex flex-col justify-center  rounded-md shadow-inner shadow-md border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500">
        Drop thee images here
      </div>
    </Field>
  );
}

export function Section({ title, children, description }) {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <h2 className="text-xl text-gray-900 font-bold">{title}</h2>
        <Description>{description}</Description>
      </div>
      <div className="col-span-3 grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

function ChoiceField({ children }) {
  return (
    <div className="flex flex-row items-center py-1 px-2 rounded-sm hover:bg-gray-200">
      {children}
    </div>
  );
}

function ChoiceLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="w-full ml-2 text-gray-800">
      {children}
    </label>
  );
}

function Field({ touched, error, children }) {
  const classNames = ['flex', 'flex-col', 'w-full', 'rounded-md', 'px-4', 'py-2'];
  return (
    <div className={c('flex', 'flex-row', error && touched && 'bg-yellow-100')}>
      <div className={c('w-1', 'bg-transparent', error && touched && 'bg-yellow-500')} />
      <div className="flex flex-col w-full">
        <div className={c(classNames)}>{children}</div>
        {error && touched && <span className="px-4 py-2 text-yellow-800">{error}</span>}
      </div>
    </div>
  );
}

function FieldLabel({ text }) {
  return (
    <label htmlFor={text} className="font-medium text-gray-800 mb-1">
      {text}
    </label>
  );
}

function ErrorMessage({ touched, error }) {
  return touched && error ? <div className="mt-1 text-red-600 text-xs">{error}</div> : null;
}

function Description({ children }) {
  return children ? <p className="font-normal mt-2 text-sm text-gray-500">{children}</p> : null;
}

function Hint() {}
