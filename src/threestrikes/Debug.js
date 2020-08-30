import { html } from "htm/react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useRecoilCallback,
} from "recoil";

import {
  extraDrawAttemptsState,
  optionState,
  priceState,
  resetGameState,
} from "./atoms.js";

import { getRandomInt } from "./util.js";

export const useToggleDebug = () =>
  useRecoilCallback(
    ({ set }) => () => set(optionState("showDebug"), (x) => !x),
    []
  );

export const Debug = () => {
  const [price, setPrice] = useRecoilState(priceState);
  const extraDrawAttempts = useRecoilValue(extraDrawAttemptsState);
  const showDebug = useRecoilValue(optionState("showDebug"));
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

  return html`
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
          ><button onClick=${() => setStartingExtraDrawAttempts((x) => x + 1)}>
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
              onChange=${() => setCorrectDigitDecreasesDrawAttempts((x) => !x)}
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
              onChange=${() => setUsingAttemptDecreasesDrawAttempts((x) => !x)}
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
  `;
};
