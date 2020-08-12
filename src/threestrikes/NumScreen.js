import { html } from "htm/react";
import { useRecoilState } from "recoil";

import { numScreensState } from "./atoms.js";

export const NumScreen = ({ i, dollar }) => {
  const [screenStates] = useRecoilState(numScreensState);
  if (dollar) {
    return html`
      <div class="screen">
        <div class="numScreen blink" id="dollar">$</div>
      </div>
    `;
  }

  return html`
    <div class="screen">
      <div class="numScreen blink" id="${i}">${screenStates[i]}</div>
    </div>
  `;
};
