import { html } from "../web_modules/htm/react.js";
import { useRecoilValue } from "../web_modules/recoil.js";

import { endGameState, runningRevealState } from "./state.js";

import { Categories } from "./Categories.js";
import { Clues } from "./Clues.js";
import { FinalReveal } from "./FinalReveal.js";
import { GameOver } from "./GameOver.js";

import "./style.css.proxy.js";

export const BoardWithoutScore = () => {
  const endGame = useRecoilValue(endGameState);
  const runningReveal = useRecoilValue(runningRevealState);

  const cluesCats = html`
    <${Clues} key="clues" />
    <${Categories} key="cats" />
  `;

  const gameOver = html`<${GameOver} />`;
  const finalReveal = html`<${FinalReveal} />`;

  return html`
    <div class="board-without-score">
      <div class="splash-screen aspect-ratio blue-background">
        <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
      </div>
      ${endGame ? gameOver : runningReveal ? finalReveal : cluesCats}
    </div>
  `;
};
