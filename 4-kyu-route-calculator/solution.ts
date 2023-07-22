export const calculate = (sum: string): string | number => {
  if (/[^.0123456789+\-*$]/.test(sum)) return '400: Bad request';

  const operators = new Set<string>(['+', '-', '*', '$']);
  const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, $: 2 };

  const stack: string[] = [];
  const postfix: string[] = [];

  const expression = sum.split(/(\+|\-|\*|\$)/g);

  expression.forEach((token) => {
    if (!operators.has(token)) postfix.push(token);
    else {
      while (stack.length > 0 && precedence[token] <= precedence[stack[stack.length - 1]])
        postfix.push(stack.pop()!);
      stack.push(token);
    }
  });

  while (stack.length > 0) postfix.push(stack.pop()!);

  const resultStack: number[] = [];

  for (const token of postfix) {
    if (!operators.has(token)) {
      resultStack.push(parseFloat(token));
    } else {
      const [y, x] = [resultStack.pop()!, resultStack.pop()!];
      switch (token) {
        case '+':
          resultStack.push(x + y);
          break;
        case '-':
          resultStack.push(x - y);
          break;
        case '*':
          resultStack.push(x * y);
          break;
        case '$':
          resultStack.push(x / y);
          break;
      }
    }
  }

  return resultStack[0];
};
