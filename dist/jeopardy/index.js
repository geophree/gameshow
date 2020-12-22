import { html } from "../web_modules/htm/react.js";
import NewWindow from "../web_modules/react-new-window.js";
import { useRecoilState, useRecoilValue } from "../web_modules/recoil.js";

import { showingPopupState } from "./state.js";

import { Categories } from "./Categories.js";
import { Controls } from "./Controls.js";
import { Clues } from "./Clues.js";
import { Fonts } from "./Fonts.js";
import { Scores } from "./Scores.js";

import "./style.css.proxy.js";

export const Jeopardy = () => {
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);
  const board = html`
    <div style=${{ userSelect: "none" }}>
      <${Fonts} />
      <div class="splash-screen aspect-ratio blue-background">
        <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
      </div>
      <${Clues} />
      <${Categories} />
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
      <div class="aspect-ratio top-left-quarter">${board}</div>
      ${popout}
    </div>
  `;
};
