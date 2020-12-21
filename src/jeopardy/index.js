import { html } from "htm/react";
import NewWindow from "react-new-window";
import { useRecoilState, useRecoilValue } from "recoil";

import { Categories } from "./Categories.js";
import { Controls } from "./Controls.js";
import { Clues } from "./Clues.js";
import { Fonts } from "./Fonts.js";

import "./style.css";

export const Jeopardy = () => {
  const board = html`
    <div style=${{ userSelect: "none" }}>
      <${Fonts} />
      <div class="splash-screen aspect-ratio blue-background">
        <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
      </div>
      <${Clues} />
      <${Categories} />
    </div>
  `;

  const popout = html`
    <${NewWindow}>
      <div class="jeopardy">${board}</div>
    <//>
  `;

  return html`
    <div class="jeopardy">
      <${Controls} />
      <div class="aspect-ratio top-left-quarter">${board}</div>
    </div>
  `;
};
