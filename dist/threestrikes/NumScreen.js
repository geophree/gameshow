import { html } from "../web_modules/htm/react.js";

export const NumScreen = ({ children, onClick }) => html`
  <div class=${"screen" + (onClick ? " clickable" : "")} onClick=${onClick}>
    <div class="numScreen">
      ${children}
    </div>
  </div>
`;
