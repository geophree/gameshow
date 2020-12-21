import { atom, atomFamily, selector, selectorFamily } from "recoil";

import localTestConfig from "./testConfig.json";

export const configState = atom({
  key: "config",
  default: selector({
    key: "configDefault",
    // Switch this to be able to fetch an arbitrary json file
    get: /* async () => (await fetch("jsonurl")).json(), //*/ () =>
      localTestConfig,
  }),
});

export const baseClueValueState = atom({
  key: "baseClueValue",
  default: selector({
    key: "baseClueValueDefault",
    get: ({ get }) => get(configState).baseClueValue,
  }),
});

export const gameStageState = atom({
  key: "gameStage",
  default: "jeopardy",
});

export const stageInfoState = atom({
  key: "stageInfo",
  default: selector({
    key: "stageInfoDefault",
    get: ({ get }) => get(configState)[get(gameStageState)],
  }),
});

export const boardDataState = atom({
  key: "boardData",
  default: selector({
    key: "boardDataDefault",
    get: ({ get }) => get(stageInfoState).board,
  }),
});

export const categoryCountValue = selector({
  key: "categoryCount",
  get: ({ get }) => get(boardDataState).length,
});

export const cluesPerCategoryValue = selector({
  key: "cluesPerCategory",
  get: ({ get }) => get(boardDataState)[0].clues.length,
});

export const categoriesState = atomFamily({
  key: "categories",
  default: selectorFamily({
    key: "categoriesDefault",
    get: (col) => ({ get }) => get(boardDataState)[col].category,
  }),
});

export const clueInfoState = atomFamily({
  key: "clueInfo",
  default: selectorFamily({
    key: "clueInfoDefault",
    get: ([col, row]) => ({ get }) => get(boardDataState)[col].clues[row - 1],
  }),
});

export const clueStatusState = atomFamily({
  key: "clueStatus",
  default: ([col, row]) => ({
    flipped: false,
    used: false,
  }),
});

export const selectedClueState = atom({ key: "selectedClue" });
