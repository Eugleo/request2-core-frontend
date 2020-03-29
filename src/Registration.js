
import React, { useState } from "react";
import { AtomSpinner } from "react-epic-spinners";
import * as Api from "./Api.js";

import { Formik, Form, Field } from "formik";
import { CenteredPage } from "./Page.js";
import { InputField } from "./Forms.js";
import { Link, useParams } from "react-router-dom";

import * as Button from "./Buttons.js";

function validate(values) {
  const errors = {};
  if (!values.email) {
    //TODO check e-maility of the e-mail
    errors.email = "This field is required";
  }
  return errors;
}

export function NewRegistrationPage() {
  let [regState, setState] = useState('init')
  
  return <CenteredPage title="New registration" width="max-w-md">
    <Formik
      initialValues={{ email: "" }}
      validate={validate}
      onSubmit={ values => {
        setState('loading');
        Api.post('/register-init', {email:values.email})
        .then(r => {
          if(r.ok) setState('success');
          else throw new Error("register-init failed");
        })
        .catch(e => {
          setState('problem');
          console.log(e);
        });
      }}>
      <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
        {regState === 'success'
        ? <p className="text-green-600 mb-5">
            Registration started correctly! Please check your mailbox for an activation e-mail.
          </p>
        : <>
          <InputField name="email" label="Email address" />
          { regState === 'loading'
          ? <center><AtomSpinner /></center>
          : <Button.Primary title="Register" type="submit" /> }
          { regState === 'problem'
          && <p className="text-red-600 mb-5">
               Something went wrong.
               If the problem persists, contact the administrator.
             </p> }
        </> }
      </Form>
    </Formik>
  </CenteredPage>;
}

export function RegisterPage() {
  let {email, token} = useParams();
  let [regState, setState] = useState('init')

  return <CenteredPage title="Registration" width="max-w-md">
    <Formik
      initialValues={{ email: email,
        token: token,
        name: "",
        password: "",
        passwordCheck: "",
        team: 1}}
      validate={values=>{
        let errors = {};
        if (!values.email)
          errors.email = "This field is required"; //should not happen but whatever
        
        if (!values.password)
          errors.password = "Password is required";
        else if(values.password.length < 8)
          errors.password = "Please use a reasonably long password";
        if (values.password &&  values.passwordCheck &&
            values.password !== values.passwordCheck)
          errors.passwordCheck = "Passwords do not match";

        if (!values.name)
          errors.name = "User name is required";
        if (values.name && (values.name.length < 3 || values.name.split(' ').length < 2))
          errors.name = "Please provide full name and surname";
        return errors;
      }}
      onSubmit={ values=> {
        setState('loading');
        Api.post('/register', values)
        .then(r => {
          if(r.ok) setState('success');
          else throw new Error("register failed");
        })
        .catch(e => {
          setState('problem');
          console.log(e);
        })
      }}>
      <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
        { regState === 'success'
        ? <p className="text-green-600 mb-5">
            Registration finished correctly!
            You can now <Link to="/login">log in</Link>.
          </p>
        : <>
          <InputField name="email" label="Email address" disabled={true} />
          <Field name="token" type="hidden" />
          <InputField name="name" label="User name" placeholder="Name Surname" />
          <InputField name="team" label="Team ID" disabled={true} />
          <InputField name="password" type="password" label="Password" />
          <InputField name="passwordCheck" type="password" label="Password (again)" />
          { regState === 'loading'
          ? <center><AtomSpinner /></center>
          : <Button.Primary title="Finish registration" type="submit" /> }
          { regState === 'problem'
          && <p className="text-red-600 mb-5">
               Something went wrong.
               If the problem persists, contact the administrator.
             </p> }
        </> }
      </Form>
    </Formik>
  </CenteredPage>;
}
