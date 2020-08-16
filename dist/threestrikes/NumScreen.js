import { html } from "../web_modules/htm/react.js";
import { useRecoilState, useRecoilValue } from "../web_modules/recoil.js";

import { numScreensState, priceDigitsValue } from "./atoms.js";

export const NumScreen = ({ i, dollar, onClick }) => {
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
  if (isShowing) realOnClick = undefined;

  return html`
    <div class="screen" onClick=${realOnClick}>
      <div class="numScreen" id="${i}">
        ${isShowing ? priceDigits[i] : ""}
      </div>
    </div>
  `;
};
