import React from "react";
import { Layout, Row, Col } from "antd";
import { get } from "lodash";
const { Header } = Layout;

export const SETTINGS = "settings";
export const SCORES = "scores";

const GameHeader = ({ personToMatch = {} }) => {
  const firstName = get(personToMatch, "firstName");
  const lastName = get(personToMatch, "lastName");

  return (
    <Header style={{ ...styles.header }}>
      <Row type="flex" align="middle" justify="center">
        <Col>
          <div style={{ ...styles.settings }}>
            {Object.keys(personToMatch).length ? (
              <h1>
                Who is &nbsp;
                {firstName} {lastName}?
              </h1>
            ) : null}
          </div>
        </Col>
      </Row>
    </Header>
  );
};

const styles = {
  header: {
    backgroundColor: "#FFF"
  },
  settings: {
    cursor: "pointer"
  }
};

export default GameHeader;
