import { html } from "htm/react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";

import "./style.css";
import fontUrl from "./fonts/3Strikes.woff2";

import {
  extraDrawAttemptsState,
  gamePhaseState,
  numScreensState,
  optionState,
  priceDigitsValue,
  priceState,
  resetGameState,
  strikesState,
  tokenDigitsValue,
  tokenModsState,
  tokenRaisedValue,
  tokensRemainingValue,
} from "./atoms.js";

import { getRandomInt } from "./util.js";

import { Cog } from "./Cog.js";
import { Debug, useToggleDebug } from "./Debug.js";
import { NumScreen } from "./NumScreen.js";
import { Splash, useDoSplash } from "./Splash.js";
import { TokenBag } from "./TokenBag.js";

const STRIKE_WORD_MAP = ["ZERO", "ONE", "TWO", "OUT"];

// TODO(geophree):
// better token bag
// sounds

export const ThreeStrikes = () => {
  const [price, setPrice] = useRecoilState(priceState);
  const [gamePhase, setGamePhase] = useRecoilState(gamePhaseState);
  const [strikes, setStrikes] = useRecoilState(strikesState);
  const [tokenMods, setTokenMods] = useRecoilState(tokenModsState);
  const [remainingTokens, setRemainingTokens] = useRecoilState(
    tokensRemainingValue
  );
  const [extraDrawAttempts, setExtraDrawAttempts] = useRecoilState(
    extraDrawAttemptsState
  );

  const toggleDebug = useToggleDebug();
  const [discardStrikes, setDiscardStrikes] = useRecoilState(
    optionState("discardStrikes")
  );
  const [numStrikes, setNumStrikes] = useRecoilState(optionState("numStrikes"));
  const [
    strikeIncreasesDrawAttempts,
    setStrikeIncreasesDrawAttempts,
  ] = useRecoilState(optionState("strikeIncreasesDrawAttempts"));
  const [
    nonStrikeDecreasesDrawAttempts,
    setNonStrikeDecreasesDrawAttempts,
  ] = useRecoilState(optionState("nonStrikeDecreasesDrawAttempts"));
  const [
    correctDigitDecreasesDrawAttempts,
    setCorrectDigitDecreasesDrawAttempts,
  ] = useRecoilState(optionState("correctDigitDecreasesDrawAttempts"));
  const [
    incorrectDigitIncreasesDrawAttempts,
    setIncorrectDigitIncreasesDrawAttempts,
  ] = useRecoilState(optionState("incorrectDigitIncreasesDrawAttempts"));
  const [
    usingAttemptDecreasesDrawAttempts,
    setUsingAttemptDecreasesDrawAttempts,
  ] = useRecoilState(optionState("usingAttemptDecreasesDrawAttempts"));
  const [
    startingExtraDrawAttempts,
    setStartingExtraDrawAttempts,
  ] = useRecoilState(optionState("startingExtraDrawAttempts"));

  const resetGame = useResetRecoilState(resetGameState);

  const tokenDigits = useRecoilValue(tokenDigitsValue);
  const priceDigits = useRecoilValue(priceDigitsValue);
  const tokenRaised = useRecoilValue(tokenRaisedValue);

  const [screenStates, setScreenStates] = useRecoilState(numScreensState);

  const modToken = (index, mod) => {
    setTokenMods((mods) => {
      mods = mods.slice();
      mods.splice(index, 1, { ...mods[index], ...mod });
      return mods;
    });
  };

  const raiseToken = (index, raised = true) => {
    modToken(index, { raised });
  };

  const raiseAllTokens = (raised = true) => {
    setTokenMods((mods) => mods.map((x) => ({ ...x, raised })));
  };

  const discardToken = (index, callback) => {
    modToken(index, { rotated: true });
    setTimeout(() => {
      modToken(index, { discarded: true });
      callback();
    }, 650);
  };

  const splash = useDoSplash();

  const decreaseDrawAttempts = () =>
    setExtraDrawAttempts((x) => Math.max(0, x - 1));
  const increaseDrawAttempts = () => setExtraDrawAttempts((x) => x + 1);
  const noop = () => {};

  const { text: bagText, bagOnClick = noop, numScreenOnClick = noop } = {
    wait: { text: "" },
    select: {
      text: "select",
      numScreenOnClick: (i) => {
        const { index, more } = tokenRaised;
        if (index <= 0) {
          setGamePhase("draw");
          return;
        }
        if (tokenDigits[index] == priceDigits[i]) {
          if (correctDigitDecreasesDrawAttempts) decreaseDrawAttempts();
          setScreenStates((states) => {
            states = states.slice();
            states[i] = true;
            return states;
          });

          const win =
            screenStates.reduce((n, x) => n + x) == screenStates.length - 1;
          if (win) {
            splash({ text: "HOME RUN!", good: true, end: true });
            // TODO(geophree): do other win stuff
          } else {
            splash({ text: "HIT!", good: true });
          }
          setGamePhase("wait");
          discardToken(index, () => {
            setGamePhase(win ? "end" : "draw");
          });
          return;
        }
        splash({ text: "MISS!", bad: true });

        if (incorrectDigitIncreasesDrawAttempts) increaseDrawAttempts();
        setGamePhase("wait");
        raiseToken(index, false);
        setTimeout(() => {
          setGamePhase("draw");
        }, 500);
      },
    },
    end: {
      text: "",
    },
    draw: {
      text: "draw",
      bagOnClick: () => {
        if (remainingTokens.length == 0) {
          setGamePhase("end");
          return;
        }
        const getRandomToken = () =>
          remainingTokens[getRandomInt(remainingTokens.length - 1)];
        let index = getRandomToken();
        for (
          let i = 0;
          i < extraDrawAttempts && tokenDigits[index] == "X";
          i++
        ) {
          index = getRandomToken();
          if (usingAttemptDecreasesDrawAttempts) decreaseDrawAttempts();
        }
        raiseToken(index);
        setGamePhase("wait");
        setTimeout(() => {
          if (tokenDigits[index] == "X") {
            const nextStrikes = strikes + 1;
            const lose = nextStrikes >= 3;
            splash({
              text: `STRIKE ${STRIKE_WORD_MAP[nextStrikes]}!`,
              bad: true,
              end: lose,
            });
            if (strikeIncreasesDrawAttempts) increaseDrawAttempts();
            if (!discardStrikes) {
              setStrikes((x) => x + 1);
              setGamePhase(lose ? "end" : "insert");
              return;
            }
            discardToken(index, () => {
              setStrikes((x) => x + 1);
              setGamePhase(lose ? "end" : "draw");
            });
            return;
          }
          if (nonStrikeDecreasesDrawAttempts) decreaseDrawAttempts();
          setGamePhase("select");
        }, 500);
      },
    },
    insert: {
      text: "insert",
      bagOnClick: () => {
        const { index, more } = tokenRaised;

        if (index >= 0) raiseToken(index, false);
        if (!more) {
          setGamePhase("wait");
          setTimeout(() => {
            setGamePhase("draw");
          }, 500);
        }
      },
    },
    start: {
      text: "start",
      bagOnClick: () => {
        resetGame();
        raiseAllTokens();
        setGamePhase("insert");
      },
    },
  }[gamePhase];

  let numScreens = [html`<${NumScreen} dollar key="$" />`];
  for (let i = 0; i < 5; i++) {
    numScreens.push(
      html`<${NumScreen} i=${i} key=${i} onClick=${numScreenOnClick} />`
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
        <div class="non-splash">
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
        </div>
        <${Splash} />
        <${Debug} />
      </div>
      <${Cog} class="debug-trigger" onClick=${toggleDebug} />
    </div>
  `;
};
