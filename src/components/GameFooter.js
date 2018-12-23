import React from "react";
import { Layout, Row, Col, Progress } from "antd";
import { mean, isNaN } from "lodash";
import getSeconds from "../util/getSeconds";
import calculateAverageSeconds from "../util/calculateAverageSeconds";

const { Footer } = Layout;

const GameFooter = ({ completionTimes, elapsedTime, score }) => {
  const percent = (elapsedTime / mean(completionTimes)) * 100;
  const status = isNaN(percent)
    ? "normal"
    : percent < 50
    ? "success"
    : percent < 100
    ? "active"
    : "exception";
  return (
    <Footer>
      <Row display="flex" justify="center" align="middle">
        <Progress
          percent={percent}
          status={status}
          format={() => `${getSeconds(elapsedTime)}s`}
        />
        <Col span={12}>
          Avg. Time:{" "}
          <h3>
            {completionTimes.length
              ? `${calculateAverageSeconds(completionTimes)} seconds`
              : `${getSeconds(elapsedTime)} seconds`}
          </h3>
        </Col>
        <Col span={12}>
          Score: <h3>{score}</h3>
        </Col>
      </Row>
    </Footer>
  );
};

export default GameFooter;
