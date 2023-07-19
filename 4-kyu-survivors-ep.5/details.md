# Survivors Ep.5

[@codewars](https://www.codewars.com/kata/60a58520c42fb60055546ce5)

## Overview

Given an array of strings (to be interpreted as a 2D array of letters and spaces), find the groups of adjacent letters, remove all letters in the board that can be reached from any letter of another group and return the remaining letters in the array, in any order (see details below).

## Details

- All letters that form a **group** should have at least one vertical or horizontal link to any adjacent letter.
- The number of characters in a group defines the range for each letter in that group.
- A letter of one group can remove any letter *from another group* that is in range using Chebyshev distance (meaning: moving vertically, horizontally or diagonally at each step). All letters are removed simultaneously for all groups.
- The output is a string containing all remaining characters at the end, in any order.

## Notes

- The strings in the list can be of different lengths.
- Strings will only contain spaces and lowercase letters (possibly duplicated).

## Examples

```text
Input: ["axz", "tb", "ch", "  gt"]:

"axz"
"tb"
"ch"
"··gt"
```

The output would be "axz": `axztbch` and `gt` are two groups of adjacent letters, with respective sizes of 7 and 2.

```text
Input ["z", "w", "", "     x  ", "agd", "", "", "", "klkp"]:

"z"
"w"
""
"·····x··"
"agd"
""
""
""
"klkp"
```

The output would be `"zklkp"` (in any order): `zw`, `x`, `agd` and `klkp` are four groups of adjacent letters. Note that:

- Letters are removed even if they are reached through empty (parts of) strings
- From the first group, only `w` is deleted since `z` is too far from any letter of the `agd` group of size 3
- `x` is in range of `d`, hence is deleted too.

---

If you like this kata, check out another one: [Kingdoms Ep1: Jousting](https://www.codewars.com/kata/6138ee916cb50f00227648d9)

## Tags

ARRAYS, STRINGS
