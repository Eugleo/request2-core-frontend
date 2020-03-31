import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";
import { Link } from "react-router-dom";
import Pagination from "./Pagination.js";

import AuthContext, { Authentized, Authorized } from "./Auth.js";

import Page from "./Page.js";

export function Teams() {
  // TODO Add paging
  let [total, setTotal] = useState(null);
  let [limit, setLimit] = useState(1);
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
        .then(json => {
          setTotal(json.total);
          setTeams(json.teams);
        })
        .catch(console.log);
    }
  }, [auth.loggedIn, apiKey, limit, offset]);

  return (
    <Page title="Teams" width="max-w-2xl">
      <Authentized or={<div>You need to be logged in to view teams.</div>}>
        <div className="flex flex-col">
          <AddTeamButton />
          <div className="flex flex-col bg-white rounded-lg shadow-sm mb-2">
            {teams.map(team => (
              <Team key={team.id} editLink={`/teams/${team.id}/edit`} {...team.data} />
            ))}
          </div>
          <Pagination
            offset={offset}
            bound={1}
            setOffset={setOffset}
            limit={limit}
            total={total}
            around={1}
          />
        </div>
      </Authentized>
    </Page>
  );
}

function AddTeamButton() {
  return (
    <Link
      to="/teams/new"
      className="rounded-lg border-2 border-dashed text-gray-500 border-gray-300 mb-6 py-4 flex justify-center hover:text-gray-400"
    >
      <Icon.Plus className="stroke-2 mr-1" /> Add new team
    </Link>
  );
}

function Team(props) {
  return (
    <div className="flex list-item px-6 py-3 items-center border-b border-gray-200 hover:bg-gray-200">
      <div className="flex flex-grow">
        {props.active ? (
          <h2 className="text-gray-900 font-medium">{props.name}</h2>
        ) : (
          <h2 className="text-gray-400 font-medium">{props.name}</h2>
        )}
      </div>
      <Authorized roles={["Admin"]}>
        <Button.NormalLinked to={props.editLink} className="pl-2 pr-3">
          <Icon.Edit3 className="mr-1 text-gray-700 h-4 stroke-2" />
          Edit
        </Button.NormalLinked>
      </Authorized>
    </div>
  );
}
