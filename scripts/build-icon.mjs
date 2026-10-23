import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const assets = path.join(root, 'assets');
const palette = JSON.parse(await readFile(path.join(root, 'core/palette.json'), 'utf8'));
const mark = await readFile(path.join(assets, 'velune-mark.svg'), 'utf8');
const background = `<rect width="1254" height="1254" fill="${palette.background.editor}"/>`;
const icon = mark.replace('</desc>', '</desc>\n  ' + background);

await mkdir(path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(assets, 'velune-icon.svg'), icon);
await sharp(Buffer.from(icon)).resize(256, 256).png().toFile(path.join(assets, 'icon.png'));
await sharp(Buffer.from(icon)).resize(1024, 1024).png().toFile(path.join(root, 'dist/velune-icon-1024.png'));
await sharp(Buffer.from(mark)).resize(1024, 1024).png().toFile(path.join(root, 'dist/velune-mark-1024.png'));
console.log('Built Velune icon: 256px package icon, SVG and 1024px exports.');
