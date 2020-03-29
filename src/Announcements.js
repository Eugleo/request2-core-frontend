import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";
import { Link, useParams } from "react-router-dom";

import AuthContext, { Authentized } from "./Auth.js";

import Page from "./Page.js";

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
          {anns.map(ann => (
            <AnnouncementCard key={ann.id} id={ann.id} {...ann.data} />
          ))}
        </div>
      </Authentized>
    </Page>
  );
}

function AnnouncementCard(props) {
  // TODO Show ann on click, show edit button only for admins & authors
  return (
    <div className="mb-6 w-full bg-white rounded-lg shadow-sm flex-col">
      <div className="flex px-6 py-3 items-center border-b border-gray-200">
        <div className="flex flex-col not-sr-onlyitems-center">
          <Link
            to={`announcements/${props.id}`}
            className="text-xl font-medium text-black hover:text-green-700"
          >
            {props.title}
          </Link>
          <p className="text-gray-500 text-sm">{formatDate(props.created)}</p>
        </div>
        <div className="flex-grow" />
        <Button.NormalLinked to={`announcements/${props.id}/edit`} className="pl-2 pr-3">
          <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
          Edit
        </Button.NormalLinked>
      </div>
      <div className="px-6 py-3 text-gray-800 text-md">{props.body}</div>
    </div>
  );
}

function formatDate(unixTime) {
  let d = new Date(unixTime * 1000);
  return `${d.getDay()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function AnnouncementFromUrl() {
  var { id } = useParams();
  return <Announcement id={id} />;
}

function Announcement(props) {
  return (
    <>
      <h1>
        <Link to="/announcements">
          <Icon.ChevronLeft className="inline-icon" color="black" />
        </Link>
        Announcement id: {props.id}
      </h1>
    </>
  );
}
