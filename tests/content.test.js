import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { ALPHABET, ANIMALS, LETTERS, STAGES } from '../web/content.js';
import * as art from '../web/illustrations/index.js';
import { loadProgress, saveProgress } from '../web/progress-storage.js';
import { defaults } from '../web/learning.js';

test('every configured lesson and reward has renderable artwork', () => {
  for (const letter of ALPHABET) {
    assert(ANIMALS[LETTERS[letter].animal]);
    assert.match(art.scene(letter), /animated-scene/);
    assert.match(art.object(LETTERS[letter].object), /<svg/);
  }
  for (const stage of STAGES) assert.match(art.object(stage.reward), /<svg/);
  for (const { id } of Object.values(ANIMALS)) assert.match(art.animal(id), /<svg/);
  assert.throws(() => art.animal('unknown'), RangeError);
  assert.throws(() => art.object('unknown'), RangeError);
});

test('the story artwork preserves all scenes after moving animals into configuration', () => {
  for (const page of [0, 1, 2, 'win']) assert.match(art.storyScene(page), /visual-story/);
  assert.match(art.storyScene('win', 'picnic'), /reunion/);
  assert.doesNotMatch(art.storyScene('win', 'apples'), /story-traveller/);
});

test('only the 26 letter names and 26 teaching phrases are bundled as speech', () => {
  for (const folder of ['audio', 'phrases']) {
    const files = readdirSync(new URL(`../web/${folder}/`, import.meta.url));
    assert.equal(files.length, 26);
    assert(files.every((name) => /^[A-Z]\.wav$/.test(name)));
  }
  const narration = new URL('../web/narration/', import.meta.url);
  assert(!existsSync(narration) || readdirSync(narration).length === 0);
  const controller = readFileSync(new URL('../web/app.js', import.meta.url), 'utf8');
  assert(!controller.includes('narration/'));
  assert(!controller.includes('skip-voice'));
});

test('progress round-trips a Set without changing the on-disk array format', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const progress = defaults();
  progress.learned.add('A');
  assert(saveProgress(storage, progress));
  assert.deepEqual(JSON.parse([...values.values()][0]).learned, ['A']);
  assert.deepEqual([...loadProgress(storage).learned], ['A']);
});

test('broken or unavailable storage leaves learning usable', () => {
  const storage = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('full');
    },
  };
  assert.equal(loadProgress(storage).learned.size, 0);
  assert.equal(saveProgress(storage, defaults()), false);
});
