import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';

const storyFilePattern = /\.stories\.(ts|tsx|js|jsx)$/;
const root = process.cwd();
const srcDir = join(root, 'src');

type StoryMapViolation = {
  file: string;
  line: number;
  column: number;
};

const getStoryFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getStoryFiles(fullPath);
    }

    if (entry.isFile() && storyFilePattern.test(entry.name)) {
      return [fullPath];
    }

    return [];
  });

const getScriptKind = (filePath: string) => (filePath.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

const findStoryMapViolations = (): StoryMapViolation[] =>
  getStoryFiles(srcDir).flatMap((filePath) => {
    const sourceText = readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, getScriptKind(filePath));
    const violations: StoryMapViolation[] = [];

    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'map'
      ) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.expression.name.getStart(sourceFile));
        violations.push({
          file: relative(root, sourceFile.fileName),
          line: line + 1,
          column: character + 1
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return violations;
  });

describe('Storybook explicit examples', () => {
  it('does not use .map() in story files', () => {
    const violations = findStoryMapViolations();

    expect(
      violations,
      [
        'Do not use `.map()` in *.stories.* files.',
        'Storybook code panels must show explicit, copyable component examples.',
        'Use containers to group examples, but write each component invocation with its props inline.',
        ...violations.map(({ file, line, column }) => `- ${file}:${line}:${column}`)
      ].join('\n')
    ).toEqual([]);
  });
});
