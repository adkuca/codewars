type Stack = number[];
type Next = (stack: Stack) => any;

export const start = (fn: Next) => {
  const stack: Stack = [];
  return fn(stack);
};

export const push = (stack: Stack) => {
  return (n: number) => {
    stack.push(n);
    return (fn: Next) => fn(stack);
  };
};

export const add = (stack: Stack) => {
  stack.push(stack.pop()! + stack.pop()!);
  return (fn: Next) => fn(stack);
};

export const sub = (stack: Stack) => {
  stack.push(stack.pop()! - stack.pop()!);
  return (fn: Next) => fn(stack);
};

export const mul = (stack: Stack) => {
  stack.push(stack.pop()! * stack.pop()!);
  return (fn: Next) => fn(stack);
};

export const div = (stack: Stack) => {
  stack.push(Math.trunc(stack.pop()! / stack.pop()!));
  return (fn: Next) => fn(stack);
};

export const end = (stack: Stack): number => stack[0];
