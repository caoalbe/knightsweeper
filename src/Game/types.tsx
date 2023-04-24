import { UNINTIALIZED, BOMB, FLAG, BLANK } from "./constants";

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
  | typeof BLANK;

type Tile = {
  value: value;
  view: view;
  adj_list: Array<number>;
};

export type { Tile, value, view };
