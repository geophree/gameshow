import { html } from "htm/react";
import NewWindow from "react-new-window";
import { useRecoilState, useRecoilValue } from "recoil";

import { endGameState, showingPopupState } from "./state.js";

import { BoardWithoutScore } from "./BoardWithoutScore.js";
import { Controls } from "./Controls.js";
import { Fonts } from "./Fonts.js";
import { Scores } from "./Scores.js";

import "./style.css";

export const Jeopardy = () => {
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);
  const endGame = useRecoilValue(endGameState);

  const board = html`
    <div class="aspect-ratio" style=${{ userSelect: "none" }}>
      <${Fonts} />
      <${BoardWithoutScore} />
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
