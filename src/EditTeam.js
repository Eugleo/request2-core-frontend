import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import Page from "./Page";

import * as Icon from "react-feather";
import AuthContext from "./Auth";
import { useRouteMatch } from "react-router-dom";
import * as Api from "./Api.js";

// TODO Fix setValue in formik (maybe change the form to Formik)
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
      .catch(e => console.log(e));
  }, [id]);

  return (
    <Page title="Edit team" width="max-w-2xl">
      <TeamForm team={team} />
    </Page>
  );
}

function validate(name, code) {
  return true;
}

function TeamForm(props) {
  let formik = useFormik({
    initialValues: {
      name: props.team.name,
      code: props.team.code || ""
    },
    validate,
    onSubmit: values => {
      console.log(values);
    }
  });

  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <form onSubmit={formik.handleSubmit} className="flex flex-col items-start">
        <InputField name="name" label="Team leader" value={props.team.name} formik={formik} />
        <InputField
          name="code"
          label="Institutional code"
          value={props.team.code}
          formik={formik}
        />
        <div className="flex justify-between w-full items-stretch pt-3">
          <button
            type="submit"
            className="bg-green-600 text-white shadow-md rounded-md px-4 py-2 text-sm hover:bg-green-500 focus:outline-none"
          >
            Save changes
          </button>
          <button className="text-red-600 border-red-400 border-2 text-white rounded-md shadow-md px-2 py-2 text-sm hover:text-red-400 flex focus:outline-none items-center">
            <Icon.Trash2 className="text-red-400 mr-1 h-5 stroke-2" /> Deactivate
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField(props) {
  let formikConfig = {
    value: props.formik.values[props.name],
    onChange: props.formik.handleChange,
    onBlur: props.formik.handleBlur
  };

  return (
    <div className="flex flex-col mb-6 w-full">
      <label htmlFor={props.name} className="text-sm font-medium text-gray-700 mb-1">
        {props.label}
      </label>
      <input
        type={props.type || "text"}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        {...formikConfig}
        value={props.value}
        className={
          "shadow-sm border text-sm border-gray-300 text-gray-900 rounded-md py-1 px-2 " +
          "focus:outline-none focus:shadow-outline-blue focus:border-blue-600 focus:z-10 font-normal"
        }
      />
      <ErrorMessage name="email" name={props.name} formik={props.formik} />
    </div>
  );
}

function ErrorMessage(props) {
  if (props.formik.errors[props.name] && props.formik.touched[props.name]) {
    return <p className="mt-1 text-red-600 text-xs">{props.formik.errors[props.name]}</p>;
  } else {
    return null;
  }
}
