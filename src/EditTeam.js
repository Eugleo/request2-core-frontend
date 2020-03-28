import React, { useContext, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./Forms.js";
import Page from "./Page";

import * as Icon from "react-feather";
import AuthContext from "./Auth";
import { useRouteMatch, Redirect } from "react-router-dom";
import * as Api from "./Api.js";

// TODO Change submit to Api.put
export default function EditTeam() {
  let match = useRouteMatch();
  let id = match.params["id"];
  let { auth } = useContext(AuthContext);
  let [team, setTeam] = useState({ name: "", code: "" });

  useEffect(() => {
    Api.get("/teams/" + id, { headers: { Authorization: auth.user.apiKey } })
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

  return (
    <Page title="Edit team" width="max-w-2xl">
      <div className="bg-white rounded-md shadow-sm p-6">
        <Formik
          initialValues={{ name: "", code: "" }}
          validate={validate}
          onSubmit={values => console.log(values)}
        >
          <Form className="flex flex-col items-start">
            <InputField
              name="name"
              initValue={team.name || ""}
              onClick={obj => obj.target.setSelectionRange(0, obj.target.value.length)}
              label="Team leader"
            />
            <InputField name="code" initValue={team.code || ""} label="Institutional code" />
            <div className="flex justify-between w-full items-stretch pt-3">
              <button
                type="submit"
                className="bg-green-600 text-white shadow-md rounded-md px-4 py-2 text-sm hover:bg-green-500 focus:outline-none"
              >
                Save changes
              </button>
              <button
                onClick={() =>
                  Api.del(`${match.path}/${id}`, { headers: { Authorization: auth.user.apiKey } })
                }
                className="text-red-600 border-red-400 border text-white rounded-md shadow-md px-2 py-2 text-sm hover:text-red-400 flex focus:outline-none items-center"
              >
                <Icon.Trash2 className="text-red-400 mr-1 h-5 stroke-2" /> Deactivate
              </button>
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
