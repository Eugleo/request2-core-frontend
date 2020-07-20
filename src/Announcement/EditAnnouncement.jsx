import React, { useEffect, useState } from 'react';
// import { Formik, Form } from 'formik';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
// import {InputField} from '../Common/Forms';
import { Formik, Form, useField } from 'formik';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';

import MdRender from '../Common/MdRender';
import { ShortText, LongText } from '../Common/Forms';
import { useGet } from '../Utils/Api';

function validate(values) {
  const error = {};

  if (!values.title) {
    error.title = 'This field is required';
  }

  if (!values.body) {
    error.body = 'This field is required';
  }

  return error;
}

// TODO Implement using Formik
export default function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authDel, authPut } = useAuth();
  const ann = useGet(`/announcements/${id}`, { active: null, title: '', body: '' });

  if (ann === null) {
    return <Navigate to=".." />;
  }
  if (ann && ann.title === '') {
    return <Page title="Edit announcement" width="max-w-2xl" />;
  }

  // TODO Handle failure
  return (
    <Page title="Edit announcement" width="max-w-2xl">
      <Formik
        initialValues={{ body: ann.body, title: ann.title }}
        onSubmit={values => {
          authPut(`/announcements/${id}`, {
            ...ann,
            title: values.title,
            body: values.body,
          }).then(() => navigate(-1));
        }}
        validate={validate}
        validateOnChange
      >
        {({ values }) => (
          <Form>
            <ShortText name="title" label="Title" />
            <LongText name="body" label="Body" className="font-mono text-sm mb-4 h-56" />

            <span className="text-sm text-gray-600 mb-1">Preview</span>
            <MdRender
              source={values.body}
              className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6"
            />

            <div className="flex mb-4">
              <Button.PrimarySubmit title="Save changes" />
              <span className="flex-grow" />
              {ann.active ? (
                <Button.Danger
                  title="Deactivate"
                  onClick={() => {
                    // TODO Add error handling
                    authDel(`/announcements/${id}`).then(() => navigate(-1));
                  }}
                  classNames={['mr-2']}
                />
              ) : (
                <Button.Secondary
                  title="Reactivate"
                  onClick={() => {
                    // TODO Add error handling
                    authPut(`/announcements/${id}`, { ...ann, active: true }).then(() =>
                      navigate(-1)
                    );
                  }}
                  classNames={['mr-2', 'bg-white']}
                />
              )}
              <Button.Normal title="Cancel" onClick={() => navigate(-1)} />
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
}
