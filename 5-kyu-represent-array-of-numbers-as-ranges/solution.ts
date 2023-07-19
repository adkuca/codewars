function range(start: number, end: number): number[] {
  const range: number[] = [];
  for (let i = start; i <= end; i += 1) range.push(i);
  return range;
}

export function toRange(arr: number[]): string {
  if (!arr.length) return '';

  const sorted = [...new Set(arr)].sort((a, b) => a - b);

  let range = sorted.reduce((acc, curr, i, arr) => {
    const isLastIndex = i === arr.length - 1;
    if (!isLastIndex && arr[i + 1] - curr === 1) {
      return !acc.endsWith('_') ? `${acc}${curr}_` : acc;
    }

    return isLastIndex ? `${acc}${curr}` : `${acc}${curr},`;
  }, '');

  return range;
}

export function toArray(str: string): number[] {
  if (!str.length) return [];

  return str.split(',').flatMap((val) => {
    const match = val.match(/(-{0,1}\d+)_(-{0,1}\d+)/);
    return match ? range(+match[1], +match[2]) : +val;
  });
}
