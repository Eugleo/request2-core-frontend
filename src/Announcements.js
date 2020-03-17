import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { Link, useRouteMatch, useParams } from "react-router-dom";

export function Announcements() {
  let match = useRouteMatch();
  let [anns, setAnns] = useState([]);

  useEffect(() => {
    Api.get("/announcements")
      .then(r => r.json())
      .then(json => setAnns(json));
  }, []);

  return (
    // TODO Replace with real Announcement element
    <>
      <h1>Announcements</h1>
      <ul>
        {anns.map(ann => (
          <li key={ann.id}>
            <Link to={`${match.path}/${ann.id}`}>{ann.data.title}</Link> (time: {ann.data.created})
          </li>
        ))}
      </ul>
    </>
  );
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
