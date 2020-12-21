import { html } from "htm/react";

import gyparodyFontUrl from "./fonts/gyparody.woff2";
import OptiKorinnaFontUrl from "./fonts/OPTIKorinna-Agency.woff2";
import OptiTopicFontUrl from "./fonts/OPTITopic-Bold.woff2";

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
    src: url("${OptiKorinnaFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTITopic-Bold";
    src: url("${OptiTopicFontUrl}") format("woff2");
    font-weight: bold;
    font-style: normal;
    font-display: block;
  }
`;

export const Fonts = () => html`
  <style>
    ${FONT_INFO}
  </style>
`;
