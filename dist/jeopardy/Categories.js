import { html } from "../web_modules/htm/react.js";
import { useRecoilValue } from "../web_modules/recoil.js";

import { categoryCountValue, categoriesState } from "./state.js";
import { Fonts } from "./Fonts.js";

export const Categories = () => {
  const categoryCount = useRecoilValue(categoryCountValue);

  const categories = [];
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
  }
  return html`<div class="categories">${categories}</div>`;
};
