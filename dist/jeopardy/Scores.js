import { html } from "../web_modules/htm/react.js";
import { useRecoilValue } from "../web_modules/recoil.js";

import { teamListState, teamScoreState } from "./state.js";

export const Scores = () => {
  const teamList = useRecoilValue(teamListState);
  const scores = teamList.map((name) => {
    const score = useRecoilValue(teamScoreState(name));
    const neg = score < 0 ? "-" : "";
    const scoreStr = Math.abs(score).toLocaleString("en-US");
    return html`<span key=${name} class="score"
      >${name}: ${neg}$${scoreStr}
    </span>`;
  });
  return html`
    <div
      style=${{
        position: "absolute",
        bottom: 0,
        left: 0,
        fontSize: "2vw",
        color: "white",
        zIndex: 50,
      }}
    >
      ${scores}
    </div>
  `;
};
