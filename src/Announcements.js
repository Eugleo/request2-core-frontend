import React, { useEffect, useState, useContext } from "react";
import * as Icon from "react-feather";
import * as Api from "./Api.js";
import { Link, useRouteMatch, useParams, Redirect } from "react-router-dom";

import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AuthContext from "./AuthContext.js";

export function Announcements() {
  let match = useRouteMatch();
  let [anns, setAnns] = useState([]);
  let { state } = useContext(AuthContext);

  useEffect(() => {
    if (state.loggedIn) {
      Api.get("/announcements", { headers: { Authorization: state.user.apiKey } })
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
  }, []);

  if (!state.loggedIn) {
    return <div>You need to be logged in to view announcements.</div>;
  }

  return (
    // TODO Replace with real Announcement element
    <>
      <h1>Announcements</h1>
      <Container fluid>
        {anns.map(ann => (
          <AnnouncementCard key={ann.id} {...ann.data} />
        ))}
      </Container>
    </>
  );
}

function AnnouncementCard(props) {
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.body}</Card.Text>
            <Card.Footer className="text-muted">{formatDate(props.created)}</Card.Footer>
          </Card.Body>
        </Card>
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
