import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Button } from '@stack-and-flow/design-system';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const loadCjs = createRequire(import.meta.url);
const cjsExports = loadCjs('@stack-and-flow/design-system');
const stylesPath = loadCjs.resolve('@stack-and-flow/design-system/styles');

if (typeof Button !== 'function') {
  throw new TypeError(`Expected ESM Button export to be a function, received ${typeof Button}`);
}

if (typeof cjsExports.Button !== 'function') {
  throw new TypeError(`Expected CJS Button export to be a function, received ${typeof cjsExports.Button}`);
}

const cssPath = resolve(packageRoot, 'dist/design-system.css');
if (stylesPath !== cssPath) {
  throw new Error(`Expected styles subpath to resolve to ${cssPath}, received ${stylesPath}`);
}

if (!existsSync(cssPath)) {
  throw new Error(`Expected package styles export target to exist: ${cssPath}`);
}

console.log('Package consumption verified: ESM/CJS root Button imports and styles subpath are available.');
