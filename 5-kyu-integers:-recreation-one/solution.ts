function calcSquaredDivisorsSum(n: number): number {
  if (n === 1) return 1;
  let squaredDivisorsSum = 0;
  for (let index = 1; index < Math.sqrt(n); index += 1)
    if (n % index === 0) squaredDivisorsSum += index ** 2 + (n / index) ** 2;
  return squaredDivisorsSum;
}

export const listSquared = (m: number, n: number): [number, number][] => {
  const result: [number, number][] = [];

  for (let index = m; index <= n; index += 1) {
    const squaredDivisorsSum = calcSquaredDivisorsSum(index);
    if (Number.isInteger(Math.sqrt(squaredDivisorsSum))) result.push([index, squaredDivisorsSum]);
  }

  return result;
};
