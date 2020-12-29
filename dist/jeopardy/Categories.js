import { html } from "../web_modules/htm/react.js";
import { useRecoilValue } from "../web_modules/recoil.js";

import {
  categoryCountValue,
  categoriesState,
  cluesLeftInCategoryValue,
} from "./state.js";

const Category = ({ col }) => {
  const category = useRecoilValue(categoriesState(col));
  const cluesLeft = useRecoilValue(cluesLeftInCategoryValue(col));
  return html`
    <div
      class="aspect-ratio little-screen category"
      style=${{ "--col": col, "--row": 0 }}
    >
      <div class="limiter blue-background">
        <p>${cluesLeft ? category : ""}</p>
      </div>
    </div>
  `;
};

export const Categories = () => {
  const categoryCount = useRecoilValue(categoryCountValue);

  const categories = [];
  for (let col = 0; col < categoryCount; col++) {
    categories.push(html`<${Category} key=${col} col=${col} />`);
  }
  return html`<div class="categories">${categories}</div>`;
};
