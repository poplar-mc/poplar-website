---
title: Install
---

On Linux and macOS, run:

```sh
curl -fsSL %PUBLIC_INSTALL_SH_URL% | sh
```

On Windows, run this in PowerShell:

```powershell
irm %PUBLIC_INSTALL_PS1_URL% | iex
```

The script downloads the latest [release](%PUBLIC_RELEASES_URL%) for your platform and installs `poplar` with its [standard library](/docs/standard-library/). On Linux and macOS it installs to `~/.local`, and on Windows to `%LOCALAPPDATA%\Programs\poplar`. To install somewhere else, set `POPLAR_PREFIX`.

## Update

`poplar update` checks for a newer release and asks before it installs one. See the [CLI](/docs/cli/) page for its options.

## Language server

Poplar comes with a language server, which you start with `poplar lsp`. It reports errors as you type and handles hover, go to definition and completion.

## Build from source

Building Poplar yourself needs [Zig 0.17.0](%PUBLIC_ZIG_DOWNLOAD_URL%):

```sh
git clone %PUBLIC_REPO_CLONE_URL%
cd poplar/compiler
zig build -Doptimize=ReleaseSafe -p ~/.local
```

This installs the compiler to `~/.local/bin/poplar` and the standard library to `~/.local/lib/poplar/std/`.

The compiler looks for the standard library at `../lib/poplar/std` next to its binary. If you move the binary, set `POPLAR_STD` to the standard library folder.
