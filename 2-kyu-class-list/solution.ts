namespace PI {
  const f1 = (x: number) => (1 / 2) ** x / x;
  const f2 = (x: number) => (1 / 3) ** x / x;

  export function* approximations() {
    let previousApproximation: number = 0;
    yield previousApproximation;
    for (let i = 1, nOdd = 1; ; i += 1, nOdd += 2) {
      const pairSum = f1(nOdd) + f2(nOdd);
      const r2 = i % 2 === 0 ? previousApproximation - pairSum : previousApproximation + pairSum;
      previousApproximation = r2;
      yield previousApproximation * 4;
    }
  }
}

function* fibonacciSequence() {
  let current = 0;
  let next = 1;
  while (true) {
    yield current;
    [current, next] = [next, next + current];
  }
}

namespace PRIME {
  function isPrime(num: number) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i += 1) if (num % i === 0) return false;
    return num > 1;
  }

  export function* sequence() {
    let index = 2;
    while (true) {
      if (isPrime(index)) yield index;
      index += 1;
    }
  }
}

namespace IterableUtils {
  export function fromIterable<T>(iterable: Iterable<T>): () => Generator<T> {
    return function* () {
      yield* iterable;
    };
  }

  export function excludingFirst<T>(iterable: Iterable<T>): () => Generator<T> {
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

  export function excludingLast<T>(iterable: Iterable<T>): () => Generator<T> {
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

  export function excludingFirstN<T>(iterable: Iterable<T>, n: number): () => Generator<T> {
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

  export function takeN<T>(iterable: Iterable<T>, n: number): () => Generator<T> {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < n; i += 1) {
        let next = iterator.next();
        if (next.done) return;
        yield next.value;
      }
    };
  }

  export function concat<T, U>(
    iterable1: Iterable<T>,
    iterable2: Iterable<U>
  ): () => Generator<T | U> {
    return function* () {
      yield* iterable1;
      yield* iterable2;
    };
  }

  export function concatMany<T>(iterables: Iterable<Iterable<T>>): () => Generator<T> {
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

  export function slice<T>(iterable: Iterable<T>, n = 0, m = Infinity): () => Generator<T> {
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

  export function map<T, U>(iterable: Iterable<T>, fn: (x: T) => U): () => Generator<U> {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        yield fn(next.value);
      }
    };
  }

  export function iterateIndefinitely<T>(fn: (x: T) => T, x: T): () => Generator<T> {
    return function* () {
      let next = x;
      while (true) {
        yield next;
        next = fn(next);
      }
    };
  }

  export function filter<T>(iterable: Iterable<T>, fn: (x: T) => boolean): () => Generator<T> {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        if (fn(next.value)) yield next.value;
      }
    };
  }

  export function reverse<T>(iterable: Iterable<T>): () => Generator<T> {
    return function* () {
      const arr = Array.from(iterable);
      for (let i = arr.length - 1; i >= 0; i -= 1) yield arr[i]!;
    };
  }

  export function concatMap<T, U>(
    iterable: Iterable<T>,
    fn: (x: T) => Iterable<U>
  ): () => Generator<U> {
    return function* () {
      for (const item of iterable) yield* fn(item);
    };
  }

  export function repeatValueNtimes<T>(n: number, x: T): () => Generator<T> {
    return function* () {
      for (let i = 0; i < n; i += 1) yield x;
    };
  }

  export function repeatInfinitely<T>(x: T): () => Generator<T> {
    return function* () {
      while (true) yield x;
    };
  }

  export function repeatIterableLength<T>(iterable: Iterable<unknown>, x: T): () => Generator<T> {
    return function* () {
      const iterator = iterable[Symbol.iterator]();
      while (!iterator.next().done) yield x;
    };
  }

  export function cycle<T>(iterable: Iterable<T>): () => Generator<T> {
    return function* () {
      while (true) yield* iterable;
    };
  }

  export function zipWith<T, U, K>(
    iterable1: Iterable<T>,
    iterable2: Iterable<U>,
    fn: (x: T, y: U) => K
  ): () => Generator<K> {
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

  export function scanLeft<T, U>(
    iterable: Iterable<T>,
    fn: (z: U, x: T) => U,
    initial: U
  ): () => Generator<U> {
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
}

class List<T> implements Iterable<T> {
  private sequenceGenerator: (() => Generator<T>) | undefined;
  private isInfinite: boolean;

  private constructor(sequenceGenerator?: () => Generator<T>, isInfinite = false) {
    this.sequenceGenerator = sequenceGenerator;
    this.isInfinite = isInfinite;
  }

  *[Symbol.iterator]() {
    if (this.sequenceGenerator) yield* this.sequenceGenerator();
  }

  static fromList<U>(xs: Iterable<U>): List<U> {
    if (xs instanceof List) return new List(xs.sequenceGenerator);
    return new List(IterableUtils.fromIterable([...xs]));
  }

  static get empty(): List<any> {
    return new List();
  }

  static iterate<U>(fn: (x: U) => U, x: U): List<U> {
    return new List(IterableUtils.iterateIndefinitely(fn, x), true);
  }

  static repeat<U>(x: U): List<U> {
    return new List(IterableUtils.repeatInfinitely(x), true);
  }

  static cycle<U>(xs: Iterable<U>): List<U> {
    if (xs instanceof List) {
      if (xs.sequenceGenerator === undefined) return List.empty;
      if (xs.isInfinite) return new List(xs.sequenceGenerator);
    }
    return new List(IterableUtils.cycle(xs), true);
  }

  static replicate<U>(n: number, x: U): List<U> {
    if (n < 0) return List.empty;
    return new List(IterableUtils.repeatValueNtimes(n, x));
  }

  static get PRIME(): List<number> {
    return new List(PRIME.sequence, true);
  }

  static get FIB(): List<number> {
    return new List(fibonacciSequence, true);
  }

  static get PI(): List<number> {
    return new List(PI.approximations, true);
  }

  head(): T | undefined {
    if (this.sequenceGenerator === undefined) return;
    const head = this.sequenceGenerator().next();
    if (head.done) return;
    return head.value;
  }

  tail(): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.excludingFirst(this));
  }

  init(): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (this.isInfinite) return new List(this.sequenceGenerator);
    return new List(IterableUtils.excludingLast(this));
  }

  last(): T | undefined {
    if (this.sequenceGenerator === undefined) return;
    if (this.isInfinite) throw new Error('infinite list diverges');

    const iterator = this[Symbol.iterator]();
    let last: T | undefined;
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

  toList(): T[] {
    if (this.sequenceGenerator === undefined) return [];
    if (this.isInfinite) throw new Error('infinite list diverges');
    return Array.from(this.sequenceGenerator());
  }

  get(i: number): T | undefined {
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

  take(n: number): List<T> {
    if (n < 0 || this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.takeN(this, n));
  }

  isGen() {
    return !!this.sequenceGenerator;
  }

  drop(n: number): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (n < 0) return new List(this.sequenceGenerator);
    const sequenceGenerator = IterableUtils.excludingFirstN(this, n);
    return new List(sequenceGenerator);
  }

  cons<U>(x: U): List<T | U> {
    return this.sequenceGenerator === undefined
      ? List.fromList([x])
      : new List(IterableUtils.concat([x], this));
  }

  append(xs: Iterable<T>): List<T> {
    if (this.isInfinite) return new List(this.sequenceGenerator);
    if (this.sequenceGenerator === undefined)
      return xs instanceof List ? new List(xs.sequenceGenerator) : List.fromList(xs);

    return new List(IterableUtils.concat(this, xs));
  }

  slice(i?: number, j?: number): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (i === undefined) return new List(this.sequenceGenerator);
    return new List(IterableUtils.slice(this, i, j));
  }

  map<U>(fn: (x: T) => U): List<U> {
    return new List(IterableUtils.map(this, fn));
  }

  filter(fn: (x: T) => boolean): List<T> {
    return new List(IterableUtils.filter(this, fn));
  }

  reverse(): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (this.isInfinite) throw new Error('infinite list diverges');
    return new List(IterableUtils.reverse(this));
  }

  concat<T>(this: List<List<T>>): List<T> {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.concatMany(this));
  }

  concatMap<U>(fn: (x: T) => List<U>): List<U> {
    if (this.sequenceGenerator === undefined) return List.empty;
    return new List(IterableUtils.concatMap(this, fn));
  }

  zipWith<U, K>(fn: (x: T, y: U) => K, xs: Iterable<U>): List<K> {
    if (this.sequenceGenerator === undefined) return List.empty;
    if (xs instanceof List && xs.sequenceGenerator === undefined) return List.empty;

    return new List(IterableUtils.zipWith(this, xs, fn));
  }

  foldr<U>(fn: (x: T, z: U) => U, z: U): U;
  foldr<U>(fn: (x: T) => U, z: U): U;
  foldr<U>(fn: (x: T) => U): U | undefined;
  foldr<U, K>(fn: () => K, z: U): K | U;
  foldr<U>(fn: () => U): U | undefined;
  foldr<U>(fn: (x: T, z: U) => U, z?: U): U | undefined {
    if (this.sequenceGenerator === undefined) return z;
    if (fn.length === 0) return (fn as () => U)();
    if (fn.length === 1) {
      const first = this[Symbol.iterator]().next().value;
      return first === undefined ? undefined : (fn as (x: T) => U)(first);
    }
    if (this.isInfinite) throw new Error('infinite list diverges');
    if (z === undefined) throw new Error('invalid second argument');

    return Array.from(this).reduceRight<U>((acc, curr) => fn(curr, acc), z);
  }

  foldl<U>(fn: (z: U, x: T) => U, z: U): U;
  foldl<U>(fn: (z: U, x: T) => U): U | undefined;
  foldl<U>(fn: (z: U) => U, z: U): U;
  foldl<U>(fn: () => U, z: U): U;
  foldl<U>(fn: () => U): U | undefined;
  foldl<U>(fn: (z: U, x: T) => U, z?: U): U | undefined {
    if (this.isInfinite) throw new Error('infinite list diverges');
    if (this.sequenceGenerator === undefined) return z;
    if (fn.length === 0) return (fn as () => U)();
    if (z === undefined) return;

    if (fn.length > 0) {
      const iterator = this[Symbol.iterator]();
      let acc: U = z;
      while (true) {
        const next = iterator.next();
        if (next.done) break;
        acc = fn(acc, next.value);
      }
      return acc;
    }

    return;
  }

  scanr<U>(fn: (x: T, z: U) => U, z: U): List<U>;
  scanr<U>(fn: (x: T, z: U) => U): List<U | undefined>;
  scanr<U, K>(fn: (x: T) => K, z: U): List<U | K>;
  scanr<U>(fn: (x: T) => U): List<U | undefined>;
  scanr<U>(fn: () => U, z: U): List<U>;
  scanr<U>(fn: () => U): List<U | undefined>;
  scanr<U>(fn: (x: T, z: U) => U, z?: U): List<U | undefined> {
    if (this.sequenceGenerator === undefined) return List.fromList([z]);
    if (this.isInfinite) {
      if (fn.length === 0) return new List(IterableUtils.repeatInfinitely((fn as () => U)()), true);
      if (fn.length === 1) return new List(IterableUtils.map(this, fn as (x: T) => U), true);
      throw new Error('infinite list diverges');
    }
    if (fn.length > 1 && z === undefined) throw new Error('invalid second argument');

    const result = Array.from(this).reduceRight<(U | undefined)[]>(
      (acc, curr) => {
        const prev = acc[0]!;
        acc.unshift(fn(curr, prev));
        return acc;
      },
      [z]
    );

    return List.fromList(result);
  }

  scanl<U>(fn: (z: U, x: T) => U, z: U): List<U>;
  scanl<U>(fn: (z: U) => U, z: U): List<U>;
  scanl<U>(fn: () => U, z: U): List<U>;
  scanl<U>(fn: (z: U, x: T) => U, z: U): List<U> {
    if (this.sequenceGenerator === undefined) return List.fromList([z]);
    if (fn.length > 0 && z === undefined) throw new Error('invalid second argument');
    return new List(IterableUtils.scanLeft(this, fn, z), this.isInfinite);
  }

  elem(x: T): boolean {
    if (this.sequenceGenerator === undefined) return false;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return false;
      if (next.value === x) return true;
    }
  }

  elemIndex(x: T): number | -1 {
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

  find(fn: (x: T) => boolean): T | undefined {
    if (this.sequenceGenerator === undefined) return;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return;
      if (fn(next.value)) return next.value;
    }
  }

  findIndex(fn: (x: T) => boolean): number | -1 {
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

  any(fn: (x: T) => boolean): boolean {
    if (this.sequenceGenerator === undefined) return false;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return false;
      if (fn(next.value)) return true;
    }
  }

  all(fn: (x: T) => boolean): boolean {
    if (this.sequenceGenerator === undefined) return true;
    const iterator = this[Symbol.iterator]();
    while (true) {
      const next = iterator.next();
      if (next.done) return true;
      if (!fn(next.value)) return false;
    }
  }

  the(): T | undefined {
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
