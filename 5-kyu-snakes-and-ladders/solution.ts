class Player {
  private position: number = 0;
  label: string;

  constructor(label: string) {
    this.label = label;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position: number) {
    this.position = position;
  }
}

export class SnakesLadders {
  currentPlayer: Player;
  player1: Player;
  player2: Player;
  hasEnded: boolean = false;
  specialPositions = new Map([
    [2, 38],
    [7, 14],
    [8, 31],
    [15, 26],
    [16, 6],
    [21, 42],
    [28, 84],
    [36, 44],
    [46, 25],
    [49, 11],
    [51, 67],
    [62, 19],
    [64, 60],
    [71, 91],
    [74, 53],
    [78, 98],
    [87, 94],
    [89, 68],
    [92, 88],
    [95, 75],
    [99, 80],
  ]);

  constructor() {
    this.player1 = new Player('Player 1');
    this.player2 = new Player('Player 2');
    this.currentPlayer = this.player1;
  }

  getNewBoardPositionOutput(player: Player, position: number) {
    if (position === 100) return `${player.label} Wins!`;
    return `${player.label} is on square ${position}`;
  }

  handleNewBoardPosition(position: number) {
    if (position === 100) this.hasEnded = true;
  }

  play(die1: number, die2: number): string {
    if (this.hasEnded) return 'Game over!';

    const player = this.getPlayer(!(die1 === die2));
    const newBoardPosition = this.getNewBoardPosition(player.getPosition(), die1, die2);
    player.setPosition(newBoardPosition);
    this.handleNewBoardPosition(newBoardPosition);

    return this.getNewBoardPositionOutput(player, newBoardPosition);
  }

  alternatePlayer() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  getPlayer(shouldAlternate: boolean = true): Player {
    const currentPlayer = this.currentPlayer;
    if (shouldAlternate) this.alternatePlayer();
    return currentPlayer;
  }

  getNewBoardPosition(currentPlayerPosition: number, die1: number, die2: number): number {
    const nextNaiveBoardPosition = 100 - Math.abs(currentPlayerPosition + die1 + die2 - 100);
    return this.specialPositions.get(nextNaiveBoardPosition) ?? nextNaiveBoardPosition;
  }
}
