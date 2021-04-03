import { Config, GridCell, Puzzle, PuzzleLine } from './types';
import { get, repeatTimes } from './utils/functions.util';
import { Identity } from './utils/monads.util';
import {
  buildColumnLine,
  buildNewPuzzle,
  copyColumnIntoGrid,
  countNecessaryCells,
} from './utils/puzzle.utils';

export const solvePuzzle = (config: Config): Puzzle =>
  // TODO: loop to solve
  // TODO: solve rows
  repeatTimes(config.width, buildNewPuzzle(config), solveColumns);

const solveColumns = (puzzle: Puzzle, columnIndex: number) =>
  Identity(buildColumnLine(puzzle, columnIndex))
    .map(fillLineByConjunction(puzzle.config.height))
    .map(copyColumnIntoGrid)
    .map(get('puzzle'))
    .getOrElse();

const fillLineByConjunction = (lineLength: number) => (puzzleLine: PuzzleLine): PuzzleLine => {
  const { line } = puzzleLine.lineConfig.reduce(
    ({ diff, line, sum }, value) => ({
      diff,
      sum: sum + value + 1,
      line: line
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
