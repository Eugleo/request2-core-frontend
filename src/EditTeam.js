import React, { useContext, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./Forms.js";
import Page from "./Page";

import AuthContext from "./Auth";
import { useRouteMatch, Redirect } from "react-router-dom";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";

export default function EditTeam() {
  let match = useRouteMatch();
  let id = match.params["id"];
  let { auth } = useContext(AuthContext);
  let [shouldRedirect, setShouldRedirect] = useState(false);
  let [team, setTeam] = useState({ name: "", code: "" });

  useEffect(() => {
    Api.get(`/teams/${id}`, { headers: { Authorization: auth.user.apiKey } })
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error(`Unable to fetch team with id: ${id}`);
        }
      })
      .then(js => setTeam(js.data))
      .catch(() => setTeam(null));
  }, [id]);

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
          initialValues={{ name: "", code: "" }}
          validate={validate}
          onSubmit={values => {
            // TODO Add error handling
            Api.put(`/teams/${id}`, { ...team, ...values }, { Authorization: auth.user.apiKey });
            setShouldRedirect(true);
          }}
        >
          <Form className="flex flex-col items-start">
            <InputField
              name="name"
              initValue={team.name || ""}
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Team leader"
            />
            <InputField
              name="code"
              initValue={team.code || ""}
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Institutional code"
            />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.Primary type="submit" title="Save changes" />
              <div className="flex">
                {team.active ? (
                  <Button.Danger
                    title="Deactivate"
                    onClick={() => {
                      // TODO Add error handling
                      Api.del(`/teams/${id}`, { headers: { Authorization: auth.user.apiKey } });
                      setShouldRedirect(true);
                    }}
                    className="mr-2"
                  />
                ) : (
                  <Button.Secondary
                    title="Reactivate"
                    onClick={() => {
                      // TODO Add error handling
                      Api.put(
                        `/teams/${id}`,
                        { ...team, active: true },
                        { Authorization: auth.user.apiKey }
                      );
                      setShouldRedirect(true);
                    }}
                    className="mr-2"
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

function validate(values) {
  let error = {};

  if (!values.name) {
    error.name = "This field is required";
  }

  if (!values.code) {
    error.code = "This field is required";
  }

  return error;
}
