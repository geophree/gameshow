import { html } from "htm/react";

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
  while (n != document.body && !n.classList.contains("fullscreen"))
    n = n.parentNode;
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
const CATEGORIES = new Array(6).fill("POTENT POTABLES");
const CLUES = new Array(6).fill(
  new Array(5).fill("DRAUGHTS IS THIS KINGLY GAME")
);

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
  <div class="aspect-ratio little-screen hidden" xstyle="--column: 2; --row: 3;">
  <div class="limiter blue-background">
  <div class="daily double">
  <p>DAI<span class="daily-ly">LY</span>
  DOUBLE</p>
  </div>
  </div>
  </div>
  <div class="aspect-ratio little-screen" xstyle="--column: 2; --row: 3;">
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

  const clues = CLUES.map((catClues, j) =>
    catClues.map((clue, i) => {
      const value = BASE_CLUE_VALUE * (i + 1);
      return html`
        <div
          key=${j * catClues.length + i}
          style=${{ "--column": j, "--row": i + 1 }}
        >
          <div class="aspect-ratio little-screen">
            <div class="limiter blue-background">
              <div class="prompt hidden">
                <p>${clue}</p>
              </div>
              <div class="value">
                <p class=${value >= 1000 && "value-1000"}>
                  <span class="dollar">$</span>${value}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    })
  );

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
