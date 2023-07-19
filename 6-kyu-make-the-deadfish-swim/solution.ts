export function parse(data: string): number[] {
  return [...data].reduce<{ acc: number; output: number[] }>(
    ({ acc, output }, command) => {
      switch (command) {
        case 'i':
          acc += 1;
          break;
        case 'd':
          acc -= 1;
          break;
        case 's':
          acc *= acc;
          break;
        case 'o':
          output.push(acc);
          break;
        default:
          break;
      }

      return { acc, output };
    },
    { acc: 0, output: [] }
  ).output;
}
