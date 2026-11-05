---
title: Project
---

```
my_pack/
├── poplar.json          the project config (optional)
├── src/
│   └── **/*.poplar      every source file, each starting with `namespace <name>;`
└── poplar-out/
    ├── <zipName>/       the datapack
    └── <zipName>.zip    the same datapack as a zip
```

Each build deletes and rewrites `poplar-out/`. All fields of `poplar.json` are optional:

| Field | Default | Description |
|---|---|---|
| `zipName` | the folder name | the name of the pack folder and the zip; no `/` or `\` |
| `namespace` | the folder name | the pack namespace, for Poplar's own files and the standard library: `a-z 0-9 _ . -` |
| `description` | `zipName` | the pack description, any JSON text component |
| `minFormat` | the targeted version | the lowest pack format: a number or `[major, minor]`, at least `88` (1.21.9) |
| `maxFormat` | `minFormat` | the highest pack format |
| `$schema` | | ignored by the compiler; lets editors check the file |

**Costs and caveats**

* Poplar needs Minecraft 1.21.9 or newer (pack format 88 or higher).
