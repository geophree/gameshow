import { html } from "htm/react";
import { atom, atomFamily, useRecoilValue } from "recoil";

import "./style.css";
import gyparodyFontUrl from "./fonts/gyparody.woff2";
import OptiKorinnaFontUrl from "./fonts/OPTIKorinna-Agency.woff2";
import OptiTopicFontUrl from "./fonts/OPTITopic-Bold.woff2";

let fullscreening = false;

function toggleFullscreen() {
  if (fullscreening) return;
  fullscreening = true;
  this.removeEventListener("click", toggleFullscreen);
  const p = this.querySelector(".prompt");
  if (p) {
    p.classList.remove("hidden");
  } else {
    return;
  }
  const dd = this.querySelector(".daily");
  if (dd) {
    dd.classList.remove("hidden");
    const ps = this.previousElementSibling;
    if (ps && ps.querySelector(".daily")) ps.classList.remove("hidden");
  }
  const v = this.querySelector(".value");
  if (v) v.classList.add("hidden");
  setTimeout(() => {
    this.classList.add("fullscreen");
  }, 0);
  const hf = this.querySelector(".horizontal-flip");
  setTimeout(() => {
    fullscreening = false;
    if (hf) hf.addEventListener("click", horizontalFlip);
    if (p) p.addEventListener("click", returnToBoard);
  }, 1000);
}

function returnToBoard(e) {
  this.classList.add("hidden");
  let n = this.parentNode;
  while (n != document.body && !n.classList.contains("fullscreen")) {
    n = n.parentNode;
  }
  n.querySelectorAll(".blue-background *").forEach((n) =>
    n.classList.add("hidden")
  );
  const dd = n.querySelector(".daily");
  if (dd) {
    const ps = n.previousElementSibling;
    if (ps) {
      const dd2 = ps.querySelector(".daily");
      if (dd2) dd2.classList.add("hidden");
    }
    n.classList.add("hidden");
  }
  n.classList.remove("fullscreen");
  e.stopPropagation();
}

function horizontalFlip() {
  if (!this.parentNode.classList.contains("fullscreen"))
    if (this.classList.contains("flipped")) return;
  this.classList.add("flipped");
}

//document.querySelectorAll('.clues .little-screen').forEach(n => n.addEventListener('click', toggleFullscreen));

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

const clueInfoState = atomFamily({
  key: "clueInfo",
  default: ([column, row]) => ({
    column,
    row,
    clue: "DRAUGHTS IS THIS KINGLY GAME",
    response: "What is checkers",
    dailyDouble: column == 2 && row == 3,
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

  /*
  <div class="aspect-ratio little-screen hidden">
    <div class="limiter blue-background">
      <div class="daily double">
        <p>DAI<span class="daily-ly">LY</span>
        DOUBLE</p>
      </div>
    </div>
  </div>
  <div class="aspect-ratio little-screen">
    <div class="limiter">
      <div class="vertical-flip">
        <div class="horizontal-flip blue-background">
          <div class="daily double hidden">
            <p>DAI<span class="daily-ly">LY</span>
            DOUBLE</p>
          </div>
          <div class="prompt blue-background hidden">
            <p>DRAUGHTS IS THIS KINGLY GAME</p>
          </div>
        </div>
      </div>
      <div class="value">
        <span class="dollar">$</span>600
      </div>
    </div>
  </div>
  */

  const selectedClue = useRecoilValue(selectedClueState);
  const clues = [];
  for (let j = 0; j < CATEGORY_COUNT; j++) {
    for (let i = 1; i <= CLUES_PER_CAT; i++) {
      const { clue, dailyDouble, used } = useRecoilValue(clueInfoState([j, i]));
      let before;
      let inner;
      if (!used) {
        const selected = selectedClue?.column == j && selectedClue?.row == i;
        const value = BASE_CLUE_VALUE * i;
        const showPrice = !selected;
        const showClue = selected;
        if (dailyDouble) {
          const dd = !dailyDouble
            ? null
            : html`
                <div class="daily double">
                  <p>DAI<span class="daily-ly">LY</span> DOUBLE</p>
                </div>
              `;
          const baseDD = "";
        }
        inner = html`
          <div class="prompt blue-background hidden">
            <p>${clue}</p>
          </div>
          <div class="value blue-background">
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
          <div class="aspect-ratio little-screen">
            <div class="limiter ${used && "blue-background"}">${inner}</div>
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
