import React, { useState } from "react";

const width = 10;
const height = 10;
const tileCount = width * height;

function Game() {
  // underlying logic 0->8: adjacent. 9: bomb
  const [bombs, setBombs] = useState(new Array(tileCount).fill(0));

  // what is shown to user. 0: blank, 1->8: num, 9: bomb, 10: flag, 11: blank
  const [visual, setVisual] = useState(new Array(tileCount).fill(11));

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
  const newBombs = new Array(tileCount).fill(0);
  for (var i = 0; i < tileCount; i++) {
    if (i != index && Math.random() < probability) {
      newBombs[i] = 9;
    }
  }

  // enumerate the safe tiles
  var seenTiles;
  var toCheck;
  for (var i = 0; i < tileCount; i++) {
    if (newBombs[i] != 9) {
      seenTiles = [];

      toCheck = [
        i - 2 * width - 1,
        i - 2 * width + 1,
        i - width - 2,
        i - width + 2,
        i + 2 * width - 1,
        i + 2 * width + 1,
        i + width - 2,
        i + width + 2,
      ];

      for (var t = 0; t < toCheck.length; t++) {}

      newBombs[i] = 2;
    }
  }

  return newBombs;
}

function rightClick(visual, setVisual, index) {
  const newVisual = visual.map((entry, i) => {
    if (i == index) {
      if (visual[index] == 11) {
        return 10; // blank --> flag
      } else if (visual[index] == 10) {
        return 11; // flag --> blank
      } else return entry;
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
  console.log("left start");
  console.log(index);
  if (!gameStarted) {
    setGameStarted(true);
    const newBombs = generateBombs(index);
    console.log("generations");
    console.log(newBombs);
    setBombs(newBombs);
  }
  console.log("left middle");
  const newVisual = visual.map((entry, i) => {
    if (i == index) {
      return bombs[index];
    } else return entry;
  });
  setVisual(newVisual);
  console.log("left end");
}

// 0->8 is revealed
// 9->11 is unrevealed
// 0: blank, 1->8: num, 9: flag, 10: bomb
function numToChar(input) {
  if (input == 11) {
    return "";
  } else if (input == 9) {
    return "💣";
  } else if (input == 10) {
    return "🚩";
  } else {
    return input;
  }
}
