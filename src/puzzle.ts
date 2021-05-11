import { Config, GridCell, Puzzle, PuzzleLine } from './types';
import { curry, get, repeatTimes, repeatWhile } from './utils/functions.util';
import { Identity } from './utils/monads.util';
import {
  buildColumnLine,
  buildNewPuzzle,
  buildRowLine,
  copyColumnIntoGrid,
  copyRowIntoGrid,
  countNecessaryCells,
  isPuzzleUnsolved,
  setAsImpossibleIfNecessary,
} from './utils/puzzle.utils';

export const solvePuzzle = (config: Config): Puzzle =>
  Identity(config)
    .map(buildNewPuzzle)
    .map(repeatWhileUnsolved(solvePuzzleStep))
    .getOrElse();

const repeatWhileUnsolved = curry(repeatWhile)(isPuzzleUnsolved);

const solvePuzzleStep = (puzzle: Puzzle) => {
  const repeatForEachColumn = curry(repeatTimes)(puzzle.config.width);
  const repeatForEachRow = curry(repeatTimes)(puzzle.config.height);

  return Identity(puzzle)
    .map(repeatForEachColumn(solveColumn))
    .map(repeatForEachRow(solveRow))
    .map(setAsImpossibleIfNecessary(puzzle))
    .getOrElse();
};

const solveColumn = (puzzle: Puzzle, columnIndex: number) =>
  Identity(buildColumnLine(puzzle, columnIndex))
    .map(fillLineByConjunction(puzzle.config.height))
    .map(copyColumnIntoGrid)
    .map(get('puzzle'))
    .getOrElse();

const solveRow = (puzzle: Puzzle, rowIndex: number) =>
  Identity(buildRowLine(puzzle, rowIndex))
    .map(fillLineByConjunction(puzzle.config.width))
    .map(copyRowIntoGrid)
    .map(get('puzzle'))
    .getOrElse();

const fillLineByConjunction = (lineLength: number) => (puzzleLine: PuzzleLine): PuzzleLine => {
  const { line } = puzzleLine.lineConfig.reduce(
    ({ diff, line, sum }, value) => ({
      diff,
      sum: sum + value + 1,
      line: value <= diff
        ? line
        : line
          .slice(0, sum + diff)
          .concat(Array(value - diff).fill(GridCell.Filled))
          .concat(line.slice(sum + value)),
    }),
    {
      diff: lineLength - countNecessaryCells(puzzleLine.lineConfig),
      sum: 0,
      line: puzzleLine.line,
    },
  );

  return {
    ...puzzleLine,
    line,
  };
};
