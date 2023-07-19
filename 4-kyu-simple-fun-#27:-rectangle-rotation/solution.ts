function pointsCounts(a: number) {
  const maxSquareRootsOnOneSide = a / 2 / Math.SQRT2;
  const decimal = maxSquareRootsOnOneSide % 1;
  const mainPointsCount = 1 + Math.floor(maxSquareRootsOnOneSide) * 2;
  const interPointsCount = decimal >= 0.5 ? mainPointsCount + 1 : mainPointsCount - 1;
  return [mainPointsCount, interPointsCount];
}

export function rectangleRotation(a: number, b: number): number {
  const [a1, a2] = pointsCounts(a);
  const [b1, b2] = pointsCounts(b);
  return a1 * b1 + a2 * b2;
}
