import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Game from "./Game";

function App() {
  return (
    <div className="App">
      <header className="App-header">knightsweeper</header>
      <body className="App-body">
        <Game />
      </body>
    </div>
  );
}

export default App;
