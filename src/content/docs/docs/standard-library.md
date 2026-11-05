---
title: Standard library
---

```poplar
namespace demo;

import std;

var $scores = [5, 1, 4];

mcfun tick() {
    /say {{ std:sqrt() with {x: 50} }} and {{ std:sum() with {list: $scores} }};
    std:sort() with {list: $scores};
    $scores = $std:result;
}
```

`import std;` loads the standard library, the namespace `std`. Call its functions like this: `std:clamp() with {x: #hp, low: 0, high: 20}`. Each one reads its [macro arguments](/docs/functions/#macro-arguments), which the tables below list as keys.

The library is written in Poplar and installed next to the compiler (`lib/poplar/std/`), so you can read it. Only the functions your code can reach go into the pack, as a copy in the pack namespace: `std:clamp` is the function `<pack namespace>:std/clamp`, and std's data is in the storage `<pack namespace>:std`. Two packs built with different Poplar versions each have their own copy, so they can't overwrite each other. A `std:name` in a command, such as `/function std:clamp {x:5,low:0,high:3};`, counts as a use too.

## Math

All math functions work on integers.

| Function | Keys | Returns |
|---|---|---|
| `abs` | `x` | `x` without its sign |
| `sign` | `x` | `1`, `-1` or `0` |
| `min`, `max` | `a`, `b` | the smaller or the larger of `a` and `b` |
| `clamp` | `x`, `low`, `high` | `x`, moved into `low..high` (both included) |
| `pow` | `base`, `exponent` | `base` to the power of `exponent`; a negative exponent gives `1` |
| `sqrt` | `x` | the integer square root, rounded down; a negative `x` gives `0` |
| `lerp` | `a`, `b`, `t`, `scale` | the value `t / scale` of the way from `a` to `b`: `{a: 0, b: 100, t: 250, scale: 1000}` gives `25` |
| `random` | `low`, `high` | a random integer in `low..high`, both included; if `high <= low`, `low` |
| `weightedRandom` | `weights` | a random index into a list of int weights: `[1, 3]` gives `1` three times as often as `0` |
| `sin`, `cos` | `degrees` | in thousandths: `{degrees: 30}` gives `500` for `sin` |

## Lists

| Function | Keys | Returns |
|---|---|---|
| `count`, `countString` | `list`, `value` | how many elements equal `value` |
| `contains`, `containsString` | `list`, `value` | `1` if an element equals `value`, else `0` |
| `indexOf`, `indexOfString` | `list`, `value` | the index of the first element equal to `value`, or `-1` |
| `sum`, `minOf`, `maxOf` | `list` | for a list of ints; `minOf` and `maxOf` give `0` for an empty list |
| `reverse` | `list` | nothing; the reversed list is in `$std:result` |
| `sort` | `list` | nothing; the list of ints, smallest first, is in `$std:result` |

To search for a string, use the `String` helpers. A macro argument loses its quotes, so `count` would read `"minecraft:diamond"` as `minecraft:diamond`, which isn't valid NBT. `count`, `contains` and `indexOf` are for numbers and compounds.

These functions work on a copy of the list, so they never change your variable. To keep a result, copy it: `std:reverse() with {list: $names}; $names = $std:result;`.

**Costs and caveats**

* Each std function is a macro function call. A game value in the `with` compound costs one command, and a list is copied once more inside the function.
* The `String` helpers can't search for a string with a `"` in it.
* `count` and `contains` have no loop, so they cost a few commands for any list. `indexOf`, `sum`, `minOf`, `maxOf` and `reverse` loop once over the list. `sort` loops once per element, so it is slow for long lists.
* `sqrt` takes about 4 to 20 loop steps, and `pow` takes one per bit of the exponent.
* `sin` and `cos` use Bhaskara's approximation, which is within 2 thousandths.
* The next `reverse` or `sort` replaces `$std:result`, so copy it right away.
* The library comes with the compiler, so rebuild your pack after an update to get its changes.
