import * as learning from './learning.js';
import * as art from './illustrations/index.js';
import { ANIMALS, Animal, LETTERS } from './content.js';
import { html } from './illustrations/svg.js';
import { AudioPlayer, SoundEffects } from './audio-player.js';
import { SpeechInput } from './speech-input.js';
import { VisualGuidance } from './visual-guidance.js';
import { loadProgress, saveProgress } from './progress-storage.js';

const byId = (id) => document.getElementById(id);
const icon = (name, className = '') =>
  html`<svg class="${className}" aria-hidden="true"><use href="#${name}" /></svg>`;
const audioPlayer = new AudioPlayer();
const soundEffects = new SoundEffects(() => saved.effects);
const guidance = new VisualGuidance(icon('hand'));
const speechInput = new SpeechInput({ onResult: receiveVoice, onStatus: onSpeechStatus });

let saved = loadProgress(localStorage),
  screen = 'home',
  learnIndex = 0,
  learnReady = false,
  quiz = null,
  feedback = null;
let sequence = false,
  toastTimer = null,
  playingIndicator = null;
let sceneToken = 0;

let storyPage = 0,
  afterStory = null;
function persist() {
  saveProgress(localStorage, saved);
}
function toast(message) {
  clearTimeout(toastTimer);
  byId('toast').textContent = message;
  byId('toast').classList.add('show');
  toastTimer = setTimeout(() => byId('toast').classList.remove('show'), 2600);
}
function markPlaying(element) {
  playingIndicator?.classList.remove('playing');
  playingIndicator = element;
  playingIndicator?.classList.add('playing');
}
function stopAudio() {
  audioPlayer.stop();
  markPlaying(null);
  sequence = false;
  byId('book-all').textContent = 'Listen to A–Z';
}
function playAudio(path, done) {
  stopAudio();
  return audioPlayer.play(path, {
    rate: saved.slow ? 0.83 : 1,
    onEnd: (succeeded) => {
      markPlaying(null);
      done?.(succeeded);
      if (!succeeded) toast('Tap the speaker to try again.');
    },
  });
}
function unlockSound() {
  soundEffects.unlock();
}
function effect(correct, big = false) {
  soundEffects.play(correct, big);
}
function clearGuides() {
  guidance.clear();
}
function guide(element) {
  guidance.pointTo(element);
}
function guideChoices() {
  guidance.pointToChoices(document.querySelector('.answer-options'));
}
function pointToNext() {
  const target = document.querySelector('.path-node.current') || byId('next-stage-button');
  if (!target) return;
  const scroller = byId('journey-scroll');
  scroller.scrollTo({
    top:
      scroller.scrollTop +
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top -
      scroller.clientHeight / 2,
    behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',
  });
  guide(target);
}
function abortVoice() {
  speechInput.stop();
  byId('mic-button')?.classList.remove('listening');
  byId('speech-scene')?.classList.remove('mic-active');
}
function silence() {
  stopAudio();
  clearGuides();
  abortVoice();
}
function showLesson() {
  silence();
  sceneToken++;
  byId('home-screen').hidden = true;
  byId('lesson-screen').hidden = false;
  byId('lesson-content').scrollTop = 0;
}
function home() {
  silence();
  sceneToken++;
  screen = 'home';
  quiz = null;
  feedback = null;
  byId('home-screen').hidden = false;
  byId('lesson-screen').hidden = true;
  renderMap();
}
function progress(value, label) {
  byId('lesson-progress-fill').style.width = `${value}%`;
  document
    .querySelector('.lesson-progress')
    .setAttribute('aria-valuenow', String(Math.round(value)));
  byId('lesson-step').textContent = label;
}

function renderMap() {
  const stage = learning.stages[saved.stage],
    letters = stage.letters,
    allLearned = letters.every((x) => saved.learned.has(x));
  byId('stage-number').textContent =
    `STAGE ${saved.stage + 1} · ${letters.length === 1 ? 'Z + A–Z' : letters[0] + '–' + letters.at(-1)}`;
  byId('stage-name').textContent = stage.name;
  byId('stage-select').style.background = stage.color;
  byId('badge-count').textContent = saved.badges.filter((x) => x.listen && x.speak).length;
  byId('star-count').textContent =
    saved.learned.size + saved.badges.filter((x) => x.listen && x.speak).length * 3;
  byId('story-title').textContent = learning.passed(saved, saved.stage)
    ? 'Look what we found!'
    : saved.stage === 0
      ? 'Panda’s picnic is missing!'
      : 'The picnic trail continues!';
  byId('story-caption').textContent = learning.passed(saved, saved.stage)
    ? `We found the ${stage.reward}!`
    : `Follow the letters. Find the ${stage.reward}.`;
  byId('story-buddy').innerHTML = art.animal(
    Animal.PANDA,
    learning.passed(saved, saved.stage) ? 'happy' : 'surprised',
  );
  byId('world-landscape').innerHTML = art.landscape(letters.length + 1);
  const xs = letters.length === 1 ? [30, 51] : [30.2, 66.3, 47.7, 25.6, 65.1, 48.8],
    ys = letters.length === 1 ? [10.8, 38.6] : [10.2, 25.3, 40.4, 55.4, 70.5, 85.5];
  const first = letters.findIndex((x) => !saved.learned.has(x));
  byId('path-nodes').innerHTML =
    letters
      .map((letter, i) => {
        const done = saved.learned.has(letter),
          allowed = learning.canLearn(saved, saved.stage, i),
          current = !done && i === first;
        return html`<button
          class="path-node ${done ? 'done' : current ? 'current' : 'locked'}"
          data-lesson="${i}"
          style="--x:${xs[i]}%;--y:${ys[i]}%"
          aria-label="${allowed ? 'Learn' : 'Locked letter'} ${letter}"
          aria-disabled="${!allowed}"
        >
          ${current ? '<span class="node-label">' + icon('sound') + ' LET’S GO!</span>' : ''}${letter}${done ? '<span class="node-tick">' + icon('check') + '</span>' : !allowed ? '<span class="node-lock">' + icon('lock') + '</span>' : ''}
        </button>`;
      })
      .join('') +
    html`<button
      class="path-node test-node ${learning.passed(saved, saved.stage) ? 'done' : allLearned ? 'current' : 'locked'}"
      id="test-node"
      style="--x:${xs[letters.length]}%;--y:${ys[letters.length]}%"
      aria-label="${allLearned ? 'Start' : 'Locked'} stage ${saved.stage + 1} test"
      aria-disabled="${!allLearned}"
    >
      ${allLearned && !learning.passed(saved, saved.stage) ? '<span class="node-label">' + icon('star') + ' LET’S PLAY!</span>' : ''}${icon('trophy')}${!allLearned ? '<span class="node-lock">' + icon('lock') + '</span>' : ''}
    </button>`;
  byId('map-cast').innerHTML = art.animal(saved.companionAnimal);
  byId('map-clue').innerHTML = art.object(stage.reward);
  byId('next-stage').innerHTML =
    saved.stage === 5
      ? icon('star') + ' A picnic with all our friends!'
      : learning.passed(saved, saved.stage)
        ? html`<button class="big-button blue" id="next-stage-button">
            ${icon('arrow')}<span>Next adventure</span>
          </button>`
        : icon('lock') + `Next: ${learning.stages[saved.stage + 1].name}`;
  document.querySelectorAll('[data-lesson]').forEach(
    (button) =>
      (button.onclick = () => {
        const index = Number(button.dataset.lesson);
        if (!learning.canLearn(saved, saved.stage, index)) {
          return pointToNext();
        }
        unlockSound();
        if (!saved.introSeen) openStory(() => startLearn(index));
        else startLearn(index);
      }),
  );
  byId('test-node').onclick = () => {
    if (!learning.canTest(saved, saved.stage)) {
      return pointToNext();
    }
    showTestIntro();
  };
  if (byId('next-stage-button'))
    byId('next-stage-button').onclick = () => selectStage(saved.stage + 1, true);
}
function selectStage(index, showScene = false) {
  if (index > learning.unlocked(saved)) {
    byId('stages-dialog').close();
    return pointToNext();
  }
  saved.stage = index;
  persist();
  byId('stages-dialog').close();
  home();
  byId('journey-scroll').scrollTop = 0;
  if (showScene) openStory();
}
function openStages() {
  silence();
  byId('stage-options').innerHTML = learning.stages
    .map(
      (stage, i) =>
        html`<button
          class="stage-option ${i > learning.unlocked(saved) ? 'locked' : ''}"
          data-stage="${i}"
          aria-label="Stage ${i + 1}, ${stage.name}, ${stage.letters.join(' ')}, ${i > learning.unlocked(saved) ? 'locked' : saved.badges[i].listen ? 'completed' : 'available'}"
        >
          <span class="stage-dot">${i + 1}</span
          ><span
            ><strong>${stage.name}</strong
            ><small
              >${stage.letters.join(' · ')}${i === 5 ? ' · alphabet adventure' : ''}</small
            ></span
          >${icon(i > learning.unlocked(saved) ? 'lock' : saved.badges[i].listen ? 'check' : 'arrow')}
        </button>`,
    )
    .join('');
  document
    .querySelectorAll('[data-stage]')
    .forEach((button) => (button.onclick = () => selectStage(Number(button.dataset.stage))));
  byId('stages-dialog').showModal();
}

function openStory(callback = null) {
  silence();
  afterStory = callback;
  storyPage = saved.stage === 0 && !learning.passed(saved, 0) ? 0 : 2;
  renderStory();
  byId('story-dialog').showModal();
}
function renderStory() {
  const won = learning.passed(saved, saved.stage);
  byId('story-dialog-title').textContent = won
    ? 'We found it!'
    : ['Picnic time!', 'Oh, Fox!', 'Let’s follow the trail!'][storyPage];
  byId('story-scene').innerHTML = art.storyScene(
    won ? 'win' : storyPage,
    learning.stages[saved.stage].reward,
  );
  byId('story-scene').setAttribute('role', 'img');
  byId('story-scene').setAttribute(
    'aria-label',
    won
      ? `The friends celebrate finding ${learning.stages[saved.stage].reward}`
      : [
          'Panda packs apples and juice into a picnic basket.',
          'Fox carries the picnic basket away, leaving an apple behind.',
          `Panda and Elephant spot the ${learning.stages[saved.stage].reward} and follow the trail.`,
        ][storyPage],
  );
  byId('story-dialog-copy').innerHTML = html`<span class="story-dots"
    >${[0, 1, 2].map((i) => html`<i class="${i === storyPage ? 'active' : ''}"></i>`).join('')}</span
  >`;
  byId('story-go').innerHTML = icon('arrow');
  byId('story-go').setAttribute(
    'aria-label',
    won || storyPage === 2 ? 'Start the adventure' : 'Next story picture',
  );
  guide(byId('story-go'));
  byId('story-go').onclick = () => {
    silence();
    if (!won && storyPage < 2) {
      storyPage++;
      renderStory();
    } else {
      saved.introSeen = true;
      persist();
      byId('story-dialog').close();
      if (afterStory) {
        const callback = afterStory;
        afterStory = null;
        callback();
      }
    }
  };
}

function startLearn(index) {
  showLesson();
  screen = 'learn';
  learnIndex = index;
  learnReady = false;
  renderLearn();
}
function renderLearn() {
  const stage = learning.stages[saved.stage],
    letter = stage.letters[learnIndex],
    name = LETTERS[letter].object;
  const token = sceneToken;
  progress((learnIndex / stage.letters.length) * 100, `${learnIndex + 1}/${stage.letters.length}`);
  byId('lesson-content').innerHTML = html`<span class="eyebrow">${stage.letters.join(' · ')}</span>
    <h2>${letter} is for ${name}!</h2>
    ${art.scene(letter)}
    <div class="letter-teach">
      <span class="letter-card"><b>${letter}</b><small>${letter.toLowerCase()}</small></span
      ><span class="letter-arrow" aria-hidden="true">➜</span
      ><span class="object-card">${art.object(name)}</span>
    </div>
    <button
      class="big-button blue hear-button"
      id="learn-hear"
      aria-label="Hear ${letter} is for ${name}"
    >
      ${icon('sound')}
    </button>`;
  byId('lesson-footer').innerHTML = html`<button
    class="big-button green"
    id="learn-next"
    aria-label="Next activity after listening"
    disabled
  >
    ${icon('arrow')}
  </button>`;
  guide(byId('learn-hear'));
  byId('learn-hear').onclick = () => {
    unlockSound();
    clearGuides();
    learnReady = false;
    byId('learn-next').disabled = true;
    playAudio(`phrases/${letter}.wav`, (ok) => {
      guidance.stopModel();
      if (!ok || screen !== 'learn' || token !== sceneToken) {
        if (screen === 'learn') guide(byId('learn-hear'));
        return;
      }
      learnReady = true;
      byId('learn-next').disabled = false;
      guide(byId('learn-next'));
    });
    guidance.model(document.querySelector('.animated-scene'));
  };
  byId('learn-next').onclick = () => {
    if (!learnReady) return;
    if (!saved.learned.has(letter)) {
      saved.learned.add(letter);
      persist();
      effect(true);
    }
    silence();
    if (learnIndex < stage.letters.length - 1) startLearn(learnIndex + 1);
    else showTestIntro();
  };
}
function showTestIntro() {
  showLesson();
  screen = 'intro';
  progress(0, iconTextBadge(saved.stage));
  byId('lesson-content').innerHTML = html`<span class="eyebrow"
      >${learning.stages[saved.stage].letters.join(' · ')}</span
    >
    <h2 class="picture-heading">${icon('sound')} <span>➜</span> Aa?</h2>
    <div class="test-modes">${icon('sound')} <span>+</span> ${icon('mic')}</div>
    <div class="test-intro-art">
      ${art.animal(Animal.PANDA)}<span class="intro-star">${icon('star')}</span>
    </div>
    <div
      class="visual-demo"
      aria-label="A hand demonstrates listening, then choosing the matching letter"
    >
      <span class="demo-sound">${icon('sound')}</span><i>➜</i>
      <div class="demo-letters"><span>A</span><span>B</span><span>C</span></div>
      <span class="demo-hand">${icon('hand')}</span><span class="demo-check">${icon('check')}</span>
    </div>`;
  byId('lesson-footer').innerHTML = html`<button
    class="big-button green"
    id="begin-test"
    aria-label="Start listening and spoken-letter game"
  >
    ${icon('arrow')}
  </button>`;
  byId('begin-test').onclick = () => beginTest();
  guide(byId('begin-test'));
}
function iconTextBadge(stage) {
  return `${stage + 1} / 6`;
}
function beginTest() {
  unlockSound();
  quiz = learning.makeTest(saved.stage, 'mixed');
  showLesson();
  screen = 'test';
  renderTask();
}
function renderTask() {
  silence();
  feedback = null;
  sceneToken++;
  byId('lesson-content').scrollTop = 0;
  if (!quiz.remainingCount) return finishTest();
  const task = quiz.currentTask;
  progress((quiz.completedCount / quiz.total) * 100, `${quiz.completedCount}/${quiz.total}`);
  if (task.kind === 'speak') return renderSpeak(task);
  const choices = learning.choicesFor(task.letter, saved.stage);
  byId('lesson-content').innerHTML = html`<span class="eyebrow"
      >${task.attempts ? 'LET’S MEET THIS ONE AGAIN' : 'LISTEN & FIND'}</span
    >
    <h2 class="picture-heading">${icon('sound')} <span>➜</span> Aa?</h2>
    ${task.attempts ? '<div class="retry-pill">↻ ' + icon('sound') + ' ' + icon('star') + '</div>' : ''}
    <div class="quiz-character" id="quiz-character">
      ${art.animal(learning.stages[saved.stage].animal)}<button
        class="sound-bubble"
        id="quiz-replay"
        aria-label="Replay the letter sound"
      >
        ${icon('sound')}
      </button>
    </div>
    <div class="answer-options">
      ${choices.map((letter) => html`<button class="answer-tile" data-answer="${letter}" aria-label="Choose letter ${letter}" disabled>${letter}<small>${letter.toLowerCase()}</small></button>`).join('')}
    </div>
    <p class="hint-text">${icon('sound')} ➜ Aa</p>`;
  byId('lesson-footer').innerHTML = html`<div class="quiz-footer-placeholder">
    ${icon('sound')}<span class="visual-choice-icon">➜ Aa</span>
  </div>`;
  const replay = () => {
    const token = sceneToken;
    playAudio(`audio/${task.letter}.wav`, (ok) => {
      if (token !== sceneToken || screen !== 'test') return;
      if (ok) {
        document.querySelectorAll('[data-answer]').forEach((button) => (button.disabled = false));
        guideChoices();
      } else guide(byId('quiz-replay'));
    });
    markPlaying(byId('quiz-replay'));
  };
  byId('quiz-replay').onclick = replay;
  document
    .querySelectorAll('[data-answer]')
    .forEach(
      (button) =>
        (button.onclick = () =>
          answerCurrent(button.dataset.answer === task.letter, button.dataset.answer)),
    );
  guide(byId('quiz-replay'));
  replay();
}
function answerCurrent(correct, observed) {
  if (feedback || !quiz || !quiz.remainingCount) return;
  abortVoice();
  stopAudio();
  clearGuides();
  unlockSound();
  effect(correct);
  const task = quiz.currentTask;
  feedback = { correct, observed };
  document.querySelectorAll('[data-answer]').forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === observed) button.classList.add(correct ? 'correct' : 'wrong');
  });
  if (byId('mic-button')) byId('mic-button').disabled = true;
  if (correct && byId('speech-scene')) byId('speech-scene').classList.add('celebrate');
  if (correct && byId('quiz-character')) byId('quiz-character').classList.add('celebrate');
  if (!correct) {
    const target = document.querySelector(`[data-answer="${task.letter}"]`);
    if (target) target.classList.add('correction-demo');
  }
  byId('lesson-footer').innerHTML = html`<div
      class="feedback pictorial-feedback ${correct ? '' : 'retry'}"
    >
      ${icon(correct ? 'check' : 'sound')}<span class="feedback-symbol"
        >${correct ? '✦' : task.letter}</span
      >${correct ? '' : html`<span class="retry-loop">↻</span>`}
    </div>
    <button
      class="big-button ${correct ? 'green' : 'blue'}"
      id="question-next"
      aria-label="Continue after ${correct ? 'correct answer' : 'reviewing the missed letter'}"
    >
      ${icon('arrow')}
    </button>`;
  byId('question-next').onclick = () => {
    quiz = learning.answer(quiz, correct);
    renderTask();
  };
  if (correct) guide(byId('question-next'));
  else {
    byId('question-next').disabled = true;
    const token = sceneToken;
    setTimeout(() => {
      if (token !== sceneToken || screen !== 'test') return;
      playAudio(`audio/${task.letter}.wav`, () => {
        if (token === sceneToken && byId('question-next')) {
          byId('question-next').disabled = false;
          guide(byId('question-next'));
        }
      });
    }, 320);
  }
}

function renderSpeak(task) {
  byId('lesson-content').innerHTML = html`<span class="eyebrow">${task.attempts ? '↻' : 'Aa'}</span>
    <h2 class="picture-heading">${icon('mouth')} <span>➜</span> ${icon('mic')}</h2>
    <div class="speech-letter">${task.letter}<small>${task.letter.toLowerCase()}</small></div>
    <div class="speech-scene" id="speech-scene">${art.animal(Animal.ELEPHANT)}</div>
    <button
      class="mic-button"
      id="mic-button"
      aria-label="Tap the microphone, then say the displayed letter to pass"
    >
      ${icon('mic')}
    </button>
    <div class="voice-status" id="voice-status" role="status" aria-live="polite"></div>
    <button
      class="text-button voice-skip"
      id="speech-replay"
      aria-label="Hear an example of the displayed letter"
    >
      ${icon('sound')}
    </button>`;
  byId('lesson-footer').innerHTML = html`<div class="quiz-footer-placeholder voice-gate">
    ${icon('mic')} <span>➜</span> ${icon('lock')}
  </div>`;
  byId('mic-button').onclick = () => {
    if (speechInput.active) {
      abortVoice();
      voiceStatus('↻');
      guide(byId('mic-button'));
      return;
    }
    if (!saved.voiceConsent) {
      byId('voice-dialog').showModal();
      return;
    }
    startVoice();
  };
  byId('speech-replay').onclick = () => {
    abortVoice();
    playAudio(`audio/${task.letter}.wav`, () => guide(byId('mic-button')));
  };
  guide(byId('mic-button'));
}
function voiceStatus(message, listening = false) {
  if (byId('voice-status')) byId('voice-status').textContent = message;
  if (byId('mic-button')) byId('mic-button').classList.toggle('listening', listening);
  if (byId('speech-scene')) byId('speech-scene').classList.toggle('mic-active', listening);
}
function voiceError(status) {
  abortVoice();
  if (screen !== 'test' || !quiz || quiz.currentTask?.kind !== 'speak') return;
  const unavailable = ['unavailable', 'permission', 'network', 'language'].includes(status);
  voiceStatus(unavailable ? '⊘' : '↻');
  if (byId('mic-button')) guide(byId('mic-button'));
  if (unavailable && byId('voice-status'))
    byId('voice-status').innerHTML = icon('mic-off') + ' ' + icon('loop');
}
function receiveVoice(results) {
  if (screen !== 'test' || feedback || quiz?.currentTask?.kind !== 'speak') return;
  const result = learning.classifySpeech(results, quiz.currentTask.letter);
  abortVoice();
  if (result.status === 'uncertain') {
    voiceStatus('↻');
    if (byId('mic-button')) guide(byId('mic-button'));
  } else answerCurrent(result.status === 'correct', result.letter);
}
function startVoice() {
  stopAudio();
  clearGuides();
  unlockSound();
  speechInput.start();
}
function onSpeechStatus(status) {
  if (screen !== 'test' || quiz?.currentTask?.kind !== 'speak') return;
  if (status === 'ready') {
    voiceStatus('✓');
    guide(byId('mic-button'));
  } else if (status === 'listening') voiceStatus('● ● ●', true);
  else if (status === 'processing') voiceStatus('…');
  else voiceError(status);
}
function finishTest() {
  silence();
  saved = learning.completeTest(saved, quiz);
  persist();
  screen = 'summary';
  const stage = learning.stages[saved.stage];
  progress(100, iconTextBadge(saved.stage));
  effect(true, true);
  byId('lesson-content').innerHTML = html`<span class="eyebrow">${stage.letters.join(' · ')}</span>
    <div class="summary-badge">${icon('star')}</div>
    <div class="summary-story">${art.storyScene('win', stage.reward)}</div>
    <div class="summary-awards">
      <span class="award">${icon('sound')} ${icon('check')}</span
      ><span class="award">${icon('mic')} ${icon('check')}</span
      ><span class="award">${art.object(stage.reward)}</span>
    </div>`;
  byId('lesson-footer').innerHTML = html`<button
    class="big-button green"
    id="summary-next"
    aria-label="${saved.stage < 5 ? 'Continue to next stage' : 'Return to adventure'}"
  >
    ${icon('arrow')}
  </button>`;
  byId('summary-next').onclick = () => {
    if (saved.stage < 5) selectStage(saved.stage + 1, true);
    else home();
  };
  guide(byId('summary-next'));
}
function openBook() {
  silence();
  byId('book-grid').innerHTML = learning.letters
    .map(
      (letter) =>
        html`<button
          class="book-letter"
          data-book-letter="${letter}"
          aria-label="Listen to letter ${letter}"
        >
          ${letter}
        </button>`,
    )
    .join('');
  document.querySelectorAll('[data-book-letter]').forEach(
    (button) =>
      (button.onclick = () => {
        stopAudio();
        playBookLetter(button.dataset.bookLetter);
      }),
  );
  byId('book-status').textContent = '';
  byId('book-dialog').showModal();
}
function playBookLetter(letter) {
  document
    .querySelectorAll('[data-book-letter]')
    .forEach((button) => button.classList.toggle('selected', button.dataset.bookLetter === letter));
  byId('book-status').textContent = letter;
  return playAudio(`audio/${letter}.wav`);
}
async function bookSequence() {
  if (sequence) {
    stopAudio();
    return;
  }
  for (const letter of learning.letters) {
    const promise = playBookLetter(letter);
    sequence = true;
    byId('book-all').textContent = 'Stop listening';
    const ok = await promise;
    if (!ok || !byId('book-dialog').open) break;
  }
  sequence = false;
  byId('book-all').textContent = 'Listen to A–Z';
}
function openFriends() {
  silence();
  byId('friend-options').innerHTML = Object.values(ANIMALS)
    .map(
      ({ id: animalId, name: animalName, description: animalDescription }) =>
        html`<button
          class="friend-option ${saved.companionAnimal === animalId ? 'selected' : ''}"
          data-animal="${animalId}"
          aria-label="Choose ${animalName} as your map companion"
        >
          ${art.animal(animalId)}<span
            ><strong>${animalName}</strong><small>${animalDescription}</small></span
          >${saved.companionAnimal === animalId ? icon('check', 'selected-icon') : ''}
        </button>`,
    )
    .join('');
  document.querySelectorAll('[data-animal]').forEach(
    (button) =>
      (button.onclick = () => {
        saved.companionAnimal = button.dataset.animal;
        persist();
        byId('friends-dialog').close();
        byId('map-cast').innerHTML = art.animal(saved.companionAnimal);
        unlockSound();
        effect(true);
      }),
  );
  byId('friends-dialog').showModal();
}
byId('story-open').onclick = () => openStory();
byId('stage-select').onclick = openStages;
byId('book-nav').onclick = openBook;
byId('friends-nav').onclick = openFriends;
byId('book-all').onclick = bookSequence;
byId('map-nav').onclick = () => {
  byId('journey-scroll').scrollTo({
    top: 0,
    behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',
  });
};
byId('lesson-close').onclick = home;
byId('voice-enable').onclick = () => {
  saved.voiceConsent = true;
  persist();
  byId('voice-dialog').close();
  startVoice();
};
byId('settings-open').onclick = () => {
  silence();
  byId('slow-setting').checked = saved.slow;
  byId('effects-setting').checked = saved.effects;
  byId('reset-confirm').hidden = true;
  byId('settings-dialog').showModal();
};
byId('slow-setting').onchange = (event) => {
  saved.slow = event.target.checked;
  persist();
};
byId('effects-setting').onchange = (event) => {
  saved.effects = event.target.checked;
  persist();
};
byId('reset-button').onclick = () => {
  byId('reset-confirm').hidden = false;
};
byId('reset-cancel').onclick = () => {
  byId('reset-confirm').hidden = true;
};
byId('reset-confirm-button').onclick = () => {
  saved = learning.defaults();
  persist();
  byId('settings-dialog').close();
  home();
  byId('journey-scroll').scrollTop = 0;
};
document.querySelectorAll('[data-close]').forEach(
  (button) =>
    (button.onclick = () => {
      silence();
      byId(button.dataset.close).close();
    }),
);
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('cancel', silence));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) silence();
});
window.addEventListener('pagehide', silence);
window.LittleWild = {
  pause: silence,
  back: () => {
    const dialog = document.querySelector('dialog[open]');
    if (dialog) {
      silence();
      dialog.close();
      return true;
    }
    if (screen !== 'home') {
      home();
      return true;
    }
    return false;
  },
};
byId('desktop-cast').innerHTML =
  art.animal(Animal.PANDA) + art.animal(Animal.ELEPHANT) + art.animal(Animal.FOX);
renderMap();
