import { html } from "htm/react";
import { useRecoilValue } from "recoil";

import { categoryCountValue, categoriesState } from "./state.js";
import { Fonts } from "./Fonts.js";

const Category = ({ col }) => {
  const category = useRecoilValue(categoriesState(col));
  return html`
    <div
      class="aspect-ratio little-screen category"
      style=${{ "--col": col, "--row": 0 }}
    >
      <div class="limiter blue-background">
        <p>${category}</p>
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
