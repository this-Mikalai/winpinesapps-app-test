export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
