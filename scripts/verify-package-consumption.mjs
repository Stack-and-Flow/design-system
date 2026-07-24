import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Button, Divider, Skeleton, Spacer } from '@stack-and-flow/design-system';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const loadCjs = createRequire(import.meta.url);
const cjsExports = loadCjs('@stack-and-flow/design-system');
const stylesPath = loadCjs.resolve('@stack-and-flow/design-system/styles');

if (typeof Button !== 'function') {
  throw new TypeError(`Expected ESM Button export to be a function, received ${typeof Button}`);
}

if (typeof Divider !== 'function') {
  throw new TypeError(`Expected ESM Divider export to be a function, received ${typeof Divider}`);
}

if (typeof Spacer !== 'function') {
  throw new TypeError(`Expected ESM Spacer export to be a function, received ${typeof Spacer}`);
}

if (typeof Skeleton !== 'function') {
  throw new TypeError(`Expected ESM Skeleton export to be a function, received ${typeof Skeleton}`);
}

if (typeof cjsExports.Button !== 'function') {
  throw new TypeError(`Expected CJS Button export to be a function, received ${typeof cjsExports.Button}`);
}

if (typeof cjsExports.Divider !== 'function') {
  throw new TypeError(`Expected CJS Divider export to be a function, received ${typeof cjsExports.Divider}`);
}

if (typeof cjsExports.Spacer !== 'function') {
  throw new TypeError(`Expected CJS Spacer export to be a function, received ${typeof cjsExports.Spacer}`);
}

if (typeof cjsExports.Skeleton !== 'function') {
  throw new TypeError(`Expected CJS Skeleton export to be a function, received ${typeof cjsExports.Skeleton}`);
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
      `import type { ComponentProps } from 'react';
import type {
  DividerColor,
  DividerProps,
  SkeletonProps,
  SkeletonRounded,
  SkeletonSize,
  SpacerProps,
  SpacerScale
} from '@stack-and-flow/design-system';
import { Button, Divider, Popover, Select, Skeleton, Spacer } from '@stack-and-flow/design-system';

const buttonProps: ComponentProps<typeof Button> = {
  text: 'Save',
  type: 'button'
};

const dividerColor: DividerColor = 'bg-primary';
const dividerProps: ComponentProps<typeof Divider> = {
  color: dividerColor,
  decorative: true,
  orientation: 'horizontal'
};
const explicitDividerProps: DividerProps = dividerProps;

const spacerScale: SpacerScale = 8;
const spacerProps: ComponentProps<typeof Spacer> = {
  axis: 'vertical',
  size: spacerScale
};
const explicitSpacerProps: SpacerProps = spacerProps;

const skeletonSize: SkeletonSize = 'title';
const skeletonRounded: SkeletonRounded = 'lg';
const skeletonProps: ComponentProps<typeof Skeleton> = {
  size: skeletonSize,
  rounded: skeletonRounded,
  ariaHidden: false,
  role: 'status',
  'aria-label': 'Loading profile'
};
const explicitSkeletonProps: SkeletonProps = skeletonProps;

const selectProps: ComponentProps<typeof Select> = {
  ariaLabel: 'Framework',
  options: [{ key: 'react', label: 'React' }]
};

const button = <Button {...buttonProps} />;
const divider = <Divider {...dividerProps} />;
const spacer = <Spacer {...spacerProps} />;
const skeleton = <Skeleton {...skeletonProps} />;
const select = <Select {...selectProps} />;
const popover = (
  <Popover>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Content>Content</Popover.Content>
  </Popover>
);

void button;
void divider;
void explicitDividerProps;
void spacer;
void explicitSpacerProps;
void skeleton;
void explicitSkeletonProps;
void select;
void popover;
`
    );

    writeFileSync(
      resolve(consumerDir, 'smoke.mjs'),
      `import { createRequire } from 'node:module';
import { Button, Divider, Skeleton, Spacer } from '@stack-and-flow/design-system';

const require = createRequire(import.meta.url);
const cjsExports = require('@stack-and-flow/design-system');
const stylesPath = require.resolve('@stack-and-flow/design-system/styles');

if (typeof Button !== 'function') {
  throw new TypeError('Expected ESM Button export to be a function');
}
if (typeof Divider !== 'function') {
  throw new TypeError('Expected ESM Divider export to be a function');
}
if (typeof Spacer !== 'function') {
  throw new TypeError('Expected ESM Spacer export to be a function');
}
if (typeof Skeleton !== 'function') {
  throw new TypeError('Expected ESM Skeleton export to be a function');
}
if (typeof cjsExports.Button !== 'function') {
  throw new TypeError('Expected CJS Button export to be a function');
}
if (typeof cjsExports.Divider !== 'function') {
  throw new TypeError('Expected CJS Divider export to be a function');
}
if (typeof cjsExports.Spacer !== 'function') {
  throw new TypeError('Expected CJS Spacer export to be a function');
}
if (typeof cjsExports.Skeleton !== 'function') {
  throw new TypeError('Expected CJS Skeleton export to be a function');
}
if (!stylesPath.endsWith('dist/design-system.css')) {
  throw new Error(\`Expected styles subpath to resolve to dist/design-system.css, received \${stylesPath}\`);
}
`
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
  'Package consumption verified: ESM/CJS root Button, Divider, Skeleton, and Spacer imports, styles subpath, and React 18/19 consumers are available.'
);
