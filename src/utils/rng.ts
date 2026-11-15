import { randomInt } from "node:crypto";

export function shuffleArray<T>(source: T[]): T[] {
  const array = Array.from(source);
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j]!, array[i]!];
  }

  return array;
}
