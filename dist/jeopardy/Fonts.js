import { html } from "../web_modules/htm/react.js";

import gyparodyFontUrl from "./fonts/gyparody.woff2.proxy.js";
import optiKorinnaFontUrl from "./fonts/OPTIKorinna-Agency.woff2.proxy.js";
import optiTopicFontUrl from "./fonts/OPTITopic-Bold.woff2.proxy.js";
import brownBagLunchFontUrl from "./fonts/BrownBagLunch.woff2.proxy.js";

const FONT_INFO = `
  @font-face {
    font-family: "Gyparody";
    src: url("${gyparodyFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTIKorinna-Agency";
    src: url("${optiKorinnaFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTITopic-Bold";
    src: url("${optiTopicFontUrl}") format("woff2");
    font-weight: bold;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "BrownBagLunch";
    src: url("${brownBagLunchFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
`;

export const Fonts = () => html`
  <style>
    ${FONT_INFO}
  </style>
`;
