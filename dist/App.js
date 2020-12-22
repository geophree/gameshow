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
].map(([Component, name, subdir]) => ({ Component, name, subdir }));

const GameList = () => {
  const { url } = useRouteMatch();
  const list = GAMES.map(
    ({ name, subdir }) => html`
      <li key=${name}>
        <${Link} to="${url}/${subdir}">${name}<//>
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
    ({ Component, name, subdir }) => html`
      <${Route} key=${subdir} path="${path}/${subdir}">
        <${Helmet}><title>${name}</title><//>
        <${Component} />
      <//>
    `
  );

  return html`
    <${Helmet}><title>HTML5 Gameshows!</title><//>
    <${Switch}>
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
