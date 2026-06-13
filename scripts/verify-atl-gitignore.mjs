import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const gitignorePath = path.resolve('.gitignore');
const atlPolicyProbePaths = [
  '.atl/__gitignore-policy-probe__/new-harness-file.md',
  '.atl/skills/__gitignore-policy-probe__/SKILL.md'
];

const readGitignore = () => {
  if (!fs.existsSync(gitignorePath)) {
    console.error('Cannot verify .atl ignore policy because .gitignore was not found.');
    process.exit(1);
  }

  return fs.readFileSync(gitignorePath, 'utf8');
};

const normalizePattern = (line) => line.trim().replace(/^\//, '').replace(/^\.\//, '');

const isForbiddenAtlBlanketPattern = (line) => {
  const pattern = normalizePattern(line);

  if (!pattern || pattern.startsWith('#') || pattern.startsWith('!')) {
    return false;
  }

  return (
    /^\.atl\/?$/.test(pattern) ||
    /^\.atl\/(?:\*|\*\*)\/?$/.test(pattern) ||
    /^\.atl\/\*\*\/\*$/.test(pattern) ||
    /^\*\*\/\.atl\/?$/.test(pattern) ||
    /^\*\*\/\.atl\/(?:\*|\*\*)\/?$/.test(pattern) ||
    /^\*\*\/\.atl\/\*\*\/\*$/.test(pattern)
  );
};

const getExplicitPatternViolations = () =>
  readGitignore()
    .split(/\r?\n/)
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) => isForbiddenAtlBlanketPattern(line));

const getEffectiveGitignoreViolations = () => {
  const result = spawnSync('git', ['check-ignore', '--no-index', '-v', '--', ...atlPolicyProbePaths], {
    cwd: path.dirname(gitignorePath),
    encoding: 'utf8'
  });

  if (result.status === 1) {
    return [];
  }

  if (result.error || result.status === null || result.status > 1) {
    console.error('Cannot verify effective .atl ignore policy with git check-ignore.');
    console.error(result.error?.message ?? result.stderr.trim());
    process.exit(1);
  }

  return result.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => line.startsWith('.gitignore:'));
};

const explicitPatternViolations = getExplicitPatternViolations();
const effectiveGitignoreViolations = getEffectiveGitignoreViolations();

if (explicitPatternViolations.length > 0 || effectiveGitignoreViolations.length > 0) {
  console.error('Do not blanket-ignore .atl/ in this repository.');
  console.error('.atl/ contains tracked harness assets such as project skills and AGENTS.md.');
  console.error('Ignoring the whole directory makes new harness files invisible to Git.');
  console.error('Ignore only specific generated local files, for example .atl/.skill-registry.cache.json.');

  if (explicitPatternViolations.length > 0) {
    console.error('');
    console.error('Forbidden .gitignore entries:');

    for (const { line, lineNumber } of explicitPatternViolations) {
      console.error(`- .gitignore:${lineNumber}: ${line}`);
    }
  }

  if (effectiveGitignoreViolations.length > 0) {
    console.error('');
    console.error('Effective .gitignore rules that ignore new .atl files:');

    for (const violation of effectiveGitignoreViolations) {
      console.error(`- ${violation}`);
    }
  }

  process.exit(1);
}

console.log('.atl gitignore policy verified.');
