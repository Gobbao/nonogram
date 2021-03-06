export interface Config {
  width: number;
  height: number;
  columns: number[][];
  rows: number[][];
}

export interface Monad<T> {
  call: (fn: (value: T) => any) => Monad<T>;
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
  isImpossibleToSolve: boolean;
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

export type Curried<A extends any[], R> =
  <P extends Partial<A>>(...args: P) => P extends A
    ? R
    : A extends [...SameLength<P>, ...infer S]
      ? S extends any[]
        ? Curried<S, R>
        : never
      : never;

export type SameLength<T extends any[]> = Extract<{ [K in keyof T]: any }, any[]>
