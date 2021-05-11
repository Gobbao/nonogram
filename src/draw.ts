import * as chalk from 'chalk';
import { GridCell, Puzzle } from './types';
import { always, get } from './utils/functions.util';
import { Identity, Left, Right } from './utils/monads.util';
import { isCellFilled } from './utils/puzzle.utils';

const EMPTY_CELL = '  ';
const FILLED_CELL = chalk.inverse('  ');

export const drawPuzzle = (puzzle: Puzzle) =>
  Identity(puzzle)
    .call(printSeparator)
    .call(printImpossibleMessageIfNecessary)
    .map(get('grid'))
    .map(drawGrid)
    .call(print)
    .call(printSeparator)
    .map(always(puzzle))
    .getOrElse();

const printSeparator = () => console.log();

const printImpossibleMessageIfNecessary = (puzzle: Puzzle) =>
  (puzzle.isImpossibleToSolve ? Right(puzzle) : Left(puzzle))
    .map(always(chalk.red('Impossible to solve this puzzle.')))
    .call(print)
    .call(printSeparator);

const print = (value: string) => console.log(value);

const drawGrid = (grid: GridCell[][]) => grid.map(drawLine).join('\n');

const drawLine = (line: GridCell[]) => line.map(drawCell).join('');

const drawCell = (cell: GridCell) => isCellFilled(cell) ? FILLED_CELL : EMPTY_CELL;
