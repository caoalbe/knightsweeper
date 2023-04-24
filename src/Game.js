import React, { useState } from "react";
import { UNINTIALIZED, BOMB, FLAG, BLANK } from "./constants";
import {
  leftClick,
  generateBombs,
  computeAdjacencyList,
  rightClick,
  numToChar,
} from "./utils";

const width = 18;
const height = 14;
const tileCount = width * height;

function Game() {
  // game has started
  const [firstClick, setFirstClick] = useState(true);

  const [tileData, setTileData] = useState(
    new Array(tileCount)
      .fill()
      .map(() => ({ value: BLANK, view: UNINTIALIZED, adj_list: [] }))
  );

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
      {new Array(height).fill().map((row, r) => (
        <div className="Game-row">
          {new Array(width).fill().map((tile, c) => {
            return (
              <div
                className="Game-tile"
                onContextMenu={() =>
                  rightClick(r * width + c, tileData, setTileData)
                }
                onClick={() => {
                  if (firstClick) {
                    const newTiles = generateBombs(r * width + c);
                    setFirstClick(false);
                    setTileData(newTiles);
                    leftClick(r * width + c, newTiles, setTileData);
                  } else {
                    leftClick(r * width + c, tileData, setTileData);
                  }
                }}
              >
                {numToChar(tileData[r * width + c].view)}
              </div>
            );
          })}
        </div>
      ))}
      {/* <button onClick={() => testTileObject(tileData, setTileData)}>
        nothing button lol
      </button> */}
    </div>
  );
}

export default Game;
