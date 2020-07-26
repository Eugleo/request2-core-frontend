import React from 'react';
import { useField } from 'formik';
import c from 'classnames';
import { components } from 'react-select';
import Creatable from 'react-select/creatable';

import Tooltip from 'react-tooltip';

import * as Icon from 'react-feather';

function TextField({ name, description, label = undefined, type = undefined, children, hint }) {
  const [field, meta] = useField({ name, type });

  const classes = [
    'border',
    'shadow-sm',
    'text-md',
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
      <FieldHeader hint={hint} label={label || name} />
      {children(field, classes)}
      <Description>{description}</Description>
    </Field>
  );
}

export function MultipleChoice({ name, description, label = undefined, choices, hint }) {
  const [field, meta] = useField({ name, type: 'checkbox' });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
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

export function SingleChoice({ name, description, label = undefined, hint, choices }) {
  const [field, meta] = useField({ name, type: 'radio' });

  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
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

export function ShortText({
  name,
  description = null,
  hint = null,
  label = undefined,
  type = 'text',
  ...props
}) {
  return (
    <TextField name={name} description={description} hint={hint} type={type} label={label}>
      {(field, classes) => {
        return <input type={type} {...field} {...props} className={c(classes)} />;
      }}
    </TextField>
  );
}

export function LongText({ name, description = '', hint = '', label = undefined, className = '' }) {
  return (
    <TextField name={name} description={description} hint={hint} label={label}>
      {(field, classes) => (
        <textarea
          style={{ minHeight: '5rem' }}
          {...field}
          className={c(classes, 'h-20', className)}
        />
      )}
    </TextField>
  );
}

export function TextWithHints({ name, description, label = undefined, hints, hint }) {
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
      <FieldHeader hint={hint} label={label || name} />
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

export function Image({ className = '' }) {
  return (
    <div
      className={c(
        'flex flex-col justify-center rounded-md shadow-inner border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500 p-6',
        className
      )}
    >
      Drop thee images here
    </div>
  );
}

export function Section({ title, children, description = null }) {
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
    <div className="flex flex-row items-center px-2 rounded-md hover:bg-gray-200">{children}</div>
  );
}

function ChoiceLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="w-full ml-2 py-1 text-gray-800">
      {children}
    </label>
  );
}

function Field({ touched, error, children }) {
  const classNames = ['flex', 'flex-col', 'w-full', 'h-full', 'rounded-md', 'px-4', 'py-2'];
  return (
    <div className={c('flex', 'flex-row', 'w-full', error && touched && 'bg-yellow-100')}>
      <div className={c('w-1', 'bg-transparent', error && touched && 'bg-yellow-500')} />
      <div className="flex flex-col w-full h-full">
        <div className={c(classNames)}>{children}</div>
        {error && touched && <span className="px-4 py-2 text-yellow-800">{error}</span>}
      </div>
    </div>
  );
}

function Description({ children }) {
  return children ? <p className="font-normal mt-2 text-sm text-gray-500">{children}</p> : null;
}

function FieldHeader({ hint, label }) {
  return (
    <div className="flex flex-row items-center mb-1">
      <FieldLabel text={label} />
      <Hint hint={hint} />
    </div>
  );
}

function FieldLabel({ text }) {
  return (
    <label htmlFor={text} className="font-medium text-gray-800 mr-2">
      {text}
    </label>
  );
}

function Hint({ hint }) {
  return hint ? (
    <>
      <Icon.HelpCircle data-tip={hint} className="h-5 text-gray-500" />
      <Tooltip className="bg-gray-600" />
    </>
  ) : null;
}
