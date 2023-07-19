namespace Pad {
  export type Position = string;

  export type PositionSequenceState = {
    sequence: Position[];
    visited: boolean[];
  };

  const midpointsMap = new Map([
    ['AC', 'B'],
    ['AG', 'D'],
    ['AI', 'E'],
    ['BH', 'E'],
    ['CG', 'E'],
    ['CI', 'F'],
    ['DF', 'E'],
    ['GI', 'H'],
  ]);

  const padPositions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  export const getLineMiddlePosition = (positionA: string, positionB: string) => {
    const sortedPositions =
      positionA < positionB ? `${positionA}${positionB}` : `${positionB}${positionA}`;
    return midpointsMap.has(sortedPositions) ? midpointsMap.get(sortedPositions)! : null;
  };

  export const findPossibleSequences = (
    startPosition: Position,
    sequenceLength: number
  ): Position[][] => {
    const possibleSequences: Position[][] = [];
    const startingPositionSequenceState: PositionSequenceState = {
      sequence: [startPosition],
      visited: padPositions.map((position) => (position === startPosition ? true : false)),
    };
    const stack: PositionSequenceState[] = [startingPositionSequenceState];

    while (stack.length > 0) {
      const { sequence: currentPositionSequence, visited } = stack.pop()!;

      if (currentPositionSequence.length === sequenceLength) {
        possibleSequences.push(currentPositionSequence);
        continue;
      }

      for (
        let padPositionIndex = 0;
        padPositionIndex < padPositions.length;
        padPositionIndex += 1
      ) {
        const lastSequencePosition = currentPositionSequence[currentPositionSequence.length - 1];
        if (visited[padPositionIndex]) continue;

        const currentPosition = padPositions[padPositionIndex];
        const lineMiddlePosition = getLineMiddlePosition(currentPosition, lastSequencePosition);
        if (lineMiddlePosition && !visited[padPositions.indexOf(lineMiddlePosition)]) continue;
        const newVisited = [...visited];
        newVisited[padPositionIndex] = true;

        stack.push({
          sequence: [...currentPositionSequence, padPositions[padPositionIndex]],
          visited: newVisited,
        });
      }
    }

    return possibleSequences;
  };
}

export function calculateCombinations(startPosition: string, patternLength: number): number {
  return Pad.findPossibleSequences(startPosition, patternLength).length;
}
