// Copies the example sources from a Poplar checkout, and the TextMate grammar from a poplar-editor-extensions checkout.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const website = resolve(import.meta.dirname, '..');
const repo = resolve(process.env.POPLAR_REPO ?? join(website, '../poplar'));
const editorsRepo = resolve(process.env.POPLAR_EDITORS_REPO ?? join(website, '../poplar-editor-extensions'));
const grammar = join(editorsRepo, 'textmate/poplar.tmLanguage.json');
if (!existsSync(join(repo, 'examples'))) {
  console.error(`${repo} is not a Poplar checkout. Clone it next to this repo, or set POPLAR_REPO to it.`);
  process.exit(1);
}
if (!existsSync(grammar)) {
  console.error(`${editorsRepo} is not a poplar-editor-extensions checkout. Clone it next to this repo, or set POPLAR_EDITORS_REPO to it.`);
  process.exit(1);
}

const examples = join(website, 'src/poplar/examples');
rmSync(examples, { recursive: true, force: true });
let copied = 0;
for (const name of readdirSync(join(repo, 'examples'))) {
  const source = join(repo, 'examples', name, 'src');
  if (!existsSync(source) || !statSync(source).isDirectory()) continue;
  mkdirSync(join(examples, name), { recursive: true });
  cpSync(source, join(examples, name, 'src'), { recursive: true });
  copied++;
}
cpSync(grammar, join(website, 'src/code/poplar.tmLanguage.json'));
console.log(`Copied ${copied} examples from ${repo}, and the grammar from ${editorsRepo}`);
