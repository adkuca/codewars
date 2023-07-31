class Primes {
  static *stream() {
    yield 2;
    yield 3;
    yield 5;
    let odd = 5;
    outer: while (true) {
      odd += 2;
      if (odd % 5 === 0) continue;
      const maxFactor = Math.sqrt(odd);
      for (let i = 3; i <= maxFactor; i += 2) if (odd % i === 0) continue outer;
      yield odd;
    }
  }
}
