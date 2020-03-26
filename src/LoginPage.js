import React, { useContext, useState } from "react";
import * as Api from "./Api.js";

import { useFormik } from "formik";
import AuthContext from "./Auth.js";
import { Redirect } from "react-router-dom";

export default function LoginPage() {
  let [loginFailed, setLoginFailed] = useState(false);
  let { auth, dispatch } = useContext(AuthContext);

  let formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validate,
    onSubmit: values => verifyLogin(values.email, values.password, dispatch, setLoginFailed)
  });

  if (auth.loggedIn) {
    return <Redirect to="/announcements" />;
  }

  return (
    <div className="max-w-sm w-full mx-auto flex-grow flex flex-col justify-center">
      <h1 className="text-3xl text-black font-bold text-center">Sign in to your account</h1>
      <p className="text-center text-gray-600 mb-6">
        Or{" "}
        <a href="#" className="text-green-700 text-sm hover:text-green-600">
          create a new account
        </a>
      </p>
      <div className="rounded-lg shadow-md bg-white p-6">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          {loginFailed ? (
            <p className="text-red-600 text-xs mb-5">Password or email is incorrect</p>
          ) : null}
          <InputField name="email" label="Email address" formik={formik} />
          <InputField type="password" name="password" label="Password" formik={formik} />
          <a href="#" className="text-green-700 text-sm hover:text-green-600 mb-6">
            Forgot you password?
          </a>
          <button
            type="submit"
            className="bg-green-600 text-white rounded-md py-2 text-sm hover:bg-green-500"
          >
            Log in
          </button>
        </form>
      </div>
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
    <div className="flex flex-col mb-6">
      <label htmlFor={props.name} className="text-sm font-medium text-gray-700 mb-1">
        {props.label}
      </label>
      <input
        type={props.type || "text"}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        {...formikConfig}
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
