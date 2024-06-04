import {fileURLToPath} from 'url';
import {dirname} from 'path';

export const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname); 