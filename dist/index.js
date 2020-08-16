import __SNOWPACK_ENV__ from './snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import { html } from "./web_modules/htm/react.js";
import { StrictMode } from "./web_modules/react.js";
import ReactDOM from "./web_modules/react-dom.js";
import { RecoilRoot } from "./web_modules/recoil.js";
import { CssBaseline } from "./web_modules/@material-ui/core.js";

import { App } from "./App.js";

ReactDOM.render(
  html`<${StrictMode}
    ><${RecoilRoot}><${CssBaseline} /><${App} /><//
  ><//>`,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
