type ArrowHitStats = {
  points: number;
  quantity: number;
};

type ArrowHitData = ArrowHitStats & {
  label: string;
};

function sortArrowHits(arrowHitMap: Map<string, ArrowHitStats>): string[] {
  const arrowStats: ArrowHitData[] = Array.from(arrowHitMap, (arrowHitData) => ({
    label: arrowHitData[0],
    points: arrowHitData[1].points,
    quantity: arrowHitData[1].quantity,
  }));

  const sortedArrowStats = arrowStats.sort(
    (arrowA, arrowB) =>
      arrowA.points - arrowB.points ||
      arrowB.quantity - arrowA.quantity ||
      arrowA.label.charCodeAt(0) - arrowB.label.charCodeAt(0)
  );

  return sortedArrowStats.map((arrow) => arrow.label);
}

function updateArrowHitMap(
  arrowHitMapAcc: Map<string, ArrowHitStats>,
  positionValue: string,
  arrowHitStats: ArrowHitStats
): void {
  const lowerCasePositionValue = positionValue.toLowerCase();
  if (arrowHitMapAcc.has(lowerCasePositionValue)) {
    const currentArrowHitStats = arrowHitMapAcc.get(lowerCasePositionValue)!;
    currentArrowHitStats.points += arrowHitStats.points;
    currentArrowHitStats.quantity += arrowHitStats.quantity;
  } else {
    arrowHitMapAcc.set(lowerCasePositionValue, arrowHitStats);
  }
}

export function countAndSort(target: string[]): string[] {
  const centerPositionIndex = Math.floor(target.length / 2);

  const arrowHitMap = target.reduce((arrowHitMapAcc, row, rowIndex) => {
    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      const positionValue = target[rowIndex][columnIndex];

      if (!/[a-z]/i.test(positionValue)) continue;

      const maxPositionalDistance = Math.max(
        Math.abs(centerPositionIndex - rowIndex),
        Math.abs(centerPositionIndex - columnIndex)
      );
      const arrowHitStats: ArrowHitStats = {
        points: centerPositionIndex + 1 - maxPositionalDistance,
        quantity: 1,
      };

      if (/[A-Z]/.test(positionValue)) {
        arrowHitStats.points *= 2;
        arrowHitStats.quantity += 1;
      }

      updateArrowHitMap(arrowHitMapAcc, positionValue, arrowHitStats);
    }

    return arrowHitMapAcc;
  }, new Map<string, ArrowHitStats>());

  return sortArrowHits(arrowHitMap);
}
