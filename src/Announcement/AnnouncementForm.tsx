import { Form, Formik } from 'formik';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { LongTextInput, ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Card, Page } from '../Common/Layout';
import { Markdown } from '../Common/MdRender';
import { Announcement } from './Announcement';

type AnnStub = { title: string; body: string };

// TODO Handle failure
export function AnnouncementForm({
  title,
  ann,
  onSubmit,
  children,
}: {
  title: string;
  ann?: Announcement;
  onSubmit: (values: AnnStub) => Promise<Response>;
  children: ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  const { register, errors, handleSubmit, watch } = useForm({
    defaultValues = { title: ann?.title ?? '', body: ann?.body ?? '' },
  });
  const body = watch('body');
  return (
    <Page title={title}>
      <form
        className="grid grid-cols-2 gap-8"
        onSubmit={handleSubmit(async values => {
          await onSubmit(values);
          navigate(-1);
        })}
      >
        <Card style={{ gridTemplateRows: 'auto 1fr auto' }} className="grid grid-rows-3 px-6 py-3">
          <Question>The title of the announcement</Question>
          <ShortTextInput name="title" ref={register(reqRule(true))} errors={errors} />
          <Question>The announcement itself</Question>
          <LongTextInput
            name="body"
            ref={register(reqRule(true))}
            className="font-mono mb-4 h-full"
            errors={errors}
          />
          <div className="flex flex-row mb-4">{children}</div>
        </Card>
        <div>
          <span className="text-sm text-gray-600 mb-1">Preview</span>
          <Markdown
            source={body}
            className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6"
          />
        </div>
      </form>
    </Page>
  );
}
