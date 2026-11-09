---
title: Poplar
---

Poplar is a programming language that compiles to Minecraft Java datapacks (1.21.9 and newer).

```poplar
namespace demo

var #deaths = 0

mcfun load:
    onEvent("deathCount", playerDied)

mcfun playerDied:
    #deaths = #deaths + 1
    /tellraw @a {{["Deaths: ", text(#deaths)]}}
```

Each `mcfun` compiles to a normal Minecraft function, so other datapacks can call it with `/function`. A variable is either a scoreboard score (`#deaths`) or NBT data (`$item`). A line that starts with `/` is a Minecraft command, and the compiler checks it when you build.
