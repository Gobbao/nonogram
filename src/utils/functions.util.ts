export const sum = (num1: number, num2: number) => num1 + num2;

export const trace = <T>(value: T) => {
  console.log(value instanceof Error ? value.message : value);

  return value;
};

export const get = <T extends string | number>(key: T) =>
  <U extends { [key in T]?: unknown }>(obj: U) => obj[key];

export const flat = <T>(items: T[][]): T[] => items.reduce(concat, []);

export const concat = <T>(items1: T[], items2: T[]) => [].concat(items1, items2);

export const slice = (start?: number, end?: number) => <T>(items: T[]) => items.slice(start, end);

export const cloneMatrix = <T>(items: T[][]) => items.map((item) => [...item]);

export const repeatTimes = <T>(times: number, value: T, fn: (value: T, index: number) => T) =>
  Array<typeof fn>(times).fill(fn).reduce((acc, curr, index) => curr(acc, index), value);
