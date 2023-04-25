import React, { useState } from "react";
import { UNINTIALIZED, BLANK } from "./constants";
import { Tile } from "./types";
import { leftClick, rightClick, numToChar, tileColour } from "./utils";

const width = 18;
const height = 14;
const tileCount = width * height;

function Game(): JSX.Element {
  const [hoveredTile, setHoveredTile] = useState<number>(-1);
  const [tileData, setTileData] = useState<Array<Tile>>(
    new Array(tileCount)
      .fill(0)
      .map(() => ({ value: UNINTIALIZED, view: BLANK, adj_list: [] }))
  );

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
    >
      {new Array(height).fill(0).map((_, r) => (
        <div className="Game-row">
          {new Array(width).fill(0).map((_, c) => {
            const index = r * width + c;
            return (
              <div
                className="Game-tile"
                style={{
                  backgroundColor: tileColour(
                    index,
                    hoveredTile,
                    tileData,
                    width
                  ),
                }}
                onMouseOver={() => setHoveredTile(index)}
                onContextMenu={() => rightClick(index, tileData, setTileData)}
                onClick={() => {
                  leftClick(index, tileData, setTileData);
                }}
              >
                {numToChar(tileData[index].view)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Game;
