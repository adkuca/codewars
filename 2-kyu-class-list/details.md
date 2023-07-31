# class List

[@codewars](https://www.codewars.com/kata/59f7a040a5b820c684000046)

## List. Any way you like

JavaScript `Array`s can only represent lists of finite length. Your job is to implement the `List` class, which must be able to represent *both* finite *and* infinite lists. It must support the class and instance methods specified below. Methods must not have side effects (mutating any argument would be a side effect).

The internal representation of `List` is completely free. With great power, however, comes great responsibility: you need to supply adequate laziness to support infinite lists yourself. E.g. `[ infinite elements ].map( function )` or `[ infinite elements ].append( [ (in)finite elements ] )` should return a new `[ infinite elements ]`.

### class methods

`List.empty`, `.iterate(fn,x)`, `.repeat(x)`, `.cycle(xs)`, `.replicate(n,x)`, `.fromList(xs)`
where `fn` is a function, `xs` is a list, `x` is an element (a value) and `n` is a number.

### instance methods

`list.head()`, `.tail()`, `.init()`, `.last()`, `.length()`, `.toList()`, `.get(i)`, `.nil()`, `.take(n)`, `.drop(n)`, `.cons(x)`, `.append(xs)`, `.slice(i,j)`, `.map(fn)`, `.filter(fn)`, `.reverse()`, `.concat()`, `.concatMap(fn)`, `.zipWith(fn,xs)`, `.foldr(fn,x)`, `.foldl(fn,x)`, `.scanr(fn,x)`, `.scanl(fn,x)`, `.elem(x)`, .elemIndex(x), .find(fn), .findIndex(fn), .any(fn), `.all(fn)`, `.the()`
where `fn` is a function, `xs` is a list, `x` is an element (a value), `i,j` are indices and `n` is a number (a sort of index).

### more class methods

You will also need to implement some use cases of infinite lists.

- `List.PRIME`: an infinite list of all prime numbers (`[ 2, 3, 5, 7, 11, 13, 17, 19, .. ]`)
You might use `primes = filterPrime [2..] where filterPrime (p:xs) = p : filterPrime [x | x <- xs, x 'mod' p /= 0]` from [haskell.org](https://www.haskell.org/). It can be written quite elegantly using `List`. (Don't worry too much about efficiency for this.)

- `List.FIB`: an infinite list of Fibonacci (0,1) numbers (`[ 0, 1, 1, 2, 3, 5, 8, 13, .. ]`)
You might use `fib = 0 : 1 : zipWith (+) fib (tail fib)`. (Again, elegance over efficiency.)

- `arctan(x)` can be written as an infinite sum `0 + x^1/1 - x^3/3 + x^5/5 - x^7/7 ..`
`π` is equal to `4 * ( arctan(1/2) + arctan(1/3) )`

- `List.PI`: an infinite list of increasing numbers of terms (taken pairwise) of this infinite sum
(`[ 0, 4*(1/2+1/3), 4*(1/2+1/3 - 1/8/3-1/27/3), 4*(1/2+1/3 - 1/8/3-1/27/3 + 1/32/5+1/243/5), .. ]`)
This one is actually quite efficient ! even though it can converge faster still with other constants. But these look nice. :P

### notes

Unlike in Haskell, the `head`, `tail`, `init` and `last` of an empty list are defined. Also, `the` is defined for all lists (and can be determined, except in case of an infinite list of all equal elements).
Diverging results and list values at out-of-bounds indices are undefined (not necessarily `undefined`!).
`take` and `drop` have defined results for out-of-bounds arguments, but `slice` does not.
Undefined results may result in any value or action.
All test inputs are valid and should result in a defined result.

### class methods

`List.empty` => an (or the) empty list (must not require `()`)

`List.iterate(fn,x)` => an infinite list of successive applications of `fn` to `x`

`List.repeat(x)` => an infinite list, every element of which is `x`

`List.cycle(xs)` => an infinite list of repetitions of `xs` (equals `xs` if `xs` is infinite)

`List.replicate(n,x)` => a finite list of length `n`, every element of which is `x`

`List.fromList(xs)` => `xs` converted to a list (an `Array` must be a valid `xs`)

`List.PRIME`, `List.FIB`, `List.PI` => (must not require `()`)

### instance methods

`list.head()` => the first element of `list`, or `undefined` for empty `list`

`list.tail()` => `list` without its first element, or an empty list for empty `list`

`list.init()` => `list` without its last element, or an empty list for empty `list` (equals `list` if `list` is infinite)

`list.last()` => the last element of `list`, or `undefined` for empty `list` (diverges for infinite `list`)

`list.length()` => the length of `list` (diverges for infinite `list`)

`list.toList()` => `list` converted to an `Array` (diverges for infinite `list`)

`list.get(i)` => the element of `list` at index `i`

`list.nil()` => `true` for empty `list`, `false` otherwise (`null` in Haskell)

`list.take(n)` => the first (at most) `n` elements of `list` (`n` may be negative or greater than `list.length()`)

`list.drop(n)` => `list` without its first (at most) `n` elements (`n` may be negative or greater than `list.length()`)

`list.cons(x)` => `x` prepended to `list`

`list.append(xs)` => `xs` appended to `list` (equals `list` if `list` is infinite)

`list.slice(i,j)` => `list` from index `i` (inclusive) to index `j` (exclusive) (both arguments are optional; result is undefined for arguments not in `list`)

`list.map(fn)` => `list` transformed by `fn`

`list.filter(fn)` => only the elements of `list` for which `fn` holds

`list.reverse()` => `list` in reverse order (diverges for infinite `list`)

`list.concat()` => `list` flattened; `list` must be a list of lists (behaves differently than `.concat()` in JavaScript!)

`list.concatMap(fn)` => `list` transformed by `fn`, then flattened

`list.zipWith(fn,xs)` => `map`, but with two lists (`fn` will normally be a binary function)

`list.foldr(fn,x)` => right-associative reduction of list to a single value (`[x1,x2,..,xn].foldr(fn,z) = fn( x1, fn( x2, .. fn( xn, z ) ) )`) (`foldr` should only recursively evaluate *necessary* `fn` arguments, as to return a valid value from a nullary or unary `fn` even if `list` is infinite) (not quite `.reduceRight()` in JavaScript)

`list.foldl(fn,x)` => left-associative reduction of list to a single value (`[x1,x2,..,xn].foldl(fn,z) = fn( .. fn( fn( z, x1 ), x2 ) .., xn )`) (diverges for infinite `list`) (`.reduce()` in JavaScript)

`list.scanr(fn,x)` => right-associative incremental reduction of list to a list (`[x1,x2,..,xn].scanr(fn,z) = [ fn( x1, .. ), .., fn( x(n-1), fn( xn, z ) ), fn( xn, z ), z ]`) (`scanr` should only recursively evaluate *necessary* `fn` arguments, as to return a valid value from a nullary or unary `fn` even if `list` is infinite. earlier versions of the kata did not have this requirement, so this is tested for Bonus Points only )

`list.scanl(fn,x)` => left-associative incremental reduction of list to a list (`[x1,x2,..,xn].scanl(fn,z) = [ z, fn( z, x1 ), fn( fn( z, x1 ), x2 ), .., fn( .., xn ) ]`)

`list.elem(x)` => `true` if `list` contains `x`, `false` otherwise (*possibly* diverges for infinite `list`) (`.includes()` in JavaScript)

`list.elemIndex(x)` => index of `x` in `list`, or `-1` if `list` does not contain `x` (*possibly* diverges for infinite `list`) (`.indexOf()` in JavaScript)

`list.find(fn)` => the first element of `list` for which `fn` holds (*possibly* diverges for infinite list)

`list.findIndex(fn)` => the first index in `list` for which `fn` holds (*possibly* diverges for infinite `list`)

`list.any(fn)` => `true` if `fn` holds for any element of `list`, `false` otherwise (*possibly* diverges for infinite list) (`.some()` in JavaScript)

`list.all(fn)` => `true` if `fn` holds for all elements of `list`, `false` otherwise (*possibly* diverges for infinite list) (`.every()` in JavaScript)

`list.the()` => any element of `list` if all elements of `list` are equal, `undefined` otherwise (*possibly* diverges for infinite `list`)

## hints

<details>
<summary>Options for underlying datatype</summary>

- Consider iterables or linked lists

</details>

<details>
<summary>Achieving laziness</summary>

- Consider thunks or proxies

</details>

<details>
<summary>Determining function arity</summary>

- Look into function.length

</details>

<details>
<summary>Reference guides</summary>

- See Mozilla Developer Network / JavaScript and Hoogle

</details>

## Tags

LISTS
