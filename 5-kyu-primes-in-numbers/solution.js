function primeFactors(n) {
  let res = '';
  for (let i = 2; i <= n; i++) {
    let f = 0;
    while (n % i === 0) {
      f++;
      n /= i;
    }
    res += f ? '(' + (f > 1 ? `${i}**${f}` : i) + ')' : '';
  }
  return res || `(${n})`;
}
