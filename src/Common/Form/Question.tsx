import c from 'classnames';
import { forwardRef, Fragment, ReactElement, ReactNode } from 'react';
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
function MultiCreatable({ ref, ...props }: any) {
  return <Creatable isMulti ref={ref} {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiSelect({ ref, ...props }: any) {
  return <Select isMulti ref={ref} {...props} />;
}

export function MultipleChoice({
  id,
  children,
  className,
  hasCustom = false,
}: QuestionProps & { children: Choice[]; hasCustom?: boolean }): JSX.Element {
  const { watch } = useFormContext();
  const value = watch(id, null) as { label: string; value: string }[] | null;

  const showChildren = children
    .filter(ch => value && ch.props.children && value.map(v => v.value).includes(ch.props.value))
    .map(ch => ch.props.children);

  return (
    <div>
      <Controller
        name={id}
        defaultValue={[]}
        render={field =>
          hasCustom ? <Creatable isMulti {...field} /> : <Select isMulti {...field} />
        }
        options={children.map(ch => ({
          label: ch.props.label ?? ch.props.value,
          value: ch.props.value,
        }))}
      />
      {showChildren.length > 0 ? <div className="mt-2">{showChildren}</div> : null}
    </div>
  );
}

export function Question({ children }: { children: ReactNode }): JSX.Element {
  return <p className="text-md text-gray-700 font-semibold mb-2">{children}</p>;
}

function SingleChoiceButtons({ id, className, children }: QuestionProps & { children: Choice[] }) {
  const { register } = useFormContext();
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
              ref={register}
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
}: QuestionProps & { children: Choice[]; hasCustom: boolean }) {
  return (
    <Controller
      name={id}
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
  const { watch } = useFormContext();
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
        <SingleChoiceText id={id} className={className} hasCustom={hasCustom}>
          {children}
        </SingleChoiceText>
      ) : (
        <SingleChoiceButtons id={id} className={className}>
          {children}
        </SingleChoiceButtons>
      )}
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
    <div className="flex flex-row items-center px-2 rounded-md hover:bg-gray-200">{children}</div>
  );
}

function ChoiceLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="w-full ml-2 py-1 text-gray-800">
      {children}
    </label>
  );
}

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
  'disabled:text-gray-400 disabled:bg-gray-200 disabled:shadow-none',
];

export function ShortText({ id, className }: QuestionProps): JSX.Element {
  const { register } = useFormContext();
  return (
    <div>
      <input name={id} ref={register} className={c(textFieldClasses, className)} />
    </div>
  );
}

export function LongText({ id, className }: QuestionProps): JSX.Element {
  const { register } = useFormContext();
  return (
    <div>
      <textarea
        name={id}
        ref={register}
        style={{ minHeight: '5rem' }}
        className={c(textFieldClasses, className)}
      />
    </div>
  );
}
