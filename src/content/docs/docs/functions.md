---
title: Functions
---

```poplar
namespace demo;

var #hp = 0;

mcfun heal() {
    #hp = #hp + $(amount);
}

mcfun double() {
    return $(x) * 2;
}

mcfun load() {
    heal() with {amount: 5};
    #hp = double() with {x: #hp};
}
```

Each `mcfun` is one `.mcfunction` file. Minecraft function names can't contain capital letters, so the file name is the snake_case form of the name: `mcfun playerDied` is `player_died.mcfunction`, and you run it with `/function <namespace>:player_died`.

## `load` and `tick`

`mcfun load()` runs every time the pack loads, after Poplar sets up its scores and storage. `mcfun tick()` runs every tick.

Each [namespace](/docs/namespaces/) can have its own. They run in import order: a namespace's `load` runs after the `load` of every namespace it imports. The game calls them with no macro arguments, so they can't use `$(name)`.

## Macro arguments

An `mcfun` has no parameter list. To take arguments, it is a [macro function](https://minecraft.wiki/w/Function_(Java_Edition)#Macros), as in Minecraft: the body reads an argument by name with `$(name)`, and the caller passes a compound with `with`:

```poplar
mcfun greet() {
    /say Hi $(name);
}
```

| Call | Minecraft |
|---|---|
| `greet() with {name: "Steve"};` | `function demo:greet {name:"Steve"}` |
| `greet() with {name: $player.name};` | `data modify storage demo:poplar args.name set from storage demo:data player.name`, then `function demo:greet with storage demo:poplar args` |
| `greet() with $player;` | `function demo:greet with storage demo:data player` |
| `greet() with @s.$SelectedItem.components;` | `function demo:greet with entity @s SelectedItem.components` |
| `greet() with block ~ ~ ~;` | `function demo:greet with block ~ ~ ~` |

A constant compound goes into the call as it is. A compound with game values (`#hp`, `$x`, math, calls) is written to `<namespace>:poplar args` first, at one command per game value, and a score or math value is an `int`. A `$` variable or an entity path is passed with `with storage` or `with entity`. It must hold a compound, and its keys are the argument names. `entity` and `block` pass the text after them to Minecraft unchanged. Minecraft ignores keys the function doesn't use.

You can use `$(name)` in these places:

* In a command or a `{{...}}` insert: `/say Hi $(name);`.
* In math or an `if`. The value goes through a score, so it must be a number.
* In an assignment: `$x = $(name);`. This writes `data modify ... set value $(name)`, so any value that parses as NBT works.

A macro inserts a string without its quotes, and a list or compound as SNBT. With `{name: "Steve"}`, `/say Hi $(name);` writes `say Hi Steve`.

`$(name)` is a game value, so it can't be a constant: `var x = $(amount);` is an error.

It is a compile error to call an `mcfun` that uses `$(name)` without `with`, and for `load`, `tick` or an [event](/docs/events/) callback to use `$(name)`.

## Return values

A call can be used as a value. `#y = double() with {x: #y};` compiles to `execute store result score ... run function demo:double ...`. Minecraft only returns integers.

## Recursion

An `mcfun` can call itself. A recursive call would overwrite the temporary scores and locals of the running call, so the compiler saves the ones that are still needed on a stack in storage around the call. Macro arguments need no saving, because Minecraft fills in `$(name)` when the call starts.

**Costs and caveats**

* Each game value in a `with` compound costs one command.
* A missing key in a `$` variable, an entity or a block fails in the game: Minecraft doesn't run the function. The compiler can't see those keys. It does check a compound written in the call, and a variable that is declared as a number, string or list and that no code changes.
* A `"` in an argument breaks forwarding, because generated bodies (`if`, `while`, `execute`) that use `$(name)` receive the arguments as `{name:"$(name)"}`.
* Recursion costs `2 + 2n` commands per call, to save and restore the `n` values that are still needed.
