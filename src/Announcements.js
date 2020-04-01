import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { AtomSpinner } from "react-epic-spinners";
import * as Button from "./Buttons.js";
import { Link, useParams } from "react-router-dom";

import AuthContext, { Authentized, Authorized } from "./Auth.js";

import Page, { CenteredPage } from "./Page.js";
import MdRender from "./MdRender.js";

export function Announcements() {
  let [anns, setAnns] = useState([]);
  let { auth } = useContext(AuthContext);
  let apiKey = auth.user ? auth.user.apiKey : null;

  useEffect(() => {
    if (auth.loggedIn) {
      Api.get("/announcements", { headers: { Authorization: apiKey } })
        .then(r => {
          if (r.ok) {
            return r.json();
          } else {
            throw new Error("Unable to retrieve the announcements");
          }
        })
        .then(json => setAnns(json))
        .catch(console.log);
    }
  }, [auth.loggedIn, apiKey]);

  return (
    <Page title="Announcements" width="max-w-2xl">
      <Authentized or={<div>You need to be logged in to view announcements.</div>}>
        <div className="flex flex-col">
          <Authorized roles={["Admin"]}>
            <AddAnnButton />
          </Authorized>
          <div className="flex flex-col">
            {anns.map(ann => (
              <AnnouncementCard key={ann.id} id={ann.id} {...ann.data} />
            ))}
          </div>
        </div>
      </Authentized>
    </Page>
  );
}

function AddAnnButton() {
  return (
    <Link
      to="/announcements/new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new announcement
    </Link>
  );
}

function AnnouncementCard(props) {
  return (
    <div className="mb-6 w-full bg-white rounded-lg shadow-sm flex-col">
      <div className="flex px-6 py-3 items-center border-b border-gray-200">
        <div className="flex flex-col not-sr-onlyitems-center">
          <Link
            to={`announcements/${props.id}`}
            className={
              "text-xl font-medium text-black hover:text-green-700 " +
              (props.active ? "text-black" : "text-gray-400")
            }
          >
            {props.title}
          </Link>
          <p className={"text-sm " + (props.active ? "text-gray-500" : "text-gray-300")}>
            {formatDate(props.created)}
          </p>
        </div>
        <div className="flex-grow" />
        <Authorized roles={["Admin"]}>
          <Button.NormalLinked to={`announcements/${props.id}/edit`} className="pl-2 pr-3">
            <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
            Edit
          </Button.NormalLinked>
        </Authorized>
      </div>
      <MdRender
        source={props.body}
        className={"px-6 pt-3 pb-1 " + (props.active ? "text-gray-800" : "text-gray-400")}
      />
    </div>
  );
}

function formatDate(unixTime) {
  let d = new Date(unixTime * 1000);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function AnnouncementFromUrl() {
  var { id } = useParams();
  let [ann, setAnn] = useState(null);
  let { auth } = useContext(AuthContext);

  useEffect(() => {
    Api.get(`/announcement/${id}`, { headers: { Authorization: auth.user.apiKey } })
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          throw Error(`Can't retreieve announcement with ID ${id}`);
        }
      })
      .then(js => setAnn(js.data))
      .catch(err => console.log(err));
  }, [id, auth.user.apiKey]);

  if (ann === null) {
    return (
      <CenteredPage title="Loading announcement">
        <div className="flex justify-center">
          <AtomSpinner color="gray" />
        </div>
      </CenteredPage>
    );
  } else {
    return (
      <Page title={ann.title} width="max-w-2xl">
        <MdRender source={ann.body} className="bg-white rounded-md shadow-sm px-6 pt-5 pb-3" />
      </Page>
    );
  }
}
