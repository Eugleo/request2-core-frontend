import Uploady from '@rpldy/uploady';
import { ReactNode, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { fieldToProperty, FieldValue } from '../../Request/FieldValue';
import { New, Property, PropertyJSON, Request } from '../../Request/Request';
import { Proteomics } from '../../Request/RequestTypes/Proteomics';
import { getRequestFormForType } from '../../Request/RequestTypes/RequestTypes';
import { apiBase } from '../../Utils/ApiBase';
import { WithID } from '../../Utils/WithID';
import { Card, Page } from '../Layout';
import { ShortText } from './NewTextField';
import { FieldContext, useFieldContext } from './Question';
import { TeamField } from './RequestInfoFields';

type RequestStub = { title: string; teamId: number };
type FormValues = { Title: string; TeamId: string } & Record<string, FieldValue>;

export type SubmitFunction = (request: RequestStub, properties: New<Property>[]) => void;

export function NewForm({
  defaultTitle,
  children,
  submit,
  defaultValues,
  requestType,
  request,
}: {
  defaultTitle: string;
  defaultValues: Record<string, string>;
  children: ReactNode;
  submit: SubmitFunction;
  requestType: string;
  request?: WithID<Request>;
}): JSX.Element {
  const form = useForm<FormValues>({ mode: 'all' });
  const title: string | null = form.watch('Title', request?.title ?? '');

  const state: FieldContext = useMemo(() => ({ state: 'edit', values: defaultValues }), [
    defaultValues,
  ]);

  return (
    <FieldContext.Provider value={state}>
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
                {getRequestFormForType(requestType)}
                <div className="h-0.5 w-full bg-gray-200" />
                <div className="flex justify-end flex-row w-full space-x-6">{children}</div>
              </form>
            </FormProvider>
          </Uploady>
        </div>
      </Page>
    </FieldContext.Provider>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  const { state } = useFieldContext();

  if (state === 'edit') {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="font-medium text-lg sticky top-0">{title}</h2>
        </div>
        <div className="col-span-2">
          <Card>
            <div className="p-6 space-y-6">{children}</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div>
        <h2 className="text-gray-600 text-sm sticky top-0 px-6 py-4 border-b border-gray-100 bg-gray-50">
          {title}
        </h2>
      </div>
      <div className="px-6 pb-6 pt-4 space-y-6">{children}</div>
    </Card>
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

export function Form({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}
