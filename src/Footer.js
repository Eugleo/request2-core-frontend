import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// TODO Replace
export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col>Neco vlevo</Col>
          <Col>Neco vpravo, asi loga</Col>
        </Row>
      </Container>
    </footer>
  );
}
