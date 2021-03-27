import config from './config';
import { resolvePuzzle } from './puzzle';
import { trace } from './utils/functions.util';
import { Identity } from './utils/monads.util';
import { validateConfig } from './validations';

Identity(config)
  .chain(validateConfig)
  .map(resolvePuzzle)
  .map(trace)
  .catch(trace);
