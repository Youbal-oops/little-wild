import { ANIMALS } from '../content.js';
import { animal } from './characters.js';
import { html, svg } from './svg.js';

const drawings = {
  apple: html`<path
      d="M81 44q-6-23 6-33"
      stroke="#875117"
      stroke-width="9"
      stroke-linecap="round"
    /><path d="M86 33q0-26 33-22-1 28-33 22" fill="#62c900" /><path
      d="M81 48q-50-23-57 26-7 52 32 68 15 6 25-3 13 9 27 2 36-18 30-66-8-46-57-27"
      fill="#ff6d34"
    /><ellipse cx="49" cy="75" rx="9" ry="16" fill="#ffb177" transform="rotate(25 49 75)" />`,
  ball: html`<circle cx="80" cy="81" r="65" fill="#ffcf21" /><path
      d="M28 40q50 16 46 105M133 40q-50 16-46 105"
      fill="#ff7846"
    /><path d="M16 82h128" stroke="#fff4ab" stroke-width="9" />`,
  cat: html`<path d="m39 60-4-40 34 23m23 0 35-23-4 43" fill="#ffb441" /><ellipse
      cx="81"
      cy="89"
      rx="54"
      ry="49"
      fill="#ffb441"
    /><path d="m43 45-1-12 15 12m48 0 15-12-2 14" fill="#ff827a" /><ellipse
      cx="61"
      cy="81"
      rx="6"
      ry="9"
      fill="#7e4c1e"
    /><ellipse cx="102" cy="81" rx="6" ry="9" fill="#7e4c1e" /><path
      d="m74 98 8 8 8-8"
      fill="#f37178"
    /><path
      d="M46 101 12 96m34 15-32 10m104-20 31-5m-31 15 31 10"
      stroke="#c9872b"
      stroke-width="4"
      stroke-linecap="round"
    />`,
  drum: html`<path d="M26 68v62q54 27 108 0V68" fill="#ff7550" /><path
      d="m30 76 23 59 28-53 27 54 22-60"
      fill="none"
      stroke="#ffdb44"
      stroke-width="7"
    /><ellipse
      cx="80"
      cy="68"
      rx="56"
      ry="22"
      fill="#fff2a6"
      stroke="#ffc528"
      stroke-width="9"
    /><path
      d="m33 16 35 39m57-39L95 55"
      stroke="#ad7035"
      stroke-width="9"
      stroke-linecap="round"
    />`,
  fish: html`<path d="m105 76 39-36v83l-38-26" fill="#ffa600" /><ellipse
      cx="66"
      cy="84"
      rx="54"
      ry="38"
      fill="#ffb11b"
    /><path d="m57 49 27-21 12 29m-41 54 26 26 14-30" fill="#ff7c00" /><circle
      cx="42"
      cy="76"
      r="12"
      fill="white"
    /><circle cx="39" cy="77" r="6" fill="#85521a" /><circle
      cx="20"
      cy="43"
      r="8"
      fill="#b7efff"
    /><circle cx="8" cy="18" r="5" fill="#b7efff" />`,
  grapes: html`<path d="m79 38 9-27" stroke="#825221" stroke-width="8" /><path
      d="M88 25q11-26 40-11-14 29-40 11"
      fill="#7acc00"
    /><g fill="#9b56e8"
      ><circle cx="53" cy="57" r="24" /><circle cx="95" cy="57" r="24" /><circle
        cx="35"
        cy="88"
        r="22" /><circle cx="76" cy="88" r="24" /><circle cx="115" cy="88" r="22" /><circle
        cx="56"
        cy="119"
        r="22" /><circle cx="96" cy="119" r="22" /><circle cx="77" cy="143" r="16"
    /></g>`,
  hat: html`<ellipse cx="80" cy="119" rx="74" ry="22" fill="#ffb20a" /><path
      d="M34 111 44 36q35-20 72 0l11 75"
      fill="#ffd329"
    /><path d="m38 82 84 0 4 27H34" fill="#17b5e6" />`,
  'ice cream': html`<path d="m42 72 39 79 38-79" fill="#f3ad4a" /><path
      d="m56 96 47 25m-58-10 45 23m22-39-45 38"
      stroke="#d68e2c"
      stroke-width="4"
    /><path d="M28 75q-8-28 14-36-1-31 34-32 34-5 41 28 26 7 19 37Z" fill="#ff9ec0" /><path
      d="M28 75h108"
      stroke="#ffe5b4"
      stroke-width="12"
      stroke-linecap="round"
    />`,
  juice: html`<path d="m39 48 10 98h62l10-98" fill="#ffc122" /><path
      d="m42 66 77 0-8 69H49"
      fill="#ff9f00"
    /><path
      d="M81 118 94 12h31"
      fill="none"
      stroke="#f7ffff"
      stroke-width="11"
      stroke-linecap="round"
    /><ellipse cx="80" cy="48" rx="41" ry="9" fill="#ffe360" /><circle
      cx="58"
      cy="92"
      r="8"
      fill="#ffde65"
    />`,
  kite: html`<path d="m80 8 60 62-60 58L21 70Z" fill="#ff7e43" /><path
      d="m80 8 0 120L21 70Z"
      fill="#18bcef"
    /><path d="m80 8 0 120M21 70h119" stroke="#fff6aa" stroke-width="5" /><path
      d="M80 128q-17 12 6 25"
      stroke="#328b9c"
      stroke-width="4"
      fill="none"
    />`,
  leaf: html`<path d="M22 132Q0 16 141 15q16 143-119 117" fill="#7ed500" /><path
      d="m18 146 97-103m-67 71-4-39m27 13 36 1"
      fill="none"
      stroke="#b3ee49"
      stroke-width="9"
      stroke-linecap="round"
    />`,
  moon: html`<path
      d="M111 12Q35 49 91 115q18 16 43 8Q62 183 21 103-10 33 65 9q25-7 46 3"
      fill="#ffe045"
    /><path d="m126 25 7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" fill="#ffb62b" />`,
  nest: html`<ellipse cx="81" cy="104" rx="70" ry="39" fill="#d7a04c" /><ellipse
      cx="80"
      cy="87"
      rx="64"
      ry="26"
      fill="#b67b30"
    /><ellipse cx="61" cy="72" rx="22" ry="31" fill="#fff2ac" /><ellipse
      cx="100"
      cy="72"
      rx="22"
      ry="31"
      fill="#b4ecff"
    /><path
      d="m16 111 112 7M28 132l113-25M16 94l120 32"
      stroke="#efbd67"
      stroke-width="7"
      stroke-linecap="round"
    />`,
  orange: html`<circle cx="79" cy="87" r="61" fill="#ffa500" /><path
      d="M83 34q7-31 43-20-12 26-43 20"
      fill="#66c914"
    /><ellipse cx="44" cy="68" rx="9" ry="19" fill="#ffcd4d" transform="rotate(25 44 68)" />`,
  queen: html`<path d="M39 58 28 20l34 18 18-28 20 28 33-18-12 38" fill="#ffd72c" /><circle
      cx="80"
      cy="92"
      r="45"
      fill="#ffd8a2"
    /><path
      d="M37 92q-12-47 12-53m73 53q12-47-12-53"
      stroke="#a56b32"
      stroke-width="16"
      fill="none"
    /><circle cx="64" cy="88" r="4" fill="#9c6230" /><circle
      cx="97"
      cy="88"
      r="4"
      fill="#9c6230"
    /><path d="M69 108q11 10 22 0" stroke="#e88975" stroke-width="4" fill="none" /><path
      d="M35 151q45-37 90 0"
      fill="#ff91b4"
    />`,
  rainbow: html`<path
      d="M14 136a66 87 0 0 1 132 0"
      stroke="#ff8d5e"
      stroke-width="19"
      fill="none"
    /><path d="M33 136a47 68 0 0 1 94 0" stroke="#ffd72f" stroke-width="19" fill="none" /><path
      d="M52 136a28 49 0 0 1 56 0"
      stroke="#7edd40"
      stroke-width="19"
      fill="none"
    /><path d="M71 136a9 30 0 0 1 18 0" stroke="#65d8ff" stroke-width="19" fill="none" />`,
  sun: html`<g stroke="#ffc61d" stroke-width="10" stroke-linecap="round"
      ><path
        d="M80 8v15m0 114v15M8 80h15m114 0h15M29 29l11 11m80 80 11 11m0-102-11 11m-80 80-11 11" /></g
    ><circle cx="80" cy="80" r="44" fill="#ffda26" /><circle
      cx="66"
      cy="76"
      r="4"
      fill="#c78b21"
    /><circle cx="94" cy="76" r="4" fill="#c78b21" /><path
      d="M66 92q14 15 28 0"
      fill="none"
      stroke="#c78b21"
      stroke-width="5"
      stroke-linecap="round"
    />`,
  tiger: html`<circle cx="39" cy="38" r="25" fill="#ff9e09" /><circle
      cx="121"
      cy="38"
      r="25"
      fill="#ff9e09"
    /><circle cx="80" cy="89" r="64" fill="#ffb227" /><path
      d="m65 27 15 34 15-34M20 66l31 11-33 10m122-21-31 11 33 10"
      fill="#92552a"
    /><ellipse cx="61" cy="88" rx="6" ry="9" fill="#714624" /><ellipse
      cx="101"
      cy="88"
      rx="6"
      ry="9"
      fill="#714624"
    /><ellipse cx="80" cy="121" rx="32" ry="23" fill="#fff5d6" /><path
      d="m69 111 11 12 11-12"
      fill="#85521c"
    />`,
  umbrella: html`<path
      d="M13 82a67 65 0 0 1 134 0q-17-15-33 0-18-17-34 0-17-17-34 0-17-15-33 0"
      fill="#fd8fa7"
    /><path
      d="M80 18q-30 29-34 64m34-64q30 29 34 64"
      fill="none"
      stroke="#ffbe67"
      stroke-width="7"
    /><path
      d="M80 82v49q0 30 24 13"
      stroke="#12aedc"
      stroke-width="9"
      fill="none"
      stroke-linecap="round"
    />`,
  violin: html`<path d="m99 10-15 60" stroke="#a46a26" stroke-width="14" /><path
      d="M83 54q-26-18-36 11 14 17-4 26-24 23 1 48 29 20 49-8-1-22 15-28 14-33-14-32"
      fill="#eea044"
    /><path
      d="m79 82-22 43m73-73-31 88"
      stroke="#ffe0a3"
      stroke-width="5"
      stroke-linecap="round"
    />`,
  whale: html`<path
      d="M18 81q3-43 55-42 51 0 53 49l26-20q7 60-54 66-76 9-80-53"
      fill="#2cbceb"
    /><path d="M25 103q29 17 68 10-25 37-54 6" fill="#9aeaff" /><circle
      cx="52"
      cy="79"
      r="5"
      fill="#147da7"
    /><path
      d="M81 39V13m0 0Q64 1 57 15m24-2q16-12 24 2"
      stroke="#63daff"
      stroke-width="8"
      stroke-linecap="round"
      fill="none"
    />`,
  xylophone: html`<path d="m32 24 8 113m73-112 7 111" stroke="#c6963d" stroke-width="9" /><g
      stroke="#fff4ba"
      stroke-width="3"
      ><rect x="13" y="29" width="133" height="22" rx="8" fill="#ff8c6b" /><rect
        x="23"
        y="58"
        width="114"
        height="22"
        rx="8"
        fill="#ffcf25" /><rect x="33" y="87" width="93" height="22" rx="8" fill="#8bd72a" /><rect
        x="43"
        y="116"
        width="73"
        height="22"
        rx="8"
        fill="#3cccf6"
    /></g>`,
  'yo-yo': html`<path d="M80 57V8" stroke="#55a786" stroke-width="5" /><ellipse
      cx="76"
      cy="94"
      rx="59"
      ry="56"
      fill="#fe8956"
    /><ellipse cx="90" cy="94" rx="51" ry="56" fill="#ffbb36" /><circle
      cx="91"
      cy="94"
      r="30"
      fill="#ffde50"
    /><circle cx="91" cy="94" r="11" fill="#ff914c" />`,
  zebra: html`<path
      d="m44 64-7-48 28 34m29 0 29-34-7 48"
      fill="#fffdf4"
      stroke="#587180"
      stroke-width="9"
    /><ellipse cx="80" cy="94" rx="51" ry="56" fill="#fffdf4" /><path
      d="m61 42 19 28 18-28M31 84l28 9-29 13m99-22-28 9 29 13"
      fill="#425c68"
    /><circle cx="61" cy="88" r="5" fill="#425c68" /><circle
      cx="100"
      cy="88"
      r="5"
      fill="#425c68"
    /><ellipse cx="80" cy="123" rx="34" ry="22" fill="#9fbac3" />`,
  basket: html`<path
      d="M34 73q-2-70 46-70t46 70"
      fill="none"
      stroke="#d98b25"
      stroke-width="13"
    /><path d="m11 63 18 82q51 15 102 0l18-82" fill="#f9bd43" /><path
      d="m35 73 11 68m25-68 3 72m30-72-3 72m26-72-11 68M22 95h117m-111 26h105"
      stroke="#e69c2a"
      stroke-width="5"
    /><path d="M12 61h137" stroke="#ffdd76" stroke-width="13" stroke-linecap="round" />`,
  blanket: html`<path d="m13 34 116-16 23 113-119 21Z" fill="#ff8c89" /><path
      d="m44 29 21 118m18-123 23 117M20 70l116-16M27 111l117-16"
      stroke="#fff2ad"
      stroke-width="12"
    />`,
  sandwiches: html`<path
      d="m15 112 58-94q9-12 19 0l60 94q5 17-12 17H28q-18 0-13-17"
      fill="#e6a54c"
    /><path d="m29 108 52-82 52 82" fill="#fff2ba" /><path
      d="m29 111 108 0"
      stroke="#71c731"
      stroke-width="10"
    /><path d="m26 122 114 0" stroke="#ffb443" stroke-width="8" />`,
};

const aliases = { apples: 'apple', picnic: 'basket' };
export function object(name) {
  if (Object.hasOwn(ANIMALS, name)) return animal(name);
  const drawing = drawings[aliases[name] ?? name];
  if (!drawing) throw new RangeError(`Unknown learning object: ${name}`);
  return svg(drawing);
}
