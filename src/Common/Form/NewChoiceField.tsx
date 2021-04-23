/* eslint-disable react/jsx-handler-names */
import c from 'classnames';
import { Fragment, ReactElement, ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Control, Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select/';
import Creatable from 'react-select/creatable';
import { valueContainerCSS } from 'react-select/src/components/containers';
import { cleanValue } from 'react-select/src/utils';
import ReactTooltip from 'react-tooltip';

import { Selection } from '../../Request/Request';
import { comparing } from '../../Utils/Func';
import { Maybe } from '../../Utils/Maybe';
import {
  ErrorMessage,
  FieldProps,
  Question,
  QuestionProps,
  reqRule,
  useFieldContext,
  InputProps,
  FormErrors,
} from './Question';

type Choice = ReactElement<
  { value: string; children: Maybe<ReactNode>; label: Maybe<string> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

export function MultipleChoice({
  id,
  required = false,
  q,
  hasCustom = false,
  children,
}: QuestionProps & Omit<ChoiceProps, 'isText'>): JSX.Element {
  const { state, values } = useFieldContext();

  const selection = values[id] ? values[id].split(';;;') : [];
  const defaultValue = children
    .filter(ch => selection.includes(ch.props.value))
    .map(ch => ({ label: ch.props.label ?? ch.props.value, value: ch.props.value }));

  if (state === 'edit') {
    return (
      <MultipleChoiceField
        name={id}
        question={q}
        required={required}
        hasCustom={hasCustom}
        defaultValue={defaultValue}
      >
        {children}
      </MultipleChoiceField>
    );
  }

  let selections;
  if (defaultValue.length === 0) {
    selections = <p className="text-sm text-gray-400">[neither option has been chosen]</p>;
  } else {
    selections = defaultValue.map(v => (
      <span
        key={v.value}
        className="text-sm text-gray-800 px-3 py-1 rounded-full bg-gray-50 border border-gray-100"
      >
        {v.label}
      </span>
    ));
  }

  return (
    <div>
      <Question required={required}>{q}</Question>
      <div className="flex flex-wrap gap-2">{selections}</div>
    </div>
  );
}

export function MultipleChoiceField({
  name,
  required,
  children,
  question,
  hasCustom,
  defaultValue,
}: FieldProps & {
  hasCustom: boolean;
  children: Choice[];
  defaultValue: Selection[];
}): JSX.Element {
  const { watch, errors, control } = useFormContext();

  return (
    <div>
      <Question required={required} hasCustom={hasCustom}>
        {question}
      </Question>
      <MultipleChoiceInput
        name={name}
        hasCustom={hasCustom}
        required={required}
        errors={errors}
        control={control}
        value={watch(name, [])}
        defaultValue={defaultValue}
      >
        {children}
      </MultipleChoiceInput>
    </div>
  );
}

export function MultipleChoiceInput({
  name,
  children,
  required = false,
  value,
  hasCustom = false,
  errors,
  control,
  defaultValue = [],
}: {
  name: string;
  value?: Maybe<Selection[]>;
  children: Choice[];
  hasCustom?: boolean;
  errors: FormErrors;
  defaultValue?: Selection[];
  required?: string | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>;
}): JSX.Element {
  const err = errors[name]?.message;
  const options = children.map(ch => ({
    label: ch.props.label ?? ch.props.value,
    value: ch.props.value,
  }));
  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          validate: (val: Selection[] | null) =>
            !required ||
            (val !== null && val.length > 0) ||
            (typeof required === 'string' ? required : 'You have to choose at least one option'),
        }}
        render={field =>
          hasCustom ? (
            <Creatable
              isMulti
              className="react-select"
              classNamePrefix={err ? 'react-select-error' : 'react-select'}
              {...field}
              options={options}
              styles={getStyles(err)}
              components={{ MultiValueRemove }}
            />
          ) : (
            <Select
              isMulti
              {...field}
              options={options}
              className="react-select"
              classNamePrefix={err ? 'react-select-error' : 'react-select'}
              styles={getStyles(err)}
              components={{ MultiValueRemove }}
            />
          )
        }
      />
      <ErrorMessage error={err} />
      {getVisibleChildren(value, children)}
    </div>
  );
}

type ChoiceProps = { hasCustom?: boolean; isText?: boolean; children: Choice[] };

export function SingleChoice({
  id,
  required = false,
  isText,
  q,
  hasCustom = false,
  children,
}: QuestionProps & Omit<ChoiceProps, 'children'> & { children: Choice | Choice[] }): JSX.Element {
  const { state, values } = useFieldContext();
  const choices = Array.isArray(children) ? children : [children];

  if (state === 'edit') {
    return (
      <SingleChoiceField
        name={id}
        question={q}
        required={required}
        hasCustom={hasCustom}
        isText={isText}
        defaultValue={values[id] ?? null}
      >
        {choices}
      </SingleChoiceField>
    );
  }
  const choice = choices.find(ch => ch.props.value === values[id]);

  let label;
  if (!values[id] || values[id] === '') {
    label = <p className="text-sm text-gray-400">[neither option has been chosen]</p>;
  } else if (values[id] && values[id] !== '' && choice) {
    label = (
      <p className="text-sm text-gray-800">
        {choice.props.label ?? choice.props.value}
        <span className="text-gray-400"> (out of {choices.length} total options)</span>
      </p>
    );
  } else if (!choice) {
    label = (
      <p className="text-sm text-gray-400">{`[ERROR]: The value ${values[id]} is invalid`}</p>
    );
  }

  return (
    <div>
      <Question required={required}>{q}</Question>
      {label}
      {getVisibleChildren(choice?.props.value, choices)}
    </div>
  );
}

export function SingleChoiceField({
  name,
  question,
  children,
  hasCustom = false,
  required,
  isText = false,
  defaultValue,
}: FieldProps & ChoiceProps & { defaultValue: string }): JSX.Element {
  const { watch, errors, register, control } = useFormContext();
  const value = watch(name, defaultValue) as string | Selection | null;

  return (
    <div>
      <Question required={required} hasCustom={hasCustom}>
        {question}
      </Question>
      {hasCustom || isText || (isText === undefined && children.length >= 4) ? (
        <SingleChoiceTextInput
          name={name}
          value={value}
          required={required}
          hasCustom={hasCustom}
          errors={errors}
          control={control}
          defaultValue={defaultValue}
        >
          {children}
        </SingleChoiceTextInput>
      ) : (
        <SingleChoiceButtonsInput
          name={name}
          value={value}
          errors={errors}
          reg={register(reqRule(required, 'You have to choose an option'))}
          defaultValue={defaultValue}
        >
          {children}
        </SingleChoiceButtonsInput>
      )}
    </div>
  );
}

function SingleChoiceButtonsInput({
  name,
  children,
  required = false,
  value,
  errors,
  reg,
  defaultValue,
  ...props
}: Omit<InputProps<'input'>, 'value'> & { children: Choice[]; value?: Maybe<Selection | string> }) {
  const err: Maybe<string> = errors && name && errors[name]?.message;
  return (
    <div>
      {toOptions(children).map(({ value, label }) => (
        <Fragment key={value}>
          <ChoiceField>
            <input
              name={name}
              ref={reg}
              id={`${name}/${value}`}
              value={value}
              type="radio"
              defaultChecked={value === defaultValue}
              {...props}
              className={c(err && 'bg-red-100 border-red-400', 'text-indigo-500')}
            />
            <ChoiceLabel htmlFor={`${name}/${value}`}>{label ?? value}</ChoiceLabel>
          </ChoiceField>
        </Fragment>
      ))}
      <ErrorMessage error={err} />
      {getVisibleChildren(value, children)}
    </div>
  );
}

function toOptions(choices: Choice[]) {
  return choices
    .map(ch => ({
      label: ch.props.label ?? ch.props.value,
      value: ch.props.value,
    }))
    .sort(comparing(o => o.label));
}

function SingleChoiceTextInput({
  name,
  children,
  required = false,
  value,
  defaultValue,
  hasCustom,
  errors,
  control,
}: {
  name: string;
  value?: Maybe<Selection | string>;
  children: Choice[];
  hasCustom: boolean;
  errors: FormErrors;
  defaultValue?: string;
  required?: string | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>;
}) {
  const err = errors[name]?.message;
  const choice = children.find(ch => ch.props.value === defaultValue);
  const defaultSelection: Selection | null =
    defaultValue && choice
      ? { label: choice.props.label ?? choice.props.value, value: choice.props.value }
      : null;

  const options = toOptions(children);

  return (
    <div>
      <Controller
        name={name}
        rules={reqRule(required, 'You have to choose an option')}
        control={control}
        defaultValue={defaultSelection}
        render={field =>
          hasCustom ? (
            <Creatable
              className="react-select"
              defaultValue={defaultSelection}
              classNamePrefix={err ? 'react-select-error' : 'react-select'}
              styles={getStyles(err)}
              options={options}
              {...field}
            />
          ) : (
            <Select
              className="react-select"
              defaultValue={defaultSelection}
              classNamePrefix={err ? 'react-select-error' : 'react-select'}
              styles={getStyles(err)}
              options={options}
              {...field}
            />
          )
        }
      />
      <ErrorMessage error={err} />
      {getVisibleChildren(value, children)}
    </div>
  );
}

export function Option({
  value,
  label,
  children,
}: {
  value: number | string;
  children?: ReactNode;
  label?: string;
}): Choice {
  return <span />;
}

export function Yes({
  children,
  value = 'Yes',
  label = 'Yes',
}: {
  children?: ReactNode;
  value?: string;
  label?: string;
}): Choice {
  return <span />;
}

export function No({
  children,
  value = 'No',
  label = 'No',
}: {
  children?: ReactNode;
  value?: string;
  label?: string;
}): Choice {
  return <span />;
}

function ChoiceField({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row text-sm items-center px-2 rounded-md hover:bg-gray-100">
      {children}
    </div>
  );
}

function ChoiceLabel({
  htmlFor,
  children,
  className,
}: {
  className?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={c('w-full ml-2 py-1 text-gray-800', className)}>
      {children}
    </label>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiValueRemove(props: any) {
  return (
    <button
      className="transition-colors text-gray-400 pl-1 pr-2 bg-gray-200 hover:text-gray-500 rounded-r-full"
      onClick={props.innerProps.onClick}
      onMouseDown={props.innerProps.onMouseDown}
      onTouchEnd={props.innerProps.onTouchEnd}
    >
      <Icon.X className="w-4" />
    </button>
  );
}

function getVisibleChildren(
  value: Maybe<Selection | string | Selection[]>,
  children: Choice[]
): ReactNode {
  let showChildren = null;
  if (value) {
    showChildren = children
      .filter(ch => {
        if (Array.isArray(value)) {
          return value.map(v => v.value).includes(ch.props.value);
        } else if (typeof value === 'string') {
          return value === ch.props.value;
        }
        return value.value === ch.props.value;
      })
      .filter(ch => ch.props.children)
      .map(ch => (
        <div className="space-y-6" key={ch.props.value}>
          {ch.props.children}
        </div>
      ));
  }

  return showChildren && showChildren.length > 0 ? (
    <div className="mt-6 space-y-6">{showChildren}</div>
  ) : null;
}

function getStyles(err: Maybe<string>) {
  return {
    control: (provided: Object, state: { isFocused: boolean }) => ({
      ...provided,
      boxShadow: undefined,
      border: undefined,
      borderRadius: undefined,
      borderWidth: undefined,
      '&:hover': {
        borderColor: undefined,
      },
      '--tw-border-opacity': 1,
      ...(state.isFocused
        ? {
            '--tw-ring-opacity': 0.5,
            '--tw-ring-color': err
              ? 'rgba(252, 165, 165, var(--tw-ring-opacity))'
              : 'rgba(147, 197, 253, var(--tw-ring-opacity))',
            '--tw-ring-offset-shadow':
              'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
            '--tw-ring-shadow':
              'var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
            boxShadow:
              'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
            borderColor: err
              ? 'rgba(248, 113, 113, var(--tw-border-opacity))'
              : 'rgba(96, 165, 250, var(--tw-border-opacity))',
          }
        : {
            borderColor: err
              ? 'rgba(252, 165, 165, var(--tw-border-opacity))'
              : 'rgba(209, 213, 219, var(--tw-border-opacity))',
            '&:hover': {
              borderColor: err
                ? 'rgba(248, 113, 113, var(--tw-border-opacity))'
                : 'rgba(156, 163, 175, var(--tw-border-opacity))',
            },
          }),
      transition: undefined,
    }),
    singleValue: (provided: Object) => ({ ...provided, color: undefined }),
    valueContainer: (provided: Object) => ({ ...provided, padding: undefined }),
    multiValue: (provided: Object) => ({
      ...provided,
      borderRadius: undefined,
      backgroundColor: undefined,
      borderWidth: undefined,
    }),
    multiValueLabel: (provided: Object) => ({
      ...provided,
      color: undefined,
      borderRadius: undefined,
      fontSize: undefined,
      padding: undefined,
      paddingLeft: undefined,
    }),
    multiValueRemove: (provided: Object) => ({
      ...provided,
      borderRadius: undefined,
      paddingLeft: undefined,
      paddingRight: undefined,
      color: undefined,
    }),
  };
}
