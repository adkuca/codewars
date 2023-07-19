# Kingdoms Ep2: The curse (simplified)

[@codewars](https://www.codewars.com/kata/6159dda246a119001a7de465)

More difficult version: [Kingdoms Ep2: The curse (normal)](https://www.codewars.com/kata/615b636c3f8bcf0038ae8e8b)

Our King was cursed - He can not pronounce an entire word anymore. Looking for the witch, the inquisition punishes every beautiful and intelligent woman in the Kingdom. Trying to save your wife and to stop the violence, you beg the audience of the Highest Priest, explaining that you can understand the King's speech. The future of your family is in your hands! Given the string `speech` and the array `vocabulary`. You should return a string of replaced "encoded" *words* in `speech` with appropriate word from `vocabulary`.

## Notes

- Encoded words consist of lowercase letters and at least one asterisk;
- There will always be only one appropriate word from `vocabulary` for every word in `speech`;
- `speech` consists of lowercase letters, spaces and marks `?!,.`;
- There might be more words in `vocabulary` than `words` in speech;
- The length of an encoded word must be the same as an appropriate word of vocabulary;
- The minimum length of a word is 3;

## Example

```typescript
given: speech = "***lo w***d!" and vocabulary = ["hello", "world"]

return "hello world!" 
```

```typescript
given: speech = "c**l, w*ak!" and vocabulary = ["hell", "cell", "week", "weak"]

return "cell, weak!" 
```

If you like this kata, check out the another one: [Kingdoms Ep.3: Archery Tournament](https://www.codewars.com/kata/616eedc41d5644001ff97462/javascript)

![The mad king](the_mad_king.png)

*The King suspecting you don't understand him*

(to break the curse read the words in the final test)

## Tags

FUNDAMENTALS, ARRAYS, REGULAR EXPRESSIONS
