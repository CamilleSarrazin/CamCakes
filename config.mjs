import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, 'config.json');

async function getConfig() {
    return JSON.parse(await readFile(configPath, 'utf-8'));
}

export { getConfig, configPath };