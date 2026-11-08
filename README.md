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

The two install script links are env vars, `PUBLIC_INSTALL_SH_URL` and `PUBLIC_INSTALL_PS1_URL`. The install page writes them as `%PUBLIC_NAME%`, and the build fails if one is missing. Every other link is written directly in the page.

## Docs

Each page is a Markdown file in `src/content/docs/docs/`. A page also goes in the `sidebar` in `astro.config.mjs`.

`bun run check-docs` compiles every `poplar` code block that starts with `namespace `. It uses the compiler in a Poplar checkout at `../poplar`, or at `POPLAR_REPO`. Run `nimble build` there first.

## Files from other repos

`src/poplar/examples/` is a copy from the Poplar repo, and `src/code/poplar.tmLanguage.json` is a copy from [poplar-editor-extensions](https://github.com/poplar-mc/poplar-editor-extensions). After a change to either one, run `bun run sync` here and commit the result. It reads `../poplar` and `../poplar-editor-extensions`, or `POPLAR_REPO` and `POPLAR_EDITORS_REPO`.

## License

[MIT](LICENSE)
