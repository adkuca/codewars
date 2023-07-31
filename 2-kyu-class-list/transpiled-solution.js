'use strict';
var PI;
(function (PI) {
  const f1 = (x) => (1 / 2) ** x / x;
  const f2 = (x) => (1 / 3) ** x / x;
  function* approximations() {
    let previousApproximation = 0;
    yield previousApproximation;
    for (let i = 1, nOdd = 1; ; i += 1, nOdd += 2) {
      const pairSum = f1(nOdd) + f2(nOdd);
      const r2 = i % 2 === 0 ? previousApproximation - pairSum : previousApproximation + pairSum;
      previousApproximation = r2;
      yield previousApproximation * 4;
    }
  }
  PI.approximations = approximations;
})(PI || (PI = {}));
function* fibonacciSequence() {
  let current = 0;
  let next = 1;
  while (true) {
    yield current;
    [current, next] = [next, next + current];
  }
}
var PRIME;
(function (PRIME) {
  function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i += 1) if (num % i === 0) return false;
    return num > 1;
  }
  function* sequence() {
    let index = 2;
    while (true) {
      if (isPrime(index)) yield index;
      index += 1;
    }
  }
  PRIME.sequence = sequence;
})(PRIME || (PRIME = {}));
var IterableUtils;
(function (IterableUtils) {
  function fromIterable(iterable) {
    return function* () {
      yield* iterable;
    };
  }
  IterableUtils.fromIterable = fromIterable;
  function excludingFirst(iterable) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      iterator.next();
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        yield next.value;
      }
    };
  }
  IterableUtils.excludingFirst = excludingFirst;
  function excludingLast(iterable) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      let prev = iterator.next();
      if (prev.done) return;
      let next = iterator.next();
      while (!next.done) {
        yield prev.value;
        prev = next;
        next = iterator.next();
      }
    };
  }
  IterableUtils.excludingLast = excludingLast;
  function excludingFirstN(iterable, n) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < n; i += 1) {
        let next = iterator.next();
        if (next.done) return;
      }
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        yield next.value;
      }
    };
  }
  IterableUtils.excludingFirstN = excludingFirstN;
  function takeN(iterable, n) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < n; i += 1) {
        let next = iterator.next();
        if (next.done) return;
        yield next.value;
      }
    };
  }
  IterableUtils.takeN = takeN;
  function concat(iterable1, iterable2) {
    return function* () {
      yield* iterable1;
      yield* iterable2;
    };
  }
  IterableUtils.concat = concat;
  function concatMany(iterables) {
    return function* () {
      const outerIterator = iterables[Symbol.iterator]();
      let outerNext = outerIterator.next();
      while (!outerNext.done) {
        const innerIterator = outerNext.value[Symbol.iterator]();
        let innerNext = innerIterator.next();
        while (!innerNext.done) {
          yield innerNext.value;
          innerNext = innerIterator.next();
        }
        outerNext = outerIterator.next();
      }
    };
  }
  IterableUtils.concatMany = concatMany;
  function slice(iterable, n = 0, m = Infinity) {
    return function* () {
      if (n < 0 || n > m) return;
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < n; i += 1) {
        const next = iterator.next();
        if (next.done) return;
      }
      for (let i = n; i < m; i += 1) {
        const next = iterator.next();
        if (next.done) return;
        yield next.value;
      }
    };
  }
  IterableUtils.slice = slice;
  function map(iterable, fn) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        yield fn(next.value);
      }
    };
  }
  IterableUtils.map = map;
  function iterateIndefinitely(fn, x) {
    return function* () {
      let next = x;
      while (true) {
        yield next;
        next = fn(next);
      }
    };
  }
  IterableUtils.iterateIndefinitely = iterateIndefinitely;
  function filter(iterable, fn) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        if (fn(next.value)) yield next.value;
      }
    };
  }
  IterableUtils.filter = filter;
  function reverse(iterable) {
    return function* () {
      const arr = Array.from(iterable);
      for (let i = arr.length - 1; i >= 0; i -= 1) yield arr[i];
    };
  }
  IterableUtils.reverse = reverse;
  function concatMap(iterable, fn) {
    return function* () {
      for (const item of iterable) yield* fn(item);
    };
  }
  IterableUtils.concatMap = concatMap;
  function repeatValueNtimes(n, x) {
    return function* () {
      for (let i = 0; i < n; i += 1) yield x;
    };
  }
  IterableUtils.repeatValueNtimes = repeatValueNtimes;
  function repeatInfinitely(x) {
    return function* () {
      while (true) yield x;
    };
  }
  IterableUtils.repeatInfinitely = repeatInfinitely;
  function repeatIterableLength(iterable, x) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (!iterator.next().done) yield x;
    };
  }
  IterableUtils.repeatIterableLength = repeatIterableLength;
  function cycle(iterable) {
    return function* () {
      while (true) yield* iterable;
    };
  }
  IterableUtils.cycle = cycle;
  function zipWith(iterable1, iterable2, fn) {
    return function* () {
      const iterator1 = iterable1[Symbol.iterator]();
      const iterator2 = iterable2[Symbol.iterator]();
      let next1 = iterator1.next();
      let next2 = iterator2.next();
      while (!next1.done && !next2.done) {
        yield fn(next1.value, next2.value);
        next1 = iterator1.next();
        next2 = iterator2.next();
      }
    };
  }
  IterableUtils.zipWith = zipWith;
  function scanLeft(iterable, fn, initial) {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      yield initial;
      let prev = initial;
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        prev = fn(prev, next.value);
        yield prev;
      }
    };
  }
  IterableUtils.scanLeft = scanLeft;
})(IterableUtils || (IterableUtils = {}));
class List {
  constructor(sequenceGenerator, isInfinite = false) {
    this.sequenceGenerator = sequenceGenerator;
    this.isInfinite = isInfinite;
  }
  *[Symbol.iterator]() {
    if (this.sequenceGenerator) yield* this.sequenceGenerator();
  }
  static fromList(xs) {
    if (xs instanceof List) return new List(xs.sequenceGenerator);
    return new List(IterableUtils.fromIterable([...xs]));
  }
  static get empty() {
    return new List();
  }
  static iterate(fn, x) {
    return new List(IterableUtils.iterateIndefinitely(fn, x), true);
  }
  static repeat(x) {
    return new List(IterableUtils.repeatInfinitely(x), true);
  }
  static cycle(xs) {
    if (xs instanceof List) {
      if (xs.sequenceGenerator === undefined) return List.empty;
      if (xs.isInfinite) return new List(xs.sequenceGenerator);
    }
    return new List(IterableUtils.cycle(xs), true);
  }
  static replicate(n, x) {
    if (n < 0) return List.empty;
    return new List(IterableUtils.repeatValueNtimes(n, x));
  }
  static get PRIME() {
    return new List(PRIME.sequence, true);
  }
  static get FIB() {
    return new List(fibonacciSequence, true);
  }
  static get PI() {
    return new List(PI.approximations, true);
  }
  head() {
    if (this.sequenceGenerator === undefined) return;
    const head = this.sequenceGenerator().next();
    if (head.done) return;
    return head.value;
  }
  tail() {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.excludingFirst(this));
  }
  init() {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (this.isInfinite) return new List(this.sequenceGenerator);
    return new List(IterableUtils.excludingLast(this));
  }
  last() {
    if (this.sequenceGenerator === undefined) return;
    if (this.isInfinite) throw new Error('infinite list diverges');
    const iterator = this[Symbol.iterator]();
    let last;
    while (true) {
      const next = iterator.next();
      if (next.done) break;
      last = next.value;
    }
    return last === undefined ? undefined : last;
  }
  length() {
    if (this.sequenceGenerator === undefined) return 0;
    if (this.isInfinite) throw new Error('infinite list diverges');
    let iterableLength = 0;
    const iterator = this[Symbol.iterator]();
    while (!iterator.next().done) iterableLength += 1;
    return iterableLength;
  }
  toList() {
    if (this.sequenceGenerator === undefined) return [];
    if (this.isInfinite) throw new Error('infinite list diverges');
    return Array.from(this.sequenceGenerator());
  }
  get(i) {
    if (this.sequenceGenerator === undefined) return;
    const iterator = this[Symbol.iterator]();
    for (let index = 0; index <= i; index += 1) {
      const item = iterator.next();
      if (item.done) break;
      if (index === i) return item.value;
    }
    return;
  }
  nil() {
    if (this.sequenceGenerator === undefined) return true;
    return this[Symbol.iterator]().next().done;
  }
  take(n) {
    if (n < 0 || this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.takeN(this, n));
  }
  isGen() {
    return !!this.sequenceGenerator;
  }
  drop(n) {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (n < 0) return new List(this.sequenceGenerator);
    const sequenceGenerator = IterableUtils.excludingFirstN(this, n);
    return new List(sequenceGenerator);
  }
  cons(x) {
    return this.sequenceGenerator === undefined
      ? List.fromList([x])
      : new List(IterableUtils.concat([x], this));
  }
  append(xs) {
    if (this.isInfinite) return new List(this.sequenceGenerator);
    if (this.sequenceGenerator === undefined)
      return xs instanceof List ? new List(xs.sequenceGenerator) : List.fromList(xs);
    return new List(IterableUtils.concat(this, xs));
  }
  slice(i, j) {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (i === undefined) return new List(this.sequenceGenerator);
    return new List(IterableUtils.slice(this, i, j));
  }
  map(fn) {
    return new List(IterableUtils.map(this, fn));
  }
  filter(fn) {
    return new List(IterableUtils.filter(this, fn));
  }
  reverse() {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (this.isInfinite) throw new Error('infinite list diverges');
    return new List(IterableUtils.reverse(this));
  }
  concat() {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.concatMany(this));
  }
  concatMap(fn) {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.concatMap(this, fn));
  }
  zipWith(fn, xs) {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (xs instanceof List && xs.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.zipWith(this, xs, fn));
  }
  foldr(fn, z) {
    if (this.sequenceGenerator === undefined) return z;
    if (fn.length === 0) return fn();
    if (fn.length === 1) {
      const first = this[Symbol.iterator]().next().value;
      return first === undefined ? undefined : fn(first);
    }
    if (this.isInfinite) throw new Error('infinite list diverges');
    if (z === undefined) throw new Error('invalid second argument');
    return Array.from(this).reduceRight((acc, curr) => fn(curr, acc), z);
  }
  foldl(fn, z) {
    if (this.isInfinite) throw new Error('infinite list diverges');
    if (this.sequenceGenerator === undefined) return z;
    if (fn.length === 0) return fn();
    if (z === undefined) return;
    if (fn.length > 0) {
      const iterator = this[Symbol.iterator]();
      let acc = z;
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        acc = fn(acc, next.value);
      }
      return acc;
    }
    return;
  }
  scanr(fn, z) {
    if (this.sequenceGenerator === undefined) return List.fromList([z]);
    if (this.isInfinite) {
      if (fn.length === 0) return new List(IterableUtils.repeatInfinitely(fn()), true);
      if (fn.length === 1) return new List(IterableUtils.map(this, fn), true);
      throw new Error('infinite list diverges');
    }
    if (fn.length > 1 && z === undefined) throw new Error('invalid second argument');
    const result = Array.from(this).reduceRight(
      (acc, curr) => {
        const prev = acc[0];
        acc.unshift(fn(curr, prev));
        return acc;
      },
      [z]
    );
    return List.fromList(result);
  }
  scanl(fn, z) {
    if (this.sequenceGenerator === undefined) return List.fromList([z]);
    if (fn.length > 0 && z === undefined) throw new Error('invalid second argument');
    return new List(IterableUtils.scanLeft(this, fn, z), this.isInfinite);
  }
  elem(x) {
    if (this.sequenceGenerator === undefined) return false;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return false;
      if (next.value === x) return true;
    }
  }
  elemIndex(x) {
    if (this.sequenceGenerator === undefined) return -1;
    const iterator = this[Symbol.iterator]();
    let index = 0;
    while (true) {
      const next = iterator.next();
      if (next.done) return -1;
      if (next.value === x) return index;
      index += 1;
    }
  }
  find(fn) {
    if (this.sequenceGenerator === undefined) return;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return;
      if (fn(next.value)) return next.value;
    }
  }
  findIndex(fn) {
    if (this.sequenceGenerator === undefined) return -1;
    const iterator = this[Symbol.iterator]();
    let index = 0;
    while (true) {
      const next = iterator.next();
      if (next.done) return -1;
      if (fn(next.value)) return index;
      index += 1;
    }
  }
  any(fn) {
    if (this.sequenceGenerator === undefined) return false;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return false;
      if (fn(next.value)) return true;
    }
  }
  all(fn) {
    if (this.sequenceGenerator === undefined) return true;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return true;
      if (!fn(next.value)) return false;
    }
  }
  the() {
    if (this.sequenceGenerator === undefined) return;
    const iterator = this[Symbol.iterator]();
    const first = iterator.next();
    if (first.done) return;
    let prev = first.value;
    while (true) {
      const next = iterator.next();
      if (next.done) return prev === undefined ? undefined : prev;
      if (next.value !== prev) return;
      prev = next.value;
    }
  }
}
