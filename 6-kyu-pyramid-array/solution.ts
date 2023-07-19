export function pyramid(n: number) {
  return Array.from({ length: n }, (_, index) => new Array(index + 1).fill(1));
}
