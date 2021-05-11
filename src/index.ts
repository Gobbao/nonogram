import config from './config';
import { drawPuzzle } from './draw';
import { solvePuzzle } from './puzzle';
import { trace } from './utils/functions.util';
import { Identity } from './utils/monads.util';
import { validateConfig } from './validations';

Identity(config)
  .chain(validateConfig)
  .map(solvePuzzle)
  .map(drawPuzzle)
  .catch(trace);
