import React from "react";
import { Layout } from "antd";
import GameBoard from "./GameBoard";
import axios from "axios";
import { filter, get, isUndefined } from "lodash";
import pickRandom from "../util/pickRandom";
import areDefined from "../util/areDefined";
import getSeconds from "../util/getSeconds";
import GameFooter from "./GameFooter";
import GameModal from "./GameModal";

export const CONFIG_MODES = {
  MATT_MODE: "matt_mode",
  TEAM_MODE: "team_mode",
  HARD_MODE: "hard_mode"
};
export const NUMBER_OF_ROUNDS = 10;

/**
 * Builds an array of WillowTree employees to play the game with.
 *
 * @param {Array} data The data to set the game from
 * @param {Object} config A config object to determine how to filter the game data.
 * @returns {Array} An array of WillowTree employees picked randomly to play the game with.
 */
const buildRoundData = (data, config = {}) => {
  // Clean out data with missing properties.
  const cleanedData = filter(
    data,
    person =>
      !isUndefined(person) &&
      areDefined(person, "id", "headshot", "headshot.url")
  );

  let gameData = cleanedData;

  if (config[CONFIG_MODES.MATT_MODE]) {
    gameData = gameData.filter(
      person => person.firstName.toLowerCase().split("matt").length > 1
    );
  }
  if (config[CONFIG_MODES.TEAM_MODE]) {
    gameData = gameData.filter(person => get(person, "jobTitle"));
  }

  return pickRandom(gameData);
};

/**
 * A component for handling game logic.
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      gameData: [],
      config: {
        [CONFIG_MODES.MATT_MODE]: false,
        [CONFIG_MODES.TEAM_MODE]: false
      },
      gameComplete: false,
      gameStart: 0,
      elapsedTime: 0,
      completionTimes: [],
      gameModalVisible: true,
      roundNumber: 0,
      score: 0
    };
    this.timer = {};
  }

  componentDidMount() {
    axios
      .get("https://willowtreeapps.com/api/v1.0/profiles/")
      .then(({ data }) => {
        const gameData = buildRoundData(data, this.state.config);
        this.setState({ data, gameData });
      });
  }

  /**
   * Triggers a new game by building a new set of game data.
   * TODO - Break this into two handlers: one for the starting modal and one for the retry modal.
   */
  triggerNewRound = () => {
    clearInterval(this.timer);
    this.setState(
      {
        gameData: buildRoundData(this.state.data, this.state.config),
        gameComplete: false,
        gameStart: Date.now(),
        roundNumber: this.state.roundNumber + 1,
        completionTimes:
          this.state.roundNumber > 0 ? this.state.completionTimes : []
      },
      this.resetGameTimer // Bug here - the timer runs between the retry and game start modal.
    );
  };

  /**
   * Handler for changing the game settings and applying it to the Game's state.
   * @param {String} name The name of the config setting.
   * @param {boolean} value True if the setting is on, false if off.
   */
  handleConfigChange = (name, value) => {
    clearInterval(this.timer);
    const config = {
      ...this.state.config,
      [name]: !value
    };
    this.setState({
      config,
      gameData: buildRoundData(this.state.data, config),
      completionTimes: [],
      gameStart: Date.now()
    });
  };

  /**
   * Set the game's completion state to a value.
   * @param {boolean} value The value to set the game's completion state to.
   *
   * TODO - Break this function into separate handlers for games and round completion
   */
  setGameComplete = value => {
    clearInterval(this.timer);

    const isFinalRound = this.state.roundNumber === NUMBER_OF_ROUNDS;

    // Set the time it took to complete the game into state.
    const completionTimes = [
      ...this.state.completionTimes,
      Date.now() - this.state.gameStart
    ];

    this.setState({
      gameComplete: value,
      completionTimes,
      gameModalVisible: isFinalRound,
      roundNumber: isFinalRound ? 0 : this.state.roundNumber
    });
  };

  /**
   * Reset the game timer.
   */
  resetGameTimer = () => {
    const tickTime = 1000;
    this.setState(
      {
        elapsedTime: 0
      },
      () => {
        this.timer = setInterval(() => {
          this.setState({
            elapsedTime: this.state.elapsedTime + tickTime
          });
        }, tickTime);
      }
    );
  };

  /**
   * Start the game.
   */
  handleStartGame = () => {
    this.setState(
      {
        gameModalVisible: false,
        roundNumber: 0,
        score: 0
      },
      this.triggerNewRound
    );
  };

  /**
   * The handler for setting the user's score.
   * @param {boolean} hit true if the answer was correct.
   */
  handleScore = hit => {
    const scoreFactor = 200; // This is made up
    const difficulty = 10; // This is also made up. In theory the lower the value the harder the game.

    const { score, elapsedTime } = this.state;
    const updatedScore = hit
      ? score + scoreFactor * (1 / getSeconds(elapsedTime, 1)) // Score higher the faster you get the correct answer.
      : score - (scoreFactor / difficulty) * getSeconds(elapsedTime, 1); // Score lower the longer it takes to get the answer.

    const roundedScore = Math.ceil(updatedScore);

    this.setState({
      score: roundedScore
    });
  };

  render() {
    return (
      <Layout>
        <GameModal
          numRounds={NUMBER_OF_ROUNDS}
          visible={this.state.gameModalVisible}
          gameComplete={this.state.gameComplete}
          completionTimes={this.state.completionTimes}
          config={this.state.config}
          dataLength={this.state.data.length}
          score={this.state.score}
          onOk={this.handleStartGame}
          onRetry={this.triggerNewRound}
          handleConfigChange={this.handleConfigChange}
        />
        <GameBoard
          config={this.state.config}
          gameData={this.state.gameData}
          roundNumber={this.state.roundNumber}
          gameComplete={this.state.gameComplete}
          numRounds={NUMBER_OF_ROUNDS}
          setGameComplete={this.setGameComplete}
          triggerNewRound={this.triggerNewRound}
          handleScore={this.handleScore}
        />
        <GameFooter
          completionTimes={this.state.completionTimes}
          score={this.state.score}
          elapsedTime={this.state.elapsedTime}
        />
      </Layout>
    );
  }
}

export default Game;
