import React, { Component } from "react";
import Game from "./components/Game";
import "./App.css";

class App extends Component {
  state = {
    mode: "play"
  };

  handleClick = e => {
    this.setState({
      mode: e.key
    });
  };

  render() {
    return <Game />;
  }
}

export default App;
