import { html } from "htm/react";
import { useRecoilState, useRecoilValue } from "recoil";

import "./style.css";
import fontUrl from "./fonts/3Strikes.woff2";

import {
  buttonPhaseState,
  priceState,
  tokenDigitsValue,
  tokensShownState,
  tokensRemainingState,
} from "./atoms.js";
import { NumScreen } from "./NumScreen.js";

// random int from 0 to max (inclusive!)
function getRandomInt(max) {
  return Math.floor(Math.random() * (Math.floor(max) + 1));
}

export const ThreeStrikes = () => {
  const [buttonPhase, setButtonPhase] = useRecoilState(buttonPhaseState);
  const [price] = useRecoilState(priceState);
  const [tokensShown, setTokensShown] = useRecoilState(tokensShownState);
  const [remainingTokens, setRemainingTokens] = useRecoilState(
    tokensRemainingState
  );

  const tokenDigits = useRecoilValue(tokenDigitsValue);

  const tokens = tokenDigits.map((c, i) => {
    let className = "token";
    if (c === "X") className += " strikeToken";
    if (tokensShown[i]) className += " raiseToken";
    return html`<div key=${i} class=${className}>${c}</div>`;
  });

  const showToken = (index, show = true) => {
    const shown = tokensShown.slice();
    shown[index] = show;
    setTokensShown(shown);
  };

  const { text: buttonText, onClick: buttonOnClick } = {
    draw: {
      text: "draw",
      onClick: () => {
        const selected = getRandomInt(remainingTokens.length - 1);
        showToken(selected);
      },
    },
    insert: {
      text: "insert",
      onClick: () => {
        const index = tokensShown.lastIndexOf(true);
        showToken(index, false);
        if (index <= 0) setButtonPhase("draw");
      },
    },
    start: {
      text: "start",
      onClick: () => {
        setRemainingTokens(tokenDigits.map((_, i) => i));
        setTokensShown(tokenDigits.map(() => true));
        setButtonPhase("insert");
        setTokensShown(tokenDigits.map(() => false));
        setButtonPhase("draw");
      },
    },
  }[buttonPhase];

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
        <div class="container-fluid">
          <div class="gameTitle">
            <span data-gametitle="3 Strikes">3 Strikes</span>
          </div>
          <div class="gameBoard">
            <${NumScreen} dollar />
            <${NumScreen} i="0" />
            <${NumScreen} i="1" />
            <${NumScreen} i="2" />
            <${NumScreen} i="3" />
            <${NumScreen} i="4" />
          </div>
          <div class="base">
            <div class="strike" id="strike1"></div>
            <div class="strike" id="strike2"></div>
            <div class="strike" id="strike3"></div>
            <div class="slot"></div>
            <div class="bottom"></div>
          </div>
          <div class="bottomDiv">
            <!-- <div class="text">Come on down!</div> -->
            <div class="bag" onClick=${buttonOnClick}>
              ${tokens}
              <button class="button">${buttonText}</button>
            </div>
            <!-- <div class="car">
              <div class="curtain">Prize</div>
            </div> -->
          </div>
          <!-- <footer>
            <div id="author">© Jarrod Yellets | 2018</div>
          </footer> -->
        </div>
      </div>
    </div>
  `;
};
