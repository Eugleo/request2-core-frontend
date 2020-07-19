import React, { useEffect, useState } from 'react';
// import { Formik, Form } from 'formik';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
// import {InputField} from '../Common/Forms';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';

import MdRender from '../Common/MdRender';

// function validate(values) {
//   const error = {};

//   if (!values.title) {
//     error.title = 'This field is required';
//   }

//   if (!values.body) {
//     error.body = 'This field is required';
//   }

//   return error;
// }

// TODO Implement using Formik
export default function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authDel, authGet, authPut } = useAuth();
  const [ann, setAnn] = useState({ active: null });
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    authGet(`/announcements/${id}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(`Unable to fetch announcement with id: ${id}`);
      })
      .then(js => {
        setAnn(js);
        setBody(js.body);
        setTitle(js.title);
      })
      .catch(() => setAnn(null));
  }, [id, authGet]);

  if (ann === null) {
    return <Navigate to=".." />;
  }

  return (
    <Page title="Edit announcement" width="max-w-2xl">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">Title</span>
        <input
          className="resize-y p-2 border rounded focus:outline-none focus:shadow-outline mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Body</span>
        <textarea
          className="resize-y font-mono text-sm px-2 py-1 border rounded focus:outline-none focus:shadow-outline mb-4 h-48"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Preview</span>
        <MdRender source={body} className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6" />
        <div className="flex mb-4">
          <Button.Primary
            title="Save changes"
            onClick={() => {
              // TODO Handle failure
              authPut(`/announcements/${id}`, {
                ...ann,
                title,
                body,
              }).then(() => navigate('..'));
            }}
          />
          <span className="flex-grow" />
          {ann.active ? (
            <Button.Danger
              title="Deactivate"
              onClick={() => {
                // TODO Add error handling
                authDel(`/announcements/${id}`).then(() => navigate('..'));
              }}
              classNames={['mr-2']}
            />
          ) : (
            <Button.Secondary
              title="Reactivate"
              onClick={() => {
                // TODO Add error handling
                authPut(`/announcements/${id}`, { ...ann, active: true }).then(() =>
                  navigate('..')
                );
              }}
              classNames={['mr-2', 'bg-white']}
            />
          )}

          <Button.Normal title="Cancel" onClick={() => navigate('..')} />
        </div>
      </div>
    </Page>
  );
}
