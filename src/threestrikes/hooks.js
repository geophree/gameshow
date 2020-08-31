import { useCallback } from "react";
import { useRecoilCallback } from "recoil";

import { getRandomInt, sleep } from "./util.js";

import {
  extraDrawAttemptsState,
  gamePhaseState,
  numScreensState,
  optionState,
  priceDigitsValue,
  resetGameState,
  splashState,
  strikesState,
  tokenDigitsValue,
  tokenModsState,
  tokenRaisedValue,
  tokensRemainingValue,
} from "./state.js";

const STRIKE_WORD_MAP = ["ZERO", "ONE", "TWO", "OUT"];

export const useDoSplash = () =>
  useRecoilCallback(
    ({ set }) => async (data) => {
      set(splashState, data);
      if (data.end) return;
      await sleep(1000);
      set(splashState, {});
    },
    []
  );

export const useUpdateDrawAttempts = () =>
  useRecoilCallback(
    ({ snapshot, set }) => async (event) => {
      let get = (name) => snapshot.getPromise(optionState(name));
      let increase = false;
      let decrease = false;
      switch (event) {
        case "CORRECT_DIGIT":
          decrease = await get("correctDigitDecreasesDrawAttempts");
          break;
        case "INCORRECT_DIGIT":
          increase = await get("incorrectDigitIncreasesDrawAttempts");
          break;
        case "USED_ATTEMPT":
          decrease = await get("usingAttemptDecreasesDrawAttempts");
          break;
        case "DREW_NON_STRIKE":
          decrease = await get("nonStrikeDecreasesDrawAttempts");
          break;
        case "DREW_STRIKE":
          increase = await get("strikeIncreasesDrawAttempts");
          break;
      }
      if (increase) set(extraDrawAttemptsState, (x) => x + 1);
      if (decrease) set(extraDrawAttemptsState, (x) => Math.max(0, x - 1));
    },
    []
  );

export const useModToken = () => {
  const modToken = useRecoilCallback(
    ({ set }) => (index, mod) =>
      set(tokenModsState, (mods) => {
        mods = mods.slice();
        mods.splice(index, 1, { ...mods[index], ...mod });
        return mods;
      }),
    []
  );

  return {
    modToken,
    raiseToken: useCallback(
      (index, raised = true) => modToken(index, { raised }),
      [modToken]
    ),

    raiseAllTokens: useRecoilCallback(
      ({ set }) => (raised = true) => {
        set(tokenModsState, (mods) => mods.map((x) => ({ ...x, raised })));
      },
      []
    ),

    discardToken: useCallback(
      async (index) => {
        modToken(index, { rotated: true });
        await sleep(650);
        modToken(index, { discarded: true });
      },
      [modToken]
    ),
  };
};

export const useStartGame = () => {
  const { raiseAllTokens } = useModToken();
  return useRecoilCallback(
    ({ reset, set }) => () => {
      reset(resetGameState);
      raiseAllTokens();
      set(gamePhaseState, "insert");
    },
    [raiseAllTokens]
  );
};

export const useInsertToken = () => {
  const { raiseToken } = useModToken();
  return useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const { index, more } = await snapshot.getPromise(tokenRaisedValue);
      if (index >= 0) raiseToken(index, false);
      if (more) return;
      set(gamePhaseState, "wait");
      await sleep(500);
      set(gamePhaseState, "draw");
    },
    [raiseToken]
  );
};

export const useDrawToken = () => {
  const { discardToken, raiseToken } = useModToken();
  const splash = useDoSplash();
  const updateDrawAttempts = useUpdateDrawAttempts();
  return useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const remainingTokens = await snapshot.getPromise(tokensRemainingValue);
      if (remainingTokens.length == 0) {
        set(gamePhaseState, "end");
        return;
      }
      const getRandomToken = () =>
        remainingTokens[getRandomInt(remainingTokens.length - 1)];
      let index = getRandomToken();
      const extraDrawAttempts = await snapshot.getPromise(
        extraDrawAttemptsState
      );
      const tokenDigits = await snapshot.getPromise(tokenDigitsValue);
      for (let i = 0; i < extraDrawAttempts && tokenDigits[index] == "X"; i++) {
        index = getRandomToken();
        updateDrawAttempts("USED_ATTEMPT");
      }
      raiseToken(index);
      set(gamePhaseState, "wait");
      await sleep(500);
      if (tokenDigits[index] != "X") {
        updateDrawAttempts("DREW_NON_STRIKE");
        set(gamePhaseState, "select");
        return;
      }
      const strikes = await snapshot.getPromise(strikesState);
      const nextStrikes = strikes + 1;
      const lose = nextStrikes >= 3;
      splash({
        text: `STRIKE ${STRIKE_WORD_MAP[nextStrikes]}!`,
        bad: true,
        end: lose,
      });
      updateDrawAttempts("DREW_STRIKE");
      const discardStrikes = await snapshot.getPromise(
        optionState("discardStrikes")
      );
      let nextPhase = "insert";
      if (discardStrikes) {
        nextPhase = "draw";
        await discardToken(index);
      }
      set(strikesState, (x) => x + 1);
      set(gamePhaseState, lose ? "end" : nextPhase);
    },
    [discardToken, raiseToken, splash, updateDrawAttempts]
  );
};

export const useSelectScreen = () => {
  const updateDrawAttempts = useUpdateDrawAttempts();
  const { raiseToken, discardToken } = useModToken();
  const splash = useDoSplash();
  return useRecoilCallback(
    ({ snapshot, set }) => async (i) => {
      const { index, more } = await snapshot.getPromise(tokenRaisedValue);
      if (index <= 0) {
        set(gamePhaseState, "draw");
        return;
      }
      const tokenDigits = await snapshot.getPromise(tokenDigitsValue);
      const priceDigits = await snapshot.getPromise(priceDigitsValue);

      if (tokenDigits[index] != priceDigits[i]) {
        splash({ text: "MISS!", bad: true });
        updateDrawAttempts("INCORRECT_DIGIT");
        set(gamePhaseState, "wait");
        raiseToken(index, false);
        await sleep(500);
        set(gamePhaseState, "draw");
        return;
      }

      updateDrawAttempts("CORRECT_DIGIT");
      const screenStates = await snapshot.getPromise(numScreensState);
      set(numScreensState, (states) => {
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
      set(gamePhaseState, "wait");
      await discardToken(index);
      set(gamePhaseState, win ? "end" : "draw");
    },
    [discardToken, raiseToken, splash, updateDrawAttempts]
  );
};
