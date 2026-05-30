import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const componentsRoot = path.resolve('src/components');
const ignoredRuntimeDefaultValues = new Set(['undefined', 'null']);

const findComponentTypeFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findComponentTypeFiles(fullPath));
      continue;
    }

    if (entry.name === 'types.ts') {
      files.push(fullPath);
    }
  }

  return files;
};

const getPropName = (name, sourceFile) => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return name.getText(sourceFile);
};

const normalizeDefault = (value) => {
  const trimmed = String(value ?? '')
    .trim()
    .split(/\r?\n/)[0]
    .trim()
    .replace(/\s+/g, ' ');

  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const getDefaultTagValue = (member, sourceFile) => {
  const defaultTag = ts.getJSDocTags(member).find((tag) => tag.tagName.getText(sourceFile) === 'default');
  if (!defaultTag) {
    return undefined;
  }

  if (typeof defaultTag.comment === 'string') {
    return normalizeDefault(defaultTag.comment);
  }

  return normalizeDefault(
    defaultTag.comment
      ?.map((part) => part.text)
      .join('')
      .trim() ?? ''
  );
};

const collectPropsFromTypeNode = (typeNode, aliases, sourceFile, visited = new Set()) => {
  const props = new Map();

  const visitType = (node) => {
    if (ts.isTypeLiteralNode(node)) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name) {
          props.set(getPropName(member.name, sourceFile), {
            defaultValue: getDefaultTagValue(member, sourceFile),
            pos: member.getStart(sourceFile),
            text: member.getText(sourceFile)
          });
        }
      }
      return;
    }

    if (ts.isIntersectionTypeNode(node)) {
      for (const child of node.types) {
        visitType(child);
      }
      return;
    }

    if (ts.isParenthesizedTypeNode(node)) {
      visitType(node.type);
      return;
    }

    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      const aliasName = node.typeName.text;
      if (visited.has(aliasName)) {
        return;
      }

      const aliased = aliases.get(aliasName);
      if (!aliased) {
        return;
      }

      visited.add(aliasName);
      visitType(aliased);
    }
  };

  visitType(typeNode);
  return props;
};

const collectPublicPropDocs = (typesPath) => {
  const source = fs.readFileSync(typesPath, 'utf8');
  const sourceFile = ts.createSourceFile(typesPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const aliases = new Map();
  const rootPropAliases = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isTypeAliasDeclaration(statement)) {
      continue;
    }

    aliases.set(statement.name.text, statement.type);

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    if (isExported && /Props$/.test(statement.name.text)) {
      rootPropAliases.push(statement);
    }
  }

  const propDocs = new Map();
  for (const alias of rootPropAliases) {
    const props = collectPropsFromTypeNode(alias.type, aliases, sourceFile);
    for (const [name, info] of props) {
      propDocs.set(name, info);
    }
  }

  return propDocs;
};

const getLiteralValue = (node, _sourceFile, constDefaults = new Map()) => {
  if (ts.isIdentifier(node) && constDefaults.has(node.text)) {
    return constDefaults.get(node.text);
  }

  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return 'true';
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return 'false';
  }

  if (ts.isArrayLiteralExpression(node) && node.elements.length === 0) {
    return '[]';
  }

  if (ts.isObjectLiteralExpression(node) && node.properties.length === 0) {
    return '{}';
  }

  return undefined;
};

const shouldScanRuntimeFile = (fileName) => {
  if (!/\.[tj]sx?$/.test(fileName)) {
    return false;
  }

  if (/\.(stories|test)\.[tj]sx?$/.test(fileName)) {
    return false;
  }

  return /^use.+\.ts$/.test(fileName) || /^[A-Z][^.]*\.tsx$/.test(fileName);
};

const flattenNullishCoalescing = (node) => {
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
    return [...flattenNullishCoalescing(node.left), ...flattenNullishCoalescing(node.right)];
  }

  return [node];
};

const collectRuntimeDefaults = (componentDir, typesPath) => {
  const defaults = new Map();
  const sourcePaths = fs
    .readdirSync(componentDir)
    .filter(shouldScanRuntimeFile)
    .map((fileName) => path.join(componentDir, fileName));

  sourcePaths.push(typesPath);

  for (const sourcePath of sourcePaths) {
    const source = fs.readFileSync(sourcePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      sourcePath,
      source,
      ts.ScriptTarget.Latest,
      true,
      sourcePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    const constDefaults = new Map();

    const recordDefault = (propName, value, node, source = 'runtime') => {
      if (value === undefined) {
        return;
      }

      defaults.set(propName, {
        value: normalizeDefault(value),
        file: path.relative(process.cwd(), sourcePath),
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        source
      });
    };

    const collectConstDefaults = (node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        const value = getLiteralValue(node.initializer, sourceFile, constDefaults);
        if (value !== undefined) {
          constDefaults.set(node.name.text, value);
        }
      }

      ts.forEachChild(node, collectConstDefaults);
    };

    const visit = (node) => {
      if (ts.isBindingElement(node) && node.initializer) {
        const nameNode = node.propertyName ?? node.name;
        if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
          recordDefault(
            getPropName(nameNode, sourceFile),
            getLiteralValue(node.initializer, sourceFile, constDefaults),
            node
          );
        }
      }

      if (ts.isPropertyAssignment(node) && node.name && getPropName(node.name, sourceFile) === 'defaultVariants') {
        if (ts.isObjectLiteralExpression(node.initializer)) {
          for (const property of node.initializer.properties) {
            if (ts.isPropertyAssignment(property) && property.name) {
              recordDefault(
                getPropName(property.name, sourceFile),
                getLiteralValue(property.initializer, sourceFile, constDefaults),
                property,
                'cva defaultVariants'
              );
            }
          }
        }
      }

      if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) {
        if (ts.isParenthesizedExpression(node.parent) && ts.isConditionalExpression(node.parent.parent)) {
          ts.forEachChild(node, visit);
          return;
        }

        const operands = flattenNullishCoalescing(node);
        const fallback = operands.at(-1);
        const fallbackValue = fallback
          ? (getLiteralValue(fallback, sourceFile, constDefaults) ??
            (ts.isIdentifier(fallback) ? defaults.get(fallback.text)?.value : undefined))
          : undefined;

        if (fallbackValue && !ignoredRuntimeDefaultValues.has(fallbackValue)) {
          for (const operand of operands.slice(0, -1)) {
            if (ts.isIdentifier(operand)) {
              recordDefault(operand.text, fallbackValue, node, 'nullish fallback');
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    collectConstDefaults(sourceFile);
    visit(sourceFile);
  }

  return defaults;
};

const failures = [];

for (const typesPath of findComponentTypeFiles(componentsRoot)) {
  const componentDir = path.dirname(typesPath);
  const propDocs = collectPublicPropDocs(typesPath);
  const runtimeDefaults = collectRuntimeDefaults(componentDir, typesPath);

  for (const [propName, runtimeDefault] of runtimeDefaults) {
    const propDoc = propDocs.get(propName);
    if (!propDoc || ignoredRuntimeDefaultValues.has(runtimeDefault.value)) {
      continue;
    }

    if (runtimeDefault.source === 'cva defaultVariants' && /React(?:\.React)?Node|ReactElement/.test(propDoc.text)) {
      continue;
    }

    if (propDoc.defaultValue === undefined) {
      failures.push({
        kind: 'missing',
        component: path.relative(process.cwd(), componentDir),
        propName,
        expectedValue: runtimeDefault.value,
        source: `${runtimeDefault.file}:${runtimeDefault.line}`,
        typesPath: path.relative(process.cwd(), typesPath)
      });
      continue;
    }

    if (propDoc.defaultValue !== runtimeDefault.value) {
      failures.push({
        kind: 'mismatch',
        component: path.relative(process.cwd(), componentDir),
        propName,
        actualValue: propDoc.defaultValue,
        expectedValue: runtimeDefault.value,
        source: `${runtimeDefault.file}:${runtimeDefault.line}`,
        typesPath: path.relative(process.cwd(), typesPath)
      });
    }
  }
}

if (failures.length > 0) {
  console.error('Public component props with runtime defaults must document matching @default values in types.ts.');
  for (const failure of failures) {
    if (failure.kind === 'missing') {
      console.error(
        `- ${failure.typesPath}: prop "${failure.propName}" defaults to ${failure.expectedValue} at ${failure.source} but has no @default tag`
      );
      continue;
    }

    console.error(
      `- ${failure.typesPath}: prop "${failure.propName}" documents @default ${failure.actualValue} but runtime default is ${failure.expectedValue} at ${failure.source}`
    );
  }
  process.exit(1);
}

console.log('Prop default docs verified.');
