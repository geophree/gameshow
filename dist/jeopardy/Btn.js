import { html } from "../web_modules/htm/react.js";

export const Btn = ({ children, ...props }) => html`
  <span class="btn" ...${props}>${children}</span>
`;
