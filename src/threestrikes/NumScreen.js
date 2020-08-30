import { html } from "htm/react";
import { useRecoilState, useRecoilValue } from "recoil";

import { gamePhaseState, numScreensState, priceDigitsValue } from "./state.js";

export const NumScreen = ({ i, dollar, onClick }) => {
  const gamePhase = useRecoilValue(gamePhaseState);
  const [screenStates, setScreenStates] = useRecoilState(numScreensState);
  const priceDigits = useRecoilValue(priceDigitsValue);

  if (dollar) {
    return html`
      <div class="screen">
        <div class="numScreen" id="dollar">$</div>
      </div>
    `;
  }

  let realOnClick = () => onClick(i);
  const isShowing = screenStates[i];
  let screenClass = "screen";
  if (isShowing) {
    realOnClick = undefined;
  } else if (gamePhase == "select") {
    screenClass += " clickable";
  }

  return html`
    <div class=${screenClass} onClick=${realOnClick}>
      <div class="numScreen" id="${i}">
        ${isShowing ? priceDigits[i] : ""}
      </div>
    </div>
  `;
};
