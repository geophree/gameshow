import { atom, selector } from "recoil";

export const buttonPhaseState = atom({
  key: "buttonPhase",
  default: "start",
});
export const priceState = atom({
  key: "price",
  default: 15672,
});
export const numScreensState = atom({
  key: "ThreeStrikesNumScreens",
  default: ["1", "2", "3", "4", "5"],
});
export const shownTokensState = atom({
  key: "ThreeStrikesShownTokens",
  default: [],
});
export const tokensShownState = atom({
  key: "ThreeStrikesTokensShown",
  default: [],
});
export const tokensRemainingState = atom({
  key: "ThreeStrikesTokensRemaining",
  default: [],
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
