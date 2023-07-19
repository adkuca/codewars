const u = (n: number): number[] => {
  const res = [1];
  let indexY = 0,
    indexZ = 0;

  for (let index = 0; index < n; index += 1) {
    const y = 2 * res[indexY] + 1;
    const z = 3 * res[indexZ] + 1;

    if (y <= z) {
      res.push(y);
      indexY += 1;
      if (y === z) indexZ += 1;
    } else {
      res.push(z);
      indexZ += 1;
    }
  }

  return res;
};

export function dblLinear(n: number): number {
  return u(n)[n]!;
}
