import { html } from "htm/react";
import { useRecoilValue } from "recoil";

import "./style.css";
import fontUrl from "./fonts/3Strikes.woff2";

import {
  gamePhaseState,
  numScreensState,
  priceDigitsValue,
  strikesState,
} from "./state.js";

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
  const screenStates = useRecoilValue(numScreensState);
  const priceDigits = useRecoilValue(priceDigitsValue);

  const toggleDebug = useToggleDebug();
  const startGame = useStartGame();
  const insertToken = useInsertToken();
  const drawToken = useDrawToken();
  const selectScreen = useSelectScreen();

  const bagText = gamePhase === "wait" || gamePhase === "end" ? "" : gamePhase;
  const bagOnClick = {
    draw: drawToken,
    insert: insertToken,
    start: startGame,
  }[gamePhase];

  let makeScreenOnClick = () => undefined;
  if (gamePhase === "select") makeScreenOnClick = (i) => () => selectScreen(i);
  const numScreens = screenStates.map(
    (filled, i) => html`
      <${NumScreen} key=${i} onClick=${filled ? null : makeScreenOnClick(i)}>
        ${filled ? priceDigits[i] : ""}
      <//>
    `
  );

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
          <${NumScreen}>$<//>
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
