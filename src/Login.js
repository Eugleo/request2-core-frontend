import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { Link, useRouteMatch, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { useFormik } from "formik";

function InputField(props) {
  let formikConfig = {
    value: props.formik.values[props.name],
    onChange: props.formik.handleChange,
    onBlur: props.formik.handleBlur,
    name: props.name
  };

  return (
    <>
      <Form.Control
        type={props.type ? props.type : "text"}
        placeholder={props.placeholder}
        {...formikConfig}
      />
      {props.formik.errors[props.name] && props.formik.touched[props.name] ? (
        <Form.Text className="text-danger">{props.formik.errors[props.name]}</Form.Text>
      ) : null}
    </>
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

function verifyLogin(email, password) {
  console.log(JSON.stringify({ email, password }));
  return Api.post("/login", { email, password })
    .then(r => {
      console.log(r);
      if (r.ok) {
        return r.json();
      } else {
        throw new Error("Incorrect email+password combination");
      }
    })
    .then(js => {
      console.log(js);
    })
    .catch(error => console.log(error));
}

export default function Login(props) {
  let formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validate,
    onSubmit: values => verifyLogin(values.email, values.password)
  });

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm={8}>
          <form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <InputField placeholder="Enter email" name="email" formik={formik} />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <InputField placeholder="Enter password" name="password" formik={formik} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
