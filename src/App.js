import { html } from "htm/react";
import { RecoilRoot, useRecoilState } from "recoil";
import { Button } from "@material-ui/core";

import { GameList } from "./GameList.js";
import selectedGame from "./selectedGame.js";
import { ThreeStrikes } from "./threestrikes/index.js";

export const App = () => {
  // TOOD(geophree): change to const
  let [SelectedGame, setSelectedGame] = useRecoilState(selectedGame);
  SelectedGame = ThreeStrikes;

  if (SelectedGame) {
    let unselectGame = () => setSelectedGame(undefined);
    return html`
      <${RecoilRoot}>
        <${SelectedGame} />
        <${Button}
          style=${{ position: "absolute", top: 0, left: 0 }}
          onClick=${unselectGame}
          >Back<//
        >
      <//>
    `;
  }
  return html`<${GameList} />`;
};
