import { atom, selector, DefaultValue } from "recoil";

// random int from 0 to max (inclusive!)
const getRandomInt = (max) => Math.floor(Math.random() * (Math.floor(max) + 1));

export const gamePhaseState = atom({
  key: "gamePhase",
  default: "start",
});

export const priceState = atom({
  key: "price",
  default: selector({
    key: "priceDefault",
    get: () => 10000 + getRandomInt(89999),
  }),
});

export const strikesState = atom({
  key: "strikes",
  default: 0,
});

export const priceDigitsValue = selector({
  key: "priceDigitsValue",
  get: ({ get }) => ("" + get(priceState)).split("").map(Number),
});

export const tokenDigitsValue = selector({
  key: "tokenDigitsValue",
  get: ({ get }) => [
    "X",
    "X",
    "X",
    ...get(priceDigitsValue)
      .slice()
      .sort((a, b) => b - a),
  ],
});

export const numScreensState = atom({
  key: "numScreens",
  default: selector({
    key: "numScreensDefault",
    get: ({ get }) => get(priceDigitsValue).map((_) => false),
  }),
});

export const tokenModsState = atom({
  key: "tokenMods",
  default: selector({
    key: "tokenModsDefault",
    get: ({ get }) =>
      get(tokenDigitsValue).map((_, i) => ({
        raised: false,
        rotated: false,
        discarded: false,
      })),
  }),
});

export const tokensRemainingValue = selector({
  key: "tokensRemaining",
  get: ({ get }) => {
    const length = get(tokenDigitsValue).length;
    const mods = get(tokenModsState);
    const remaining = [];
    for (let i = 0; i < length; i++) {
      const { raised, discarded } = mods[i];
      if (!raised && !discarded) remaining.push(i);
    }
    return remaining;
  },
});

export const tokenRaisedValue = selector({
  key: "tokenRaisedValue",
  get: ({ get }) => {
    const tokenMods = get(tokenModsState);
    let index = -1;
    let more = false;
    for (let i = tokenMods.length - 1; i >= 0; i--) {
      const { raised, discarded } = tokenMods[i];
      if (discarded || !raised) continue;
      if (index != -1) {
        more = true;
        break;
      }
      index = i;
    }
    return { index, more };
  },
});

const resetStates = [
  gamePhaseState,
  numScreensState,
  strikesState,
  tokenModsState,
];

export const resetGameState = selector({
  key: "reset",
  get: () => {},
  set: ({ set }, x) => {
    if (!(x instanceof DefaultValue)) return;
    resetStates.map((s) => set(s, x));
  },
});
