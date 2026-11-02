import { ALPHABET, ANIMALS, Animal, LETTER_ALIASES, STAGES } from './content.js';
import { ReviewQueue } from './review-queue.js';

export { ALPHABET as letters, STAGES as stages };

const validLetters = new Set(ALPHABET);
const letterIndex = new Map(ALPHABET.map((letter, index) => [letter, index]));
const stageIndexes = STAGES.map(
  (stage) => new Map(stage.letters.map((letter, index) => [letter, index])),
);
const aliasLookup = new Map();

for (const [letter, aliases] of Object.entries(LETTER_ALIASES)) {
  for (const alias of aliases) aliasLookup.set(alias, letter);
}

export function recognizeLetter(text) {
  if (typeof text !== 'string') return null;
  const normalized = text
    .toLowerCase()
    .replace(/[.!?,:;'"-]/g, '')
    .trim()
    .replace(/^(?:the letter|letter|it is|its)\s+/, '')
    .replace(/\s+/g, '');
  return aliasLookup.get(normalized) ?? null;
}

export function classifySpeech(alternatives, target) {
  if (!Array.isArray(alternatives) || !validLetters.has(target)) return { status: 'uncertain' };
  let heard = null;
  for (const text of alternatives) {
    const candidate = recognizeLetter(text);
    if (!candidate) continue;
    if (heard && candidate !== heard) return { status: 'uncertain' };
    heard = candidate;
  }
  if (!heard) return { status: 'uncertain' };
  return { status: heard === target ? 'correct' : 'wrong', letter: heard };
}

function randomIndex(length, random) {
  const value = random();
  if (value < 0 || value >= 1 || !Number.isFinite(value))
    throw new RangeError('Random values must be in [0, 1).');
  return Math.floor(value * length);
}

export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomIndex(index + 1, random);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function getStage(index) {
  const stage = STAGES[index];
  if (!stage) throw new RangeError(`Unknown stage: ${index}`);
  return stage;
}

export function choicesFor(letter, stageIndex, random = Math.random) {
  const stage = getStage(stageIndex);
  const isFinal = stageIndex === STAGES.length - 1;
  const pool = isFinal ? ALPHABET : stage.letters;
  const target = (isFinal ? letterIndex : stageIndexes[stageIndex]).get(letter);
  if (target === undefined) throw new RangeError(`Letter ${letter} is not in this stage.`);

  let first = randomIndex(pool.length - 1, random);
  if (first >= target) first += 1;
  const low = Math.min(first, target);
  const high = Math.max(first, target);
  let second = randomIndex(pool.length - 2, random);
  if (second >= low) second += 1;
  if (second >= high) second += 1;
  return shuffle([letter, pool[first], pool[second]], random);
}

export class QuizSession {
  constructor(stage, mode, tasks) {
    this.stage = stage;
    this.mode = mode;
    this.questions = new ReviewQueue(tasks);
    this.total = tasks.length;
    this.mastered = new Set();
    this.mistakes = new Set();
    this.turns = 0;
  }

  get currentTask() {
    return this.questions.peek();
  }
  get remainingCount() {
    return this.questions.length;
  }
  get completedCount() {
    return this.mastered.size;
  }
  get complete() {
    return this.remainingCount === 0 && this.completedCount === this.total;
  }

  recordAnswer(correct) {
    if (typeof correct !== 'boolean') throw new TypeError('An answer must be true or false.');
    const task = this.questions.take();
    if (!task) return this;
    this.turns += 1;
    if (correct) this.mastered.add(task.id);
    else {
      this.mistakes.add(task.letter);
      this.questions.retryAfterTwo({ ...task, attempts: task.attempts + 1 });
    }
    return this;
  }
}

export function makeTest(stageIndex, mode = 'mixed', random = Math.random) {
  const stage = getStage(stageIndex);
  if (!['listen', 'speak', 'mixed'].includes(mode))
    throw new RangeError(`Unknown test mode: ${mode}`);
  const targets =
    stageIndex === STAGES.length - 1
      ? ['Z', ...shuffle(ALPHABET.slice(0, -1), random).slice(0, 4)]
      : stage.letters;
  const kinds = mode === 'mixed' ? ['listen', 'speak'] : [mode];
  const tasks = [];
  let firstSpokenTask;
  for (const letter of targets) {
    for (const kind of kinds) {
      const task = { id: `${kind}${letter}`, kind, letter, attempts: 0 };
      if (mode === 'mixed' && kind === 'speak' && letter === stage.letters[0])
        firstSpokenTask = task;
      else tasks.push(task);
    }
  }
  const ordered = shuffle(tasks, random);
  if (firstSpokenTask) ordered.unshift(firstSpokenTask);
  return new QuizSession(stageIndex, mode, ordered);
}

export function answer(session, correct) {
  return session.recordAnswer(correct);
}

export function defaults() {
  return {
    version: 3,
    stage: 0,
    learned: new Set(),
    badges: STAGES.map(() => ({ listen: false, speak: false })),
    companionAnimal: Animal.PANDA,
    slow: false,
    effects: true,
    voiceConsent: false,
    introSeen: false,
  };
}

export function normalize(raw) {
  const state = defaults();
  if (!raw || typeof raw !== 'object') return state;
  if (Array.isArray(raw.learned) || raw.learned instanceof Set) {
    state.learned = new Set([...raw.learned].filter((letter) => validLetters.has(letter)));
  }
  let locked = false;
  for (let index = 0; index < STAGES.length; index += 1) {
    const badge = raw.badges?.[index];
    if (!locked && badge && typeof badge === 'object') {
      state.badges[index] = { listen: badge.listen === true, speak: badge.speak === true };
    }
    if (!passed(state, index)) locked = true;
  }
  state.stage = Math.max(0, Math.min(Number.isInteger(raw.stage) ? raw.stage : 0, unlocked(state)));
  const savedAnimal = raw.companionAnimal ?? raw.buddy;
  if (Object.hasOwn(ANIMALS, savedAnimal)) state.companionAnimal = savedAnimal;
  state.slow = raw.slow === true;
  state.effects = raw.effects !== false;
  state.voiceConsent = raw.voiceConsent === true;
  state.introSeen = raw.introSeen === true;
  return state;
}

export function serialize(state) {
  return { ...state, learned: [...state.learned] };
}
export function passed(state, stage) {
  return state.badges[stage].listen && state.badges[stage].speak;
}
export function unlocked(state) {
  const index = state.badges.findIndex((badge) => !badge.listen || !badge.speak);
  return index === -1 ? STAGES.length - 1 : index;
}
export function canLearn(state, stage, index) {
  const letters = getStage(stage).letters;
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < letters.length &&
    stage <= unlocked(state) &&
    (index === 0 || state.learned.has(letters[index - 1]))
  );
}
export function canTest(state, stage) {
  return (
    stage <= unlocked(state) && getStage(stage).letters.every((letter) => state.learned.has(letter))
  );
}
export function completeTest(state, session) {
  if (!session.complete) return state;
  const result = normalize(state);
  const badge = result.badges[session.stage];
  if (session.mode !== 'speak') badge.listen = true;
  if (session.mode !== 'listen') badge.speak = true;
  return result;
}
