import React, { useContext, useState } from "react";

import * as Icon from "react-feather";
import * as Button from "./Buttons.js";
import AuthContext from "./Auth.js";

export default function UserView() {
  let [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {showDetails ? (
        <div
          className="cursor-default w-screen h-screen absolute left-0 top-0"
          onClick={() => setShowDetails(!showDetails)}
        />
      ) : null}
      <div className="h-full w-full relative">
        <button
          className="p-2 bg-gray-400 text-white rounded-full hover:text-gray-200 focus:outline-none"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Icon.User className="h-5 w-5" />
        </button>
        {showDetails ? <UserDetails /> : null}
      </div>
    </>
  );
}

function UserDetails() {
  let { auth, dispatch } = useContext(AuthContext);
  let user = auth.user;

  return (
    <div
      className={
        "details-dropdown absolute flex text-sm flex-col w-40 right-0 border border-gray-300 " +
        "bg-white text-gray-900 shadow-md rounded-md mt-2 transition duration-150"
      }
    >
      <div className="font-semibold px-4 py-2 mb-2 border-b border-gray-300">{user.name}</div>
      <div className="px-4 mb-4">
        <Section title="Team">{user.team.name}</Section>
        <Section title="Roles">{user.roles.join(", ")}</Section>
        <Section title="Joined">{formatDate(user.created)}</Section>
        <Button.Danger
          title="Log out"
          onClick={() => dispatch({ type: "LOGOUT" })}
          className="mt-2 w-full flex justify-center"
        />
      </div>
    </div>
  );
}

function formatDate(unixTime) {
  let d = new Date(unixTime * 1000);
  return `${d.getDay()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

function Section(props) {
  return (
    <div className="mb-2">
      <h4 className="text-xs text-gray-600">{props.title}</h4>
      {props.children}
    </div>
  );
}
