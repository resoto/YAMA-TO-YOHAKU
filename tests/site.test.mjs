import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const root = resolve('dist');
assert.ok(existsSync(root), 'Run pnpm build before pnpm test.');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
const pages = walk(root).filter(path => path.endsWith('.html'));
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

test('Cloudflare Pages receives static entry points and headers', () => {
  for (const file of ['index.html', '404.html', '_headers', 'favicon.svg']) {
    assert.ok(existsSync(join(root, file)), `Missing ${file}`);
  }
  assert.ok(!existsSync(join(root, '_worker.js')), 'The blog must not require a Worker.');
  assert.match(readFileSync(join(root, '404.html'), 'utf8'), /name="robots" content="noindex"/);
});

test('Every page has Japanese metadata and exactly one primary heading', () => {
  assert.ok(pages.length > 1);
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<html lang="ja">/, file);
    assert.match(html, /<title>[^<]+<\/title>/, file);
    assert.match(html, /name="description" content="[^"]+"/, file);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, file);
    assert.ok(!html.includes('undefined'), `${file} contains an unresolved value`);
  }
});

test('Internal links, article anchors, styles and images resolve in the built site', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const pathname = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '');
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(decode(raw), `https://blog.test${pathname}`);
      if (url.origin !== 'https://blog.test') continue;
      let target = join(root, decodeURIComponent(url.pathname));
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
      assert.ok(existsSync(target), `${pathname}: missing ${raw}`);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = readFileSync(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${pathname}: missing anchor ${raw}`);
      }
    }
  }
});

test('Local photographs are non-empty WebP files ready for static hosting', () => {
  for (const file of walk(join(root, 'images')).filter(file => file.endsWith('.webp'))) {
    const bytes = readFileSync(file);
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', file);
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', file);
    assert.ok(bytes.length > 1000 && bytes.length < 1_000_000, `${file}: unexpected image size`);
  }
});
