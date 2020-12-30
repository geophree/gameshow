import { html } from "htm/react";
import { useRecoilValue } from "recoil";

import {
  revealStageState,
  selectedTeamState,
  teamResponseState,
  teamWagerState,
} from "./state.js";

export const FinalReveal = () => {
  const name = useRecoilValue(selectedTeamState);
  const nameStr = name ? `Team ${name}` : "";
  const wager = useRecoilValue(teamWagerState(name));
  const wagerStr = wager.toLocaleString("en-US");
  const response = useRecoilValue(teamResponseState(name));
  const revealStage = useRecoilValue(revealStageState(name));
  const hideResponse = revealStage < 1 ? " hidden" : "";
  const hideWager = revealStage < 2 ? " hidden" : "";
  return html`
    <div class="aspect-ratio blue-background final-reveal">
      <p class="team-name">${nameStr}</p>
      <p class="final-response${hideResponse}">${response}</p>
      <p class="final-wager${hideWager}">
        <span class="dollar">$</span>${wagerStr}
      </p>
    </div>
  `;
};
