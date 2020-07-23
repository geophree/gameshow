import { html } from "htm/react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App.js";

ReactDOM.render(
  html`<${RecoilRoot}><${App} /><//>`,
  document.getElementById("root")
);
