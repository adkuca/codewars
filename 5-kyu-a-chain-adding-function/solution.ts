export default function add(x: number): any {
  const fn = (n: number) => add(x + n);
  fn.valueOf = () => x;
  return fn;
}
