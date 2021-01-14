import Uploady from '@rpldy/uploady';
import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { apiBase } from '../../Utils/ApiBase';
import { Primary } from '../Buttons';
import { Page } from '../Layout';
import { FileInput } from './NewFile';
import { Option, LongText, MultipleChoice, Question, ShortText, SingleChoice } from './Question';

export function NewForm(): JSX.Element {
  const form = useForm();

  return (
    <Page title="Test">
      <Uploady destination={{ url: `${apiBase}/files` }}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(console.log)}>
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
