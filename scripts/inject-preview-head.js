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
  // Leer el contenido de index.html
  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Eliminar el <title>, favicon y fuentes de Nunito del <head>
  indexContent = indexContent.replace(/<title>.*?<\/title>/, '');
  indexContent = indexContent.replace(/<link rel="icon".*?>/g, '');
  indexContent = indexContent.replace(/@font-face {[^}]*?Nunito Sans[^}]*?}/g, '');

  // Inyectar el contenido de preview-head.html y el link capturado en el <head> de index.html
  const updatedIndexContent = indexContent.replace('</head>', `${previewHeadContent}\n</head>`);

  // Escribir los cambios en index.html
  fs.writeFileSync(indexPath, updatedIndexContent, 'utf-8');
  console.log(
    'Styles from preview-head.html and captured CSS link have been injected into index.html, and unwanted content has been removed.'
  );

  // Leer el contenido de iframe.html
  let iframeContent = fs.readFileSync(iframePath, 'utf-8');
  // Eliminar el <title>, favicon y fuentes de Nunito del <head>
  iframeContent = iframeContent.replace(/<title>.*?<\/title>/, '');
  iframeContent = iframeContent.replace(/<link rel="icon".*?>/g, '');
  iframeContent = iframeContent.replace(/@font-face {[^}]*?Nunito Sans[^}]*?}/g, '');
  // Escribir los cambios en iframe.html
  const updatedIframeContent = iframeContent;
  fs.writeFileSync(iframePath, updatedIframeContent, 'utf-8');
  console.log(
    'Styles from preview-head.html have been injected into iframe.html, and unwanted content has been removed.'
  );
} else {
  console.warn('preview-head.html not found or is empty. No changes made to index.html.');
}
