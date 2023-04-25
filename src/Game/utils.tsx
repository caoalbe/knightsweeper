import {
  UNINTIALIZED,
  BOMB,
  FLAG,
  BLANK,
  HEX_REVEALED,
  HEX_LIGHT,
  HEX_DARK,
  HEX_REVEALED_HOVERED,
  HEX_LIGHT_HOVERED,
  HEX_DARK_HOVERED,
} from "./constants";
import { Tile, view } from "./types";
import { Dispatch, SetStateAction } from "react";

const width = 18;
const height = 14;
const tileCount = width * height;

function leftClick(
  index: number,
  tileData: Array<Tile>,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>
): void {
  const currView = tileData[index].view;
  const currValue = tileData[index].value;

  if (currValue == UNINTIALIZED) {
    // generate board
    tileData = generateBombs(index);
  }

  if (currView == BLANK) {
    // perform bfs
    // dequeue()-->shift(), enqueue(v)-->push(v)
    const queue: Array<number> = [index];
    const explored: Array<number> = [index];
    var curr: number;
    var dest: number;

    while (queue.length > 0) {
      curr = queue.shift() as number;
      if (tileData[curr].value === 0) {
        for (var i = 0; i < tileData[curr].adj_list.length; i++) {
          dest = tileData[curr].adj_list[i];
          if (!explored.includes(dest)) {
            explored.push(dest);
            queue.push(dest);
          }
        }
      }
    }

    const newTileData: Array<Tile> = tileData.map((tile, i) => {
      if (explored.includes(i)) {
        // reveal the tile
        return {
          value: tile.value,
          view: tile.value as view,
          adj_list: tile.adj_list,
        };
      } else {
        return tile;
      }
    });

    setTileData(newTileData);
  }
}

function generateBombs(index: number): Array<Tile> {
  // naive rng generation
  // place the bombs
  const safeTiles = computeAdjacencyList(index);
  safeTiles.push(index);

  const newTiles = new Array(tileCount).fill(0);
  const probability = 0.15;
  var i;
  for (i = 0; i < tileCount; i++) {
    newTiles[i] = {
      value:
        !safeTiles.includes(i) && Math.random() < probability
          ? BOMB
          : UNINTIALIZED,
      view: BLANK,
      adj_list: computeAdjacencyList(i),
    };
  }

  // enumerate the safe tiles
  for (i = 0; i < tileCount; i++) {
    if (newTiles[i].value === UNINTIALIZED) {
      newTiles[i].value = newTiles[i].adj_list
        .map((dest: number) => newTiles[dest].value)
        .filter((val: number) => {
          if (val === BOMB) {
            return true;
          } else {
            return false;
          }
        }).length;
    }
  }
  return newTiles;
}

function computeAdjacencyList(index: number): Array<number> {
  if (index < 0 || index >= tileCount) {
    return [];
  }

  const col = index % width;
  const row = Math.floor(index / width);

  const feasible = [
    [col - 1, row - 2],
    [col + 1, row - 2],
    [col - 2, row - 1],
    [col + 2, row - 1],
    [col - 2, row + 1],
    [col + 2, row + 1],
    [col - 1, row + 2],
    [col + 1, row + 2],
  ];
  return feasible
    .filter(([x, y]) => {
      if (0 <= x && x < width && 0 <= y && y < height) {
        return true;
      } else {
        return false;
      }
    })
    .map(([x, y]) => y * width + x);
}

function rightClick(
  index: number,
  tileData: Array<Tile>,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>
): void {
  // flag or blank
  const currView: view = tileData[index].view;
  var newView: view;
  var mutate: boolean = true;

  switch (currView) {
    case BLANK:
      newView = FLAG;
      break;
    case FLAG:
      newView = BLANK;
      break;
    default:
      mutate = false;
  }

  if (mutate) {
    const newTileData = tileData.map((e, i) => {
      if (index === i) {
        return { value: e.value, view: newView, adj_list: e.adj_list };
      } else {
        return e;
      }
    });
    setTileData(newTileData);
  }
}

function numToChar(input: view): string {
  switch (input) {
    case BLANK:
    case 0:
      return "";
    case BOMB:
      return "💣";
    case FLAG:
      return "🚩";
    default:
      return input.toString();
  }
}

function tileColour(
  index: number,
  activeTile: number,
  tileData: Array<Tile>,
  width: number
): string {
  const currView = tileData[index].view;
  const hovered = index === activeTile;

  // Revealed Tiles
  if (0 === currView) {
    return HEX_REVEALED;
  } else if (0 < currView && currView <= 8) {
    return hovered ? HEX_REVEALED_HOVERED : HEX_REVEALED;
  }

  // Unrevealed Tiles
  switch ((index % 2) + (Math.floor(index / width) % 2)) {
    case 0:
    case 2:
      return hovered ? HEX_DARK_HOVERED : HEX_DARK;
    default:
      return hovered ? HEX_LIGHT_HOVERED : HEX_LIGHT;
  }
}

export { leftClick, generateBombs, rightClick, numToChar, tileColour };
