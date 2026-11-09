---
title: Scores
---

```poplar
namespace demo

var #mana = 0

mcfun regen:
    if @s.#mana < 100:
        @s.#mana = @s.#mana + 5
```

A `#` variable is a scoreboard score: a 32-bit integer. Math wraps on overflow, and `/` and `%` round down.

* A global `#mana` has its own `dummy` objective, `<namespace>.mana`, which `poplar/load` adds.
* `#mana` on its own is the global value, held by the fake player `#global`. The sidebar hides it.
* `@s.#mana` is an entity's value in the same objective. Any selector works: `@p.#mana`, `@a.#mana`.
* A local is the fake player `#<name>_<function>` in the objective `poplar.<namespace>`.

Scores support `+ - * / %` and the comparisons `< <= > >= == !=`. The example above compiles to one command:

```mcfunction
execute if score @s demo.mana matches ..99 run scoreboard players add @s demo.mana 5
```

To read an entity score, the selector must name one entity: `@s`, `@p`, `@r`, `@n`, or a selector with `limit=1`. You can write to many entities at once (`@a.#mana = 0`).

**Costs and caveats**

* Each global `#` variable adds one objective to the world.
* `/reload` keeps values. A global's initial value is only set when `#global` has no value, so changing it in your code doesn't change an existing world. Entities get no initial value.
* A local costs one command per declaration to set its value. Locals have no entity values, so `@s.#i` is an error when `#i` is local.
