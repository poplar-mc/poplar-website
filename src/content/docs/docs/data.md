---
title: Data
---

```poplar
namespace demo

var $stats = {hp: 20, name: "Steve"}
var $names = []
var #kills = 0

mcfun win:
    append($names, "Alex")
    $stats.hp = #kills * 2
    if $stats.name == "Steve":
        /say Steve is still in the lead
```

A `$` variable is NBT. A global is a key in the storage `<namespace>:data`, and a local is the key `<name>_<function>` in the same storage. As in the game, NBT has no declared types: a variable holds whatever you put in it, and a list can mix types.

## Values

| Write | Stored as |
|---|---|
| `20` | `20` (an int) |
| `0.5` | `0.5` (a double) |
| `0.05f`, `20f` | `0.05f`, `20f` (a float) |
| `0.05d`, `20d` | `0.05d`, `20d` (a double) |
| `1b`, `5s`, `5L` | `1b`, `5s`, `5L` (a byte, short and long) |
| `true` / `false` | `true` / `false` (a byte, `1b` / `0b`) |
| `"Steve"` | `"Steve"` |
| `[1, "a"]` | `[1,"a"]` |
| `{hp: 20, "custom key": 1}` | `{hp:20,"custom key":1}` |

Numbers use the same forms as Minecraft's SNBT, and suffixes can be upper or lower case, so you can paste NBT from a command: `{Count: 1b, chance: 0.05f}`. A global's initial value is only set if the key doesn't exist, so `/reload` keeps its value.

## Assigning

`$x = ...` takes a constant, a `$` variable, entity data, a score, math or a macro argument. A copy from a `$` variable or entity data keeps its NBT type. A score or math is stored as an `int`. A macro argument goes into the command as text, so Minecraft reads its type:

```poplar
$count = #kills * 2             // execute store result storage demo:data count int 1 run ...
$speed = $(speed)               // data modify storage demo:data speed set value $(speed)
$copy = @s.$SelectedItem        // data modify storage demo:data copy set from entity @s SelectedItem
```

## Paths

A path reaches into a compound or a list: `$stats.hp`, `$inventory[0].count`, `$names[-1]`, `$item.components."minecraft:custom_data"`. The root (`$stats`) must be declared. The rest of the path isn't checked.

A literal can contain game values. `$pos = [#x, #y, 0]` writes `[0,0,0]`, then stores `#x` and `#y` into `pos[0]` and `pos[1]`.

## List functions

| Function | Does |
|---|---|
| `append($list, value)` | adds `value` at the end |
| `prepend($list, value)` | adds `value` at the start |
| `insert($list, index, value)` | adds `value` at `index` |
| `remove($list, index)` | removes the value at `index` |
| `len(value)` | the number of elements of a list or compound, or the length of a string in UTF-16 units, as the game counts it (an emoji counts as 2) |

`index` must be a constant integer. A score or math value is added as a `0` first, then stored into it.

## Strings

```poplar
namespace demo

var $id = ""
var #kills = 0

mcfun inspect:
    $id = slice(@s.$SelectedItem.id, 10)          // "minecraft:diamond_sword" → "diamond_sword"
    var $label = str(#kills)                      // 5 → "5"
    if endsWith(@s.$SelectedItem.id, "_sword"):
        /say a sword
```

| Helper | Gives | Compiles to |
|---|---|---|
| `slice(text, start)`, `slice(text, start, end)` | the characters from `start` (included) to `end` (not included) | `data modify ... set string <text> <start> [<end>]` |
| `str(value)` | a number, score or math as text | `set string` from the number |
| `startsWith(text, "prefix")` | a condition | a substring of the text, then an NBT match |
| `endsWith(text, "suffix")` | a condition | the same, from the end |

`text` is a `$` path, entity data (`@s.$path`) or another string helper (`slice(str(#x), 1)`). `start` and `end` are constant integers, and a negative one counts from the end, so `slice($id, -3)` is the last three characters. The prefix or suffix is a constant string. If every argument is a constant, the compiler computes the result: `{{slice("minecraft:stone", 10)}}` writes `stone`.

`slice` and `str` give a string, which you can store in data, pass to a function or insert with `{{...}}`. `startsWith` and `endsWith` are conditions for `if` and `while`. Minecraft has no command that joins strings, so to join them, use inserts in a command: `/data modify storage demo:data name set value "{{$first}} {{$last}}"`.

## NBT types

A number literal says its own NBT type with a suffix: `0.05f`, `1b`, `5L`. A score or math is always stored as an `int`. A float inserted into a command on its own prints as a long decimal, because Minecraft widens it: with `$x` set to `0.05f`, `/say {{$x}}` says `.050000000745058`. Inside a compound, it prints as `0.05f`.

In entity data, the game converts the value to the type of the field: `@s.$Health = #hp` gives `Health` the value `7.0f`. In storage and custom data it stays an `int`. To store a score as another type there, write the command yourself, using the objective name from [Scores](/docs/scores/):

```mcfunction
execute store result storage demo:data ratio float 0.05 run scoreboard players get #global demo.kills
```

**Costs and caveats**

* Paths aren't checked. A typo like `$stats.hpp` compiles and reads nothing in the game.
* Build-time math only works on plain whole numbers, so `0.5 + 1` is an error.
* A comparison checks the NBT type as well as the value. `$x == 0.25d` is false if `$x` is `0.25f` or `1`.
* `$x = $(key)` stores whatever the text parses as. A macro removes a string's quotes, so `"5"` becomes the int `5`, and Minecraft refuses the function for `"minecraft:diamond"`. For a string, write the quotes in a command: `/data modify storage demo:data x set value "$(key)"`.
* In math or a number comparison, `$x` is read with `data get`, which rounds a fraction down.
* A literal with game values costs one command for the literal, plus one for each game value.
* Adding a game value to a list costs 2 commands. A constant, or a copy from other data, costs 1.
* A data local costs one `data remove` at the end of the body and at every `return`. A `return` of a game value computes it into a temporary score first, because the value can read a local.
* `append`, `prepend`, `insert`, `remove`, `len`, `slice`, `str`, `startsWith` and `endsWith` are reserved, so they can't be function names.
* `slice` costs one command, and `str` of a score or math costs 2, because the number is stored first.
* Each `startsWith` or `endsWith` runs 3 commands every time its condition is checked: it clears a scratch value, copies the start or end of the text into it, and compares it. Two in one condition cost 6, and inside a `while` the cost is per loop step. Both are false for a text shorter than the prefix.
