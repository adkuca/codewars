class VectorSizeMismatchError extends Error {
  constructor() {
    super('Vectors must be of the same size');
    this.name = 'VectorSizeMismatchError';
  }
}

type Operand =
  | typeof Vector.ADD
  | typeof Vector.SUBTRACT
  | typeof Vector.MULTIPLY
  | typeof Vector.POWER;

const operations = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  power: (a: number, b: number) => a ** b,
};

export class Vector {
  components: number[];

  constructor(components: number[]) {
    this.components = components;
  }

  toString(): string {
    return `(${this.components.join(',')})`;
  }

  size(): number {
    return this.components.length;
  }

  equals(vector: Vector): boolean {
    if (this.size() !== vector.size()) return false;
    return this.components.every((component, index) => component === vector.components[index]);
  }

  add(vector: Vector): Vector {
    return new Vector(Vector.componentOperation(this, vector, Vector.ADD));
  }

  subtract(vector: Vector): Vector {
    return new Vector(Vector.componentOperation(this, vector, Vector.SUBTRACT));
  }

  dot(vector: Vector): number {
    return Vector.componentOperation(this, vector, Vector.MULTIPLY, Vector.ADD);
  }

  norm(): number {
    return Math.sqrt(Vector.componentOperation(this, 2, Vector.POWER, Vector.ADD));
  }

  static readonly ADD = 'add';
  static readonly SUBTRACT = 'subtract';
  static readonly MULTIPLY = 'multiply';
  static readonly POWER = 'power';

  private static componentOperation(vectorA: Vector, vectorB: Vector, operand: Operand): number[];
  private static componentOperation(vectorA: Vector, b: number, operand: Operand): number[];
  private static componentOperation(
    vectorA: Vector,
    vectorB: Vector,
    operand: Operand,
    reductionOperand: Operand
  ): number;
  private static componentOperation(
    vectorA: Vector,
    b: number,
    operand: Operand,
    reductionOperand: Operand
  ): number;
  private static componentOperation(
    vectorA: Vector,
    b: Vector | number,
    operand: Operand,
    reductionOperand?: Operand
  ): number | number[] {
    if (b instanceof Vector && vectorA.size() !== b.size()) throw new VectorSizeMismatchError();

    if (reductionOperand)
      return typeof b === 'number'
        ? vectorA.components.reduce(
            (acc, curr) => operations[reductionOperand](acc, operations[operand](curr, b)),
            0
          )
        : vectorA.components.reduce(
            (acc, curr, index) =>
              operations[reductionOperand](acc, operations[operand](curr, b.components[index])),
            0
          );

    return typeof b === 'number'
      ? vectorA.components.map((component, index) => operations[operand](component, b))
      : vectorA.components.map((component, index) =>
          operations[operand](component, b.components[index])
        );
  }
}
