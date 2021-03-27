import { Config, GridCell, Puzzle } from './types';
import { cloneMatrix, flat, sum } from './utils/functions.util';

export const resolvePuzzle = (config: Config) => {
  const puzzle = buildNewPuzzle(config);

  // TODO: analyze columns

  // TODO: analyze rows

  return puzzle;
};

const buildNewPuzzle = (config: Config): Puzzle => ({
  config,
  filledSpacesCount: 0,
  spacesTotalCount: countTotalSpaces(config),
  filledSpacesTotalCount: countTotalFilledSpaces(config),
  grid: buildNewGrid(config),
});

const countTotalSpaces = (config: Config) => config.width * config.height;

const countTotalFilledSpaces = (config: Config) => flat(config.columns).reduce(sum, 0);

const buildNewGrid = (config: Config): number[][] =>
  Array(config.width).fill(null).map(() => Array(config.height).fill(GridCell.Blank));

export const countNecessarySpaces = (line: number[]) => {
  const countFilledSpaces = line.reduce(sum, 0);
  const countBlankSpaces = (line.length || 1) - 1;

  return countFilledSpaces + countBlankSpaces;
};
