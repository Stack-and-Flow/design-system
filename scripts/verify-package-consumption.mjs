import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
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

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: packageRoot,
    stdio: 'pipe',
    encoding: 'utf8',
    ...options
  });

const packageJson = loadCjs(resolve(packageRoot, 'package.json'));
const packDir = mkdtempSync(join(tmpdir(), 'stack-and-flow-pack-'));
const consumerDirs = [];

try {
  const packOutput = run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packDir]);
  const jsonStart = packOutput.indexOf('[\n');
  const jsonEnd = packOutput.lastIndexOf(']');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Could not find npm pack JSON output: ${packOutput}`);
  }

  const [{ filename }] = JSON.parse(packOutput.slice(jsonStart, jsonEnd + 1));
  const tarballPath = resolve(packDir, filename);

  const matrices = [
    {
      name: 'react-18',
      react: '18.3.1',
      reactDom: '18.3.1',
      typesReact: '18.3.18',
      typesReactDom: '18.3.5'
    },
    {
      name: 'react-19',
      react: '19.2.7',
      reactDom: '19.2.7',
      typesReact: '19.2.16',
      typesReactDom: '19.2.3'
    }
  ];

  for (const matrix of matrices) {
    const consumerDir = mkdtempSync(join(tmpdir(), `stack-and-flow-${matrix.name}-consumer-`));
    consumerDirs.push(consumerDir);

    writeFileSync(
      resolve(consumerDir, 'package.json'),
      JSON.stringify(
        {
          private: true,
          type: 'module',
          scripts: {
            typecheck: 'tsc --noEmit',
            smoke: 'node smoke.mjs'
          },
          dependencies: {
            '@stack-and-flow/design-system': `file:${tarballPath}`,
            '@types/react': matrix.typesReact,
            '@types/react-dom': matrix.typesReactDom,
            react: matrix.react,
            'react-dom': matrix.reactDom,
            typescript: packageJson.devDependencies.typescript
          },
          devDependencies: {}
        },
        null,
        2
      )
    );

    writeFileSync(
      resolve(consumerDir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            strict: true,
            jsx: 'react-jsx',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            target: 'ES2022',
            skipLibCheck: false,
            noEmit: true
          },
          include: ['consumer.tsx']
        },
        null,
        2
      )
    );

    writeFileSync(
      resolve(consumerDir, 'consumer.tsx'),
      `import type { ComponentProps } from 'react';\nimport { Button, Popover, Select } from '@stack-and-flow/design-system';\n\nconst buttonProps: ComponentProps<typeof Button> = {\n  text: 'Save',\n  type: 'button'\n};\n\nconst selectProps: ComponentProps<typeof Select> = {\n  ariaLabel: 'Framework',\n  options: [{ key: 'react', label: 'React' }]\n};\n\nconst button = <Button {...buttonProps} />;\nconst select = <Select {...selectProps} />;\nconst popover = (\n  <Popover>\n    <Popover.Trigger>Open</Popover.Trigger>\n    <Popover.Content>Content</Popover.Content>\n  </Popover>\n);\n\nvoid button;\nvoid select;\nvoid popover;\n`
    );

    writeFileSync(
      resolve(consumerDir, 'smoke.mjs'),
      `import { createRequire } from 'node:module';\nimport { Button } from '@stack-and-flow/design-system';\n\nconst require = createRequire(import.meta.url);\nconst cjsExports = require('@stack-and-flow/design-system');\nconst stylesPath = require.resolve('@stack-and-flow/design-system/styles');\n\nif (typeof Button !== 'function') {\n  throw new TypeError('Expected ESM Button export to be a function');\n}\nif (typeof cjsExports.Button !== 'function') {\n  throw new TypeError('Expected CJS Button export to be a function');\n}\nif (!stylesPath.endsWith('dist/design-system.css')) {\n  throw new Error(\`Expected styles subpath to resolve to dist/design-system.css, received ${stylesPath}\`);\n}\n`
    );

    run('npm', ['install', '--silent', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerDir });
    run('npm', ['run', '--silent', 'typecheck'], { cwd: consumerDir });
    run('npm', ['run', '--silent', 'smoke'], { cwd: consumerDir });

    console.log(
      `Package consumer verified for ${matrix.name}: React ${matrix.react}, React DOM ${matrix.reactDom}, @types/react ${matrix.typesReact}.`
    );
  }
} finally {
  for (const consumerDir of consumerDirs) {
    rmSync(consumerDir, { recursive: true, force: true });
  }
  rmSync(packDir, { recursive: true, force: true });
}

console.log(
  'Package consumption verified: ESM/CJS root Button imports, styles subpath, and React 18/19 consumers are available.'
);
