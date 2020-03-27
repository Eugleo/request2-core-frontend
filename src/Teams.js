import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { Link, useRouteMatch, useParams } from "react-router-dom";

import AuthContext, { Authentized } from "./Auth.js";

import Page from "./Page.js";

export function Teams() {
  let match = useRouteMatch();
  let [limit, setLimit] = useState(20);
  let [offset, setOffset] = useState(0);
  let [teams, setTeams] = useState([]);
  let { auth } = useContext(AuthContext);
  let apiKey = auth.user == null ? null : auth.user.apiKey;

  useEffect(() => {
    if (auth.loggedIn) {
      let url = Api.urlWithParams("/teams", { limit, offset });
      Api.get(url, { headers: { Authorization: apiKey } })
        .then(r => {
          if (r.ok) {
            return r.json();
          } else {
            throw new Error("Unable to retrieve the teams");
          }
        })
        .then(json => setTeams(json.teams))
        .catch(console.log);
    }
  }, [auth.loggedIn, apiKey, limit, offset]);

  return (
    <Page title="Teams">
      <Authentized or={<div>You need to be logged in to view teams.</div>}>
        <div className="flex flex-col bg-white rounded-lg shadow-sm">
          {teams.map(team => (
            <Team key={team.id} link={`${match.path}/${team.id}`} {...team.data} />
          ))}
        </div>
      </Authentized>
    </Page>
  );
}

function Team(props) {
  // TODO Show team on click, show edit button only for admins & authors
  return (
    <div className="flex list-item px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      <div className="flex flex-grow">
        <h2 className="text-black font-medium">{props.name}</h2>
      </div>
      <button className="inline-flex items-center rounded-md text-sm shadow-sm pl-2 pr-3 py-2 text-gray-800 border border-gray-300 mr-2">
        <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
        Edit
      </button>
      <button className="inline-flex items-center rounded-md text-sm shadow-sm pl-2 pr-3 py-2 text-gray-800 border border-gray-300">
        <Icon.Eye className="mr-1 text-gray-700 h-4 stroke-2" />
        View
      </button>
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
