import React from "react";
import { CONFIG_MODES } from "./Game";
import { Row, Col, Switch } from "antd";

const GameSettings = ({ handleConfigChange, config }) => (
  <React.Fragment>
    <h3>Configuration</h3>
    <Row type="flex">
      <Col span={18}>Matt Mode - Only ones named Matt!</Col>
      <Col span={4}>
        <Switch
          size="small"
          checked={config[CONFIG_MODES.MATT_MODE]}
          onClick={() =>
            handleConfigChange(
              CONFIG_MODES.MATT_MODE,
              config[CONFIG_MODES.MATT_MODE]
            )
          }
        />
      </Col>
    </Row>
    <Row type="flex">
      <Col span={18}>Team Mode - Only current team members.</Col>
      <Col span={4}>
        <Switch
          size="small"
          checked={config[CONFIG_MODES.TEAM_MODE]}
          onClick={() =>
            handleConfigChange(
              CONFIG_MODES.TEAM_MODE,
              config[CONFIG_MODES.TEAM_MODE]
            )
          }
        />
      </Col>
    </Row>
    <Row type="flex">
      <Col span={18}>Hard Mode - Good Luck :)</Col>
      <Col span={4}>
        <Switch
          size="small"
          checked={config[CONFIG_MODES.HARD_MODE]}
          onClick={() =>
            handleConfigChange(
              CONFIG_MODES.HARD_MODE,
              config[CONFIG_MODES.HARD_MODE]
            )
          }
        />
      </Col>
    </Row>
  </React.Fragment>
);

export default GameSettings;
