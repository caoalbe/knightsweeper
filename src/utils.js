import { UNINTIALIZED, BOMB, FLAG, BLANK } from "./constants";

const width = 18;
const height = 14;
const tileCount = width * height;

function leftClick(index, tileData, setTileData) {
  if (tileData[index].view === FLAG) {
    return; // do nothing
  }

  const queue = [index]; // dequeue()-->shift(), enqueue(v)-->push(v)
  const explored = [index];
  var curr;
  var dest;
  while (queue.length > 0) {
    curr = queue.shift();
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

  const newTileData = tileData.map((e, i) => {
    if (explored.includes(i)) {
      return { value: e.value, view: e.value, adj_list: e.adj_list };
    } else {
      return e;
    }
  });

  setTileData(newTileData);
}

function generateBombs(index) {
  // naive rng generation
  // place the bombs
  const probability = 0.25;
  const newTiles = new Array(tileCount).fill();
  var i;
  for (i = 0; i < tileCount; i++) {
    newTiles[i] = {
      value: i !== index && Math.random() < probability ? BOMB : UNINTIALIZED,
      view: BLANK,
      adj_list: computeAdjacencyList(i),
    };
  }

  // enumerate the safe tiles
  for (i = 0; i < tileCount; i++) {
    if (newTiles[i].value === UNINTIALIZED) {
      newTiles[i].value = newTiles[i].adj_list
        .map((index) => newTiles[index].value)
        .filter((val) => {
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

function computeAdjacencyList(index) {
  if (index < 0 || index >= tileCount) {
    console.log("out of bounds error");
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

function rightClick(index, tileData, setTileData) {
  // flag or blank
  if (tileData[index].view === BLANK || tileData[index].view === FLAG) {
    const newView = tileData[index].view === BLANK ? FLAG : BLANK;

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
function numToChar(input) {
  if (input === BLANK || input == UNINTIALIZED) {
    return "";
  } else if (input === BOMB) {
    return "💣";
  } else if (input === FLAG) {
    return "🚩";
  } else {
    return input;
  }
}

export {
  leftClick,
  generateBombs,
  computeAdjacencyList,
  rightClick,
  numToChar,
};
