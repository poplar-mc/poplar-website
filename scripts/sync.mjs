// Copies the example sources and the TextMate grammar from a Poplar checkout.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const website = resolve(import.meta.dirname, '..');
const repo = resolve(process.env.POPLAR_REPO ?? join(website, '../poplar'));
const grammar = join(repo, 'editors/textmate/poplar.tmLanguage.json');
if (!existsSync(grammar)) {
  console.error(`${repo} is not a Poplar checkout. Clone it next to this repo, or set POPLAR_REPO to it.`);
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
console.log(`Copied ${copied} examples and the grammar from ${repo}`);
