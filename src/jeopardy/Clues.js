import { html } from "htm/react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  baseClueValueState,
  categoryCountValue,
  cluesPerCategoryValue,
  clueInfoState,
  clueStatusState,
  selectedClueState,
} from "./state.js";
import { useFinishSelectedClue } from "./hooks.js";

const Clue = ({ col, row }) => {
  const baseClueValue = useRecoilValue(baseClueValueState);
  const [selectedClue, setSelectedClue] = useRecoilState(selectedClueState);
  const finishSelectedClue = useFinishSelectedClue();
  const { clue, imageUrl, dailyDouble } = useRecoilValue(
    clueInfoState([col, row])
  );
  const [{ flipped, used }, setClueStatus] = useRecoilState(
    clueStatusState([col, row])
  );

  let selected = false;
  let doClick = null;
  let before;
  let inner;
  if (!used) {
    if (selectedClue) {
      selected = selectedClue.col == col && selectedClue.row == row;
    } else {
      doClick = () => setSelectedClue({ col, row });
    }
    if (selected) {
      doClick = finishSelectedClue;
    }
    const value = baseClueValue * row;
    const showPrice = !selected;
    const showClue = selected;
    // for image prompts, use "image" class and background-image url()
    // https://drive.google.com/uc?id=0B9o1MNFt5ld1N3k1cm9tVnZxQjg
    // replace after the = with image's drive id
    let imageContent = null;
    let clueContent = null;
    if (imageUrl) {
      const style = { backgroundImage: `url(${imageUrl})` };
      imageContent = html`<div class="image" style=${style} />`;
    } else {
      clueContent = html`<p>${clue}</p>`;
    }

    let clueSection = html`
      <div
        key="simple"
        class="prompt blue-background${showClue ? "" : " hidden"}"
      >
        ${imageContent} ${clueContent}
      </div>
    `;
    if (dailyDouble) {
      if (selected && !flipped) {
        doClick = null;
      }
      const dd = html`
        <div key="dd" class="daily double${selected ? "" : " hidden"}">
          <p>DAI<span class="daily-ly">LY</span><br />DOUBLE</p>
        </div>
      `;
      before = html`
        <div class="aspect-ratio little-screen">
          <div class="limiter${used ? " blue-background" : ""}">${dd}</div>
        </div>
      `;
      const doFlip = () =>
        setClueStatus((info) => ({ ...info, flipped: true }));
      clueSection = html`
        <div key="fullSection" class="vertical-flip">
          <div
            class="horizontal-flip blue-background${flipped ? " flipped" : ""}"
            style=${doFlip ? { cursor: "pointer" } : {}}
            onClick=${doFlip}
          >
            ${dd} ${clueSection}
          </div>
        </div>
      `;
    }
    const valueStr = !value
      ? "CLUE"
      : html` <span class="dollar">$</span>${value} `;

    inner = html`
      ${clueSection}
      <div
        key="value"
        class="value blue-background${showPrice ? "" : " hidden"}"
      >
        <p class=${value >= 1000 && "value-1000"}>${valueStr}</p>
      </div>
    `;
  }

  return html`
    <div style=${{ "--col": col, "--row": row }}>
      ${before}
      <div class="aspect-ratio little-screen${selected ? " fullscreen" : ""}">
        <div
          class="limiter${used ? " blue-background" : ""}"
          style=${doClick ? { cursor: "pointer" } : {}}
          onClick=${doClick}
        >
          ${inner}
        </div>
      </div>
    </div>
  `;
};

export const Clues = () => {
  // TODO(geophree): prevent clicking while fullscreening or flipping
  const cluesPerCategory = useRecoilValue(cluesPerCategoryValue);
  const categoryCount = useRecoilValue(categoryCountValue);

  const clues = [];
  for (let col = 0; col < categoryCount; col++) {
    for (let row = 1; row <= cluesPerCategory; row++) {
      clues.push(
        html`<${Clue}
          key=${col * cluesPerCategory + row - 1}
          ...${{ col, row }}
        />`
      );
    }
  }

  return html`<div class="clues aspect-ratio">${clues}</div>`;
};
