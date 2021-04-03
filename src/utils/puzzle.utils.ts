import { Config, GridCell, Puzzle, PuzzleLine } from '../types';
import { always, cloneMatrix, flat, slice, sum } from './functions.util';

export const buildColumnLine = (puzzle: Puzzle, columnIndex: number): PuzzleLine => ({
  line: puzzle.grid.flatMap(slice(columnIndex, columnIndex + 1)),
  lineConfig: puzzle.config.columns[columnIndex],
  lineIndex: columnIndex,
  puzzle,
});

export const buildNewGrid = ({ height, width }: Config): GridCell[][] =>
  Array(width).fill(null).map(always(Array(height).fill(GridCell.Blank)));

export const buildNewPuzzle = (config: Config): Puzzle => ({
  config,
  filledCellsTotalCount: countTotalCellsToFill(config),
  grid: buildNewGrid(config),
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

export const countNecessaryCells = (lineConfig: number[]) => {
  const countFilledCells = lineConfig.reduce(sum, 0);
  const countBlankCells = (lineConfig.length || 1) - 1;

  return countFilledCells + countBlankCells;
};

export const countTotalCellsToFill = ({ columns }: Config) => flat(columns).reduce(sum, 0);