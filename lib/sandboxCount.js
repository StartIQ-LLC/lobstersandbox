import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const COUNT_FILE = path.join(DATA_DIR, 'sandbox-count.json');

const INITIAL_COUNT = 127;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCountFile() {
  try {
    if (fs.existsSync(COUNT_FILE)) {
      const data = JSON.parse(fs.readFileSync(COUNT_FILE, 'utf8'));
      return typeof data.count === 'number' ? data.count : INITIAL_COUNT;
    }
  } catch {
  }
  return INITIAL_COUNT;
}

function writeCountFile(count) {
  ensureDataDir();
  fs.writeFileSync(COUNT_FILE, JSON.stringify({ count, lastUpdated: new Date().toISOString() }));
}

export function getCount() {
  return readCountFile();
}

export function incrementCount() {
  const current = readCountFile();
  const newCount = current + 1;
  writeCountFile(newCount);
  return newCount;
}
