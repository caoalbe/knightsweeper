import {
  UNINTIALIZED,
  BOMB,
  FLAG,
  BLANK,
  MISFLAG,
  HEX_REVEALED,
  HEX_LIGHT,
  HEX_DARK,
  HEX_REVEALED_HOVERED,
  HEX_LIGHT_HOVERED,
  HEX_DARK_HOVERED,
} from "./constants";
import { Tile, Settings, Score, view, value } from "./types";
import { Dispatch, SetStateAction } from "react";

function leftClick(
  index: number,
  tileData: Array<Tile>,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>,
  gameOver: boolean,
  setGameOver: Dispatch<SetStateAction<boolean>>,
  setPopupActive: Dispatch<SetStateAction<boolean>>,
  settings: Settings
): void {
  const currView: view = tileData[index].view;
  const currValue: value = tileData[index].value;

  if (currView === FLAG || gameOver) {
    return; // do nothing
  }

  if (currValue === UNINTIALIZED) {
    // generate board
    tileData = generateBombs(index, settings);
  }

  if (currView === BLANK && currValue !== BOMB) {
    // reveal in bfs fashion
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

    var revealedEverything = true;
    for (var i = 0; i < settings.tileCount; i++) {
      if (newTileData[i].value !== BOMB && newTileData[i].view === BLANK) {
        revealedEverything = false;
        break;
      }
    }

    setTileData(newTileData);
    if (revealedEverything) {
      setGameOver(true);
      setPopupActive(true);
    }
  }

  if (currView === BLANK && currValue === BOMB) {
    // GAME OVER
    const newTileData: Array<Tile> = tileData.map((tile) => {
      if (tile.value === BOMB && tile.view === BLANK) {
        return { value: tile.value, view: BOMB, adj_list: tile.adj_list };
      } else if (tile.value !== BOMB && tile.view === FLAG) {
        return { value: tile.value, view: MISFLAG, adj_list: tile.adj_list };
      } else {
        return tile;
      }
    });
    setTileData(newTileData);
    setGameOver(true);
    setPopupActive(true);
  }
}

function generateBombs(index: number, settings: Settings): Array<Tile> {
  // naive rng generation
  // place the bombs

  const newTiles: Array<Tile> = new Array(settings.tileCount).fill(0);
  const probability: number = 0.15;

  // set newTiles <view> and <adj_list>
  var i: number;
  for (i = 0; i < settings.tileCount; i++) {
    newTiles[i] = {
      value: UNINTIALIZED,
      view: BLANK,
      adj_list: computeAdjacencyList(i, settings),
    };
  }

  const reservedTiles: Array<number> = newTiles[index].adj_list;
  reservedTiles.push(index);

  // place bombs
  var placedBombs = 0;
  i = 0;
  while (placedBombs < settings.bombCount) {
    if (
      !reservedTiles.includes(i % settings.tileCount) &&
      newTiles[i % settings.tileCount].value === UNINTIALIZED &&
      (Math.random() < probability || i > 3 * settings.tileCount)
    ) {
      newTiles[i % settings.tileCount] = {
        value: BOMB,
        view: newTiles[i % settings.tileCount].view,
        adj_list: newTiles[i % settings.tileCount].adj_list,
      };
      placedBombs++;
    }
    i++;
  }

  // enumerate the safe tiles
  var num_bombs;
  for (i = 0; i < settings.tileCount; i++) {
    if (newTiles[i].value === UNINTIALIZED) {
      num_bombs = newTiles[i].adj_list
        .map((neighbour: number) => newTiles[neighbour].value)
        .filter((val: number) => {
          return val === BOMB;
        }).length as value;

      newTiles[i].value = num_bombs;
    }
  }
  return newTiles;
}

function computeAdjacencyList(
  index: number,
  settings: Settings
): Array<number> {
  if (index < 0 || index >= settings.tileCount) {
    return [];
  }

  const col = index % settings.width;
  const row = Math.floor(index / settings.width);

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
      if (0 <= x && x < settings.width && 0 <= y && y < settings.height) {
        return true;
      } else {
        return false;
      }
    })
    .map(([x, y]) => y * settings.width + x);
}

function rightClick(
  index: number,
  tileData: Array<Tile>,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>,
  flagsRemaining: number,
  setFlagsRemaining: Dispatch<SetStateAction<number>>
): void {
  // flag or blank
  const currView: view = tileData[index].view;
  var newView: view;

  switch (currView) {
    case BLANK:
      newView = FLAG;
      setFlagsRemaining(flagsRemaining - 1);
      break;
    case FLAG:
      newView = BLANK;
      setFlagsRemaining(flagsRemaining + 1);
      break;
    default:
      return;
  }

  const newTileData = tileData.map((e, i) => {
    if (index === i) {
      return { value: e.value, view: newView, adj_list: e.adj_list };
    } else {
      return e;
    }
  });
  setTileData(newTileData);
}

function restartGame(
  gameSettings: Settings,
  setTileData: Dispatch<SetStateAction<Array<Tile>>>,
  setPopupActive: Dispatch<SetStateAction<boolean>>,
  setGameOver: Dispatch<SetStateAction<boolean>>,
  setFlagsRemaining: Dispatch<SetStateAction<number>>
) {
  setTileData(
    new Array(gameSettings.tileCount)
      .fill(0)
      .map(() => ({ value: UNINTIALIZED, view: BLANK, adj_list: [] }))
  );
  setPopupActive(false);
  setGameOver(false);
  setFlagsRemaining(gameSettings.bombCount);
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
    case MISFLAG:
      return "❌";
    default:
      return input.toString();
  }
}

function generateScore(tileData: Array<Tile>): Score {
  if (tileData.length === 0) {
    return {
      flagCorrect: 0,
      flagIncorrect: 0,
      bombsRemaining: 0,
      victory: false,
    };
  }

  var flag_count = 0;
  var misflag_count = 0;
  var bomb_count = 0;
  var blank_count = 0;
  var swept_count = 0;
  var currTile;
  for (var i = 0; i < tileData.length; i++) {
    currTile = tileData[i];
    if (currTile.view === FLAG) {
      flag_count++;
    } else if (currTile.view === MISFLAG) {
      misflag_count++;
    } else if (currTile.view === BOMB) {
      bomb_count++;
    } else if (currTile.view === BLANK) {
      blank_count++;
    } else {
      // currTile.view in [0, ...,8]
      swept_count++;
    }
  }
  return {
    flagCorrect: flag_count,
    flagIncorrect: misflag_count,
    bombsRemaining: bomb_count,
    victory: bomb_count === 0,
  };
}

function generateSettings(
  width: number,
  height: number,
  bombCount: number
): Settings {
  return {
    width: width,
    height: height,
    tileCount: width * height,
    bombCount: bombCount,
    probability: bombCount / (width * height),
  };
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

export {
  leftClick,
  generateBombs,
  rightClick,
  restartGame,
  numToChar,
  generateSettings,
  generateScore,
  tileColour,
};
