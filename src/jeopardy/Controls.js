import { html } from "htm/react";

export const Controls = () => {
  return html`
    <div class="aspect-ratio">
      <div
        class="bottom-half"
        style=${{ border: "1px solid white", color: "white" }}
      >
        Controls
      </div>
    </div>
  `;
};
