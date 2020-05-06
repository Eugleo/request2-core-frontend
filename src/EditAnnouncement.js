import React, { useContext, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { InputField } from "./Forms.js";
import Page from "./Page";

import AuthContext from "./Auth";
import { useRouteMatch, Redirect } from "react-router-dom";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";

import MdRender from "./MdRender.js";

export default function EditAnnouncement() {
  let match = useRouteMatch();
  let id = match.params["id"];
  let { auth } = useContext(AuthContext);
  let [shouldRedirect, setShouldRedirect] = useState(false);
  let [ann, setAnn] = useState({});
  let [title, setTitle] = useState("");
  let [body, setBody] = useState("");

  useEffect(() => {
    Api.get(`/announcement/${id}`, { headers: { Authorization: auth.user.apiKey } })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error(`Unable to fetch announcement with id: ${id}`);
        }
      })
      .then((js) => {
        setAnn(js.data);
        setBody(js.data.body);
        setTitle(js.data.title);
      })
      .catch(() => setAnn(null));
  }, [id, auth.user.apiKey]);

  if (ann === null) {
    return <Redirect to="/404" />;
  }

  if (shouldRedirect) {
    return <Redirect to="/announcements" />;
  }

  return (
    <Page title="Edit announcement" width="max-w-2xl">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">Title</span>
        <input
          className="resize-y p-2 border rounded focus:outline-none focus:shadow-outline mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Body</span>
        <textarea
          className="resize-y font-mono text-sm px-2 py-1 border rounded focus:outline-none focus:shadow-outline mb-4 h-48"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Preview</span>
        <MdRender source={body} className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6" />
        <div className="flex mb-4">
          <Button.Primary
            title="Save changes"
            onClick={() => {
              // TODO Handle failure
              Api.put(
                `/announcement/${id}`,
                {
                  ...ann,
                  title,
                  body,
                },
                { Authorization: auth.user.apiKey }
              ).then(() => setShouldRedirect(true));
            }}
          />
          <span className="flex-grow" />
          {ann.active ? (
            <Button.Danger
              title="Deactivate"
              onClick={() => {
                // TODO Add error handling
                Api.del(`/announcement/${id}`, {
                  headers: { Authorization: auth.user.apiKey },
                }).then(() => setShouldRedirect(true));
              }}
              className="mr-2"
            />
          ) : (
            <Button.Secondary
              title="Reactivate"
              onClick={() => {
                // TODO Add error handling
                Api.put(
                  `/announcement/${id}`,
                  { ...ann, active: true },
                  { Authorization: auth.user.apiKey }
                ).then(() => setShouldRedirect(true));
              }}
              className="mr-2 bg-white"
            />
          )}

          <Button.Normal title="Cancel" onClick={() => setShouldRedirect(true)} />
        </div>
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
