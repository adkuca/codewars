function findTwo<T>(array: T[], filterFn: (value: T, index: number, array: T[]) => boolean): T[] {
  const found: T[] = [];
  for (let i = 0; i < array.length && found.length < 2; i += 1) {
    const value = array[i];
    if (filterFn(value, i, array)) found.push(value);
  }

  return found;
}

export class Game {
  board: { top: number; right: number; bottom: number; left: number }[][];
  boardSize: number;

  constructor(boardSize: number) {
    this.boardSize = boardSize;
    const verticalNumberingDifference = boardSize * 2 + 1;
    this.board = Array.from({ length: boardSize }, (_, j) =>
      Array.from({ length: boardSize }, (_, i) => {
        const top = i + 1 + j * verticalNumberingDifference,
          left = top + boardSize,
          right = left + 1,
          bottom = right + boardSize;
        return { top, left, right, bottom };
      })
    );
  }

  playTurn(lines: Set<number>) {
    for (let j = 0; j < this.boardSize; j += 1) {
      for (let i = 0; i < this.boardSize; i += 1) {
        const square = this.board[j][i];
        const linesNotOfSquare = findTwo(Object.values(square), (line) => !lines.has(line));
        // if it doesn't have only one, then complete it
        if (linesNotOfSquare.length === 1) lines.add(linesNotOfSquare[0]);
      }
    }
  }

  play(initialLines: number[]): number[] {
    const lines = new Set(initialLines);

    let linesSizeAtStartOfIteration: number;
    do {
      linesSizeAtStartOfIteration = lines.size;
      this.playTurn(lines);
    } while (linesSizeAtStartOfIteration !== lines.size);

    return [...lines].sort((a, b) => a - b);
  }
}
