import { html } from "htm/react";
import { useRecoilState } from "recoil";
import { Button } from "@material-ui/core";

import { GameList } from "./GameList.js";
import selectedGame from "./selectedGame.js";
import { ThreeStrikes } from "./threestrikes/index.js";

export const App = () => {
  const [SelectedGame, setSelectedGame] = useRecoilState(selectedGame);

  return html`<${ThreeStrikes} />`;
  if (SelectedGame) {
    let unselectGame = () => setSelectedGame(undefined);
    return html` <${SelectedGame} />
      <${Button}
        style=${{ position: "absolute", top: 0, left: 0 }}
        onClick=${unselectGame}
        >Back<//
      >`;
  }
  return html`<${GameList} />`;
};
