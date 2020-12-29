import { html } from "htm/react";
import NewWindow from "react-new-window";
import { useRecoilState, useRecoilValue } from "recoil";

import { showingPopupState } from "./state.js";

import { Categories } from "./Categories.js";
import { Controls } from "./Controls.js";
import { Clues } from "./Clues.js";
import { Fonts } from "./Fonts.js";
import { Scores } from "./Scores.js";

import "./style.css";

export const Jeopardy = () => {
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);
  const board = html`
    <div class="aspect-ratio" style=${{ userSelect: "none" }}>
      <${Fonts} />
      <div class="board-without-score">
        <div class="splash-screen aspect-ratio blue-background">
          <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
        </div>
        <${Clues} />
        <${Categories} />
      </div>
      <${Scores} />
    </div>
  `;

  const doPopin = () => setShowingPopup(false);
  const popout = !showingPopup
    ? null
    : html`
        <${NewWindow} onUnload=${doPopin} onBlock=${doPopin}>
          <div class="jeopardy">${board}</div>
        <//>
      `;

  return html`
    <div class="jeopardy">
      <${Controls} />
      <div class="aspect-ratio control-board-view">${board}</div>
      ${popout}
    </div>
  `;
};
