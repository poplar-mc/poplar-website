---
title: Data files
---

```poplar
namespace demo;

predicate lucky { "type": "minecraft:random_chance", "chance": 0.25 }

itemTag handles { "values": ["minecraft:stick", "minecraft:blaze_rod"] }

lootTable "minecraft:entities/zombie" {
  "type": "minecraft:entity",
  "pools": [{ "rolls": 1, "entries": [{ "type": "minecraft:item", "name": "minecraft:diamond" }] }]
}

mcfun tick() {
    if (predicate self:lucky) { /say lucky; }
}
```

Recipes, predicates, loot tables, advancements, tags and worldgen are JSON files in a pack, and a data file declaration writes one. The type word picks the folder and the name picks the file. The body is the JSON: an object, or a list for the few types that use one (`blockTransformer`). It is written unchanged, so you can paste output from a generator such as [misode](https://misode.github.io). A string id can replace a vanilla file, such as a loot table.

The example writes:

```
data/demo/predicate/lucky.json
data/demo/tags/item/handles.json
data/minecraft/loot_table/entities/zombie.json
```

The name is an identifier or a string:

| Name | File | Id |
|---|---|---|
| `lucky` | `data/demo/predicate/lucky.json` (snake_case, like an `mcfun`) | `demo:lucky`, or `self:lucky` in commands |
| `"checks/rare"` | `data/demo/predicate/checks/rare.json` | none; type `demo:checks/rare` |
| `"minecraft:entities/zombie"` | `data/minecraft/loot_table/entities/zombie.json` | none; it replaces the vanilla file |

In commands and conditions, refer to a data file by its name: `if (predicate self:lucky)` (see [ids in commands](/docs/commands/#ids-in-commands)). Inside JSON, write ids in full: `"#demo:handles"`, or `"demo:first_trident"` for an `mcfun firstTrident`.

The type word is the folder name in camelCase. Worldgen types drop `worldgen/`, and a tag is the registry name followed by `Tag`:

| Type words | Folder |
|---|---|
| `advancement`, `recipe`, `predicate`, `lootTable`, `itemModifier`, `enchantment`, `damageType`, `dialog`, `jukeboxSong`, `trimMaterial`, ... | the same name in snake_case: `loot_table`, `item_modifier`, ... |
| `biome`, `feature`, `placedFeature`, `noiseSettings`, `densityFunction`, `structure`, `templatePool`, ... | `worldgen/<name>` |
| `itemTag`, `blockTag`, `entityTypeTag`, `functionTag`, `biomeTag`, ... | `tags/item`, `tags/block`, `tags/entity_type`, `tags/function`, `tags/worldgen/biome` |

The type words are only special at the top level of a file, so you can use `recipe` as a name inside an `mcfun`. A wrong word is an error with a suggestion: `Unknown data file type 'recpie'. Did you mean 'recipe'?`.

**Costs and caveats**

* The compiler only checks the JSON syntax. The game reads the contents when the pack loads, and a bad file can stop the world from loading: in 26.3, a predicate with `"condition"` in place of `"type"` gives `No key type`, and the server refuses to start.
* The body is plain JSON, so `//` and `{{...}}` aren't read as Poplar.
* The `minecraft:load` and `minecraft:tick` function tags belong to Poplar. Use `mcfun load` and `mcfun tick` instead.
