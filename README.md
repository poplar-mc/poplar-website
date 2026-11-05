# Poplar website

The website and documentation for [Poplar](https://github.com/poplar-mc/poplar), a language that compiles to Minecraft datapacks. It uses Astro, Starlight and Tailwind.

## Run it

```sh
cp .env.example .env
bun install
bun run dev
```

Search only works in a build: `bun run build`, then `bun run preview`.

## Links

Every external link is an env var in `.env`. Code reads it from `import.meta.env`, and a docs page writes `%PUBLIC_NAME%` in a link or code block. To add a link, put it in `.env` and `.env.example`, and add its name to `requiredLinks` in `astro.config.mjs`.

## Docs

Each page is a Markdown file in `src/content/docs/docs/`. A page also goes in the `sidebar` in `astro.config.mjs`.

`bun run check-docs` compiles every `poplar` code block that starts with `namespace `. It uses the compiler in a Poplar checkout at `../poplar`, or at `POPLAR_REPO`. Run `zig build` there first.

## Files from the Poplar repo

`src/poplar/examples/` and `src/code/poplar.tmLanguage.json` are copies from the Poplar repo. After a change to the examples or the grammar there, run `bun run sync` here and commit the result. It reads the same checkout as `check-docs`.

## License

[MIT](LICENSE)
