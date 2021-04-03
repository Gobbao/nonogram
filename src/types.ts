export interface Config {
  width: number;
  height: number;
  columns: number[][];
  rows: number[][];
}

export interface Monad<T> {
  chain: <R, U extends Monad<R>>(fn: (value: T) => U) => U;
  getOrElse: (defaultValue?: T) => T;
  map: <R>(fn: (value: T) => R) => Monad<R>;
}

export interface EitherMonad<T> extends Monad<T> {
  catch: <R>(fn: (value: T) => R) => EitherMonad<R>;
  map: <R>(fn: (value: T) => R) => EitherMonad<R>;
}

export interface Puzzle {
  config: Config;
  filledCellsTotalCount: number;
  grid: GridCell[][];
}

export const enum GridCell {
  Blank,
  Filled,
  Empty,
}

export interface PuzzleLine {
  line: GridCell[];
  lineConfig: number[];
  lineIndex: number;
  puzzle: Puzzle;
}
