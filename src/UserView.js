import React, { useContext, useState } from "react";

import * as Icon from "react-feather";
import AuthContext from "./Auth.js";

export default function UserView() {
  let [showDetails, setShowDetails] = useState(false);

  return (
    <div className="h-full w-full relative">
      <button
        className="p-2 bg-gray-400 text-white rounded-full hover:text-gray-200 focus:outline-none"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Icon.User className="h-5 w-5" />
      </button>
      {showDetails ? <UserDetails /> : null}
    </div>
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
        <Section title="Team">{user.team}</Section>
        <Section title="Roles">{user.roles.join(", ")}</Section>
        <button
          className="p-2 mt-4 border border-gray-300 shadow-sm rounded-lg w-full text-red-700 hover:bg-red-100 hover:border-red-200 focus:outline-none"
          onClick={() => dispatch({ type: "LOGOUT" })}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function Section(props) {
  return (
    <div className="mb-2">
      <h4 className="text-xs text-gray-600">{props.title}</h4>
      {props.children}
    </div>
  );
}
