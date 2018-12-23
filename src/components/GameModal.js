import React from "react";
import { Modal, Button, Row, Col, Divider } from "antd";
import calculateAverageSeconds from "../util/calculateAverageSeconds";
import GameSettings from "./GameSettings";

const GameCompleteModal = ({ visible, onRetry, completionTimes, score }) => (
  <Modal
    title="Results"
    visible={visible}
    closable={false}
    footer={
      <Button onClick={onRetry} type="primary">
        Play Again!
      </Button>
    }
  >
    <Row type="flex">
      <Col span={12}>
        <h3>Avg. Time</h3>
        {`${calculateAverageSeconds(completionTimes)} seconds`}
      </Col>
      <Col span={12}>
        <h3>Final Score</h3>
        {score}
      </Col>
    </Row>
  </Modal>
);

const GameStartModal = ({
  visible,
  onOk,
  numRounds,
  handleConfigChange,
  config,
  dataLength
}) => (
  <Modal
    title="The WillowTree Name Game"
    visible={visible}
    closable={false}
    footer={
      <Button
        onClick={onOk}
        type="primary"
        disabled={!dataLength}
        loading={!dataLength}
      >
        {!dataLength ? "Loading..." : "Start"}
      </Button>
    }
  >
    <p>
      {`Match the portait to the name and go for ${numRounds} rounds and go for a high
  score!`}
    </p>
    <Divider />
    <GameSettings handleConfigChange={handleConfigChange} config={config} />
  </Modal>
);

/**
 * This is a terrible component and should be handled in a better way!
 * TODO - Break these out into separate components, or at least omit props.
 */
const GameModal = props =>
  props.gameComplete ? (
    <GameCompleteModal {...props} />
  ) : (
    <GameStartModal {...props} />
  );

export default GameModal;
