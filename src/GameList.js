import { html } from "htm/react";
import { Button } from "@material-ui/core";
import { useRecoilState } from "recoil";

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
