import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const localAtlProbePaths = ['.atl/skill-registry.md', '.atl/skills/__local-registry-probe__/SKILL.md'];
const teamSkillProbePath = 'skills/__team-skill-probe__/SKILL.md';
const staleReferencePattern = String.raw`\.atl/(skills|AGENTS\.md)`;

const runGit = (args) =>
  spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8'
  });

const fail = (message, details = []) => {
  console.error(message);
  for (const detail of details.filter(Boolean)) {
    console.error(detail);
  }
  process.exit(1);
};

const splitLines = (source) => source.trim().split(/\r?\n/).filter(Boolean);

const listTrackedAtlFiles = () => {
  const result = runGit(['ls-files', '--', '.atl']);

  if (result.status !== 0) {
    fail('Cannot verify tracked .atl files.', [result.stderr.trim()]);
  }

  return splitLines(result.stdout);
};

const parseIgnoredPaths = (stdout) =>
  new Set(
    splitLines(stdout)
      .map((line) => line.split('\t').at(-1)?.trim())
      .filter(Boolean)
  );

const assertAtlIsLocalOnly = () => {
  const trackedAtlFiles = listTrackedAtlFiles();

  if (trackedAtlFiles.length > 0) {
    fail('Do not commit .atl/ files in this repository.', [
      '.atl/ is generated local Gentle AI registry/cache state and may include user-level skills.',
      'Move shared team skills to skills/ and keep .atl/ ignored.',
      '',
      'Tracked .atl files:',
      ...trackedAtlFiles.map((file) => `- ${file}`)
    ]);
  }

  const result = runGit(['check-ignore', '--no-index', '-v', '--', ...localAtlProbePaths]);

  if (result.status === null || result.status > 1) {
    fail('Cannot verify .atl/ ignore policy.', [result.stderr.trim()]);
  }

  const ignoredPaths = parseIgnoredPaths(result.stdout);
  const missingIgnoredPaths = localAtlProbePaths.filter((probePath) => !ignoredPaths.has(probePath));

  if (missingIgnoredPaths.length > 0) {
    fail('Expected all .atl/ probe paths to be ignored as local generated harness state.', [
      'Add a blanket .atl/ entry to .gitignore; do not store shared team skills there.',
      '',
      'Missing ignored probe paths:',
      ...missingIgnoredPaths.map((probePath) => `- ${probePath}`),
      '',
      'Matched ignore rules:',
      result.stdout.trim() || '- none'
    ]);
  }
};

const assertTeamSkillsAreVisible = () => {
  if (!fs.existsSync(path.resolve('skills'))) {
    fail('Expected shared team skills to live in the committed skills/ directory.');
  }

  const skillFiles = runGit(['ls-files', '--', 'skills/**/SKILL.md']);

  if (skillFiles.status !== 0) {
    fail('Cannot verify tracked team skill files.', [skillFiles.stderr.trim()]);
  }

  const trackedSkillFiles = splitLines(skillFiles.stdout);

  if (trackedSkillFiles.length === 0) {
    fail('Expected at least one tracked team skill under skills/**/SKILL.md.');
  }

  const ignoredSkillProbe = runGit(['check-ignore', '--no-index', '-v', '--', teamSkillProbePath]);

  if (ignoredSkillProbe.status === 0) {
    fail('Do not ignore the committed skills/ directory.', [ignoredSkillProbe.stdout.trim()]);
  }

  if (ignoredSkillProbe.status > 1 || ignoredSkillProbe.status === null) {
    fail('Cannot verify that skills/ is visible to Git.', [ignoredSkillProbe.stderr.trim()]);
  }
};

const getIndexedSource = (file) => {
  const result = runGit(['show', `:${file}`]);

  return result.status === 0 ? result.stdout : undefined;
};

const getWorkingTreeSource = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return undefined;
  }
};

const collectSourceViews = (file) => {
  const views = [];
  const indexedSource = getIndexedSource(file);
  const workingTreeSource = getWorkingTreeSource(file);

  if (indexedSource !== undefined) {
    views.push({ label: `${file} (index)`, source: indexedSource });
  }

  if (workingTreeSource !== undefined && workingTreeSource !== indexedSource) {
    views.push({ label: `${file} (working tree)`, source: workingTreeSource });
  }

  return views;
};

const assertNoStaleAtlReferences = () => {
  const result = runGit(['ls-files']);

  if (result.status !== 0) {
    fail('Cannot list tracked files for stale .atl harness reference verification.', [result.stderr.trim()]);
  }

  const staleReferenceRegex = new RegExp(staleReferencePattern);
  const violations = [];
  const files = splitLines(result.stdout).filter((file) => file !== 'scripts/verify-harness-skill-boundaries.mjs');

  for (const file of files) {
    for (const { label, source } of collectSourceViews(file)) {
      source.split(/\r?\n/).forEach((line, index) => {
        if (staleReferenceRegex.test(line)) {
          violations.push(`${label}:${index + 1}: ${line}`);
        }
      });
    }
  }

  if (violations.length > 0) {
    fail('Tracked files still reference old committed .atl harness paths.', [
      'Use AGENTS.md for project agent context and skills/ for shared team skills.',
      '',
      ...violations
    ]);
  }
};

assertAtlIsLocalOnly();
assertTeamSkillsAreVisible();
assertNoStaleAtlReferences();

console.log('Harness skill boundaries verified.');
