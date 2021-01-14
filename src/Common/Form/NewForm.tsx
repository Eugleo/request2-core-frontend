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
import { Option, LongText, MultipleChoice, Question, ShortText, SingleChoice } from './Question';

export function NewForm(): JSX.Element {
  const form = useForm();
  const { authPost } = useAuth();

  return (
    <Page title="Test">
      <Uploady destination={{ url: `${apiBase}/files` }}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Section title="Scope of the experiment">
              <div className="bg-yellow-200">
                <Question>What type of the analysis do you want to perform?</Question>
              </div>
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
              <MultipleChoice id="analysisTypeOpen">
                <Option value="Purified proteins">
                  <Question>How did you purify them?</Question>
                  <ShortText id="purificationMethod" />
                  <Question>No, really, tell us in detail!</Question>
                  <LongText id="purificationMethodDetail" />
                </Option>
                <Option value="Cell lysate">And I, I have chosen this</Option>
                <Option value="Tissue lysate">Wwwwhat?</Option>
              </MultipleChoice>
              <FileInput id="analysisFiles" />
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
  data: { title: string; teamId: number } & Record<string, FieldValue>,
  submit: (request: NewRequest, properties: NewProperty[]) => Promise<Response>
) {
  const req: NewRequest = {
    title: data.title,
    status: 'Pending',
    teamId: data.teamId,
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
