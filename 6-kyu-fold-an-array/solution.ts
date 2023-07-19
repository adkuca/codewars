export function foldArray(array: number[], runs: number): number[] {
  const arrayCopy = Array.from(array);

  for (let foldIterationIndex = 0; foldIterationIndex < runs; foldIterationIndex += 1) {
    const arrayCopyLength = arrayCopy.length;
    for (let arrayCopyIndex = 0; arrayCopyIndex < (arrayCopyLength - 1) / 2; arrayCopyIndex += 1) {
      arrayCopy[arrayCopyIndex] = arrayCopy[arrayCopyIndex] + arrayCopy.pop()!;
    }
  }

  return arrayCopy;
}
