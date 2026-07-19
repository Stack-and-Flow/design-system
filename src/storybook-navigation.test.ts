import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

type ParsedArray = Array<string | string[]>;

const readProjectFile = (path: string) => readFileSync(join(root, path), 'utf8');

const parseSourceFile = (path: string) =>
  ts.createSourceFile(join(root, path), readProjectFile(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const getPropertyName = (name: ts.PropertyName) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return undefined;
};

const getObjectProperty = (objectLiteral: ts.ObjectLiteralExpression, propertyName: string) => {
  const property = objectLiteral.properties.find(
    (item): item is ts.PropertyAssignment =>
      ts.isPropertyAssignment(item) && getPropertyName(item.name) === propertyName
  );

  return property?.initializer;
};

const parseStringArray = (arrayLiteral: ts.ArrayLiteralExpression): string[] =>
  arrayLiteral.elements.map((element) => {
    if (!ts.isStringLiteral(element)) {
      throw new Error('Expected array item to be a string literal.');
    }

    return element.text;
  });

const parseStorySortOrder = (arrayLiteral: ts.ArrayLiteralExpression): ParsedArray =>
  arrayLiteral.elements.map((element) => {
    if (ts.isStringLiteral(element)) {
      return element.text;
    }

    if (ts.isArrayLiteralExpression(element)) {
      return parseStringArray(element);
    }

    throw new Error('Expected storySort.order items to be string literals or nested string arrays.');
  });

const readPreviewStorySortOrder = () => {
  const sourceFile = parseSourceFile('.storybook/preview.tsx');
  let storySortOrder: ParsedArray | undefined;

  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node) && getPropertyName(node.name) === 'storySort') {
      const storySort = node.initializer;

      if (!ts.isObjectLiteralExpression(storySort)) {
        throw new Error('Expected Storybook storySort to be configured inline.');
      }

      const order = getObjectProperty(storySort, 'order');

      if (!order || !ts.isArrayLiteralExpression(order)) {
        throw new Error('Expected Storybook storySort.order to be an inline array.');
      }

      storySortOrder = parseStorySortOrder(order);
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  if (!storySortOrder) {
    throw new Error('Expected preview config to define storySort.order.');
  }

  return storySortOrder;
};

const readManagerCollapsedRoots = () => {
  const sourceFile = parseSourceFile('.storybook/manager.ts');
  let collapsedRoots: string[] | undefined;

  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node) && getPropertyName(node.name) === 'collapsedRoots') {
      const initializer = node.initializer;

      if (ts.isArrayLiteralExpression(initializer)) {
        collapsedRoots = parseStringArray(initializer);
        return;
      }

      if (ts.isIdentifier(initializer)) {
        const variable = sourceFile.statements.find(
          (statement): statement is ts.VariableStatement =>
            ts.isVariableStatement(statement) &&
            statement.declarationList.declarations.some(
              (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === initializer.text
            )
        );
        const declaration = variable?.declarationList.declarations.find(
          (item) => ts.isIdentifier(item.name) && item.name.text === initializer.text
        );

        if (declaration?.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
          collapsedRoots = parseStringArray(declaration.initializer);
          return;
        }
      }

      throw new Error('Expected collapsedRoots to resolve to a string array.');
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  if (!collapsedRoots) {
    throw new Error('Expected manager config to define collapsedRoots.');
  }

  return collapsedRoots;
};

describe('Storybook navigation', () => {
  it('keeps the sidebar roots ordered from design documentation to component tiers', () => {
    expect(readPreviewStorySortOrder()).toEqual([
      'Design System',
      [
        'Welcome',
        'Component Methodology',
        'Primitive Colors',
        'Semantic Colors',
        'Breakpoints',
        'Typography',
        'Animations'
      ],
      'Primitives',
      'Atoms',
      'Molecules',
      'Organisms',
      'Controls',
      'Docs',
      'Stories'
    ]);
  });

  it('keeps only the design system root expanded on initial load', () => {
    const collapsedRoots = readManagerCollapsedRoots();

    expect(collapsedRoots).toEqual(['primitives', 'atoms', 'molecules', 'organisms']);
    expect(collapsedRoots).not.toContain('design-system');
  });

  it('links methodology readers to the English project docs', () => {
    const methodologyStory = readProjectFile('stories/Design system/6-component-methodology.mdx');

    expect(methodologyStory).toContain('docs/GUIDELINES.en.md');
    expect(methodologyStory).toContain('docs/DESIGN.en.md');
    expect(methodologyStory).toContain('docs/CONTRIBUTING.en.md');
    expect(methodologyStory).not.toContain('docs/GUIDELINES.md');
    expect(methodologyStory).not.toContain('docs/DESIGN.md');
    expect(methodologyStory).not.toContain('docs/CONTRIBUTING.md');
  });
});
