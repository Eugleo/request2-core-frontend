import Uploady from '@rpldy/uploady';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewProperty, NewRequest } from '../../Request/Request';
import { apiBase } from '../../Utils/ApiBase';
import { File, fileToString } from '../../Utils/File';
import { Maybe } from '../../Utils/Maybe';
import { Cancel, Primary } from '../Buttons';
import { ShortText } from './NewTextField';
import { TeamField } from './RequestInfoFields';

type RequestStub = { title: string; teamId: number };

export type SubmitFunction = (request: RequestStub, properties: NewProperty[]) => Promise<Response>;

export function NewForm({
  children,
  titleChanged,
  submit,
}: {
  children: ReactNode;
  titleChanged: (title: string) => void;
  submit: SubmitFunction;
}): JSX.Element {
  const form = useForm<{ title: string; teamId: string } & Record<string, FieldValue>>({
    mode: 'all',
  });

  const title = form.watch('title');
  titleChanged(title);

  return (
    <Uploady destination={{ url: `${apiBase}/files` }}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(values => onSubmit(values, submit))}
          className="space-y-8"
        >
          <Section title="General information">
            <ShortText q="What should be this request called?" id="title" required />
            <TeamField id="teamId" />
          </Section>
          {children}
          <div className="h-0.5 w-full bg-gray-200" />
          <div className="flex justify-end flex-row w-full space-x-6">
            <Cancel />
            <Primary type="submit">Submit</Primary>
          </div>
        </form>
      </FormProvider>
    </Uploady>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <h2 className="font-medium text-lg">{title}</h2>
      </div>
      <div className="col-span-3">
        <div className="p-6 bg-white  rounded-md shadow-sm space-y-6">{children}</div>
      </div>
    </div>
  );
}

type Selection = { label: string; value: string };
type FieldValue = string | number | Selection | Selection[] | File[];

async function onSubmit(
  data: { title: string; teamId: string } & Record<string, FieldValue>,
  submit: (request: RequestStub, properties: NewProperty[]) => Promise<Response>
) {
  const req: RequestStub = {
    title: data.title,
    teamId: Number.parseInt(data.teamId),
  };
  const props: NewProperty[] = Object.entries(data).reduce(fieldToProperty, []);
  return submit(req, props);
}

function fieldToProperty(acc: NewProperty[], [name, value]: [string, FieldValue]): NewProperty[] {
  if (typeof value === 'string') {
    return acc.concat([{ name, value }]);
  } else if (typeof value === 'number') {
    return acc.concat([{ name, value: value.toString() }]);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return acc.concat([{ name, value: '' }]);
    }

    if ('mime' in value[0]) {
      return acc.concat(
        (value as File[]).map((f, i) => ({ name: `${name}${i}`, value: fileToString(f) }))
      );
    } else if ('label' in value[0]) {
      return acc.concat([{ name, value: (value as Selection[]).map(s => s.value).join(';;;') }]);
    }
  } else if (typeof value === 'object' && 'label' in value) {
    return acc.concat([{ name, value: value.value }]);
  }
  throw new TypeError(`Field -> Property conversion failed: name=${name}, value is above`);
}
