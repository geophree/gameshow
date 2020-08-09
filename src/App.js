import { html } from "htm/react";
import { useRecoilState } from "recoil";
import { Button } from "@material-ui/core";

import { GameList } from "./GameList.js";
import selectedGame from "./selectedGame.js";

export const App = () => {
  const [SelectedGame, setSelectedGame] = useRecoilState(selectedGame);

  if (SelectedGame) {
    return html`<${Button} onClick=${() => setSelectedGame(undefined)}>Back<//
      ><${SelectedGame} />`;
  }
  return html`<${GameList} />`;
};
