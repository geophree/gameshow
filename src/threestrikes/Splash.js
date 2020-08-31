import { html } from "htm/react";
import { useRecoilValue, useRecoilCallback } from "recoil";

import { splashState } from "./state.js";
import { sleep } from "./util.js";

export const Splash = () => {
  const splashData = useRecoilValue(splashState);

  let splashClasses = "splash";
  if (splashData.good) splashClasses += " good";
  if (splashData.bad) splashClasses += " bad";
  if (!splashData.text) splashClasses += " hide";

  return html`
    <div class=${splashClasses}>
      <div class="splash-background"></div>
      <div class="splash-text">
        <span>${splashData.text}</span>
      </div>
    </div>
  `;
};
