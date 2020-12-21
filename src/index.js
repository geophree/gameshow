import { html } from "htm/react";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "./App.js";

const fallback = html`<div>Loading...</div>`;

ReactDOM.render(
  html`<${StrictMode}
    ><${RecoilRoot}
      ><${Router}
        ><${CssBaseline} /><${Suspense} fallback=${fallback}
          ><${App} /><//><//><//
  ><//>`,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
