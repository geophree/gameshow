import { html } from "../web_modules/htm/react.js";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "../web_modules/recoil.js";

import "./style.css.proxy.js";
import fontUrl from "./fonts/3Strikes.woff2.proxy.js";

import {
  extraDrawAttemptsState,
  gamePhaseState,
  numScreensState,
  optionState,
  priceDigitsValue,
  priceState,
  resetGameState,
  splashState,
  strikesState,
  tokenDigitsValue,
  tokenModsState,
  tokenRaisedValue,
  tokensRemainingValue,
} from "./atoms.js";

import { NumScreen } from "./NumScreen.js";
import { Cog } from "./Cog.js";

const STRIKE_WORD_MAP = ["ZERO", "ONE", "TWO", "OUT"];

// TODO(geophree):
// screens: win, lose, draw strike, miss digit guess
// better token bag
// sounds

// random int from 0 to max (inclusive!)
const getRandomInt = (max) => Math.floor(Math.random() * (Math.floor(max) + 1));

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
  const [splashData, setSplash] = useRecoilState(splashState);

  let splashClasses = "splash";
  if (splashData.good) splashClasses += " good";
  if (splashData.bad) splashClasses += " bad";
  if (!splashData.text) splashClasses += " hide";

  const [showDebug, setShowDebug] = useRecoilState(optionState("showDebug"));
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

  const goToPricedLink = () => {
    if (!window) {
      console.log("need window for goToPricedLink");
      return;
    }
    const url = new URL(window.location);
    url.hash = btoa(JSON.stringify({ price }));
    window.history.pushState({}, "", url.toString());
  };

  const resetGame = useResetRecoilState(resetGameState);

  const tokenDigits = useRecoilValue(tokenDigitsValue);
  const priceDigits = useRecoilValue(priceDigitsValue);
  const tokenRaised = useRecoilValue(tokenRaisedValue);
  // const { gameOver, won } = useRecoilValue(gameOverValue);

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

  const splash = (data) => {
    setSplash(data);
    if (!data.end) setTimeout(() => setSplash({}), 1000);
  };

  const decreaseDrawAttempts = () =>
    setExtraDrawAttempts((x) => Math.max(0, x - 1));
  const increaseDrawAttempts = () => setExtraDrawAttempts((x) => x + 1);
  const noop = () => {};

  const { text: buttonText, buttonOnClick = noop, numScreenOnClick = noop } = {
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
      buttonOnClick: () => {
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
      buttonOnClick: () => {
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
      buttonOnClick: () => {
        resetGame();
        raiseAllTokens();
        setGamePhase("insert");
        // TODO(geophree): remove these two when done developing
        // raiseAllTokens(false);
        // setGamePhase("draw");
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

  const tokens = tokenDigits.map((c, i) => {
    const { raised = false, rotated = false, discarded = false } = tokenMods[i];
    let className = "token";
    if (c === "X") className += " strikeToken";
    if (raised) className += " raiseToken";
    if (rotated) className += " rotate";
    if (discarded) className += " hide";
    return html`<div key=${i} class=${className}>${c}</div>`;
  });

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
        <div class="non-splash${splashData.text ? " dim" : ""}">
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
            <!-- <div class="text">Come on down!</div> -->
            <div class="bag">
              ${tokens}
              <button class="button" onClick=${buttonOnClick}>
                ${buttonText}
              </button>
            </div>
            <!-- <div class="car">
              <div class="curtain">Prize</div>
            </div> -->
          </div>
        </div>
        <div class="debug${showDebug ? "" : " hide"}">
          DEBUG:<br />
          <label
            ><input
              type="checkbox"
              checked=${discardStrikes}
              onChange=${() => setDiscardStrikes((x) => !x)}
            />discard strikes</label
          ><br />
          Total strike tokens: ${numStrikes}
          <button onClick=${() => setNumStrikes((x) => Math.max(0, x - 1))}>
            -</button
          ><button onClick=${() => setNumStrikes((x) => x + 1)}>+</button><br />
          Extra draw attempts (internal): ${extraDrawAttempts}<br />
          <ul style=${{ margin: 0 }}>
            <li>
              starting: ${startingExtraDrawAttempts}
              <button
                onClick=${() =>
                  setStartingExtraDrawAttempts((x) => Math.max(0, x - 1))}
              >
                -</button
              ><button
                onClick=${() => setStartingExtraDrawAttempts((x) => x + 1)}
              >
                +</button
              ><br />
            </li>
            <li>
              <label
                ><input
                  type="checkbox"
                  checked=${strikeIncreasesDrawAttempts}
                  onChange=${() => setStrikeIncreasesDrawAttempts((x) => !x)}
                />strike increases</label
              ><br />
            </li>
            <li>
              <label
                ><input
                  type="checkbox"
                  checked=${nonStrikeDecreasesDrawAttempts}
                  onChange=${() => setNonStrikeDecreasesDrawAttempts((x) => !x)}
                />non strike decreases</label
              ><br />
            </li>
            <li>
              <label
                ><input
                  type="checkbox"
                  checked=${correctDigitDecreasesDrawAttempts}
                  onChange=${() =>
                    setCorrectDigitDecreasesDrawAttempts((x) => !x)}
                />correct digit decreases</label
              ><br />
            </li>
            <li>
              <label
                ><input
                  type="checkbox"
                  checked=${incorrectDigitIncreasesDrawAttempts}
                  onChange=${() =>
                    setIncorrectDigitIncreasesDrawAttempts((x) => !x)}
                />incorrect digit increases</label
              ><br />
            </li>
            <li>
              <label
                ><input
                  type="checkbox"
                  checked=${usingAttemptDecreasesDrawAttempts}
                  onChange=${() =>
                    setUsingAttemptDecreasesDrawAttempts((x) => !x)}
                />using attempt decreases</label
              ><br />
            </li>
          </ul>
          Price
          <button onClick=${() => setPrice(() => 10000 + getRandomInt(89999))}>
            randomize
          </button>
          <button onClick=${() => setPrice(Number(prompt("hello")))}>
            set
          </button>
          <button onClick=${goToPricedLink}>go to priced url</button><br />
          <button onClick=${resetGame}>reset game</button><br />
        </div>
        <div class=${splashClasses}><span>${splashData.text}</span></div>
      </div>
      <${Cog} class="debug-trigger" onClick=${() => setShowDebug((x) => !x)} />
    </div>
  `;
};
