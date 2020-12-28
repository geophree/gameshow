import { html } from "htm/react";

export const Btn = ({ children, ...props }) => html`
  <span class="btn" ...${props}>${children}</span>
`;
