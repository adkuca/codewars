export function sumPairs(integers: number[], targetSum: number): [number, number] | void {
  const complements = new Set<number>();
  const sumPairObjects: { pair: [number, number]; secondElementIndex: number }[] = [];

  integers.forEach((integer, index) => {
    const complement = targetSum - integer;
    if (complements.has(integer))
      sumPairObjects.push({ pair: [complement, integer], secondElementIndex: index });
    complements.add(complement);
  });

  if (!sumPairObjects.length) return;

  const sumPairObjectWithSmallestSecondElementIndex = sumPairObjects.reduce((acc, curr) =>
    acc.secondElementIndex < curr.secondElementIndex ? acc : curr
  );

  return sumPairObjectWithSmallestSecondElementIndex.pair;
}
