import React from "react";

import { Authentized, NotAuthentized } from "./Auth.js";

import "./styles/tailwind.css";
import { NavLink as RouterNavLink } from "react-router-dom";

import UserView from "./UserView.js";

export default function Navbar() {
  return (
    <nav className="w-full bg-white sticky border-gray-300 border-b top-0 p-4">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-left">
            <span className="text-green-600 font-extrabold text-xl mr-6">
              rQ<sup>2</sup>
            </span>
            <Authentized>
              <NavLink to="/announcements">Announcements</NavLink>
              <NavLink to="/teams">Teams</NavLink>
            </Authentized>
          </div>
          <div className="flex items-center justify-right">
            <Authentized>
              <UserView />
            </Authentized>
            <NotAuthentized>
              <NavLink to="/register/new">Register</NavLink>
              <NavLink to="/login">Log in</NavLink>
            </NotAuthentized>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink(props) {
  return (
    <RouterNavLink
      to={props.to}
      className={props.className || "ml-2 px-3 py-2 rounded-md text-sm hover:bg-gray-200"}
      activeClassName="bg-gray-200"
    >
      {props.children}
    </RouterNavLink>
  );
}
