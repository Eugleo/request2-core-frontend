import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { ShortText } from '../Common/Forms';
import Page from '../Page/Page';

import { useAuth } from '../Utils/Auth';
import * as Button from '../Common/Buttons';

function validate(values) {
  const error = {};

  if (!values.name) {
    error.name = 'This field is required';
  }

  if (!values.code) {
    error.code = 'This field is required';
  }

  return error;
}

export default function EditTeam() {
  const { id } = useParams();
  const { authGet, authPut, authDel } = useAuth();
  const [team, setTeam] = useState({ name: '', code: '', active: false });
  const navigate = useNavigate();

  useEffect(() => {
    authGet(`/teams/${id}`)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
        throw new Error(`Unable to fetch team with id: ${id}`);
      })
      .then(js => setTeam(js))
      .catch(() => setTeam(null));
  }, [id, authGet]);

  if (team === null) {
    return navigate('/404');
  }
  if (team.name === '') {
    return <Page title="Edit team" width="max-w-2xl" />;
  }

  return (
    <Page title="Edit team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: team.name || '', code: team.code || '' }}
          validate={validate}
          onSubmit={values => {
            // TODO Add error handling
            authPut(`/teams/${id}`, { ...team, ...values });
            navigate('..');
          }}
        >
          <Form className="flex flex-col items-start">
            <ShortText
              name="name"
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Team leader"
            />
            <ShortText
              name="code"
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Institutional code"
            />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.PrimarySubmit title="Save changes" />
              <div className="flex">
                {team.active ? (
                  <Button.Danger
                    title="Deactivate"
                    onClick={() => {
                      // TODO Add error handling
                      authDel(`/teams/${id}`);
                      navigate('..');
                    }}
                    classNames={['mr-2']}
                  />
                ) : (
                  <Button.Secondary
                    title="Reactivate"
                    onClick={() => {
                      // TODO Add error handling
                      authPut(`/teams/${id}`, { ...team, active: true });
                      navigate('..');
                    }}
                    classNames={['mr-2']}
                  />
                )}
                <Button.Normal title="Cancel" onClick={() => navigate('..')} />
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
