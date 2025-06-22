import fs from 'fs';
import { extractStyle } from '@ant-design/static-style-extract';

const outputPath = './public/antd.min.css';

// Create public directory if it doesn't exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

const css = extractStyle();

fs.writeFileSync(outputPath, css);

console.log(`Ant Design CSS extracted to ${outputPath}`); 