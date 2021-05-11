import ErrorMessage from './errors';
import { Config } from './types';
import { Identity, tryOrCatch } from './utils/monads.util';
import { always, flat, sum } from './utils/functions.util';
import { countNecessaryCells } from './utils/puzzle.utils';

export const validateConfig = (config: Config) =>
  Identity(config)
    .chain(validateWidth)
    .chain(validateHeight)
    .chain(validateColumns)
    .chain(validateRows)
    .chain(validateSpacesCount);

const validateWidth = (config: Config) =>
  validateSize(config.width, ErrorMessage.INVALID_WIDTH).map(always(config));

const validateHeight = (config: Config) =>
  validateSize(config.height, ErrorMessage.INVALID_HEIGHT).map(always(config));

const validateSize = (value: number, error: ErrorMessage) => tryOrCatch(() => {
  if (value <= 0 || value % 5 !== 0) {
    throw new Error(error);
  }

  return value;
});

const validateColumns = (config: Config) =>
  Identity(config.columns)
    .chain(validateLineLength(config.width, ErrorMessage.INVALID_COLUMNS))
    .chain(validateLineSpaces(config.height, ErrorMessage.INVALID_COLUMNS))
    .map(always(config));

const validateRows = (config: Config) =>
  Identity(config.rows)
    .chain(validateLineLength(config.height, ErrorMessage.INVALID_ROWS))
    .chain(validateLineSpaces(config.width, ErrorMessage.INVALID_ROWS))
    .map(always(config));

const validateLineLength = (length: number, error: ErrorMessage) => (lines: number[][]) =>
  tryOrCatch(() => {
    if (!lines || lines.length !== length) {
      throw new Error(error);
    }

    return lines;
  });

const validateLineSpaces = (length: number, error: ErrorMessage) => (lines: number[][]) =>
  tryOrCatch(() => {
    for (const line of lines) {
      if (countNecessaryCells(line) > length) {
        throw new Error(error);
      }
    }

    return lines;
  });

const validateSpacesCount = (config: Config) => tryOrCatch(() => {
  const columnsSpacesCount = flat(config.columns).reduce(sum, 0);
  const rowsSpacesCount = flat(config.rows).reduce(sum, 0);

  if (columnsSpacesCount !== rowsSpacesCount) {
    throw new Error(ErrorMessage.INVALID_SPACES_COUNT);
  }

  return config;
});
