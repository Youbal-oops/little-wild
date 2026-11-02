import { defaults, normalize, serialize } from './learning.js';

const STORAGE_KEY = 'littlewild.quest.v3';
const PREVIOUS_KEY = 'littlewild.quest.v2';
const ALPHABET_PREVIEW_KEY = 'littlewild.alphabet.v1';

export function loadProgress(storage) {
  try {
    const current = storage.getItem(STORAGE_KEY) ?? storage.getItem(PREVIOUS_KEY);
    if (current) return normalize(JSON.parse(current));
    const previous = JSON.parse(storage.getItem(ALPHABET_PREVIEW_KEY) ?? '{}');
    return normalize({ buddy: previous.buddy, slow: previous.slow, effects: previous.effects });
  } catch {
    return defaults();
  }
}

export function saveProgress(storage, progress) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(serialize(progress)));
    return true;
  } catch {
    return false;
  }
}
