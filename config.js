import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const rootPath = __dirname;

export default {
  rootPath,
  uploadPath: path.join(rootPath, 'public', 'uploads'),
  db: {
    name: 'webappDb',
    url: 'mongodb://localhost/',
  },
};
