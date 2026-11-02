import { LETTERS, STORY_CAST } from '../content.js';
import { animal } from './characters.js';
import { object } from './objects.js';
import { html, svg } from './svg.js';

export function scene(letter) {
  const lesson = LETTERS[letter];
  if (!lesson) throw new RangeError(`Unknown letter: ${letter}`);
  const name = lesson.object;
  const lessonAnimal = lesson.animal;
  const action = lesson.action;
  return html`<div class="animated-scene act-${action}">
    <div class="scene-cloud cloud-one"></div>
    <div class="scene-cloud cloud-two"></div>
    <div class="scene-tree">${tree()}</div>
    <div class="scene-ground"></div>
    <div class="scene-animal">${animal(lessonAnimal)}</div>
    <div class="scene-object">${object(name)}</div>
    ${letter === 'A' ? html`<div class="catch-basket">${object('basket')}</div>` : ''}${letter === 'E' ? '<div class="water-drops"><i></i><i></i><i></i><i></i></div><div class="water-flowers">✿ ✿ ✿</div>' : ''}<span
      class="scene-spark spark-a"
      >✦</span
    ><span class="scene-spark spark-b">✦</span>
  </div>`;
}
export function tree() {
  return svg(
    '<rect x="73" y="60" width="15" height="96" rx="7" fill="#ffd02b"/><circle cx="80" cy="45" r="40" fill="#76d300"/><circle cx="51" cy="75" r="33" fill="#86df0b"/><circle cx="109" cy="77" r="33" fill="#86df0b"/>',
  );
}
export function landscape(count = 6) {
  const ys = count === 2 ? [90, 320] : [85, 210, 335, 460, 585, 710],
    xs = count === 2 ? [130, 220] : [130, 285, 205, 110, 280, 210];
  let path = `M${xs[0]} ${ys[0] - 55} L${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++)
    path += ` C${xs[i - 1]} ${ys[i - 1] + 80} ${xs[i]} ${ys[i] - 80} ${xs[i]} ${ys[i]}`;
  return svg(
    html`<path d="M0 0h430v830H0Z" fill="#a9ec2c" /><path
        d="M0 0h100q40 120-18 210t-82 120Z"
        fill="#47b66c"
      /><path d="M430 80q-95-16-88 120t88 120Z" fill="#6cd32e" /><path
        d="M0 440q105-73 96 76t-96 150Z"
        fill="#74d91c"
      /><path d="M430 510q-58 60-130 106t-300 98v116h430Z" fill="#57c9f4" /><path
        d="${path}"
        stroke="#fff17e"
        stroke-width="49"
        fill="none"
        stroke-linecap="round"
      /><path
        d="M335 660q-70 42-120 42"
        stroke="#ffda52"
        stroke-width="51"
        fill="none"
        stroke-linecap="round"
      /><g fill="#a7eaff"
        ><ellipse cx="67" cy="766" rx="25" ry="9" /><ellipse
          cx="110"
          cy="802"
          rx="11"
          ry="5" /><ellipse cx="369" cy="729" rx="20" ry="7" /></g
      ><g transform="translate(290 285) scale(.58)"
        >${tree().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g
      ><g transform="translate(12 550) scale(.5)">${tree().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g
      ><g transform="translate(329 5) scale(.55)">${tree().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g
      ><g fill="#71bd1a"
        ><ellipse cx="45" cy="415" rx="8" ry="17" transform="rotate(-30 45 415)" /><ellipse
          cx="60"
          cy="413"
          rx="8"
          ry="17"
          transform="rotate(25 60 413)" /><ellipse
          cx="344"
          cy="550"
          rx="8"
          ry="17"
          transform="rotate(-30 344 550)" /><ellipse
          cx="359"
          cy="550"
          rx="8"
          ry="17"
          transform="rotate(25 359 550)"
      /></g>`,
    '0 0 430 830',
    'landscape',
  );
}
export function storyScene(page, reward = 'apple') {
  if (page === 'win' && reward !== 'picnic')
    return html`<div class="visual-story recovery">
      <div class="story-owner">${animal(STORY_CAST.panda)}</div>
      <div class="story-helper">${animal(STORY_CAST.elephant)}</div>
      <div class="story-food">${object(reward)}</div>
      <span class="heart heart-one">♥</span><span class="heart heart-two">♥</span>
    </div>`;
  if (page === 'win' || page === 3)
    return html`<div class="visual-story reunion">
      <div class="picnic-blanket">${object('blanket')}</div>
      <div class="story-owner">${animal(STORY_CAST.panda)}</div>
      <div class="story-helper">${animal(STORY_CAST.elephant)}</div>
      <div class="story-traveller">${animal(STORY_CAST.fox)}</div>
      <div class="story-food">${object(reward)}</div>
      <span class="heart heart-one">♥</span><span class="heart heart-two">♥</span>
    </div>`;
  if (page === 0)
    return html`<div class="visual-story packing">
      <div class="story-owner">${animal(STORY_CAST.panda)}</div>
      <div class="story-basket">${object('basket')}</div>
      <div class="packing-apple">${object('apple')}</div>
      <div class="packing-juice">${object('juice')}</div>
      <span class="heart">♥</span>
    </div>`;
  if (page === 1)
    return html`<div class="visual-story sneaking">
      <div class="basket-carrier">
        ${animal(STORY_CAST.fox)}
        <div>${object('basket')}</div>
      </div>
      <div class="trail-footprints">● ● ●</div>
      <div class="left-apple">${object('apple')}</div>
    </div>`;
  return html`<div class="visual-story searching">
    <div class="story-owner">${animal(STORY_CAST.panda, 'surprised')}</div>
    <div class="story-helper">${animal(STORY_CAST.elephant)}</div>
    <div class="story-question">?</div>
    <div class="clue-arrow">➜</div>
    <div class="trail-clue">${object(reward)}</div>
  </div>`;
}
