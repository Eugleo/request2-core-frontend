import { Form, Formik } from 'formik';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { LongText, ShortText } from '../Common/Forms';
import { Card, Page } from '../Common/Layout';
import Markdown from '../Common/MdRender';
import { Announcement } from './Announcement';

type AnnStub = { title: string; body: string };

function validate(values: AnnStub) {
  const error: { title?: string; body?: string } = {};

  if (!values.title) {
    error.title = 'This field is required';
  }

  if (!values.body) {
    error.body = 'This field is required';
  }

  return error;
}

// TODO Handle failure
export default function AnnouncementForm({
  title,
  ann,
  onSubmit,
  children,
}: {
  title: string;
  ann?: Announcement;
  onSubmit: (values: AnnStub) => Promise<Response>;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <Page title={title}>
      <Formik
        initialValues={{ body: ann?.body || '', title: ann?.title || '' }}
        onSubmit={values => {
          onSubmit(values)
            .then(() => navigate(-1))
            .catch(console.log);
        }}
        validate={validate}
        validateOnChange
      >
        {({ values }) => (
          <Form className="grid grid-cols-2 gap-8">
            <Card
              style={{ gridTemplateRows: 'auto 1fr auto' }}
              className="grid grid-rows-3 px-6 py-3"
            >
              <ShortText path="title" label="Title" />
              <LongText path="body" label="Body" className="font-mono text-sm mb-4 h-full" />
              <div className="flex flex-row mb-4">{children}</div>
            </Card>
            <div>
              <span className="text-sm text-gray-600 mb-1">Preview</span>
              <Markdown
                source={values.body}
                className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6"
              />
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
}
