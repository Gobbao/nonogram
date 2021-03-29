import { Config, GridCell, Puzzle, PuzzleLine } from './types';
import { cloneMatrix, flat, get, repeatTimes, slice, sum } from './utils/functions.util';
import { Identity } from './utils/monads.util';

export const solvePuzzle = (config: Config): Puzzle =>
  // TODO: loop to solve
  // TODO: solve rows
  repeatTimes(config.width, buildNewPuzzle(config), solveColumns);

const buildNewPuzzle = (config: Config): Puzzle => ({
  config,
  filledSpacesTotalCount: countTotalFilledSpaces(config),
  grid: buildNewGrid(config),
});

const countTotalFilledSpaces = (config: Config) => flat(config.columns).reduce(sum, 0);

const buildNewGrid = (config: Config): number[][] =>
  Array(config.width).fill(null).map(() => Array(config.height).fill(GridCell.Blank));

const solveColumns = (puzzle: Puzzle, columnIndex: number) =>
  Identity(buildColumnLine(puzzle, columnIndex))
    .map(fillLineByConjunction(puzzle.config.height))
    .map(copyColumnIntoGrid)
    .map(get('puzzle'))
    .getOrElse();

const buildColumnLine = (puzzle: Puzzle, columnIndex: number): PuzzleLine => ({
  line: puzzle.grid.map(slice(columnIndex, columnIndex + 1)).flat(),
  lineConfig: puzzle.config.columns[columnIndex],
  lineIndex: columnIndex,
  puzzle,
});

export const countNecessarySpaces = (line: number[]) => {
  const countFilledSpaces = line.reduce(sum, 0);
  const countBlankSpaces = (line.length || 1) - 1;

  return countFilledSpaces + countBlankSpaces;
};

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
      diff: lineLength - countNecessarySpaces(puzzleLine.lineConfig),
      sum: 0,
      line: puzzleLine.line,
    },
  );

  return {
    ...puzzleLine,
    line,
  };
};

const copyColumnIntoGrid = (puzzleLine: PuzzleLine): PuzzleLine => {
  const clonedGrid = cloneMatrix(puzzleLine.puzzle.grid);

  puzzleLine.line.forEach((value, rowIndex) => {
    clonedGrid[rowIndex][puzzleLine.lineIndex] = value;
  });

  return {
    ...puzzleLine,
    puzzle: {
      ...puzzleLine.puzzle,
      grid: clonedGrid,
    },
  };
};
