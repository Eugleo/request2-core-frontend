/* eslint-disable react/jsx-handler-names */
import c from 'classnames';
import { Fragment, ReactElement, ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select/';
import Creatable from 'react-select/creatable';
import ReactTooltip from 'react-tooltip';

import { Maybe } from '../../Utils/Maybe';
import { ErrorMessage, Question, QuestionProps, reqRule } from './Question';

type Choice = ReactElement<
  { value: string; children: Maybe<ReactNode>; label: Maybe<string> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

function getStyles(err: Maybe<string>) {
  return {
    control: (provided: Object, state: { isFocused: boolean }) => ({
      ...provided,
      boxShadow: undefined,
      border: undefined,
      borderRadius: undefined,
      borderColor: undefined,
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
            'box-shadow':
              'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
            'border-color': err
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

export function MultipleChoice({
  id,
  children,
  className,
  hasCustom = false,
  required,
  q,
}: QuestionProps & { children: Choice[]; hasCustom?: boolean }): JSX.Element {
  const { watch, errors } = useFormContext();
  const value = watch(id, null) as { label: string; value: string }[] | null;

  const showChildren = children
    .filter(ch => value && ch.props.children && value.map(v => v.value).includes(ch.props.value))
    .map(ch => ch.props.children);

  const options = children.map(ch => ({
    label: ch.props.label ?? ch.props.value,
    value: ch.props.value,
  }));

  const err = errors[id]?.message;

  return (
    <div>
      <div className="flex flex-row space-x-2 items-center mb-2">
        <p className="text-md text-gray-700 font-semibold text-sm">{q}</p>
        {hasCustom ? <Icon.Codepen className="text-green-400 w-4" /> : null}
      </div>
      <Controller
        name={id}
        defaultValue={[]}
        rules={{
          validate: (val: { label: string; value: string }[] | null) =>
            !required ||
            (val !== null && val.length > 0) ||
            'You have to choose at least one option',
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
      {showChildren.length > 0 ? <div className="mt-6 space-y-6">{showChildren}</div> : null}
    </div>
  );
}

export function SingleChoice({
  id,
  children,
  hasCustom = false,
  isText,
  className,
  required,
  q,
}: QuestionProps & { children: Choice[]; hasCustom?: boolean; isText?: boolean }): JSX.Element {
  const { watch, errors } = useFormContext();
  const err = errors[id]?.message;
  const value = watch(id) as string | { label: string; value: string } | null;

  const showChildren = children
    .filter(ch => {
      if (typeof value === 'string') {
        return value === ch.props.value && ch.props.children;
      } else if (value) {
        return value.value === ch.props.value;
      }
    })
    .map(ch => ch.props.children);

  return (
    <div>
      <CreatableQuestion q={q} hasCustom={hasCustom} />
      {hasCustom || isText || (isText === undefined && children.length >= 4) ? (
        <SingleChoiceText id={id} required={required} className={className} hasCustom={hasCustom}>
          {children}
        </SingleChoiceText>
      ) : (
        <SingleChoiceButtons id={id} required={required} className={className}>
          {children}
        </SingleChoiceButtons>
      )}
      <ErrorMessage error={err} />
      {showChildren.length > 0 ? <div className="mt-6 space-y-6">{showChildren}</div> : null}
    </div>
  );
}

function SingleChoiceButtons({
  id,
  className,
  children,
  required = false,
}: QuestionProps & { children: Choice[] }) {
  const { register, errors } = useFormContext();

  const err: Maybe<string> = errors[id]?.message;

  return (
    <div>
      {children.map(ch => (
        <Fragment key={ch.props.value}>
          <ChoiceField>
            <input
              name={id}
              id={ch.props.value}
              value={ch.props.value}
              type="radio"
              ref={register(reqRule(required, 'You have to choose an option'))}
              className={c(err && 'bg-red-100 border-red-400', 'text-green-500')}
            />
            <ChoiceLabel htmlFor={ch.props.value}>{ch.props.label ?? ch.props.value}</ChoiceLabel>
          </ChoiceField>
        </Fragment>
      ))}
    </div>
  );
}

function SingleChoiceText({
  id,
  className,
  children,
  hasCustom,
  required = false,
}: QuestionProps & { children: Choice[]; hasCustom: boolean }) {
  const { errors } = useFormContext();
  const err = errors[id]?.message;
  return (
    <Controller
      name={id}
      rules={reqRule(required, 'You have to choose an option')}
      as={
        hasCustom ? (
          <Creatable
            className="react-select"
            classNamePrefix={err ? 'react-select-error' : 'react-select'}
            styles={getStyles(err)}
          />
        ) : (
          <Select
            className="react-select"
            classNamePrefix={err ? 'react-select-error' : 'react-select'}
            styles={getStyles(err)}
          />
        )
      }
      options={children.map(ch => ({
        label: ch.props.label ?? ch.props.value,
        value: ch.props.value,
      }))}
    />
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

function CreatableQuestion({ hasCustom, q }: { q?: string; hasCustom: boolean }) {
  return (
    <div className="flex flex-row space-x-2 items-center mb-2">
      <p className="text-md text-gray-700 font-semibold text-sm">{q}</p>
      {hasCustom ? (
        <>
          <Icon.Box className="text-green-400 w-3.5" data-tip="You can enter your own option" />
          <ReactTooltip
            type="light"
            effect="solid"
            backgroundColor="rgba(243, 244, 246, 1)"
            className="white-tooltip"
          />
        </>
      ) : null}
    </div>
  );
}
