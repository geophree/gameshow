import { html } from "htm/react";
import { atom, atomFamily, useRecoilState, useRecoilValue } from "recoil";

import "./style.css";
import gyparodyFontUrl from "./fonts/gyparody.woff2";
import OptiKorinnaFontUrl from "./fonts/OPTIKorinna-Agency.woff2";
import OptiTopicFontUrl from "./fonts/OPTITopic-Bold.woff2";

const FONT_INFO = `
  @font-face {
    font-family: "Gyparody";
    src: url("${gyparodyFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTIKorinna-Agency";
    src: url("${OptiKorinnaFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTITopic-Bold";
    src: url("${OptiTopicFontUrl}") format("woff2");
    font-weight: bold;
    font-style: normal;
    font-display: block;
  }
`;

const BASE_CLUE_VALUE = 200;
const CATEGORY_COUNT = 6;
const CLUES_PER_CAT = 5;
const CATEGORIES = new Array(CATEGORY_COUNT).fill("POTENT POTABLES");
const DAILY_DOUBLE = { column: 2, row: 3 };

const clueInfoState = atomFamily({
  key: "clueInfo",
  default: ([column, row]) => ({
    column,
    row,
    clue: "DRAUGHTS IS THIS KINGLY GAME",
    response: "What is checkers",
    dailyDouble: column == DAILY_DOUBLE.column && row == DAILY_DOUBLE.row,
    flipped: false,
    used: false,
  }),
});

const selectedClueState = atom({ key: "selectedClue" });

export const Jeopardy = () => {
  const categories = CATEGORIES.map(
    (cat, i) => html`
      <div
        key=${i}
        class="aspect-ratio little-screen topic"
        style=${{ "--column": i, "--row": 0 }}
      >
        <div class="limiter blue-background">
          <p>${cat}</p>
        </div>
      </div>
    `
  );

  // TODO(geophree): prevent clicking while fullscreening or flipping
  const [selectedClue, setSelectedClue] = useRecoilState(selectedClueState);
  const clues = [];
  for (let j = 0; j < CATEGORY_COUNT; j++) {
    for (let i = 1; i <= CLUES_PER_CAT; i++) {
      const [
        { clue, dailyDouble, flipped, used },
        setClueInfo,
      ] = useRecoilState(clueInfoState([j, i]));
      let selected = false;
      let doClick = () => {};
      let before;
      let inner;
      if (!used) {
        if (selectedClue) {
          selected = selectedClue.column == j && selectedClue.row == i;
        } else {
          doClick = () => setSelectedClue({ column: j, row: i });
        }
        if (selected) {
          doClick = () => {
            setClueInfo((info) => ({ ...info, used: true }));
            setSelectedClue();
          };
        }
        const value = BASE_CLUE_VALUE * i;
        const showPrice = !selected;
        const showClue = selected;
        let clueSection = html`
          <div class="prompt blue-background${showClue ? "" : " hidden"}">
            <p>${clue}</p>
          </div>
        `;
        if (dailyDouble) {
          if (selected && !flipped) {
            doClick = () => {};
          }
          const dd = html`
            <div class="daily double${selected ? "" : " hidden"}">
              <p>DAI<span class="daily-ly">LY</span><br />DOUBLE</p>
            </div>
          `;
          before = html`
            <div class="aspect-ratio little-screen">
              <div class="limiter${used ? " blue-background" : ""}">${dd}</div>
            </div>
          `;
          const doFlip = () =>
            setClueInfo((info) => ({ ...info, flipped: true }));
          clueSection = html`
            <div class="vertical-flip">
              <div
                class="horizontal-flip blue-background${flipped
                  ? " flipped"
                  : ""}"
                onClick=${doFlip}
              >
                ${dd} ${clueSection}
              </div>
            </div>
          `;
        }
        inner = html`
          ${clueSection}
          <div class="value blue-background${showPrice ? "" : " hidden"}">
            <p class=${value >= 1000 && "value-1000"}>
              <span class="dollar">$</span>${value}
            </p>
          </div>
        `;
      }
      clues.push(html`
        <div
          key=${j * CLUES_PER_CAT + i - 1}
          style=${{ "--column": j, "--row": i }}
        >
          ${before}
          <div
            class="aspect-ratio little-screen${selected ? " fullscreen" : ""}"
            onClick=${doClick}
          >
            <div class="limiter${used ? " blue-background" : ""}">${inner}</div>
          </div>
        </div>
      `);
    }
  }

  return html`
    <div class="jeopardy">
      <style>
        ${FONT_INFO}
      </style>
      <div class="splash-screen aspect-ratio blue-background">
        <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
      </div>
      <div class="clues aspect-ratio">${clues}</div>
      <div class="categories">${categories}</div>
    </div>
  `;
};
