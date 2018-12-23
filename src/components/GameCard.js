import React from "react";
import { Card } from "antd";

const { Meta } = Card;

/**
 * A card showing a WillowTree employee.
 * @param {Object} props.person A person object returned from the WillowTree API
 * @param {Function} props.handleCardClick A callback for when the card is clicked.
 * @param {boolean} props.hardMode Sets a blur on the cards if hardmode is true.
 */
const GameCard = ({ person, handleCardClick, hardMode }) => {
  const {
    firstName,
    lastName,
    headshot,
    revealed,
    jobTitle,
    isPersonToMatch
  } = person;
  const { url } = headshot;
  const name = `${firstName} ${lastName}`;

  return (
    <Card
      hoverable
      style={{ ...cardStyles(revealed && !isPersonToMatch, hardMode) }}
      cover={
        <img
          alt="example"
          style={{ ...imageStyle(!revealed && hardMode) }}
          src={url}
        />
      }
      onClick={() => handleCardClick(person)}
    >
      {revealed ? <Meta title={name} description={jobTitle || ""} /> : null}
    </Card>
  );
};

/**
 * Factory for building a style object based on whether or not to grayscale the card.
 * @param {boolean} showGrayscale Sets the filter to a grayscale if true.
 * @returns {Object} A cardStyles object to apply to the Card component's style prop.
 */
const cardStyles = showGrayscale => ({
  width: 180,
  filter: `${showGrayscale ? "grayscale(100%)" : "none"}`
});

/**
 * Factory for building a style object based on whether hard mode is enabled.
 * If enabled a blur is set on the game cards.
 * @param {boolean} hardMode if true sets a filter blur on the style object.
 * @returns {Object} A cardStyles object to apply to the Card component image's style prop.
 */
const imageStyle = hardMode => {
  console.log(hardMode);
  return {
    filter: hardMode ? "blur(10px)" : "none"
  };
};

export default GameCard;
