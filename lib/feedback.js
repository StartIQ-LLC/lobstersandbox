import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEEDBACK_FILE = path.join(__dirname, '..', 'data', 'feedback.json');

function ensureDataDir() {
  const dataDir = path.dirname(FEEDBACK_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadFeedback() {
  ensureDataDir();
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
  }
  return { entries: [] };
}

export function saveFeedback(text) {
  const data = loadFeedback();
  data.entries.push({
    id: Date.now().toString(),
    text: text.slice(0, 5000),
    submitted_at: new Date().toISOString()
  });
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
  return true;
}

export function getFeedbackCount() {
  const data = loadFeedback();
  return data.entries.length;
}
