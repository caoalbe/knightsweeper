import React, { useState } from "react";
import { UNINTIALIZED, BLANK } from "./constants";
import { Tile } from "./types";
import { leftClick, rightClick, numToChar, tileColour } from "./utils";

const width = 18;
const height = 14;
const tileCount = width * height;

function Game() {
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [tileData, setTileData] = useState<Array<Tile>>(
    new Array(tileCount)
      .fill(0)
      .map(() => ({ value: UNINTIALIZED, view: BLANK, adj_list: [] }))
  );
  console.log(`hovered: ${hoveredTile}`);
  return (
    <div
      // suppress the right-click menu
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      // suppress text selection (highlighting)
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      className=""
    >
      {new Array(height).fill(0).map((row, r) => (
        <div className="Game-row">
          {new Array(width).fill(0).map((tile, c) => {
            return (
              <div
                className="Game-tile"
                style={{
                  backgroundColor: tileColour(
                    r * width + c,
                    hoveredTile,
                    tileData,
                    width
                  ),
                }}
                onMouseOver={() => setHoveredTile(r * width + c)}
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
