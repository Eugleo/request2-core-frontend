import c from 'classnames';
import { useField } from 'formik';
import React, { ReactNode } from 'react';
import * as Icon from 'react-feather';
import { components, ControlProps, PlaceholderProps } from 'react-select';
import Creatable from 'react-select/creatable';
import Tooltip from 'react-tooltip';

import { Maybe } from '../Utils/Maybe';

type FieldConfig = { path: string; description?: string; label?: string; hint?: string };

type FieldWithStyle = FieldConfig & { className?: string };

const textFieldClasses = [
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

export function ShortText({
  path: name,
  description,
  hint,
  label,
  className,
  type = 'text',
  ...props
}: FieldWithStyle & { type?: string } & React.PropsWithoutRef<JSX.IntrinsicElements['input']>) {
  const [field, meta] = useField<string>({ name, type });
  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <input type={type} {...field} {...props} className={c(textFieldClasses, className)} />
      <Description>{description}</Description>
    </Field>
  );
}

export function LongText({
  path: name,
  description,
  hint,
  label,
  className,
  ...props
}: FieldWithStyle & React.PropsWithoutRef<JSX.IntrinsicElements['textarea']>) {
  const [field, meta] = useField<string>({ name });
  return (
    <Field touched={meta.touched} error={meta.error}>
      <FieldHeader hint={hint} label={label || name} />
      <textarea
        style={{ minHeight: '5rem' }}
        className={c(textFieldClasses, 'h-20', className)}
        {...field}
        {...props}
      />
      <Description>{description}</Description>
    </Field>
  );
}

type FieldWithChoices = FieldConfig & { choices: Array<string> };

export function SingleChoice({ path: name, description, label, hint, choices }: FieldWithChoices) {
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
              defaultChecked={meta.initialValue === choice}
            />
            <ChoiceLabel htmlFor={`${name}/${choice}`}>{choice}</ChoiceLabel>
          </ChoiceField>
        ))}
      </div>
      <Description>{description}</Description>
    </Field>
  );
}

export function MultipleChoice({
  path: name,
  description,
  label,
  choices,
  hint,
}: FieldWithChoices) {
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

type OptionType = { value: string; label: string };

export function TextWithHints({ path: name, description, label, choices, hint }: FieldWithChoices) {
  const [field, meta, helpers] = useField<OptionType>({ name, type: 'text' });

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

  const options = choices.sort().map(h => ({ value: h, label: h }));

  const Placeholder = ({
    children,
    ...props
  }: { children: ReactNode } & PlaceholderProps<{ value: string; label: string }>) => {
    return (
      <components.Placeholder {...props} className="text-gray-500">
        {children}
      </components.Placeholder>
    );
  };

  const Control = ({
    children,
    ...props
  }: { children: ReactNode } & ControlProps<{ value: string; label: string }>) => {
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
        onChange={option => helpers.setValue(option as OptionType)}
        options={options}
        isClearable
        defaultValue={meta.initialValue}
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
      <span>Images & files don't work properly yet</span>
    </div>
    // <UploadDropZone onDragOverClassName="bg-green-100" grouped={false} autoUpload={false}>
    //   <div
    //     className={c(
    //       'flex flex-col justify-center rounded-md shadow-inner border-dashed border-2 border-gray-500 h-32 text-center text-lg text-gray-500 p-6',
    //       className
    //     )}
    //   >
    //     <span>Drag&Drop File(s) Here</span>
    //   </div>
    // </UploadDropZone>
  );
}

function ChoiceField({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center px-2 rounded-md hover:bg-gray-200">{children}</div>
  );
}

function ChoiceLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="w-full ml-2 py-1 text-gray-800">
      {children}
    </label>
  );
}

function Field({
  touched,
  error,
  children,
}: {
  touched: boolean;
  error: Maybe<string>;
  children: ReactNode;
}) {
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

function Description({ children }: { children: Maybe<ReactNode> }) {
  return children ? <p className="font-normal mt-2 text-sm text-gray-500">{children}</p> : null;
}

function FieldHeader({ hint, label }: { hint: Maybe<string>; label: string }) {
  return (
    <div className="flex flex-row items-center mb-1">
      <FieldLabel text={label} />
      <Hint hint={hint} />
    </div>
  );
}

function FieldLabel({ text }: { text: string }) {
  return (
    <label htmlFor={text} className="font-medium text-gray-800 mr-2">
      {text}
    </label>
  );
}

function Hint({ hint }: { hint: Maybe<string> }) {
  return hint ? (
    <>
      <Icon.HelpCircle data-tip={hint} className="h-5 text-gray-500" />
      <Tooltip className="bg-gray-600" />
    </>
  ) : null;
}
