import React, { useContext, useState } from "react";
import * as Api from "./Api.js";

import { Formik, Form } from "formik";
import { CenteredPage } from "./Page.js";
import { InputField } from "./Forms.js";
import AuthContext from "./Auth.js";
import { Redirect } from "react-router-dom";

import * as Button from "./Buttons.js";

export default function LoginPage() {
  let [loginFailed, setLoginFailed] = useState(false);
  let { auth, dispatch } = useContext(AuthContext);

  if (auth.loggedIn) {
    return <Redirect to="/announcements" />;
  }

  return (
    <CenteredPage title="Log in to your account" width="max-w-md">
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validate={validate}
        onSubmit={values => verifyLogin(values.email, values.password, dispatch, setLoginFailed)}
      >
        <Form className="rounded-lg shadow-md bg-white p-6 flex flex-col">
          {loginFailed ? (
            <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
          ) : null}
          <InputField name="email" label="Email address" />
          <InputField type="password" name="password" label="Password" />
          <a href="#" className="text-green-700 text-sm hover:text-green-600 mb-6">
            Forgot you password?
          </a>
          <Button.Primary title="Log in" type="submit" />
        </Form>
      </Formik>
    </CenteredPage>
  );
}

function validate(values) {
  const errors = {};
  if (!values.email) {
    errors.email = "This field is required";
  }

  if (!values.password) {
    errors.password = "This field is required";
  }

  return errors;
}

async function verifyLogin(email, password, authDispatch, setFailed) {
  return await Api.post("/login", { email, password })
    .then(r => {
      if (r.ok) {
        setFailed(false);
        return r.json();
      } else {
        setFailed(true);
        throw new Error("Incorrect email and/or password");
      }
    })
    .then(js => {
      getUserInfo(js.apiKey).then(userDetails => {
        console.log({ ...js, user: userDetails });
        authDispatch({
          type: "LOGIN",
          payload: { ...js, ...userDetails }
        });
      });
    })
    .catch(error => console.log(error));
}

async function getUserInfo(apiKey) {
  return await Api.get("/me", { headers: { Authorization: apiKey } })
    .then(r => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error("Failed to retrieve user by api key");
      }
    })
    .then(js => js)
    .catch(error => console.log(error));
}
