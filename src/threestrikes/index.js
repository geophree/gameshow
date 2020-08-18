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
import { NumScreen } from "./NumScreen.js";

// TODO(geophree):
// screens: win, lose, draw strike, miss digit guess
// better token bag
// sounds

// random int from 0 to max (inclusive!)
function getRandomInt(max) {
  return Math.floor(Math.random() * (Math.floor(max) + 1));
}

export const ThreeStrikes = () => {
  const setPrice = useSetRecoilState(priceState);
  const [gamePhase, setGamePhase] = useRecoilState(gamePhaseState);
  const [strikes, setStrikes] = useRecoilState(strikesState);
  const [tokenMods, setTokenMods] = useRecoilState(tokenModsState);
  const [remainingTokens, setRemainingTokens] = useRecoilState(
    tokensRemainingValue
  );
  const [extraDrawAttempts, setExtraDrawAttempts] = useRecoilState(
    extraDrawAttemptsState
  );

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
  // const { gameOver, won } = useRecoilValue(gameOverValue);

  const setScreenStates = useSetRecoilState(numScreensState);

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
          // TODO(geophree): check win condition
          setGamePhase("wait");
          discardToken(index, () => {
            setGamePhase("draw");
          });
          return;
        }
        // TODO(geophree): Big NO flash?

        if (incorrectDigitIncreasesDrawAttempts) increaseDrawAttempts();
        setGamePhase("wait");
        raiseToken(index, false);
        setTimeout(() => {
          setGamePhase("draw");
        }, 500);
      },
    },
    end: {
      text: "restart",
      buttonOnClick: () => {
        setGamePhase("start");
      },
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
            if (strikeIncreasesDrawAttempts) increaseDrawAttempts();
            if (!discardStrikes) {
              setStrikes((x) => x + 1);
              setGamePhase("insert");
              return;
            }
            discardToken(index, () => {
              setStrikes((x) => x + 1);
              setGamePhase("draw");
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
        <div class="container-fluid">
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
          <div class="debug">
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
            ><button onClick=${() => setNumStrikes((x) => x + 1)}>+</button
            ><br />
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
                    onChange=${() =>
                      setNonStrikeDecreasesDrawAttempts((x) => !x)}
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
            <button
              onClick=${() => setPrice(() => 10000 + getRandomInt(89999))}
            >
              randomize price</button
            ><br />
            <button onClick=${resetGame}>reset game</button><br />
          </div>
          <!-- <footer>
            <div id="author">© Jarrod Yellets | 2018</div>
          </footer> -->
        </div>
      </div>
    </div>
  `;
};
