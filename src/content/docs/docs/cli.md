---
title: CLI
---

| Command | Does |
|---|---|
| `poplar new <name>` | makes a project folder; the namespace is the lowercase name |
| `poplar init` | the same, in the current folder |
| `poplar build [dir]` | compiles into `poplar-out/` |
| `poplar check [dir]` | prints the errors, writes nothing |
| `poplar watch [dir] [--world <world>]` | builds again on every change; with a world, copies each build into the world's `datapacks/` |
| `poplar update [--yes]` | updates Poplar to the latest release, after asking |
| `poplar lsp` | the language server, over stdin and stdout |
| `poplar --version`, `poplar -v` | the Poplar and Minecraft versions |

`new` and `init` never overwrite a file. A failing command lists its errors, one per line, and exits with code 1:

```
✗ src/main.poplar:4:21  Unknown mob_effect 'poision'. Did you mean 'poison'?
✗ 1 error, nothing was written
```

Output has colors in a terminal, and setting `NO_COLOR` turns them off. Errors go to stderr.

`watch` takes the world from `--world`, then the `POPLAR_WORLD` environment variable, then `POPLAR_WORLD` in the project's `.env`. If the world doesn't come from `--world`, the first copy line names the source. With no world, `watch` still builds, but it prints a warning and copies nothing. The world must be a folder with `level.dat`, and a leading `~/` in `POPLAR_WORLD` is your home folder.

A `.env` has `KEY=VALUE` lines, `#` comments, an optional `export ` and optional quotes. It has no variable expansion.

`watch` only replaces a pack folder that it copied itself, which it marks with a `.poplar-watch` file, so it doesn't touch your own folders.

`update` asks GitHub for the latest release. If that release is newer, it shows it and asks before running the install script. The script runs with `POPLAR_PREFIX` set to the folder that holds this `poplar`, so the copy you run is the one it replaces:

```
You have poplar 0.3.0. 0.4.0 is available: https://github.com/poplar-mc/poplar/releases/tag/v0.4.0
Update now? [y/N]
```

`--yes` updates without asking. Without a terminal and without `--yes`, it only says that an update is available.

**Costs and caveats**

* `poplar watch` polls the files every 300 ms.
* The language server compiles the whole project on each change.
* Go to definition jumps to the start of the line.
* `poplar update` needs the network, plus `curl` and `sh` (PowerShell on Windows), as the install command does. The install scripts come from the `main` branch.
* `poplar update` replaces the binary that you run, including a development build in `zig-out/`.
