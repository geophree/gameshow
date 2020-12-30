import { html } from "../web_modules/htm/react.js";
import { useRecoilValue } from "../web_modules/recoil.js";

import { teamScoreState } from "./state.js";

const Score = ({ name, class: className, ...props }) => {
  const score = useRecoilValue(teamScoreState(name));
  const neg = score < 0 ? "-" : "";
  const scoreStr = Math.abs(score).toLocaleString("en-US");
  return html`
    <div class="${className ?? ""} score">
      <div class="score-name">${name}</div>
      <div class="score-score">${neg}<span class="dollar">$</span>${scoreStr}</div>
    </span>
  `;
};

export const Scores = () => {
  return html`
    <div class="scores-container">
      <${Score} class="score-red" name="Red" />
      <${Score} class="score-green" name="Green" />
      <${Score} class="score-blue" name="Blue" />
    </div>
  `;
};
