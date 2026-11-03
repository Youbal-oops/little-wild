import { Animal } from '../content.js';
import { html, svg } from './svg.js';

function eyes() {
  return html`<g class="eyes">
      <ellipse cx="124" cy="132" rx="17" ry="23" fill="#fff" />
      <ellipse cx="196" cy="132" rx="17" ry="23" fill="#fff" />
      <ellipse cx="128" cy="136" rx="10" ry="15" fill="#253b46" />
      <ellipse cx="192" cy="136" rx="10" ry="15" fill="#253b46" />
      <circle cx="131" cy="130" r="4" fill="#fff" /><circle
        cx="195"
        cy="130"
        r="4"
        fill="#fff"
      /> </g
    ><g fill="#ff9eac" opacity=".85"
      ><ellipse cx="103" cy="163" rx="15" ry="9" /><ellipse cx="217" cy="163" rx="15" ry="9"
    /></g>`;
}
function paws(color) {
  return html`<g fill="${color}"
      ><ellipse cx="111" cy="281" rx="33" ry="20" /><ellipse cx="209" cy="281" rx="33" ry="20"
    /></g>
    <g fill="#fff" opacity=".18"
      ><ellipse cx="108" cy="277" rx="16" ry="6" /><ellipse cx="212" cy="277" rx="16" ry="6"
    /></g>`;
}
function scarf(color) {
  return html`<path d="M109 196q51 20 102 0l-14 28-37-9-39 10Z" fill="${color}" />
    <path class="scarf-tip" d="m179 214 27 33-31 5-10-34Z" fill="${color}" />
    <path
      d="m132 207 19 5"
      stroke="#fff"
      stroke-opacity=".5"
      stroke-width="5"
      stroke-linecap="round"
    />`;
}
function drawPanda(mouth) {
  return html`${paws('#263e49')}
    <ellipse cx="160" cy="236" rx="67" ry="57" fill="#edf8ef" />
    <path d="M100 222q60 28 120 0v22q-60 28-120 0Z" fill="#304b55" />
    <g class="arm-left"><ellipse cx="94" cy="232" rx="22" ry="36" fill="#304b55" /></g>
    <g class="arm-right"
      ><ellipse cx="226" cy="230" rx="22" ry="36" fill="#304b55" /><ellipse
        cx="233"
        cy="243"
        rx="9"
        ry="12"
        fill="#526a73"
    /></g>
    ${scarf('#20bba3')}
    <g class="animal-head">
      <circle cx="91" cy="66" r="31" fill="#304b55" /><circle
        cx="229"
        cy="66"
        r="31"
        fill="#304b55"
      />
      <circle cx="91" cy="66" r="16" fill="#58717c" /><circle
        cx="229"
        cy="66"
        r="16"
        fill="#58717c"
      />
      <path d="M69 128q-1-80 91-80t91 80q5 78-91 80t-91-80Z" fill="#fffdf0" />
      <path
        d="M83 109q6-49 54-49"
        fill="none"
        stroke="#fff"
        stroke-width="8"
        stroke-linecap="round"
      />
      <ellipse cx="122" cy="135" rx="29" ry="35" fill="#304b55" transform="rotate(19 122 135)" />
      <ellipse cx="198" cy="135" rx="29" ry="35" fill="#304b55" transform="rotate(-19 198 135)" />
      ${eyes()}<ellipse cx="160" cy="173" rx="30" ry="23" fill="#f4edda" />
      <path d="M147 164q13-8 26 0-1 12-13 13t-13-13Z" fill="#304b55" />${mouth}
      <path d="M153 49q-7-26 21-31 9 22-21 31" fill="#7dd441" /><path
        d="m157 44 10-15"
        stroke="#4eb639"
        stroke-width="3"
      />
    </g>`;
}
function drawFox(mouth) {
  return html`<g class="fox-tail"
      ><path d="M216 267q92-3 71-111-17 44-59 50-51 5-44 35Z" fill="#ed791c" />
      <path d="M259 196q20-15 28-40 9 41-3 65l-12-12-16 7Z" fill="#fff5d9"
    /></g>
    ${paws('#c76b24')}<ellipse cx="160" cy="236" rx="64" ry="57" fill="#ff981e" />
    <ellipse cx="160" cy="240" rx="37" ry="45" fill="#fff2d3" />
    <g class="arm-left"><ellipse cx="96" cy="230" rx="21" ry="35" fill="#f5871e" /></g>
    <g class="arm-right"><ellipse cx="224" cy="230" rx="21" ry="35" fill="#f5871e" /></g>
    ${scarf('#468ceb')}
    <g class="animal-head">
      <path d="m77 108-7-77q0-17 14-6l54 43m44 0 54-43q14-11 14 6l-7 77" fill="#ef811e" />
      <path d="m88 82-2-35 28 30m92 0 28-30-2 35" fill="#ffbf8c" />
      <path
        d="M64 123q4-69 96-69t96 69l14 21-29 7 13 12q-32 44-94 44t-94-44l13-12-29-7Z"
        fill="#ff9e28"
      />
      <path d="M65 150q49-8 95 23 46-31 95-23-27 51-95 54-68-3-95-54" fill="#fff5df" />
      <path d="m148 59 12-16 6 15 14-9-4 16" fill="#ffb545" />
      ${eyes()}<path d="M145 165q15-9 30 0-3 14-15 14t-15-14Z" fill="#65412f" />${mouth}
    </g>`;
}
function drawElephant(mouth) {
  return html`${paws('#579bd3')}<ellipse cx="160" cy="235" rx="71" ry="59" fill="#80c9f2" />
    <ellipse cx="160" cy="243" rx="42" ry="40" fill="#a9e0fa" />
    <g class="arm-left"><ellipse cx="91" cy="231" rx="24" ry="36" fill="#69b9e8" /></g>
    <g class="arm-right"><ellipse cx="229" cy="231" rx="24" ry="36" fill="#69b9e8" /></g>
    ${scarf('#ffba35')}
    <g class="animal-head">
      <g class="ear-left"
        ><ellipse cx="71" cy="121" rx="47" ry="62" fill="#64b3e5" /><ellipse
          cx="71"
          cy="122"
          rx="31"
          ry="43"
          fill="#dda8ca"
      /></g>
      <g class="ear-right"
        ><ellipse cx="249" cy="121" rx="47" ry="62" fill="#64b3e5" /><ellipse
          cx="249"
          cy="122"
          rx="31"
          ry="43"
          fill="#dda8ca"
      /></g>
      <path d="M82 126q0-75 78-75t78 75v21q0 57-78 57t-78-57Z" fill="#8ad1f5" />
      <path
        d="M107 93q13-24 36-26"
        fill="none"
        stroke="#c6edff"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path d="m146 54 9-18 6 18 17-11-5 17" fill="#6cbce9" />
      ${eyes()}${mouth}
      <g class="elephant-trunk"
        ><path
          d="M148 159v38q0 34 31 34 30 0 34-25"
          fill="none"
          stroke="#5daee0"
          stroke-width="30"
          stroke-linecap="round" />
        <path
          d="M153 163v33q0 28 24 28 24 0 30-20"
          fill="none"
          stroke="#91d5f7"
          stroke-width="21"
          stroke-linecap="round" />
        <path
          d="m144 185 17 1m-16 13 16 1"
          stroke="#69b8e5"
          stroke-width="3"
          stroke-linecap="round"
      /></g>
    </g>`;
}
const drawings = {
  [Animal.PANDA]: drawPanda,
  [Animal.ELEPHANT]: drawElephant,
  [Animal.FOX]: drawFox,
};
export function animal(kind = Animal.PANDA, mood = 'happy') {
  const draw = drawings[kind];
  if (!draw) throw new RangeError(`Unknown animal: ${kind}`);
  const mouth =
    mood === 'surprised'
      ? html`<ellipse class="mouth" cx="160" cy="185" rx="7" ry="9" fill="#65412f" />`
      : html`<path
          class="mouth"
          d="M149 181q11 13 22 0"
          fill="none"
          stroke="#65412f"
          stroke-width="4"
          stroke-linecap="round"
        />`;
  return svg(
    html`<ellipse
        class="animal-shadow"
        cx="160"
        cy="303"
        rx="77"
        ry="8"
        fill="#167e70"
        opacity=".15"
      />
      <g class="character-body">${draw(mouth)}</g>`,
    '0 0 320 320',
    `character animal-${kind} mood-${mood}`,
  );
}
