import { useRecoilCallback } from "../web_modules/recoil.js";

import { clueStatusState, selectedClueState } from "./state.js";

export const useFinishSelectedClue = () =>
  useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const selectedClue = await snapshot.getPromise(selectedClueState);
      if (!selectedClue) return;
      const { col, row } = selectedClue;
      set(clueStatusState([col, row]), (status) => ({ ...status, used: true }));
      set(selectedClueState, null);
    },
    []
  );
