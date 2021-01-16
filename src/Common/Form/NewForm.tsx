import Uploady from '@rpldy/uploady';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewProperty, NewRequest } from '../../Request/Request';
import { apiBase } from '../../Utils/ApiBase';
import { useAuth } from '../../Utils/Auth';
import { File, fileToString } from '../../Utils/File';
import { Maybe } from '../../Utils/Maybe';
import { Primary } from '../Buttons';
import { Page } from '../Layout';
import { FileInput } from './NewFile';
import { LongText, ShortText } from './NewTextField';
import { Option, MultipleChoice, Question, SingleChoice } from './Question';
import { TeamField } from './RequestInfoFields';

export function NewForm(): JSX.Element {
  const form = useForm({ mode: 'all' });
  const { authPost } = useAuth();

  const title = form.watch('title', null);

  return (
    <Page title={title ? `New Request: ${title}` : 'New Request'}>
      <Uploady destination={{ url: `${apiBase}/files` }}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(console.log)}>
            <Section title="General information">
              <Question>What should be this request called?</Question>
              <ShortText id="title" required />
              <TeamField id="teamId" />
            </Section>
            <Section title="Scope of the experiment">
              <Question>What type of the analysis do you want to perform?</Question>
              <SingleChoice id="analysisType">
                <Option value="Purified proteins">
                  <Question>How did you purify them?</Question>
                  <ShortText id="purificationMethod" />
                  <Question>No, really, tell us in detail!</Question>
                  <LongText id="purificationMethodDetail" />
                </Option>
                <Option value="Cell lysate">And I, I have chosen this</Option>
                <Option value="Tissue lysate">Wwwwhat?</Option>
              </SingleChoice>
              <Question>Choose one of the following</Question>
              <MultipleChoice required id="analysisTypeOpen">
                <Option value="Purified proteins">
                  <Question>How did you purify them?</Question>
                  <ShortText id="purificationMethod" />
                  <Question>No, really, tell us in detail!</Question>
                  <LongText id="purificationMethodDetail" />
                </Option>
                <Option value="Cell lysate">And I, I have chosen this</Option>
                <Option value="Tissue lysate">Wwwwhat?</Option>
              </MultipleChoice>
              <FileInput required id="analysisFiles" />
            </Section>
            <div className="mt-10">
              <Primary type="submit">Submit</Primary>
            </div>
          </form>
        </FormProvider>
      </Uploady>
    </Page>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-6">
      <h2 className="font-bold text-xl">{title}</h2>
      {children}
    </div>
  );
}

type Selection = { label: string; value: string };
type FieldValue = string | number | Selection | Selection[] | File[];

async function onSubmit(
  requestType: string,
  data: { title: string; teamId: string } & Record<string, FieldValue>,
  submit: (request: NewRequest, properties: NewProperty[]) => Promise<Response>
) {
  const req: NewRequest = {
    title: data.title,
    status: 'Pending',
    teamId: Number.parseInt(data.teamId),
    requestType,
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
  console.log(value);
  throw new TypeError(`Field -> Property conversion failed: name=${name}, value is above`);
}
