export const Animal = Object.freeze({
  PANDA: 'panda',
  ELEPHANT: 'elephant',
  FOX: 'fox',
});

export const ANIMALS = Object.freeze({
  [Animal.PANDA]: { id: Animal.PANDA, name: 'Panda', description: 'Our picnic-loving explorer.' },
  [Animal.ELEPHANT]: {
    id: Animal.ELEPHANT,
    name: 'Elephant',
    description: 'Big ears and a helpful heart.',
  },
  [Animal.FOX]: { id: Animal.FOX, name: 'Fox', description: 'A cheeky friend with a surprise.' },
});

export const STORY_CAST = Object.freeze({
  panda: Animal.PANDA,
  elephant: Animal.ELEPHANT,
  fox: Animal.FOX,
});

export const LETTERS = Object.freeze({
  A: {
    object: 'apple',
    animal: Animal.PANDA,
    action: 'catch',
  },
  B: {
    object: 'ball',
    animal: Animal.PANDA,
    action: 'bounce',
  },
  C: {
    object: 'cat',
    animal: Animal.PANDA,
    action: 'cat',
  },
  D: {
    object: 'drum',
    animal: Animal.ELEPHANT,
    action: 'drum',
  },
  E: {
    object: 'elephant',
    animal: Animal.ELEPHANT,
    action: 'water',
  },
  F: {
    object: 'fish',
    animal: Animal.ELEPHANT,
    action: 'swim',
  },
  G: {
    object: 'grapes',
    animal: Animal.PANDA,
    action: 'discover',
  },
  H: {
    object: 'hat',
    animal: Animal.PANDA,
    action: 'hat',
  },
  I: {
    object: 'ice cream',
    animal: Animal.ELEPHANT,
    action: 'discover',
  },
  J: {
    object: 'juice',
    animal: Animal.ELEPHANT,
    action: 'discover',
  },
  K: {
    object: 'kite',
    animal: Animal.PANDA,
    action: 'discover',
  },
  L: {
    object: 'leaf',
    animal: Animal.PANDA,
    action: 'discover',
  },
  M: {
    object: 'moon',
    animal: Animal.PANDA,
    action: 'discover',
  },
  N: {
    object: 'nest',
    animal: Animal.PANDA,
    action: 'discover',
  },
  O: {
    object: 'orange',
    animal: Animal.PANDA,
    action: 'discover',
  },
  P: {
    object: 'panda',
    animal: Animal.PANDA,
    action: 'discover',
  },
  Q: {
    object: 'queen',
    animal: Animal.PANDA,
    action: 'discover',
  },
  R: {
    object: 'rainbow',
    animal: Animal.ELEPHANT,
    action: 'discover',
  },
  S: {
    object: 'sun',
    animal: Animal.PANDA,
    action: 'discover',
  },
  T: {
    object: 'tiger',
    animal: Animal.PANDA,
    action: 'discover',
  },
  U: {
    object: 'umbrella',
    animal: Animal.FOX,
    action: 'discover',
  },
  V: {
    object: 'violin',
    animal: Animal.FOX,
    action: 'discover',
  },
  W: {
    object: 'whale',
    animal: Animal.FOX,
    action: 'discover',
  },
  X: {
    object: 'xylophone',
    animal: Animal.FOX,
    action: 'discover',
  },
  Y: {
    object: 'yo-yo',
    animal: Animal.FOX,
    action: 'discover',
  },
  Z: {
    object: 'zebra',
    animal: Animal.FOX,
    action: 'discover',
  },
});

export const ALPHABET = Object.freeze(Object.keys(LETTERS));

export const STAGES = Object.freeze([
  {
    name: 'Sunny Meadow',
    letters: ['A', 'B', 'C', 'D', 'E'],
    reward: 'apples',
    animal: Animal.PANDA,
    color: '#59c735',
  },
  {
    name: 'Bubble Brook',
    letters: ['F', 'G', 'H', 'I', 'J'],
    reward: 'juice',
    animal: Animal.ELEPHANT,
    color: '#21b9e5',
  },
  {
    name: 'Bamboo Bend',
    letters: ['K', 'L', 'M', 'N', 'O'],
    reward: 'blanket',
    animal: Animal.PANDA,
    color: '#51b840',
  },
  {
    name: 'Drumbeat Grove',
    letters: ['P', 'Q', 'R', 'S', 'T'],
    reward: 'sandwiches',
    animal: Animal.ELEPHANT,
    color: '#f2a52d',
  },
  {
    name: 'Rainbow Ridge',
    letters: ['U', 'V', 'W', 'X', 'Y'],
    reward: 'basket',
    animal: Animal.FOX,
    color: '#ef8c32',
  },
  {
    name: 'Picnic Peak',
    letters: ['Z'],
    reward: 'picnic',
    animal: Animal.FOX,
    color: '#91d225',
  },
]);

export const LETTER_ALIASES = Object.freeze({
  A: ['a', 'ay', 'ey'],
  B: ['b', 'bee', 'be'],
  C: ['c', 'see', 'sea'],
  D: ['d', 'dee'],
  E: ['e', 'ee'],
  F: ['f', 'ef', 'eff'],
  G: ['g', 'gee'],
  H: ['h', 'aitch', 'aich', 'haitch'],
  I: ['i', 'eye'],
  J: ['j', 'jay'],
  K: ['k', 'kay'],
  L: ['l', 'el', 'ell'],
  M: ['m', 'em'],
  N: ['n', 'en'],
  O: ['o', 'oh'],
  P: ['p', 'pee'],
  Q: ['q', 'cue', 'queue'],
  R: ['r', 'ar', 'are'],
  S: ['s', 'ess', 'es'],
  T: ['t', 'tee', 'tea'],
  U: ['u', 'you', 'yew'],
  V: ['v', 'vee'],
  W: ['w', 'doubleyou', 'doubleu'],
  X: ['x', 'ex', 'eks'],
  Y: ['y', 'why'],
  Z: ['z', 'zee', 'zed'],
});
