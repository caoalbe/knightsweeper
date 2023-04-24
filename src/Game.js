import React, { useState } from "react";

const width = 10;
const height = 10;

function Game() {
  // underlying logic
  const [bombs, setBombs] = useState(new Array(width * height).fill(0)); // 0->8: adjacent. 9: bomb

  // what is shown to user
  const [visual, setVisual] = useState(new Array(width * height).fill(0)); // 0: blank, 1->8: num, 9: flag, 10: bomb

  // game has started
  const [gameStarted, setGameStarted] = useState(false);

  // suppress the right-click menu
  document.oncontextmenu = (event) => {
    event.preventDefault();
  };
  // suppress text selection (highlighting)
  document.onmousedown = (event) => {
    event.preventDefault();
  };

  return (
    <div className="">
      {new Array(height).fill(0).map((row, r) => (
        <div className="Game-row">
          {new Array(width).fill(0).map((tile, c) => {
            return (
              <div
                className="Game-tile"
                onContextMenu={() =>
                  rightClick(visual, setVisual, r * width + c)
                }
                onClick={() =>
                  leftClick(
                    r * width + c,
                    gameStarted,
                    setGameStarted,
                    bombs,
                    setBombs,
                    visual,
                    setVisual
                  )
                }
              >
                {numToChar(visual[r * width + c])}
              </div>
            );
          })}
        </div>
      ))}
      {/* <button onClick={generateBombs(setBombs, 0)}>nothing button lol</button> */}
    </div>
  );
}

export default Game;

function generateBombs(index) {
  // naive rng generation
  // place the bombs
  const probability = 0.1;
  const newBombs = new Array(width * height).fill(0);
  for (var i = 0; i < width * height; i++) {
    if (i != index && Math.random() < probability) {
      newBombs[i] = 9;
    }
  }

  // enumerate the safe tiles
  var seenTiles = [];
  for (var i = 0; i < width * height; i++) {
    if (newBombs[i] != 9) {
    }
  }

  return newBombs;
}

function rightClick(visual, setVisual, index) {
  const newVisual = visual.map((entry, i) => {
    if (i == index) {
      if (visual[index] == 0) {
        return 9; // blank --> flag
      } else if (visual[index] == 9) {
        return 0; // flag --> blank
      } else {
        return entry;
      }
    } else return entry;
  });
  setVisual(newVisual);
}

function leftClick(
  index,
  gameStarted,
  setGameStarted,
  bombs,
  setBombs,
  visual,
  setVisual
) {
  if (!gameStarted) {
    setGameStarted(true);
    const newBombs = generateBombs(index);
    console.log("generations");
    console.log(newBombs);
  }

  const newVisual = visual.map((entry, i) => {
    if (i == index) {
      return 10;
    } else return entry;
  });
  setVisual(newVisual);
}

// 0->8 is revealed
// 9->11 is unrevealed
// 0: blank, 1->8: num, 9: flag, 10: bomb
function numToChar(input) {
  if (input == 0) {
    return "";
  } else if (input == 9) {
    return "🚩";
  } else if (input == 10) {
    return "💣";
  } else {
    return input;
  }
}
