import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { InputField } from '../Common/Forms';
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
  const match = useRouteMatch();
  // @ts-ignore
  const { id } = match.params;
  const { authGet, authPut, authDel } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [team, setTeam] = useState({ name: '', code: '', active: true });

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
    return <Redirect to="/404" />;
  }

  if (shouldRedirect) {
    return <Redirect to="/teams" />;
  }

  return (
    <Page title="Edit team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: '', code: '' }}
          validate={validate}
          onSubmit={values => {
            // TODO Add error handling
            authPut(`/teams/${id}`, { ...team, ...values });
            setShouldRedirect(true);
          }}
        >
          <Form className="flex flex-col items-start">
            <InputField
              name="name"
              initValue={team.name || ''}
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Team leader"
            />
            <InputField
              name="code"
              initValue={team.code || ''}
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
                      setShouldRedirect(true);
                    }}
                    classNames={['mr-2']}
                  />
                ) : (
                  <Button.Secondary
                    title="Reactivate"
                    onClick={() => {
                      // TODO Add error handling
                      authPut(`/teams/${id}`, { ...team, active: true });
                      setShouldRedirect(true);
                    }}
                    classNames={['mr-2']}
                  />
                )}
                <Button.Normal title="Cancel" onClick={() => setShouldRedirect(true)} />
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </Page>
  );
}
