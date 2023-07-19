export function findUniq(arr: string[]): string {
  const latestTwo: [number, string][] = [];
  let result: string = '';

  arr.every((str, index) => {
    let cleanStr = str.replaceAll(/\s+/g, '').toLowerCase();
    const charCodeSum = [...new Set(cleanStr)].reduce((acc, curr) => acc + curr.charCodeAt(0), 0);

    if (index >= 2) {
      const count = latestTwo.reduce((acc, item) => (item[0] === charCodeSum ? acc + 1 : acc), 0);
      if (count === 0) {
        result = str;
        return false;
      } else if (count === 1) {
        const resultItem = latestTwo.find((item) => item[0] !== charCodeSum);
        if (!resultItem) throw new Error('unique item should exist');
        result = resultItem[1];
        return false;
      }

      latestTwo.shift();
    }

    latestTwo.push([charCodeSum, str]);
    return true;
  });

  return result.toString();
}
