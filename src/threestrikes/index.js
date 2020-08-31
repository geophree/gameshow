import { html } from "htm/react";
import { useRecoilValue } from "recoil";

import "./style.css";
import fontUrl from "./fonts/3Strikes.woff2";

import { gamePhaseState, strikesState } from "./state.js";

import {
  useDrawToken,
  useInsertToken,
  useStartGame,
  useSelectScreen,
} from "./hooks.js";

import { Cog } from "./Cog.js";
import { Debug, useToggleDebug } from "./Debug.js";
import { NumScreen } from "./NumScreen.js";
import { Splash } from "./Splash.js";
import { TokenBag } from "./TokenBag.js";

// TODO(geophree):
// better token bag
// sounds

export const ThreeStrikes = () => {
  const gamePhase = useRecoilValue(gamePhaseState);
  const strikes = useRecoilValue(strikesState);

  const toggleDebug = useToggleDebug();
  const drawToken = useDrawToken();
  const insertToken = useInsertToken();
  const startGame = useStartGame();
  const selectScreen = useSelectScreen();

  let bagText = gamePhase;
  if (gamePhase === "wait" || gamePhase === "end") bagText = "";

  let bagOnClick = {
    draw: drawToken,
    insert: insertToken,
    start: startGame,
  }[gamePhase];

  let numScreens = [html`<${NumScreen} dollar key="$" />`];
  for (let i = 0; i < 5; i++) {
    numScreens.push(
      html`<${NumScreen} i=${i} key=${i} onClick=${selectScreen} />`
    );
  }

  let strikeScreens = [];
  for (let i = 0; i < 3; i++) {
    strikeScreens.push(
      html`<div class="strike" key=${i}>${i < strikes ? "X" : ""}</div>`
    );
  }

  return html`
    <div class="threestrikes">
      <style>
        @font-face {
          font-family: "3Strikes";
          src: url("${fontUrl}") format("woff2");
          font-weight: normal;
          font-style: normal;
        }
      </style>
      <div class="game-screen">
        <div class="gameTitle">
          <span data-gametitle="3 Strikes">3 Strikes</span>
        </div>
        <div class="gameBoard">
          ${numScreens}
        </div>
        <div class="base">
          ${strikeScreens}
          <div class="slot"></div>
          <div class="bottom"></div>
        </div>
        <div class="bottomDiv">
          <${TokenBag} bagText=${bagText} onClick=${bagOnClick} />
        </div>
        <${Splash} />
        <${Debug} />
      </div>
      <${Cog} class="debug-trigger" onClick=${toggleDebug} />
    </div>
  `;
};
