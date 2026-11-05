---
title: Entities
---

```poplar
namespace demo;

var #hp = 0;

mcfun check() {
    #hp = @s.$Health;
    if (@s.$Health < 10) {
        @s.$Glowing = true;
    }
}

mcfun heal() {
    @s.$Health = #hp + 4;
}
```

A selector followed by `.#` or `.$` names a value of an entity. `@s.#mana` is the entity's score in the objective of `#mana`, and `@s.$Health` is the entity's NBT at the path `Health`. Without a selector, `$item` is the pack's own storage and `#mana` is the global score.

You can read an entity value anywhere a value is expected, and `@s.$Health * 10` is one command: `data get entity @s Health 10`. That scaled read keeps the fraction until the end, so `1.5 * 10` is `15`, and a value too large for an integer is clamped.

A write uses `data modify`: `@s.$Glowing = true;`. Minecraft refuses `data modify entity` on a player. A copy from other NBT keeps its type: `$lastPos = @s.$Pos;`. A score or math is stored as an `int`, and the game converts it to the type of the field, so `@s.$Health = #hp;` gives `Health` the value `7.0f`.

Reads and writes need a selector for one entity: `@s`, `@p`, `@r`, `@n` or `limit=1`.

**Costs and caveats**

* The path isn't checked.
* The compiler can't check for a write to a player, which fails in the game.
