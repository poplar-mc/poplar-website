---
title: Variables
---

```poplar
namespace demo;

var #deaths = 0;          // a score
var $lastWinner = "Steve"; // NBT data in storage

mcfun load() {
    var rounds = 3;       // a constant
    /say Best of {{rounds}};
}
```

A sigil is the symbol in front of a variable's name. It says what kind of variable it is: `#` for a score, `$` for data, and no sigil for a constant.

| Form | What it is | Exists |
|---|---|---|
| `rounds` | a constant | only while the pack is built |
| `#deaths` | a [score](/docs/scores/) | in the game |
| `$lastWinner` | [NBT data](/docs/data/) in storage | in the game |

`var` declares a variable and `=` changes it. Statements end with `;`, and `//` starts a comment. You cannot declare a name again in an inner block.

## Constants

A variable without a sigil is a constant. It holds a number, a string, `true`, `false`, `null`, a list or a compound that the compiler knows. Use constants to build commands (`/say {{rounds}};`) and in [`for`](/docs/loops-and-return/#for) loops. The compiler does math on constants, and `/` and `%` round down as they do in Minecraft.

A constant cannot hold a value from the game. `var copy = #deaths;` is an error. Use `var #copy = #deaths;` instead.

Strings use double quotes and stay on one line. The only escapes are `\"` and `\\`.

A selector on its own, such as `@a` or `@e[type=zombie]`, is a constant string: `var everyone = @a;`.

## Global and local variables

A `#` or `$` variable declared at the top level of a file is global. Every function sees the same value, and it keeps that value between calls and across `/reload`.

A `#` or `$` variable declared inside a function is local:

```poplar
namespace demo;

var #total = 0;

mcfun countdown() {
    var #i = 10;
    var $seen = [];
    while (#i > 0) {
        #i = #i - 1;
        append($seen, 1);
        #total = #total + #i;
    }
}
```

* It is visible from its declaration to the end of its block.
* Its value is set every time the declaration runs.
* It never holds a value from an earlier call. A data local is removed when the function ends (at the end of the body and at every `return`), so copying from a path that doesn't exist leaves it empty. A score local needs no removal, because every score write overwrites it and a failed write stores 0.

  ```poplar
  mcfun show() {
      var $enchantments = @s.$SelectedItem.components."minecraft:enchantments";
      if ($enchantments) { /say enchanted; } else { /say plain; }
  }
  ```

  For an item without enchantments, the copy fails and `$enchantments` does not exist, so `show` says `plain`.
* Each function has its own locals, and a recursive call gets its own copies.

In the game, a local is named `<name>_<function>`: `#i` above is the fake player `#i_countdown` in the objective `poplar.<namespace>`, and `$seen` is the key `seen_countdown` in `<namespace>:data`. A local only exists while its function runs, so to inspect one, print it from inside the function: `/say {{#i}};`.
