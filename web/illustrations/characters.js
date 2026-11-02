import { Animal } from '../content.js';
import { html, svg } from './svg.js';

function eyes() {
  return `<g class="eyes"><ellipse cx="124" cy="127" rx="29" ry="35" fill="white"/><ellipse cx="195" cy="127" rx="29" ry="35" fill="white"/><ellipse cx="131" cy="131" rx="14" ry="20" fill="#88501a"/><ellipse cx="188" cy="131" rx="14" ry="20" fill="#88501a"/><circle cx="135" cy="124" r="5" fill="white"/><circle cx="192" cy="124" r="5" fill="white"/></g><ellipse cx="105" cy="161" rx="15" ry="12" fill="#ff9b9d"/><ellipse cx="214" cy="161" rx="15" ry="12" fill="#ff9b9d"/>`;
}

function drawFox(mouth) {
  return html`<path
      class="fox-tail"
      d="M224 263q101-9 67-105-7 38-53 45-50 6-49 44Z"
      fill="#ff8800"
    /><path d="M278 203q24-20 13-45-7 26-28 34Z" fill="#fff4c9" /><ellipse
      cx="115"
      cy="281"
      rx="32"
      ry="21"
      fill="#e96b00"
    /><ellipse cx="205" cy="281" rx="32" ry="21" fill="#e96b00" /><ellipse
      cx="160"
      cy="230"
      rx="70"
      ry="66"
      fill="#ff9600"
    /><ellipse cx="160" cy="233" rx="43" ry="48" fill="#fff5cf" /><g class="animal-head"
      ><path d="M76 113 75 23q0-15 13-5l54 52m36 0 55-52q13-10 12 6l-2 91" fill="#ff8800" /><path
        d="m88 77 1-34 29 32m86 0 28-32-1 34"
        fill="#bd5a0b"
      /><path
        d="M58 123q3-68 102-70 98 2 103 70l-16 14 16 12q-26 54-103 57-77-3-103-57l17-12Z"
        fill="#ff9b0b"
      /><path
        d="M62 146q49-21 98 24 48-45 98-24-28 48-98 54-71-6-98-54"
        fill="#fff8db"
      />${eyes()}<path d="M144 166q15-10 31 0-4 16-16 16t-15-16" fill="#854715" />${mouth}</g
    ><ellipse
      class="arm-left"
      cx="96"
      cy="227"
      rx="23"
      ry="37"
      fill="#ff8900"
      transform="rotate(-22 96 227)"
    /><ellipse
      class="arm-right"
      cx="226"
      cy="227"
      rx="23"
      ry="37"
      fill="#ff8900"
      transform="rotate(22 226 227)"
    />`;
}

function drawElephant(_mouth) {
  return html`<ellipse cx="111" cy="280" rx="32" ry="23" fill="#53b7e8" /><ellipse
      cx="210"
      cy="280"
      rx="32"
      ry="23"
      fill="#53b7e8"
    /><ellipse cx="160" cy="231" rx="76" ry="67" fill="#79ceff" /><ellipse
      cx="160"
      cy="239"
      rx="46"
      ry="45"
      fill="#b2eaff"
    /><g class="animal-head"
      ><ellipse
        class="ear-left"
        cx="61"
        cy="120"
        rx="49"
        ry="65"
        fill="#66c7f9"
        transform="rotate(-15 61 120)" /><ellipse
        cx="61"
        cy="121"
        rx="32"
        ry="44"
        fill="#ffa8c4"
        transform="rotate(-15 61 121)" /><ellipse
        class="ear-right"
        cx="260"
        cy="120"
        rx="49"
        ry="65"
        fill="#66c7f9"
        transform="rotate(15 260 120)" /><ellipse
        cx="260"
        cy="121"
        rx="32"
        ry="44"
        fill="#ffa8c4"
        transform="rotate(15 260 121)" /><ellipse
        cx="160"
        cy="120"
        rx="93"
        ry="87"
        fill="#81d2ff" /><path d="M116 49q44-35 88 0" fill="#ffe647" /><ellipse
        cx="160"
        cy="30"
        rx="24"
        ry="17"
        fill="#ffce19" />${eyes()}<path
        d="M112 177q-21 22-20-9m116 9q21 22 20-9"
        fill="#fff9d5" /><path
        class="elephant-trunk"
        d="M160 164v30q0 25 24 25 25 0 25-24"
        stroke="#6dc5f6"
        stroke-width="33"
        stroke-linecap="round"
        fill="none" /><path
        d="M150 176h20m-20 12h20"
        stroke="#4eafe7"
        stroke-width="3"
        stroke-linecap="round" /></g
    ><ellipse
      class="arm-left"
      cx="89"
      cy="231"
      rx="24"
      ry="35"
      fill="#5bbfee"
      transform="rotate(-20 89 231)"
    /><ellipse
      class="arm-right"
      cx="232"
      cy="231"
      rx="24"
      ry="35"
      fill="#5bbfee"
      transform="rotate(20 232 231)"
    />`;
}

function drawPanda(mouth) {
  return html`<ellipse cx="111" cy="281" rx="34" ry="23" fill="#354e59" /><ellipse
      cx="208"
      cy="281"
      rx="34"
      ry="23"
      fill="#354e59"
    /><ellipse cx="160" cy="229" rx="76" ry="67" fill="#fffdf3" /><ellipse
      cx="160"
      cy="247"
      rx="43"
      ry="27"
      fill="#e6f1ea"
    /><g class="animal-head"
      ><circle cx="93" cy="59" r="34" fill="#354e59" /><circle
        cx="227"
        cy="59"
        r="34"
        fill="#354e59" /><circle cx="93" cy="59" r="18" fill="#617782" /><circle
        cx="227"
        cy="59"
        r="18"
        fill="#617782" /><ellipse cx="160" cy="124" rx="104" ry="88" fill="#fffdf3" /><ellipse
        cx="121"
        cy="128"
        rx="39"
        ry="43"
        fill="#354e59"
        transform="rotate(18 121 128)" /><ellipse
        cx="199"
        cy="128"
        rx="39"
        ry="43"
        fill="#354e59"
        transform="rotate(-18 199 128)" />${eyes()}<path
        d="M145 168q15-9 30 0-2 16-15 16t-15-16"
        fill="#354e59" />${mouth}<path
        d="M143 43q0-25 18-28 4 13-5 23 12-17 26-11-7 21-29 19"
        fill="#85d318" /></g
    ><ellipse
      class="arm-left"
      cx="92"
      cy="229"
      rx="24"
      ry="37"
      fill="#354e59"
      transform="rotate(-25 92 229)"
    /><ellipse
      class="arm-right"
      cx="229"
      cy="229"
      rx="24"
      ry="37"
      fill="#354e59"
      transform="rotate(25 229 229)"
    />`;
}

const drawings = {
  [Animal.FOX]: drawFox,
  [Animal.ELEPHANT]: drawElephant,
  [Animal.PANDA]: drawPanda,
};
export function animal(kind = Animal.PANDA, mood = 'happy') {
  const mouth =
    mood === 'surprised'
      ? `<ellipse class="mouth" cx="160" cy="184" rx="10" ry="13" fill="#855321"/>`
      : `<path class="mouth" d="M146 180q14 16 28 0" fill="none" stroke="#915920" stroke-width="5" stroke-linecap="round"/>`;
  const draw = drawings[kind];
  if (!draw) throw new RangeError(`Unknown animal: ${kind}`);
  const body = draw(mouth);
  return svg(
    `<ellipse cx="161" cy="302" rx="100" ry="10" fill="#20b394" opacity=".2"/><g class="character-body">${body}</g>`,
    '0 0 320 320',
    `character animal-${kind} mood-${mood}`,
  );
}
