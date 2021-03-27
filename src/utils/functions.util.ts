export const sum = (num1: number, num2: number) => num1 + num2;

export const trace = <T>(value: T) => {
  console.log(value instanceof Error ? value.message : value);

  return value;
};

export const flat = <T>(items: T[][]): T[] => items.reduce(concat, []);

export const concat = <T>(items1: T[], items2: T[]) => [].concat(items1, items2);

export const cloneMatrix = <T>(items: T[][]) => items.map((item) => [...item]);
