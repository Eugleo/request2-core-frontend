import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./Forms.js";
import Page from "./Page";

import AuthContext from "./Auth";
import { Redirect } from "react-router-dom";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";

// TODO Change submit to Api.put
export default function NewTeam() {
  let { auth } = useContext(AuthContext);
  let [shouldRedirect, setShouldRedirect] = useState(false);

  if (shouldRedirect) {
    return <Redirect to="/teams" />;
  }

  return (
    <Page title="New team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: "", code: "" }}
          validate={validate}
          onSubmit={values =>
            Api.post("/teams", { ...values, active: true }, { Authorization: auth.user.apiKey })
          }
        >
          <Form className="flex flex-col items-start">
            <InputField name="name" label="Team leader" />
            <InputField name="code" label="Institutional code" />
            <div className="flex justify-between w-full items-stretch pt-3">
              <Button.Primary title="Add new team" type="submit" />
              <Button.Normal title="Cancel" onClick={() => setShouldRedirect(true)} />
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
