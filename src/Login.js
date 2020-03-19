import React, { useContext, useState } from "react";
import * as Api from "./Api.js";

import * as Icon from "react-feather";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";

import { useFormik } from "formik";
import AuthContext from "./AuthContext.js";
import { Redirect } from "react-router-dom";

export default function Login(props) {
  let [loginFailed, setLoginFailed] = useState(false);
  let { state, dispatch } = useContext(AuthContext);

  let formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validate,
    onSubmit: values => verifyLogin(values.email, values.password, dispatch, setLoginFailed)
  });

  if (state.loggedIn) {
    return <Redirect to="/announcements" />;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm={8}>
          <h2>Sign in</h2>
          <hr className="mb-4" />
          <form onSubmit={formik.handleSubmit}>
            {loginFailed ? (
              <Form.Group controlId="formGroupEmail">
                <center className="text-danger">Password or email is incorrect</center>
              </Form.Group>
            ) : null}

            <Form.Group controlId="formGroupEmail">
              <Form.Label>Your email</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <Icon.Mail strokeWidth="1.5px" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputField placeholder="Email" name="email" formik={formik} />
              </InputGroup>
              <ErrorMessage name="email" formik={formik} />
            </Form.Group>

            <Form.Group controlId="formGroupPassword">
              <Form.Label>Your password</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <Icon.Key strokeWidth="1.5px" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputField placeholder="*****" name="password" formik={formik} type="password" />
              </InputGroup>
              <ErrorMessage name="password" formik={formik} />
            </Form.Group>

            <Form.Group controlId="formGroupEmail">
              <center>
                <Button block variant="primary" type="submit">
                  Login
                </Button>
              </center>
            </Form.Group>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

function InputField(props) {
  let formikConfig = {
    value: props.formik.values[props.name],
    onChange: props.formik.handleChange,
    onBlur: props.formik.handleBlur,
    name: props.name
  };

  return (
    <Form.Control
      type={props.type ? props.type : "text"}
      placeholder={props.placeholder}
      {...formikConfig}
    />
  );
}

function ErrorMessage(props) {
  if (props.formik.errors[props.name] && props.formik.touched[props.name]) {
    return <Form.Text className="text-danger">{props.formik.errors[props.name]}</Form.Text>;
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
      authDispatch({
        type: "LOGIN",
        payload: js
      });
    })
    .catch(error => console.log(error));
}
