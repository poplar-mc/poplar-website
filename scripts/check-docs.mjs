// Every `poplar` block that is a whole program (it starts with `namespace `) must compile.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const website = resolve(import.meta.dirname, '..');
const repo = resolve(process.env.POPLAR_REPO ?? join(website, '../poplar'));
const poplar = join(repo, 'zig-out/bin/poplar');
if (!existsSync(poplar)) {
  console.error(`${poplar} not found. Run 'zig build' in the Poplar repo, or set POPLAR_REPO to it.`);
  process.exit(1);
}
const pagesDir = join(website, 'src/content/docs/docs');
const project = mkdtempSync(join(tmpdir(), 'poplar-docs-'));
mkdirSync(join(project, 'src'));
writeFileSync(join(project, 'poplar.json'), '{"namespace": "demo"}');

let failures = 0;
let checked = 0;
for (const page of readdirSync(pagesDir)) {
  const text = readFileSync(join(pagesDir, page), 'utf8');
  for (const match of text.matchAll(/```poplar\n(.*?)```/gs)) {
    if (!match[1].startsWith('namespace ')) continue;
    checked++;
    writeFileSync(join(project, 'src/main.poplar'), match[1]);
    const result = spawnSync(poplar, ['check', project], {
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1', POPLAR_STD: join(repo, 'std') },
    });
    if (result.status !== 0) {
      failures++;
      const line = text.slice(0, match.index).split('\n').length;
      console.log(`${page}:${line}\n${result.stdout}${result.stderr}`);
    }
  }
}
rmSync(project, { recursive: true });
console.log(`${checked} programs checked, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
