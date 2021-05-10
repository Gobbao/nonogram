import { Config, GridCell, Puzzle, PuzzleLine } from '../types';
import { always, cloneMatrix, flat, slice, sum } from './functions.util';

export const buildColumnLine = (puzzle: Puzzle, columnIndex: number): PuzzleLine => ({
  line: puzzle.grid.flatMap(slice(columnIndex, columnIndex + 1)),
  lineConfig: puzzle.config.columns[columnIndex],
  lineIndex: columnIndex,
  puzzle,
});

export const buildRowLine = (puzzle: Puzzle, rowIndex: number): PuzzleLine => ({
  line: puzzle.grid[rowIndex],
  lineConfig: puzzle.config.rows[rowIndex],
  lineIndex: rowIndex,
  puzzle,
});

export const buildNewGrid = ({ height, width }: Config): GridCell[][] =>
  Array(width).fill(null).map(always(Array(height).fill(GridCell.Blank)));

export const buildNewPuzzle = (config: Config): Puzzle => ({
  config,
  filledCellsTotalCount: countTotalCellsToFill(config),
  grid: buildNewGrid(config),
  isImpossibleToSolve: false,
});

export const copyColumnIntoGrid = (puzzleLine: PuzzleLine): PuzzleLine => {
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

export const copyRowIntoGrid = (puzzleLine: PuzzleLine): PuzzleLine => {
  const clonedGrid = cloneMatrix(puzzleLine.puzzle.grid);

  clonedGrid[puzzleLine.lineIndex] = [...puzzleLine.line];

  return {
    ...puzzleLine,
    puzzle: {
      ...puzzleLine.puzzle,
      grid: clonedGrid,
    },
  };
}

export const countFilledCells = (grid: GridCell[][]) => grid.flat().filter(isCellFilled).length;

export const countNecessaryCells = (lineConfig: number[]) => {
  const countFilledCells = lineConfig.reduce(sum, 0);
  const countBlankCells = (lineConfig.length || 1) - 1;

  return countFilledCells + countBlankCells;
};

export const countTotalCellsToFill = ({ columns }: Config) => flat(columns).reduce(sum, 0);

export const isCellFilled = (cell: GridCell) => cell === GridCell.Filled;

export const isPuzzleUnsolved = (puzzle: Puzzle) =>
  countFilledCells(puzzle.grid) !== puzzle.filledCellsTotalCount && !puzzle.isImpossibleToSolve;

export const setAsImpossibleIfNecessary = (oldPuzzle: Puzzle) => (newPuzzle: Puzzle): Puzzle => {
  const newCount = countFilledCells(newPuzzle.grid);
  const oldCount = countFilledCells(oldPuzzle.grid);
  const isImpossibleToSolve = newCount === oldCount;

  return { ...newPuzzle, isImpossibleToSolve };
}
