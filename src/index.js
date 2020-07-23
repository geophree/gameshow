import { html } from 'htm/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import App from './App.js';

ReactDOM.render(
  html`<${StrictMode}
    ><${RecoilRoot}><${App} /><//
  ><//>`,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
