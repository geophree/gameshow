import { html } from "htm/react";
import { useRecoilValue, useRecoilCallback } from "recoil";

import { splashState } from "./state.js";
import { sleep } from "./util.js";

export const useDoSplash = () =>
  useRecoilCallback(
    ({ set }) => async (data) => {
      set(splashState, data);
      if (data.end) return;
      await sleep(1000);
      set(splashState, {});
    },
    []
  );

export const Splash = () => {
  const splashData = useRecoilValue(splashState);

  let splashClasses = "splash";
  if (splashData.good) splashClasses += " good";
  if (splashData.bad) splashClasses += " bad";
  if (!splashData.text) splashClasses += " hide";

  return html`
    <div class=${splashClasses}><span>${splashData.text}</span></div>
  `;
};
