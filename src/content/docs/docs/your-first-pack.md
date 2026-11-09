---
title: Your first pack
---

```sh
poplar new hello_pack
cd hello_pack
poplar build
```

`poplar new` creates this folder:

```
hello_pack/
├── poplar.json          the project config
├── poplar.schema.json   lets your editor check poplar.json
├── src/main.poplar      starts with `namespace hello_pack;`
└── .gitignore           ignores poplar-out/
```

`src/main.poplar` has one function:

```poplar
namespace hello_pack

mcfun load:
    /say Hello from hello_pack!
```

`mcfun load` runs every time the pack loads. `poplar build` writes the datapack to `poplar-out/hello_pack/`, and a zip of it to `poplar-out/hello_pack.zip` for sharing:

```
✓ Built hello_pack in 20 ms → poplar-out/hello_pack (1 function, zip)
```

Copy the folder or the zip into a world's `datapacks` folder, open the world and run `/reload`.

While you work, `poplar watch` can build and copy the pack for you:

```sh
poplar watch --world ~/.minecraft/saves/"My World"
```

It builds every time you save a file and copies the pack into the world's `datapacks/` folder. Run `/reload` in the game to load the latest build.

To avoid typing `--world` each time, put the world in a `.env` file in the project folder. `poplar new` adds `.env` to `.gitignore`, because the path is specific to your machine:

```sh
# .env
POPLAR_WORLD="~/.minecraft/saves/My World"
```
