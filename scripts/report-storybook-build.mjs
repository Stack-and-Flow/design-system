import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve(process.cwd(), process.argv[2] ?? 'storybook-static');

if (!fs.existsSync(outputDir)) {
  console.error(`Storybook output directory not found: ${outputDir}`);
  process.exit(1);
}

const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KiB', 'MiB', 'GiB'];
  let value = bytes;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
};

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return [fullPath];
  });
};

const files = walk(outputDir).map((fullPath) => {
  const stats = fs.statSync(fullPath);

  return {
    fullPath,
    relativePath: path.relative(outputDir, fullPath),
    size: stats.size
  };
});

const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
const jsFiles = files.filter((file) => file.relativePath.endsWith('.js'));
const jsBytes = jsFiles.reduce((sum, file) => sum + file.size, 0);
const topAssets = files
  .filter((file) => file.relativePath.startsWith('assets/'))
  .sort((a, b) => b.size - a.size)
  .slice(0, 10);

console.log('Storybook build report');
console.log(`Directory: ${outputDir}`);
console.log(`Total size: ${formatBytes(totalBytes)} (${totalBytes} bytes)`);
console.log(`JavaScript files: ${jsFiles.length}`);
console.log(`Raw JavaScript size: ${formatBytes(jsBytes)} (${jsBytes} bytes)`);
console.log('Top assets:');

for (const asset of topAssets) {
  console.log(`- ${formatBytes(asset.size)}  ${asset.relativePath}`);
}
