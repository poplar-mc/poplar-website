---
title: Conditions
---

```poplar
if (#score > 10) {
    /say big;
} else if (#score > 5) {
    /say medium;
} else {
    /say small;
}
```

A condition works like `execute if` in Minecraft:

| Condition | Compiles to |
|---|---|
| `#a > 5`, `#a == #b` | `if score ...` |
| `@s.$SelectedItem.components.enchantments` | `if data entity @s SelectedItem.components.enchantments`, which tests that the path exists |
| `!$stats.bonus` | `unless data storage <ns>:data stats.bonus` |
| `@s.$OnGround == true` | `if data entity @s {OnGround:1b}` |
| `$name == "Steve"` | `if data storage <ns>:data {name:"Steve"}` |
| `$ratio == 5f` | `if data storage <ns>:data {ratio:5f}` |
| `block ~ ~-1 ~ #minecraft:logs` | `if block ~ ~-1 ~ #minecraft:logs` |
| `items entity @s weapon.mainhand #self:swords` | `if items entity @s weapon.mainhand #<ns>:swords` |
| `!entity @s[type=#minecraft:undead]` | `unless entity @s[type=#minecraft:undead]` |
| `predicate self:isSitting` | `if predicate <ns>:is_sitting` |

Combine conditions with `and`, `or` and `!`.

A condition can also be an `execute if` check, written as you would write it in a command:

```poplar
if (block ~ ~-1 ~ #minecraft:logs) { /say on a log; }
```

Poplar treats a condition as a check when it starts with one of these words and a space: `biome`, `block`, `blocks`, `data`, `dimension`, `entity`, `function`, `items`, `loaded`, `predicate`, `score`, `slots` or `stopwatch`. The check ends at `and`, `or` or the closing `)`.

Checks work like the text of a [command](/docs/commands/). The compiler checks them against the command tree, you can name something in your pack with [`self:name`](/docs/commands/#ids-in-commands), and `{{...}}` inserts a constant or a `$(name)` macro argument:

```poplar
namespace demo;

itemTag swords { "values": ["#minecraft:swords"] }

var #mana = 0;

mcfun tick() {
    if (block ~ ~-1 ~ #minecraft:logs and #mana > 5) {
        /say on a log;
    } else if (items entity @s weapon.mainhand #self:swords) {
        /say sword;
    }
}
```

```mcfunction
# tick
execute if block ~ ~-1 ~ #minecraft:logs if score #global demo.mana matches 6.. run return run say on a log
execute if items entity @s weapon.mainhand #demo:swords run return run say sword
```

A bare data path tests that the path exists, whatever its value. A bool always exists (`0b` or `1b`), so compare it with `== true` or `== false`. Comparing data with a string, bool, list, compound or typed number (`5f`) is an NBT match; comparing it with a plain int reads it into a score.

The compiler decides a condition that has only constants, and it writes only the branch that is taken.

A body with one command goes inline after `run`. A longer body becomes its own function, `poplar/<mcfun>/if_<n>`. Inside a runtime `if`, you can't change a constant declared outside it.

**Costs and caveats**

* A body with more than one command is a function call.
* `else`, `else if` and `or` use one wrapper function.
* A Minecraft check is raw text, so tags and ids in other namespaces aren't checked. The word `and` or `or` ends the check unless it is inside brackets or quotes.
* A game value in a Minecraft check is an error, for `{{#x}}` and `{{$x}}` alike. Use `execute (if ...) { }` instead.
* `==` with data only works on key paths. `$stats.name == "x"` works, and `$list[0] == "x"` is an error. You can't compare two game values that aren't numbers.
