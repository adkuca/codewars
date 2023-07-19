class Tape {
  private tape: Uint8Array;
  private pointer: number;

  constructor(size: number = 5000, initialPointer: number = 2500) {
    this.tape = new Uint8Array(size);
    this.pointer = initialPointer;
  }

  incrementPointer() {
    this.pointer += 1;
  }

  decrementPointer() {
    this.pointer -= 1;
  }

  incrementValue() {
    this.tape[this.pointer] += 1;
  }

  decrementValue() {
    this.tape[this.pointer] -= 1;
  }

  getValue() {
    return this.tape[this.pointer];
  }

  setValue(value: number) {
    this.tape[this.pointer] = value;
  }
}

function instructionHandler(
  instruction: string,
  output: string,
  index: number,
  interpreterObj: { input: string; tape: Tape; matchingBracketsMap: Map<number, number> }
): [string, number] {
  switch (instruction) {
    case '>':
      interpreterObj.tape.incrementPointer();
      break;
    case '<':
      interpreterObj.tape.decrementPointer();
      break;
    case '+':
      interpreterObj.tape.incrementValue();
      break;
    case '-':
      interpreterObj.tape.decrementValue();
      break;
    case '.':
      output += String.fromCharCode(interpreterObj.tape.getValue());
      break;
    case ',':
      interpreterObj.tape.setValue(interpreterObj.input.charCodeAt(0));
      interpreterObj.input = interpreterObj.input.slice(1);
      break;
    case '[': {
      if (interpreterObj.tape.getValue() === 0) {
        if (!interpreterObj.matchingBracketsMap.has(index))
          throw new Error('there should be a key of this index in matching brackets map');
        const rightBracketIndex = interpreterObj.matchingBracketsMap.get(index);
        if (rightBracketIndex === undefined)
          throw new Error('matching bracket index should not be undefined');
        index = rightBracketIndex;
      }
      break;
    }
    case ']': {
      if (interpreterObj.tape.getValue() !== 0) {
        if (!interpreterObj.matchingBracketsMap.has(index))
          throw new Error('there should be a key of this index in matching brackets map');
        const leftBracketIndex = interpreterObj.matchingBracketsMap.get(index);
        if (leftBracketIndex === undefined)
          throw new Error('matching bracket index should not be undefined');
        index = leftBracketIndex;
      }
      break;
    }
    default:
      throw new Error('unknown instruction');
      break;
  }

  return [output, index];
}

function createMatchingBracketsMap(input: string) {
  const matchingBracketsMap = new Map<number, number>();
  const leftBracketsStack: number[] = [];

  for (let index = 0; index < input.length; index += 1) {
    const instruction = input[index];
    if (instruction === '[') leftBracketsStack.push(index);
    else if (instruction === ']') {
      const lastLeftBracket = leftBracketsStack.pop();
      if (!lastLeftBracket) throw new Error('input contains uneven amount of brackets');
      matchingBracketsMap.set(lastLeftBracket, index);
      matchingBracketsMap.set(index, lastLeftBracket);
    }
  }

  if (leftBracketsStack.length) throw new Error('input contains uneven amount of brackets');

  return matchingBracketsMap;
}

export function brainLuck(code: string, input: string) {
  let output = '';
  const interpreterObj = {
    input,
    tape: new Tape(),
    matchingBracketsMap: createMatchingBracketsMap(code),
  }; // should've done a class

  const codeLen = code.length;
  for (let index = 0; index < codeLen; index += 1) {
    [output, index] = instructionHandler(code[index], output, index, interpreterObj);
  }

  return output;
}
