import { html } from "htm/react";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import "./style.css";
import gyparodyFontUrl from "./fonts/gyparody.woff2";
import OptiKorinnaFontUrl from "./fonts/OPTIKorinna-Agency.woff2";
import OptiTopicFontUrl from "./fonts/OPTITopic-Bold.woff2";
import testConfigUrl from "./testConfig.json";

const FONT_INFO = `
  @font-face {
    font-family: "Gyparody";
    src: url("${gyparodyFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTIKorinna-Agency";
    src: url("${OptiKorinnaFontUrl}") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: "OPTITopic-Bold";
    src: url("${OptiTopicFontUrl}") format("woff2");
    font-weight: bold;
    font-style: normal;
    font-display: block;
  }
`;

const configState = atom({
  key: "config",
  default: selector({
    key: "configDefault",
    // Switch this to be able to fetch an arbitrary json file
    get: () => testConfigUrl, // async () => (await fetch(testConfigUrl)).json(),
  }),
});

const baseClueValueState = atom({
  key: "baseClueValue",
  default: selector({
    key: "baseClueValueDefault",
    get: ({ get }) => get(configState).baseClueValue,
  }),
});

const gameStageState = atom({
  key: "gameStage",
  default: "jeopardy",
});

const stageInfoState = atom({
  key: "stageInfo",
  default: selector({
    key: "stageInfoDefault",
    get: ({ get }) => get(configState)[get(gameStageState)],
  }),
});

const boardDataState = atom({
  key: "boardData",
  default: selector({
    key: "boardDataDefault",
    get: ({ get }) => get(stageInfoState).board,
  }),
});

const categoryCountValue = selector({
  key: "categoryCount",
  get: ({ get }) => get(boardDataState).length,
});

const cluesPerCategoryValue = selector({
  key: "cluesPerCategory",
  get: ({ get }) => get(boardDataState)[0].clues.length,
});

const categoriesState = atomFamily({
  key: "categories",
  default: selectorFamily({
    key: "categoriesDefault",
    get: (col) => ({ get }) => get(boardDataState)[col].category,
  }),
});

const clueInfoState = atomFamily({
  key: "clueInfo",
  default: selectorFamily({
    key: "clueInfoDefault",
    get: ([col, row]) => ({ get }) => get(boardDataState)[col].clues[row - 1],
  }),
});

const clueStatusState = atomFamily({
  key: "clueStatus",
  default: ([col, row]) => ({
    flipped: false,
    used: false,
  }),
});

const selectedClueState = atom({ key: "selectedClue" });

export const Jeopardy = () => {
  // TODO(geophree): prevent clicking while fullscreening or flipping
  const cluesPerCategory = useRecoilValue(cluesPerCategoryValue);
  const categoryCount = useRecoilValue(categoryCountValue);
  const baseClueValue = useRecoilValue(baseClueValueState);
  const [selectedClue, setSelectedClue] = useRecoilState(selectedClueState);

  const categories = [];
  const clues = [];
  for (let col = 0; col < categoryCount; col++) {
    const category = useRecoilValue(categoriesState(col));
    categories.push(html`
      <div
        key=${col}
        class="aspect-ratio little-screen category"
        style=${{ "--col": col, "--row": 0 }}
      >
        <div class="limiter blue-background">
          <p>${category}</p>
        </div>
      </div>
    `);
    for (let row = 1; row <= cluesPerCategory; row++) {
      const { clue, dailyDouble } = useRecoilValue(clueInfoState([col, row]));
      const [{ flipped, used }, setClueInfo] = useRecoilState(
        clueStatusState([col, row])
      );
      let selected = false;
      let doClick = () => {};
      let before;
      let inner;
      if (!used) {
        if (selectedClue) {
          selected = selectedClue.col == col && selectedClue.row == row;
        } else {
          doClick = () => setSelectedClue({ col, row });
        }
        if (selected) {
          doClick = () => {
            setClueInfo((info) => ({ ...info, used: true }));
            setSelectedClue();
          };
        }
        const value = baseClueValue * row;
        const showPrice = !selected;
        const showClue = selected;
        let clueSection = html`
          <div class="prompt blue-background${showClue ? "" : " hidden"}">
            <p>${clue}</p>
          </div>
        `;
        if (dailyDouble) {
          if (selected && !flipped) {
            doClick = () => {};
          }
          const dd = html`
            <div class="daily double${selected ? "" : " hidden"}">
              <p>DAI<span class="daily-ly">LY</span><br />DOUBLE</p>
            </div>
          `;
          before = html`
            <div class="aspect-ratio little-screen">
              <div class="limiter${used ? " blue-background" : ""}">${dd}</div>
            </div>
          `;
          const doFlip = () =>
            setClueInfo((info) => ({ ...info, flipped: true }));
          clueSection = html`
            <div class="vertical-flip">
              <div
                class="horizontal-flip blue-background${flipped
                  ? " flipped"
                  : ""}"
                onClick=${doFlip}
              >
                ${dd} ${clueSection}
              </div>
            </div>
          `;
        }
        inner = html`
          ${clueSection}
          <div class="value blue-background${showPrice ? "" : " hidden"}">
            <p class=${value >= 1000 && "value-1000"}>
              <span class="dollar">$</span>${value}
            </p>
          </div>
        `;
      }
      clues.push(html`
        <div
          key=${col * cluesPerCategory + row - 1}
          style=${{ "--col": col, "--row": row }}
        >
          ${before}
          <div
            class="aspect-ratio little-screen${selected ? " fullscreen" : ""}"
            onClick=${doClick}
          >
            <div class="limiter${used ? " blue-background" : ""}">${inner}</div>
          </div>
        </div>
      `);
    }
  }

  return html`
    <div class="jeopardy">
      <style>
        ${FONT_INFO}
      </style>
      <div class="splash-screen aspect-ratio blue-background">
        <p class="title"><span class="double">DOUBLE</span>JEOPARDY!</p>
      </div>
      <div class="clues aspect-ratio">${clues}</div>
      <div class="categories">${categories}</div>
    </div>
  `;
};
