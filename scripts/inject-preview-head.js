import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '..', 'storybook-static', 'index.html');
const iframePath = path.join(__dirname, '..', 'storybook-static', 'iframe.html');
const previewHeadPath = path.join(__dirname, '..', '.storybook', 'preview-head.html');
console.log('indexPath', indexPath);
console.log('previewHeadPath', previewHeadPath, fs.existsSync(previewHeadPath));

const fontsDir = path.join(__dirname, '..', 'storybook-static');

if (fs.existsSync(fontsDir)) {
  const files = fs.readdirSync(fontsDir);
  files.forEach((file) => {
    if (file.toLowerCase().includes('nunito')) {
      const filePath = path.join(fontsDir, file);
      fs.rmSync(filePath, { force: true });
      console.log(`Deleted file: ${filePath}`);
    }
  });
} else {
  console.warn(`Directory not found: ${fontsDir}`);
}

const previewHeadContent = fs.existsSync(previewHeadPath) ? fs.readFileSync(previewHeadPath, 'utf-8') : '';

if (previewHeadContent) {
  // Read the contents of index.html.
  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Remove the title, favicon, and Nunito font declarations from the head.
  indexContent = indexContent.replace(/<title>.*?<\/title>/, '');
  indexContent = indexContent.replace(/<link rel="icon".*?>/g, '');
  indexContent = indexContent.replace(/@font-face {[^}]*?Nunito Sans[^}]*?}/g, '');

  // Inject the preview-head.html metadata into the index.html head.
  const updatedIndexContent = indexContent.replace('</head>', `${previewHeadContent}\n</head>`);

  // Write the changes to index.html.
  fs.writeFileSync(indexPath, updatedIndexContent, 'utf-8');
  console.log('Injected preview-head metadata into index.html and removed Storybook default head entries.');

  // Read the contents of iframe.html.
  let iframeContent = fs.readFileSync(iframePath, 'utf-8');
  // Remove the title, favicon, and Nunito font declarations from the head.
  iframeContent = iframeContent.replace(/<title>.*?<\/title>/, '');
  iframeContent = iframeContent.replace(/<link rel="icon".*?>/g, '');
  iframeContent = iframeContent.replace(/@font-face {[^}]*?Nunito Sans[^}]*?}/g, '');
  // Write the changes to iframe.html.
  const updatedIframeContent = iframeContent;
  fs.writeFileSync(iframePath, updatedIframeContent, 'utf-8');
  console.log('Normalized iframe.html head entries after Storybook build.');
} else {
  console.warn('preview-head.html not found or empty. Skipped index.html metadata injection.');
}
