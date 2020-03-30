import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import * as Button from "./Buttons.js";
import { Link } from "react-router-dom";

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
          <PageCounter
            offset={offset}
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

// TODO Refactor omg

// Didn't want to think too much about this
function PageCounter(props) {
  let page = Math.floor(props.offset / props.limit);
  let totalPages = Math.floor(props.total / props.limit);

  let start = [0, 1];
  let middle = [...Array(props.around * 2 + 1).keys()]
    .map(n => page + n - props.around)
    .filter(n => n > 1 && n < totalPages - 2);
  let end = [totalPages - 2, totalPages - 1].filter(n => n > 2);

  let buttons = [start, middle, end].reduce((acc, a) => {
    if (a.length > 0) {
      let dif = a[0] - acc[acc.length - 1];
      if (dif > 2) {
        acc.push("...");
      } else if (dif === 2) {
        acc.push(a[0] - 1);
      }
    }

    return acc.concat(a);
  });
  buttons = buttons.map((txt, i) => {
    if (txt === page) {
      return (
        <NumberButton key={i} selected={true}>
          {txt + 1}
        </NumberButton>
      );
    } else if (txt === "...") {
      return (
        <NumberButton key={i} inactive={true}>
          {txt}
        </NumberButton>
      );
    } else {
      return (
        <NumberButton key={i} onClick={() => props.setOffset(txt * props.limit)}>
          {txt + 1}
        </NumberButton>
      );
    }
  });

  buttons = [
    <NumberButton
      greyedOut={page === 0}
      key={-1}
      onClick={() => props.setOffset(props.offset - props.limit)}
    >
      <Icon.ChevronLeft className="h-4" />
    </NumberButton>,
    ...buttons,
    <NumberButton
      greyedOut={page === totalPages - 1}
      key={-2}
      onClick={() => props.setOffset(props.offset + props.limit)}
    >
      <Icon.ChevronRight className="h-4" />
    </NumberButton>
  ];

  return (
    <div className="px-6 py-3 text-sm flex items-center justify-center">
      {totalPages > 1 ? (
        <div className="flex border border-gray-300 rounded-md ">{buttons}</div>
      ) : (
        <div className="text-sm tracking-wide text-gray-600">These are all the items</div>
      )}
    </div>
  );
}

function NumberButton(props) {
  let classes = "list-item px-3 py-1 border-r border-gray-200 focus:outline-none flex items-center";

  if (props.greyedOut) {
    classes += " text-gray-500";
    return <div className={classes}>{props.children}</div>;
  }

  if (!props.inactive && !props.selected) {
    classes += " hover:bg-gray-200 text-gray-800";

    return (
      <button onClick={props.onClick} to="/" className={classes}>
        {props.children}
      </button>
    );
  }

  classes += " cursor-default text-gray-800";

  if (props.selected) {
    classes += " font-extrabold";
  }

  return <div className={classes}>{props.children}</div>;
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
