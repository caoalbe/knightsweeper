import { UNINTIALIZED, BOMB, FLAG, BLANK, MISFLAG } from "./constants";

type value =
  | typeof UNINTIALIZED
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | typeof BOMB;

type view =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | typeof BOMB
  | typeof FLAG
  | typeof BLANK
  | typeof MISFLAG;

type Tile = {
  value: value;
  view: view;
  adj_list: Array<number>;
};

type Settings = {
  width: number;
  height: number;
  tileCount: number;
  bombCount: number;
  probability: number;
};

type Score = {
  flagCorrect: number;
  flagIncorrect: number;
  bombsRemaining: number;
  victory: boolean;
};

export type { value, view, Tile, Settings, Score };
