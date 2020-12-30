import { html } from "htm/react";
import { useRecoilValue } from "recoil";

import { winningTeamValue } from "./state.js";

export const GameOver = () => {
  const team = useRecoilValue(winningTeamValue);
  let congrats = "";
  let teamName = "The End";
  let scoreSec = "";
  if (team) {
    const { name, score } = team;
    const neg = score < 0 ? "-" : "";
    const scoreStr = Math.abs(score).toLocaleString("en-US");
    congrats = html`<p class="congrats">Congratulations</p>`;
    teamName = `Team ${name}`;
    scoreSec = html`
      <p class="final-score"><span class="dollar">$</span>${scoreStr}</p>
    `;
  }
  return html`
    <div class="aspect-ratio blue-background game-over">
      ${congrats}
      <p class="team-name">${teamName}</p>
      ${scoreSec}
    </div>
  `;
};
