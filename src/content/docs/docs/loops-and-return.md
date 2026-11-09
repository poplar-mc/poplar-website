---
title: Loops and return
---

## `while`

```poplar
while #i > 0:
    #i = #i - 1
```

`while` runs in the game. Its condition must use a score or data value, or be `true`. `break` leaves the loop and `continue` starts the next step. `while true` must contain a `break` or a `return`. Minecraft stops a run after `max_command_sequence_length` commands (65536 by default), so a very long or endless loop stops partway.

Each loop becomes `poplar/<mcfun>/while_<n>`, which tests the condition, and `while_<n>_body`, which ends by running the test again.

## `for`

```poplar
for n in 0..3:
    /say step {{n}}
// say step 0
// say step 1
// say step 2
```

`for n in a..b` runs while the pack is built. The compiler writes the body once for each value from `a` up to, but not including, `b`, and `n` is a constant. `a` and `b` can be [constants](/docs/variables/#constants). For a loop that depends on the game, use `while`.

## `return`

`return value` ends the `mcfun` and gives its caller a value, and `return` on its own returns 0. An `if` body that returns must have `return` as its last statement. If one branch of an `if`/`else` returns, every branch must. Code after `return`, `break` or `continue` in the same block is an error.

`return` also works inside `while` and `execute`. The value is stored in a score and the body returns 1, so the call site can return too.

## `execute`

```poplar
execute as @e[type=zombie] at @s:
    /say found
    /particle flame ~ ~1 ~
```

`execute <subcommands>:` runs the body with `execute <subcommands> run ...`. The subcommands go up to the colon that starts the body, and you can put parentheses around them: `execute (as @a):`. The compiler checks them against the command tree, and they can contain `{{...}}` inserts. Nested executes are joined, so `execute A run execute B run C` is written as `execute A B run C`. The compiler doesn't track `@s`: inside an `mcfun`, `@s` is whatever the caller ran it as.

**Costs and caveats**

* `while` costs one function call per step.
* `continue` costs one function call.
* `return` in a loop or `execute` costs 2 commands where it happens and one check at the call site, or 2 checks in an `mcfun` that uses macro arguments.
* `return` in `execute as @a:` returns for the first entity that returns. It is an error in an `mcfun` that uses macro arguments, and in an `execute` whose subcommands insert `{{$x}}`.
* `for` writes its body once per value, so `for n in 0..100` adds 100 copies to the pack.
