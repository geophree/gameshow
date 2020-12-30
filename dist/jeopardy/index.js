import { html } from "../web_modules/htm/react.js";
import NewWindow from "../web_modules/react-new-window.js";
import { useRecoilState, useRecoilValue } from "../web_modules/recoil.js";

import { endGameState, showingPopupState } from "./state.js";

import { BoardWithoutScore } from "./BoardWithoutScore.js";
import { Controls } from "./Controls.js";
import { Fonts } from "./Fonts.js";
import { Scores } from "./Scores.js";

import "./style.css.proxy.js";

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
