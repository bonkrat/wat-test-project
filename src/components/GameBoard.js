import React from "react";
import { Layout, Row, Col } from "antd";
import GameCard from "./GameCard";
import GameHeader from "./GameHeader";
import { map, difference, compact } from "lodash";
import pickRandom from "../util/pickRandom";
import { CONFIG_MODES } from "./Game";

const { Content } = Layout;

class GameBoard extends React.Component {
  state = {
    personToMatch: {},
    boardData: []
  };

  componentDidUpdate(prevProps) {
    const { gameData } = this.props;

    const isNewGame = !!difference(
      map(gameData, "id"),
      map(prevProps.gameData, "id")
    ).length;

    // Generate data for a new game.
    if (isNewGame) {
      let boardData;
      // Prepare the gameData for the board's state by setting a revealed property to false.
      boardData = gameData.map(person => ({
        ...person,
        revealed: false
      }));

      // Pick a random person from the list to match.
      const personToMatch = pickRandom(boardData, 1);

      // Set property on other people that are not the one to match (for styling in Cards)
      boardData = boardData.map(person => ({
        ...person,
        isPersonToMatch: person.id === personToMatch.id
      }));

      this.setState({
        personToMatch,
        boardData
      });
    }
  }

  /**
   * Handler for a game card being clicked.
   * @param {Object} personClicked THe object value for the person that the card being clicked represents.
   */
  handleCardClick = personClicked => {
    const { triggerNewRound, gameComplete, setGameComplete } = this.props;
    const { personToMatch, boardData } = this.state;

    // If the game is completed and the cards are waiting to be reset do not handle the click.
    if (gameComplete) {
      return;
    }

    // Helper function for completing a game
    const completeGame = () => {
      // Reveal all of the people on the board (showing their names and job titles).
      const updateBoardData = boardData.map(person => ({
        ...person,
        revealed: true
      }));

      this.setState({
        boardData: updateBoardData
      });

      // Set the game as complete
      setGameComplete(true);

      if (this.props.roundNumber !== this.props.numRounds) {
        // Start a new game after 2 seconds.
        setTimeout(() => {
          triggerNewRound();
        }, 2000);
      }
    };

    // Handle a wrong answer.
    if (personClicked.id !== personToMatch.id) {
      // Decrement the score.
      this.props.handleScore(false);

      // Set the revealed state to true if the person does not match the name.
      const updateBoardData = boardData.map(person =>
        person.id === personClicked.id
          ? {
              ...person,
              revealed: true
            }
          : person
      );

      // If everyone but the correct person has been chosen complete the game.
      const numOfRevealedPeople = compact(map(updateBoardData, "revealed"))
        .length;
      if (numOfRevealedPeople === updateBoardData.length - 1) {
        completeGame();
      } else {
        // Update the board with the newly revealed card in the board data.
        this.setState({
          boardData: updateBoardData
        });
      }
    } else {
      // The correct person was chosen, reveal all of the names.

      // Increment the score.
      this.props.handleScore(true);

      // Complete this game round.
      completeGame();
    }
  };

  render() {
    const { personToMatch, boardData } = this.state;
    const hardMode = this.props.config[CONFIG_MODES.HARD_MODE];

    return (
      <Layout>
        <GameHeader personToMatch={personToMatch} />
        <Content style={{ ...styles.root }}>
          <Row type="flex" gutter={16} justify="center">
            {boardData.map((person, index) => (
              <Col span={4} key={index}>
                <GameCard
                  person={person}
                  handleCardClick={this.handleCardClick}
                  hardMode={hardMode}
                />
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    );
  }
}

const styles = {
  root: {
    padding: "40px 0",
    minHeight: "350px"
  },
  name: {
    margin: "0 auto"
  }
};

export default GameBoard;
