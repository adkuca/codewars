namespace ExpressionParser {
  export namespace InfixToPostfix {
    const operators = new Set<string>(['+', '-', '*', '/', '(', ')', '#']);
    const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2, '#': 3 };

    function preprocessAndTokenizeInfix(infix: string): string[] {
      const cleanInfix = infix.replace(/\s+/g, '');
      const unaryNegationReplaced = cleanInfix.replaceAll(/(?<=^|[\+\-\*\/\(])(\-)/g, '#');
      const tokenizedInfix = unaryNegationReplaced.match(/(\d+(\.\d+)?)|(\+|\-|\*|\/|\(|\)|#)/g);
      if (!tokenizedInfix) throw new Error('Invalid expression');
      return tokenizedInfix;
    }

    function handleInfixToken(token: string, stack: string[], postfix: string[]): void {
      if (!operators.has(token)) postfix.push(token);
      else if (token === '(') stack.push(token);
      else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') postfix.push(stack.pop()!);
        if (stack.pop() !== '(') throw new Error('Unmatched parentheses');
      } else {
        while (stack.length > 0 && precedence[token] <= precedence[stack[stack.length - 1]])
          postfix.push(stack.pop()!);
        stack.push(token);
      }
    }

    export function translate(infix: string): string[] {
      const stack: string[] = [];
      const postfix: string[] = [];

      const tokenizedInfix = preprocessAndTokenizeInfix(infix);

      tokenizedInfix.forEach((token) => handleInfixToken(token, stack, postfix));

      while (stack.length > 0) postfix.push(stack.pop()!);

      return postfix;
    }
  }

  export namespace PostfixCalculator {
    type BinaryOperation = (x: number, y: number) => number;
    type UnaryOperation = (x: number) => number;

    const binaryOperations: Record<string, BinaryOperation> = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => {
        if (y === 0) throw new Error('Cannot divide by zero');
        return x / y;
      },
    };
    const unaryOperations: Record<string, UnaryOperation> = {
      '#': (x) => x * -1,
    };

    function handleBinaryOperation(token: string, stack: number[]) {
      const [x, y] = [stack.pop(), stack.pop()];
      if (x === undefined || y === undefined)
        throw new Error('Insufficient operands for the operation');
      stack.push(binaryOperations[token](y, x));
    }

    function handleUnaryOperation(token: string, stack: number[]) {
      const x = stack.pop();
      if (x === undefined) throw new Error('Insufficient operands for the operation');
      stack.push(unaryOperations[token](x));
    }

    export function evaluate(postfix: string[]): number {
      const resultStack: number[] = [];

      for (const token of postfix) {
        if (binaryOperations[token]) handleBinaryOperation(token, resultStack);
        else if (unaryOperations[token]) handleUnaryOperation(token, resultStack);
        else resultStack.push(parseFloat(token));
      }

      const remaining = resultStack.pop();
      if (remaining === undefined || resultStack.length !== 0)
        throw new Error('Postfix expression should result in a single value');

      return remaining;
    }
  }
}

export function calc(expression: string): number {
  const postfix = ExpressionParser.InfixToPostfix.translate(expression);
  return ExpressionParser.PostfixCalculator.evaluate(postfix);
}
