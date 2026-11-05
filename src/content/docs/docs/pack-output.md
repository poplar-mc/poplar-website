---
title: Pack output
---

For the pack namespace `demo` and a second namespace `combat`:

```
poplar-out/<zipName>/
├── pack.mcmeta
└── data/
    ├── minecraft/tags/function/   load.json, tick.json
    ├── combat/
    │   ├── function/              combat's mcfuns, and poplar/<mcfun>/ helpers
    │   └── <folder>/              combat's data files, such as predicate/lucky.json
    └── demo/function/
        ├── <name>.mcfunction      one per mcfun, in snake_case
        ├── std/                   the standard library functions that the pack uses
        └── poplar/
            ├── load.mcfunction    sets up scores and storage, then runs each namespace's load
            ├── tick.mcfunction    event checks, then each tick (only with events)
            ├── event_<n>.mcfunction
            └── <mcfun>/           if_<n>, while_<n>, execute_<n>, macro_<n>
```

| Name | Use |
|---|---|
| objective `combat.<name>` | one per global `#` variable of `combat` |
| objective `poplar.combat` | `combat`'s locals (`#<name>_<mcfun>`) and temporary scores |
| objective `poplar.demo` | the pack namespace's locals and temps, and the constants |
| objective `<ns>.event_<n>` | one per `onEvent`, in the namespace that registers it |
| storage `combat:data` | `combat`'s `$` variables, globals and locals |
| storage `demo:poplar` | `args`, `macro` and the recursion `stack` |

The optimizer changes the output in these ways:

* It computes math on known values.
* It removes writes that nothing reads, and unused constants.
* It folds `data get` and a multiplication into one scaled `data get`.
* It writes results straight into their destination.
* It moves a generated function with one command to where it is called, along with a helper that is the last command of its function, such as the `if`/`else` wrapper.

**Costs and caveats**

* The output isn't a line-by-line copy of your code, so a line in your source may not match one line in a `.mcfunction` file.
