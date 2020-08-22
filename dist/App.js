import { html } from "./web_modules/htm/react.js";
import { RecoilRoot, useRecoilState } from "./web_modules/recoil.js";
import { Button } from "./web_modules/@material-ui/core.js";

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
        <!-- <${Button}
          style=${{ position: "absolute", top: 0, left: 0 }}
          onClick=${unselectGame}
          >Back<//
        > -->
      <//>
    `;
  }
  return html`<${GameList} />`;
};
