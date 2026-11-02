import test from 'node:test';
import assert from 'node:assert/strict';
import * as learning from '../web/learning.js';
import { ALPHABET, STAGES } from '../web/content.js';

test('speech matching distinguishes a wrong letter from unclear audio', () => {
  assert.deepEqual(learning.classifySpeech(['ay'], 'A'), { status: 'correct', letter: 'A' });
  assert.deepEqual(learning.classifySpeech(['bee'], 'A'), { status: 'wrong', letter: 'B' });
  for (const input of [[], null, ['hello'], ['bee', 'dee']]) {
    assert.deepEqual(learning.classifySpeech(input, 'A'), { status: 'uncertain' });
  }
});

test('common letter-name variants work without accepting arbitrary sentences', () => {
  assert.equal(learning.recognizeLetter('The letter bee!'), 'B');
  assert.equal(learning.recognizeLetter('double you'), 'W');
  assert.equal(learning.recognizeLetter('zee'), 'Z');
  assert.equal(learning.recognizeLetter('zed'), 'Z');
  assert.equal(learning.recognizeLetter('a cat'), null);
  assert.equal(learning.recognizeLetter({}), null);
});

test('a wrong speaking answer returns after two other questions, including repeated misses', () => {
  const quiz = learning.makeTest(0, 'mixed', () => 0.4);
  const missed = quiz.currentTask.id;
  quiz.recordAnswer(false);
  assert.equal(quiz.questions.toArray()[2].id, missed);
  quiz.recordAnswer(true).recordAnswer(true);
  assert.equal(quiz.currentTask.id, missed);
  quiz.recordAnswer(false);
  assert.equal(quiz.questions.toArray()[2].id, missed);
  assert(!quiz.mastered.has(missed));
});

test('listening alone and unresolved speaking tasks do not unlock a stage', () => {
  const listening = learning.makeTest(0, 'listen');
  while (listening.remainingCount) listening.recordAnswer(true);
  const progress = learning.completeTest(learning.defaults(), listening);
  assert(progress.badges[0].listen);
  assert.equal(learning.unlocked(progress), 0);
  assert(!learning.passed(progress, 0));

  const mixed = learning.makeTest(0);
  mixed.recordAnswer(false);
  const untouched = learning.defaults();
  assert.equal(learning.completeTest(untouched, mixed), untouched);
});

test('a mixed test begins with the displayed stage letter and requires all ten answers', () => {
  const quiz = learning.makeTest(0);
  assert.equal(quiz.total, 10);
  assert.equal(quiz.currentTask.kind, 'speak');
  assert.equal(quiz.currentTask.letter, 'A');
  assert.equal(quiz.questions.toArray().filter((task) => task.kind === 'speak').length, 5);
  while (quiz.remainingCount) quiz.recordAnswer(true);
  const progress = learning.completeTest(learning.defaults(), quiz);
  assert(learning.passed(progress, 0));
  assert.equal(learning.unlocked(progress), 1);
});

test('legacy progress cannot bypass the required speaking check', () => {
  const progress = learning.normalize({
    stage: 2,
    learned: ['A', 'bad', 'A'],
    badges: [
      { listen: true, speak: false },
      { listen: true, speak: true },
    ],
  });
  assert.equal(progress.stage, 0);
  assert.deepEqual([...progress.learned], ['A']);
  assert(!learning.passed(progress, 1));
});

test('learning gates use completed letters and reject out-of-range positions', () => {
  const progress = learning.defaults();
  assert(learning.canLearn(progress, 0, 0));
  assert(!learning.canLearn(progress, 0, -1));
  assert(!learning.canLearn(progress, 0, 1));
  assert(!learning.canLearn(progress, 0, 5));
  for (const letter of STAGES[0].letters) progress.learned.add(letter);
  assert(learning.canTest(progress, 0));
  assert(!learning.canLearn(progress, 1, 0));
});

test('answer choices contain the target and two distinct distractors at random boundaries', () => {
  for (let stage = 0; stage < STAGES.length; stage += 1) {
    const targets = stage === STAGES.length - 1 ? ALPHABET : STAGES[stage].letters;
    for (const letter of targets) {
      for (const value of [0, 0.1, 0.5, 0.9, 0.999999]) {
        const choices = learning.choicesFor(letter, stage, () => value);
        assert.equal(new Set(choices).size, 3);
        assert(choices.includes(letter));
        assert(choices.every((choice) => ALPHABET.includes(choice)));
      }
    }
  }
});

test('the final review contains Z and four distinct earlier letters', () => {
  const quiz = learning.makeTest(STAGES.length - 1);
  const letters = new Set(quiz.questions.toArray().map((task) => task.letter));
  assert.equal(letters.size, 5);
  assert(letters.has('Z'));
});

test('all six stages finish correctly after retries', () => {
  let progress = learning.defaults();
  for (let stage = 0; stage < STAGES.length; stage += 1) {
    progress.stage = stage;
    for (const letter of STAGES[stage].letters) progress.learned.add(letter);
    const quiz = learning.makeTest(stage);
    quiz.recordAnswer(false).recordAnswer(false);
    while (quiz.remainingCount) quiz.recordAnswer(true);
    progress = learning.completeTest(progress, quiz);
    assert(learning.passed(progress, stage));
  }
  assert(progress.badges.every((badge) => badge.listen && badge.speak));
});
