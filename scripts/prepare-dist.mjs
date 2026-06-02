import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';

const distRoot = resolve('dist');
const indexTypesPath = resolve(distRoot, 'index.d.ts');
const cssSideEffectImport = "import './styles/global.css';\n";

const toPosix = (value) => value.split(sep).join('/');

const getDeclarationFiles = (dir) => {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const path = resolve(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...getDeclarationFiles(path));
      continue;
    }

    if (path.endsWith('.d.ts')) {
      files.push(path);
    }
  }

  return files;
};

const aliasTargets = [
  ['@/', distRoot],
  ['@atoms/', resolve(distRoot, 'components/atoms')],
  ['@molecules/', resolve(distRoot, 'components/molecules')],
  ['@organisms/', resolve(distRoot, 'components/organisms')],
  ['@hooks/', resolve(distRoot, 'hooks')],
  ['@utils/', resolve(distRoot, 'utils')]
];

const resolveAliasSpecifier = (specifier, fromFile) => {
  for (const [prefix, targetRoot] of aliasTargets) {
    if (!specifier.startsWith(prefix)) {
      continue;
    }

    const target = resolve(targetRoot, specifier.slice(prefix.length));
    let rewritten = toPosix(relative(dirname(fromFile), target));

    if (!rewritten.startsWith('.')) {
      rewritten = `./${rewritten}`;
    }

    return rewritten;
  }

  return specifier;
};

for (const file of getDeclarationFiles(distRoot)) {
  let contents = readFileSync(file, 'utf8');

  if (file === indexTypesPath && contents.includes(cssSideEffectImport)) {
    contents = contents.replace(cssSideEffectImport, '');
  }

  contents = contents.replace(/(from\s+['"])([^'"]+)(['"])/g, (match, before, specifier, after) => {
    const rewritten = resolveAliasSpecifier(specifier, file);
    return `${before}${rewritten}${after}`;
  });

  writeFileSync(file, contents);
}
