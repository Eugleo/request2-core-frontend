import Uploady from '@rpldy/uploady';
import { ReactNode, useMemo, useState } from 'react';
import { AlertTriangle, Info } from 'react-feather';
import { FormProvider, useForm } from 'react-hook-form';

import { fieldToProperty, FieldValue } from '../../Request/FieldValue';
import { New, Property, PropertyJSON, Request } from '../../Request/Request';
import { Proteomics } from '../../Request/RequestTypes/Proteomics';
import { getRequestFormForType } from '../../Request/RequestTypes/RequestTypes';
import { apiBase } from '../../Utils/ApiBase';
import { useAuth } from '../../Utils/Auth';
import { WithID } from '../../Utils/WithID';
import { Body, Card, ContentWrapper, Header, Page, Title } from '../Layout';
import { ShortText } from './NewTextField';
import { FieldContext, useFieldContext, Warning } from './Question';
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
  const { auth } = useAuth();
  const form = useForm<FormValues>({ mode: 'all' });
  const title: string | null = form.watch('Title', request?.title ?? '');

  const state: FieldContext = useMemo(() => ({ state: 'edit', values: defaultValues }), [
    defaultValues,
  ]);

  if (auth.user.teams.length === 0) {
    return (
      <Page title="Error: No research group">
        <div className="bg-white rounded-md border border-yellow-300 overflow-hidden">
          <div className="flex bg-yellow-100 px-3 py-2 items-center">
            <AlertTriangle className="text-yellow-900 w-5 mr-2" />
            <h3 className="font-medium text-sm text-yellow-900">Beware!</h3>
          </div>
          <div className="p-4 text-sm text-gray-700">
            <p>
              You have to be assigned a research group before you'll be able to create requests.
            </p>
          </div>
        </div>
      </Page>
    );
  }

  console.log(form.errors);

  return (
    <FieldContext.Provider value={state}>
      <ContentWrapper>
        <div className="max-w-4xl mx-auto w-full">
          <Header>
            <Title>{title ? `${defaultTitle}: ${title}` : defaultTitle}</Title>
          </Header>
          <Body>
            <Uploady destination={{ url: `${apiBase}/files` }}>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(values => onSubmit(values, submit))}
                  className="space-y-8"
                >
                  <Section title="General information">
                    <ShortText q="What should be this request called?" id="Title" required />
                    <TeamField id="TeamId" />
                  </Section>
                  {getRequestFormForType(requestType)}
                  <div className="h-0.5 w-full bg-gray-200" />
                  <div className="flex justify-end flex-row w-full space-x-6 relative">
                    {children}
                  </div>
                </form>
              </FormProvider>
            </Uploady>
          </Body>
        </div>
      </ContentWrapper>
    </FieldContext.Provider>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  const { state } = useFieldContext();

  if (state === 'edit') {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="font-medium text-lg sticky top-3">{title}</h2>
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
