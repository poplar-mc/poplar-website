---
title: Commands
---

```poplar
namespace demo;

var #hp = 20;
var $item = "diamond";

mcfun load() {
    /give @s diamond 1;
    /say {{$item}} for you;
    /say hp is {{#hp}} and double is {{#hp * 2}};
}
```

A statement that starts with `/` is a Minecraft command, and it goes into the file as you wrote it. It ends at the first `;` outside quotes and brackets, so `/tellraw @a {"text":"a;b"};` is one command.

The compiler checks each command against the command tree of the targeted version, including literals, argument kinds and vanilla ids of items, blocks, effects and entities.

```
✗ src/main.poplar:4:21  Unknown mob_effect 'poision'. Did you mean 'poison'?
```

Tags, `*`, `$(x)` and ids in other namespaces aren't checked.

The compiler also checks selectors. An unknown option or an unknown `type=` id is an error, and so is a quoted value, because only `name` and `nbt` accept quotes in Minecraft. A selector with `$(x)` in it isn't checked.

## Ids in commands

```poplar
namespace demo;

predicate isSitting { "type": "minecraft:random_chance", "chance": 0.5 }
entityTypeTag undead { "values": ["minecraft:zombie", "minecraft:skeleton"] }

mcfun tick() {
    if (predicate self:isSitting) { /function self:healPlayer; }
    /execute as @e[type=#self:undead] run say grr;
}

mcfun healPlayer() {
    /effect give @s minecraft:instant_health;
}
```

```mcfunction
# tick, for the namespace demo
execute if predicate demo:is_sitting run function demo:heal_player
execute as @e[type=#demo:undead] run say grr
```

Minecraft needs a full id, `namespace:path`. In commands, `execute (...)` and conditions, refer to an `mcfun` or a [data file](/docs/data-files/) of your pack by its name in the source. Poplar gives you `self` as a helper, which the compiler converts to the namespace of the current file:

| You write | Means |
|---|---|
| `self:healPlayer` | `healPlayer` in this file's namespace: `demo:heal_player` |
| `magic:castSpell` | `castSpell` in the namespace `magic`, which the file imports: `magic:cast_spell` |
| `magic:cast_spell` | the real id, kept as it is |
| `std:clamp` | the standard library's `clamp`: `demo:std/clamp` (see [Standard library](/docs/standard-library/)) |
| `minecraft:stone`, `otherpack:thing` | not one of your namespaces: kept as it is |
| `self:boss` in `/bossbar add self:boss "Boss"` | an id that is not a function or data file (a storage, a bossbar): only the namespace is filled in, `demo:boss` |

The compiler writes the file name, so `healPlayer` becomes `heal_player`, and your code doesn't change when you rename a namespace. It only checks and converts ids where Minecraft expects a function or a data file: `function`, `predicate`, `loot`, `item modify`, tags and selector values such as `type=`. The command tree says which kind each argument is. A data file declared with a string is named by that string, so `predicate "checks/rare"` is `self:checks/rare`. For a tag, add `#`, including in selector values such as `type=#self:undead`. Chat and other text stay unchanged: `/say self:x` says `self:x`.

The compiler checks the name, and `self:` only takes the name from the source:

```
'self:isSiting' is not a data file or mcfun of namespace 'demo'. Did you mean 'isSitting'?
'self:is_sitting' is a file name. Use the name from the source: 'self:isSitting'
```

**Costs and caveats**

* `self:` doesn't work in data file JSON. A JSON body is written unchanged, so write ids in full (`"#demo:handles"`).
* The check doesn't look at the type. `predicate self:healPlayer` passes because `healPlayer` is an `mcfun`, and the game then finds no predicate with that name.
* A name from your pack needs `self:`, because an id without a namespace means `minecraft:name`. `predicate isVehicle` is an error when `isVehicle` is in your pack, and so is any bare id with a capital letter where a function or data file goes. Where Minecraft has its own list of ids, a bare name stays unchanged: `/effect give @s speed` is the effect, even with an `mcfun speed`.
* `self:` is only for commands. In Poplar code a plain name already means this namespace, so write `healPlayer()`.

## Inserts with `{{...}}`

| Insert | Written as |
|---|---|
| a constant, `{{i}}` | its text: `say step 3`. A string has no quotes, a list or compound is SNBT |
| a [macro argument](/docs/functions/#macro-arguments), `{{$(amount)}}` or `$(amount)` in the text | `$(amount)` in a macro line |
| a `$` variable, `{{$item}}` | a macro line that reads `<namespace>:data` |
| a score, math or entity data: `{{#hp}}`, `{{#hp * 2}}`, `{{@s.$CustomName}}` | a macro line, with the value copied in first |

A line with a game value moves into a helper function, `poplar/<mcfun>/macro_<n>`. Values other than whole `$` variables are first copied into `<namespace>:poplar macro`, named after their source: `$stats.hp` is `$(stats_hp)`, `#hp` is `$(hp)`, and math is `$(value)`.

## Text components

```poplar
namespace demo;

var #hp = 20;

mcfun tick() {
    /title @a actionbar {{["HP: ", text(#hp)]}};
    /tellraw @a {text: "Hello", color: "gold"};
}
```

A text component with fixed text is plain Minecraft text, so you write it directly in the command. To show a game value, build the component in `{{...}}` with `text(value)`. This is a part that names a score or data, and the game reads the value when it shows the text:

| Call | Text component |
|---|---|
| `text(#hp)` | `{score:{name:"#global",objective:"<namespace>.hp"}}` |
| `text($name)` | `{storage:"<namespace>:data",nbt:"name"}` |
| `text(@s.$SelectedItem.id)` | `{entity:"@s",nbt:"SelectedItem.id"}` |

To insert a compound, put a space after `{{` and before `}}`, as in `{{ {text: "HP: ", extra: [text(#hp)]} }}`, because `}}}` would end the insert too early.

**Costs and caveats**

* The ids come from the Minecraft version the compiler was built with.
* A game value insert adds a helper function call.
* Every game value except a whole `$` variable costs one command to copy.
