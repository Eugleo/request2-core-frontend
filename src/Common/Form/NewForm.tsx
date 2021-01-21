import Uploady from '@rpldy/uploady';
import { ReactNode, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { fieldToProperty, FieldValue, groupFiles } from '../../Request/FieldValue';
import { New, Property, PropertyJSON, Request } from '../../Request/Request';
import { Proteomics } from '../../Request/RequestTypes/Proteomics';
import { apiBase } from '../../Utils/ApiBase';
import { WithID } from '../../Utils/WithID';
import { Page } from '../Layout';
import { ShortText } from './NewTextField';
import { TeamField } from './RequestInfoFields';

type RequestStub = { title: string; teamId: number };
type FormValues = { Title: string; TeamId: string } & Record<string, FieldValue>;

export type SubmitFunction = (request: RequestStub, properties: New<Property>[]) => void;

export function NewForm({
  defaultTitle,
  children,
  submit,
  ...props
}: {
  defaultTitle: string;
  children: ReactNode;
  submit: SubmitFunction;
} & (
  | { requestType: string }
  | { request: WithID<Request>; properties: PropertyJSON[] }
)): JSX.Element {
  const defaultValues =
    'request' in props
      ? groupFiles(props.properties).reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {})
      : {};

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues,
  });
  const title = form.watch('Title');

  const requestType = 'requestType' in props ? props.requestType : props.request.requestType;
  let requestForm = null;

  switch (requestType) {
    case 'proteomics':
    case 'lipidomics':
    case 'small molecule':
      requestForm = Proteomics;
  }

  return (
    <Page title={title ? `${defaultTitle}: ${title}` : defaultTitle}>
      <div className="mx-auto">
        <Uploady destination={{ url: `${apiBase}/files` }}>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(values => onSubmit(values, submit))}
              className="space-y-8 max-w-5xl w-full mx-auto"
            >
              <Section title="General information">
                <ShortText q="What should be this request called?" id="Title" required />
                <TeamField id="TeamId" />
              </Section>
              {requestForm}
              <div className="h-0.5 w-full bg-gray-200" />
              <div className="flex justify-end flex-row w-full space-x-6">{children}</div>
            </form>
          </FormProvider>
        </Uploady>
      </div>
    </Page>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <h2 className="font-medium text-lg sticky top-0">{title}</h2>
      </div>
      <div className="col-span-2">
        <div className="p-6 bg-white rounded-md shadow-sm space-y-6">{children}</div>
      </div>
    </div>
  );
}

async function onSubmit(data: FormValues, submit: SubmitFunction) {
  const req: RequestStub = {
    title: data.Title,
    teamId: Number.parseInt(data.TeamId),
  };
  const props: New<Property>[] = Object.entries(data).reduce(fieldToProperty, []);
  submit(req, props);
}
