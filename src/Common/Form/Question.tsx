import c from 'classnames';
import { Fragment, ReactElement, ReactNode } from 'react';
import * as Icon from 'react-feather';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { Maybe } from '../../Utils/Maybe';

type Choice = ReactElement<
  { value: string; children: Maybe<ReactNode>; label: Maybe<string> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

export type QuestionProps = { id: string; className?: string; required?: boolean };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiValueRemove(props: any) {
  return (
    // eslint-disable-next-line react/jsx-handler-names

    <button
      className="transition-colors text-gray-400 pl-1 pr-2 hover:text-gray-500 bg-gray-200 hover:text-gray-500 rounded-r-full"
      onClick={props.innerProps.onClick}
      onMouseDown={props.innerProps.onMouseDown}
      onTouchEnd={props.innerProps.onTouchEnd}
    >
      <Icon.X className="w-4" />
    </button>
  );
}

export function MultipleChoice({
  id,
  children,
  className,
  hasCustom = false,
  required,
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
              classNamePrefix="request-select"
              {...field}
              options={options}
              className="border-red-500 border-red-300"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: state.isFocused ? 'none' : provided.border,
                  borderColor: '#f56565',
                  '&:hover': {
                    borderColor: '#f56565',
                  },
                }),
              }}
            />
          ) : (
            <Select
              isMulti
              {...field}
              options={options}
              classNamePrefix={err ? 'request-select-error' : 'request-select'}
              components={{ MultiValueRemove }}
              styles={{
                control: (provided, state) => ({
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
                valueContainer: provided => ({ ...provided, padding: undefined }),
                multiValue: provided => ({
                  ...provided,
                  borderRadius: undefined,
                  backgroundColor: undefined,
                  borderWidth: undefined,
                }),
                multiValueLabel: provided => ({
                  ...provided,
                  color: undefined,
                  borderRadius: undefined,
                  fontSize: undefined,
                  padding: undefined,
                  paddingLeft: undefined,
                }),
                multiValueRemove: provided => ({
                  ...provided,
                  borderRadius: undefined,
                  paddingLeft: undefined,
                  paddingRight: undefined,
                  color: undefined,
                }),
              }}
            />
          )
        }
      />
      <ErrorMessage error={err} />
      {showChildren.length > 0 ? <div className="mt-2">{showChildren}</div> : null}
    </div>
  );
}

export function ErrorMessage({ error }: { error: Maybe<string> }): JSX.Element | null {
  if (error) {
    return (
      <div className="flex items-center mt-1">
        <span className="mr-1">
          <Icon.AlertCircle className="w-4 text-red-600" />
        </span>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }
  return null;
}

export function Question({ children }: { children: ReactNode }): JSX.Element {
  return <p className="text-md text-gray-700 font-semibold mb-2">{children}</p>;
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

export function reqRule(
  required: boolean,
  msg = 'This field is required'
): {} | { required: string } {
  return required ? { required: msg } : {};
}

function SingleChoiceText({
  id,
  className,
  children,
  hasCustom,
  required = false,
}: QuestionProps & { children: Choice[]; hasCustom: boolean }) {
  return (
    <Controller
      name={id}
      rules={reqRule(required, 'You have to choose an option')}
      as={hasCustom ? Creatable : Select}
      options={children.map(ch => ({
        label: ch.props.label ?? ch.props.value,
        value: ch.props.value,
      }))}
    />
  );
}

export function SingleChoice({
  id,
  children,
  hasCustom = false,
  isText,
  className,
  required,
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
      {showChildren.length > 0 ? <div className="mt-2">{showChildren}</div> : null}
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

function ChoiceField({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center px-2 rounded-md hover:bg-gray-100">{children}</div>
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
