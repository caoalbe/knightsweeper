import React, { useEffect, useState } from "react";
import { UNINTIALIZED, BLANK } from "./constants";
import { Tile } from "./types";
import { leftClick, rightClick, numToChar } from "./utils";

const width = 18;
const height = 14;
const tileCount = width * height;

function Game() {
  const [tileData, setTileData] = useState<Array<Tile>>(
    new Array(tileCount)
      .fill(0)
      .map(() => ({ value: UNINTIALIZED, view: BLANK, adj_list: [] }))
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
    <div className="game-container">
      {new Array(height).fill(0).map((row, r) => (
        <div className="Game-row">
          {new Array(width).fill(0).map((tile, c) => {
            return (
              <div
                className="Game-tile"
                onContextMenu={() =>
                  rightClick(r * width + c, tileData, setTileData)
                }
                onClick={() => {
                  leftClick(r * width + c, tileData, setTileData);
                }}
              >
                {numToChar(tileData[r * width + c].view)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Game;
