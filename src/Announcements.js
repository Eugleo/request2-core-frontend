import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { Link, useRouteMatch, useParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AuthContext, { Authentized } from "./Auth.js";

export function Announcements() {
  let match = useRouteMatch();
  let [anns, setAnns] = useState([]);
  let { auth } = useContext(AuthContext);
  let apiKey = auth.user == null ? null : auth.user.apiKey;

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
    <Authentized or={<div>You need to be logged in to view announcements.</div>}>
      <h1>Announcements</h1>
      <Container fluid>
        {anns.map(ann => (
          <AnnouncementCard key={ann.id} link={`${match.path}/${ann.id}`} {...ann.data} />
        ))}
      </Container>
    </Authentized>
  );
}

function AnnouncementCard(props) {
  // TODO Show ann upon click
  return (
    <Row className="mb-4">
      <Col>
        <Link to={props.link} className="no-style">
          <Card>
            <Card.Body>
              <Card.Title>{props.title}</Card.Title>
              <Card.Text>{props.body}</Card.Text>
              <Card.Footer className="text-muted">{formatDate(props.created)}</Card.Footer>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
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
