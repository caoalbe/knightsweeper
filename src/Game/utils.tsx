import { UNINTIALIZED, BOMB, FLAG, BLANK } from "./constants";
import { Tile, view } from "./types";
import { Dispatch, SetStateAction } from "react";

const width = 18;
const height = 14;
const tileCount = width * height;

function leftClick(
  index: number,
  tileData: Array<Tile>,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>
) {
  const currView = tileData[index].view;
  const currValue = tileData[index].value;

  if (currValue == UNINTIALIZED) {
    // generate board
    console.log("case uninit");
    tileData = generateBombs(index);
  }

  if (currView == BLANK) {
    console.log("case blnk");
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

function generateBombs(index: number) {
  // naive rng generation
  // place the bombs
  const probability = 0.15;
  const newTiles = new Array(tileCount).fill(0);
  const safeTiles = computeAdjacencyList(index);
  safeTiles.push(index);

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

function computeAdjacencyList(index: number) {
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
) {
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

// 0->9 is revealed
function numToChar(input: view) {
  switch (input) {
    case BLANK:
      return "";
    case BOMB:
      return "💣";
    case FLAG:
      return "🚩";
    default:
      return input;
  }
}

export { leftClick, generateBombs, rightClick, numToChar };
