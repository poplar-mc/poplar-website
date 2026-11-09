---
title: Namespaces
---

```poplar
// src/combat.poplar
namespace combat

import magic

var #mana = 0

mcfun tick:
    magic:heal()
    #magic:mana = #mana
    /execute as @a run function magic:castSpell
```

```poplar
// src/spells/magic.poplar
namespace magic

var #mana = 0

mcfun heal:
    #mana = #mana + 1

mcfun castSpell:
    /say whoosh
```

Each file starts with `namespace <name>`. Every `.poplar` file in `src/` is part of the pack, and folders don't affect the result. Files with the same namespace share their names. A plain name (`heal()`, `#mana`, `$item`) is in the file's namespace. A name in another namespace is written `magic:heal()`, `#magic:mana`, `$magic:item` or `@s.#magic:mana`, and the file must `import magic` first.

Two namespaces can use the same names, because each has its own files and state:

| In `namespace combat` | Written as |
|---|---|
| `mcfun heal` | `data/combat/function/heal.mcfunction`, `combat:heal` |
| its helpers, temps and locals | `combat:poplar/heal/...`, the objective `poplar.combat` |
| `var #mana` | the objective `combat.mana` |
| `var $item` | the key `item` in the storage `combat:data` |
| `predicate isSitting` | `data/combat/predicate/is_sitting.json` |

Poplar's own functions (`poplar/load`, `poplar/tick`, the event checks) and the [standard library](/docs/standard-library/) go into the pack namespace, set by `"namespace"` in `poplar.json`. A file can use that name as its namespace too.

Each namespace can have [`load` and `tick`](/docs/functions/#load-and-tick). They run in import order: if `combat` imports `magic`, `magic:load` runs first, so its state is ready. Namespaces that import each other run in alphabetical order.

A namespace name uses `a-z`, `0-9`, `_` and `.` (`bs.math`). Minecraft also allows `-`, but in Poplar code `-` is the minus sign.

**Costs and caveats**

* Each namespace adds one objective for its temps and locals, set up in `poplar/load`.
* Renaming a namespace gives it different scores and storage. A world keeps the old values under the old name.
* `namespace minecraft` writes into vanilla's namespace, so it can replace vanilla functions and data. Minecraft's `load` and `tick` tags belong to Poplar, so you can't write those this way.
