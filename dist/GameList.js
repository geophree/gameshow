import { html } from "./web_modules/htm/react.js";
import { Button } from "./web_modules/@material-ui/core.js";
import { useRecoilState } from "./web_modules/recoil.js";

import { ThreeStrikes } from "./threestrikes/index.js";
import selectedGame from "./selectedGame.js";

const GAMES = [["3 Strikes", ThreeStrikes]];

export const GameList = () => {
  const [, setSelectedGame] = useRecoilState(selectedGame);
  const list = GAMES.map(([name, game]) => {
    const selectGame = () => setSelectedGame(() => game);
    return html`
      <li key=${name}>
        <${Button} onClick=${selectGame}>${name}<//>
      </li>
    `;
  });
  return html`<ul style=${{ listStyleType: "none" }}>
    ${list}
  </ul>`;
};
