export function findUniq(arr: number[]): number {
  const nonUnique = arr[arr[0] === arr[1] ? 0 : 2];
  const unique = arr.find((n) => n !== nonUnique);
  if (unique === undefined) throw new Error('arr had no non-uniques');
  return unique;
}
