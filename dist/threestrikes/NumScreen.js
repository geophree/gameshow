import { html } from "../web_modules/htm/react.js";
import { useRecoilState, useRecoilValue } from "../web_modules/recoil.js";

import { gamePhaseState, numScreensState, priceDigitsValue } from "./atoms.js";

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
