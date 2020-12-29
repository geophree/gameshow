import { html } from "./web_modules/htm/react.js";
import { Helmet } from "./web_modules/react-helmet.js";
import { RecoilRoot, useRecoilState } from "./web_modules/recoil.js";
import { Button } from "./web_modules/@material-ui/core.js";
import { Link, Redirect, Route, Switch, useRouteMatch } from "./web_modules/react-router-dom.js";

import { ThreeStrikes } from "./threestrikes/index.js";
import { Jeopardy } from "./jeopardy/index.js";

const GAMES = [
  [ThreeStrikes, "3 Strikes", "threestrikes"],
  [Jeopardy, "Jeopardy", "jeopardy"],
].map(([Component, name, subpath]) => ({ Component, name, subpath }));

const GameList = () => {
  const { url } = useRouteMatch();
  const list = GAMES.map(
    ({ name, subpath }) => html`
      <li key=${name}>
        <${Link} to="${url}/${subpath}">${name}<//>
      </li>
    `
  );
  return html`<ul style=${{ listStyleType: "none" }}>
    ${list}
  </ul>`;
};

export const App = () => {
  const path = "/gameshow";
  const gameRoutes = GAMES.map(
    ({ Component, name, subpath }) => html`
      <${Route} key=${subpath} path="${path}/${subpath}">
        <${Helmet}><title>${name}</title><//>
        <${Component} />
      <//>
    `
  );

  return html`
    <${Helmet} key="title"><title>HTML5 Gameshows!</title><//>
    <${Switch} key="switch">
      <${Route} exact path=${path}>
        <${GameList} />
      <//>
      ${gameRoutes}
      <${Route} path="*">
        <${Redirect} to="/gameshow" />
      <//>
    <//>
  `;
};
