import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioPlayer } from '../web/audio-player.js';
import { SpeechInput } from '../web/speech-input.js';

function audioFixture() {
  const clips = [];
  const player = new AudioPlayer((source) => {
    const clip = {
      source,
      play: () => Promise.resolve(),
      pause() {
        this.paused = true;
      },
    };
    clips.push(clip);
    return clip;
  });
  return { player, clips };
}

test('cancelled model audio never completes a listening activity', async () => {
  const { player, clips } = audioFixture();
  let completions = 0;
  const first = player.play('A.wav', { onEnd: () => (completions += 1) });
  const staleEnd = clips[0].onended;
  const second = player.play('B.wav', { onEnd: () => (completions += 1) });
  staleEnd();
  clips[1].onended();
  assert.equal(await first, false);
  assert.equal(await second, true);
  assert.equal(completions, 1);
  assert(clips[0].paused);
});

test('a failed audio clip reports failure once', async () => {
  const { player, clips } = audioFixture();
  let completions = 0;
  const playback = player.play('broken.wav', { onEnd: () => (completions += 1) });
  const error = clips[0].onerror;
  error();
  error();
  assert.equal(await playback, false);
  assert.equal(completions, 1);
});

function speechFixture() {
  const scope = new EventTarget();
  scope.AndroidVoice = {
    isAvailable: () => true,
    starts: 0,
    start() {
      this.starts += 1;
    },
    cancel() {},
  };
  const states = [],
    results = [];
  const input = new SpeechInput({
    scope,
    onResult: (value) => results.push(value),
    onStatus: (value) => states.push(value),
  });
  const emit = (detail) => scope.dispatchEvent(new CustomEvent('littlewild-voice', { detail }));
  return { scope, input, states, results, emit };
}

test('permission readiness does not automatically start microphone recording', () => {
  const { scope, input, states, emit } = speechFixture();
  input.start();
  emit({ status: 'ready' });
  assert.equal(scope.AndroidVoice.starts, 1);
  assert.equal(input.active, false);
  assert.equal(states.at(-1), 'ready');
  input.start();
  assert.equal(scope.AndroidVoice.starts, 2);
  input.dispose();
});

test('late speech results after cancellation cannot pass a question', () => {
  const { input, results, emit } = speechFixture();
  input.start();
  input.stop();
  emit({ status: 'results', results: ['ay'] });
  assert.deepEqual(results, []);
  input.dispose();
});

test('speech results are delivered once, with no transcript stored on the input object', () => {
  const { input, results, emit } = speechFixture();
  input.start();
  emit({ status: 'results', results: ['ay'] });
  emit({ status: 'results', results: ['bee'] });
  assert.deepEqual(results, [['ay']]);
  assert.equal(input.active, false);
  assert.equal(input.transcript, undefined);
  input.dispose();
});

test('temporary speech service errors allow another attempt', () => {
  const { input, states, emit } = speechFixture();
  input.start();
  emit({ status: 'network' });
  assert.equal(states.at(-1), 'network');
  input.start();
  assert.equal(input.active, true);
  input.dispose();
});
