---
title: Events
---

```poplar
namespace demo;

import std;

var #deaths = 0;

mcfun load() {
    onEvent("deathCount", playerDied);
    onEvent("minecraft.used:minecraft.snowball", threwSnowball);
}

mcfun playerDied() {
    #deaths = #deaths + 1;
}

mcfun threwSnowball() {
    /tellraw @s {text: "Nice throw"};
}
```

`onEvent(criteria, callback)` runs the `mcfun` `callback` as a player, at the player, each time the [scoreboard criteria](https://minecraft.wiki/w/Scoreboard#Criteria) counts for that player. Call it in `mcfun load()` of any namespace, outside any runtime `if`, `while` or `execute`. The callback cannot use [macro arguments](/docs/functions/#macro-arguments).

Each event gets an objective, `<namespace>.event_<n>`, and `poplar/tick` checks it every tick:

```mcfunction
execute as @a[scores={demo.event_0=1..}] at @s run function demo:poplar/event_0
```

`poplar/event_<n>` resets the player's score and runs the callback. If you define `mcfun tick()`, `poplar/tick` runs it after the event checks.

**Costs and caveats**

* Each event costs one check every tick, over all players.
* The score is reset on each run. A counting criteria (`deathCount`, `minecraft.used:...`) fires once per occurrence, and a value criteria (`health`, `food`) fires every tick while it is above 0.
* You can only call `onEvent` in `load`.
* The criteria isn't checked. A wrong one makes `scoreboard objectives add` fail in the game.

## Triggers

```poplar
namespace demo;

mcfun load() {
    onTrigger("showoff", show);
}

mcfun show() {
    /say I am showing off;
}
```

Every player can use `/trigger <objective>`, so datapacks use it for their own commands. `onTrigger(name, callback)` sets one up: when a player runs `/trigger showoff`, the `mcfun` `show` runs as that player, at the player. The rules are the same as for `onEvent`.

`poplar/load` adds the objective `showoff` with the criteria `trigger`. The name is used as it is, without the namespace, because players type it. `poplar/tick` runs the callback for each player with a score, and then enables the trigger again for all players, because Minecraft disables a trigger after each use:

```mcfunction
# poplar/tick
execute as @a[scores={showoff=1..}] at @s run function demo:poplar/event_0
scoreboard players enable @a showoff

# poplar/event_0
scoreboard players reset @s showoff
function demo:show
```

**Costs and caveats**

* Each trigger costs two commands every tick: the check and the `enable`.
* The name has no namespace, so two packs that use the same trigger name share it.
* A name that starts with `poplar.` or `<namespace>.` is an error, because Poplar uses those for its own objectives. The name of the namespace itself (`showoff` in the namespace `showoff`) is fine.
* `/trigger showoff set 5` runs the callback once, like `/trigger showoff`. The callback can't read the value, because the score is reset first.

## Player events

```poplar
namespace demo;

mcfun load() {
    onFirstJoin(welcome);
    onJoin(greet);
    onDeath(died);
    onRespawn(giveKit);
}

mcfun welcome() { /tellraw @s "Welcome to the server!"; }
mcfun greet() { /say I joined; }
mcfun died() { /say I died; }
mcfun giveKit() { /give @s minecraft:bread 4; }
```

Poplar provides helpers for common player events, so you don't need to set up their scoreboard criteria yourself. Each one runs the callback as the player, at the player, from `poplar/tick`, with the same rules as `onEvent`:

| Builtin | Runs the callback | How it is detected |
|---|---|---|
| `onFirstJoin(cb)` | the first time a player is in the world | a player without the tag `<ns>.event_<n>` (which it then gets) |
| `onJoin(cb)` | each time a player joins, the first time too | the same tag, plus the `leave_game` statistic for a rejoin |
| `onDeath(cb)` | when a player dies | `onEvent("deathCount", cb)` |
| `onRespawn(cb)` | when a dead player is alive again | `deathCount`, then the `time_since_death` statistic, which only counts while alive |

**Costs and caveats**

* Each event costs one check every tick over all players, or two for `onJoin`.
* Players who are already in the world when you add the pack count as joining for the first time.
* `onDeath` runs while the player is on the death screen, so use `onRespawn` to give items.
