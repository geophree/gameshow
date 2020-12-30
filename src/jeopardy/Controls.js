import { html } from "htm/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { Btn } from "./Btn.js";

import {
  endGameState,
  gameStageState,
  revealOrderValue,
  revealStageState,
  runningRevealState,
  selectedClueState,
  selectedClueDataValue,
  selectedTeamState,
  showingPopupState,
  teamListState,
  teamResponseState,
  teamScoreState,
  teamWagerState,
  validGameStages,
} from "./state.js";
import { useFinishSelectedClue } from "./hooks.js";

const useUnselectTeam = () => {
  const setSelectedTeam = useSetRecoilState(selectedTeamState);
  return () => setSelectedTeam(null);
};

const useSelectedClueValue = () => {
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  return selectedClueData?.value ?? 0;
};

const useSelectedClueIsDailyDouble = () => {
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  return !!selectedClueData?.dailyDouble;
};

const SelectedClueSection = () => {
  const clueData = useRecoilValue(selectedClueDataValue);
  const finishSelectedClue = useFinishSelectedClue();

  if (!clueData) return null;
  const { clue, prompt, response, value, dailyDouble } = clueData;

  const promptSection = !prompt
    ? null
    : html`
        <dt key="pdt">MC Prompt:</dt>
        <dd key="pdd" style=${{ fontSize: "110%" }}>${prompt}</dd>
      `;
  const clueStyle = prompt ? {} : { fontSize: "110%" };
  const clueSection = !clue
    ? null
    : html`
        <dt key="cdt">Clue:</dt>
        <dd key="cdd" style=${clueStyle}>${clue}</dd>
      `;

  return html`
    ${promptSection} ${clueSection}
    <dt>Response:</dt>
    <dd>${response}</dd>
    <dt>Value: $${value}</dt>
    <dt>Daily Double? ${dailyDouble ? "Yes" : "No"}</dt>
  `;
};

const SelectTeamBtn = ({ name }) => {
  const setSelectedTeam = useSetRecoilState(selectedTeamState);
  const setWager = useSetRecoilState(teamWagerState(name));
  const selectTeam = () => {
    setSelectedTeam(name);
    setWager();
  };
  return html`<${Btn} onClick=${selectTeam}>${name}<//>`;
};

const TeamSelectionSection = () => {
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  const teamList = useRecoilValue(teamListState);
  const selectedTeam = useRecoilValue(selectedTeamState);
  const unselectTeam = useUnselectTeam();
  const finishSelectedClue = useFinishSelectedClue();

  if (!selectedClueData) return null;

  let teamOrList = null;
  if (selectedTeam) {
    teamOrList = html`<dd>${selectedTeam}</dd>`;
  } else {
    teamOrList = teamList.map((name) => {
      const selectTeam = (name) => {
        set;
      };
      return html`
        <dd key=${name}>
          <${SelectTeamBtn} name=${name} />
        </dd>
      `;
    });
    teamOrList.push(html`
      <dd key="None">
        <${Btn} onClick=${finishSelectedClue}>Timed out<//>
      </dd>
    `);
  }
  const unselectTeamButton = html` <${Btn} onClick="${unselectTeam}"
    >change<//
  >`;
  return html`
    <dt>Team answering${selectedTeam ? unselectTeamButton : ""}:</dt>
    ${teamOrList}
  `;
};

const useWager = () => {
  const isDailyDouble = useSelectedClueIsDailyDouble();
  const selectedTeam = useRecoilValue(selectedTeamState);
  const selectedTeamWager = useRecoilValue(teamWagerState(selectedTeam));
  const value = useSelectedClueValue();
  const gameStage = useRecoilValue(gameStageState);

  if (!isDailyDouble && gameStage !== "finalJeopardy") return value;

  return selectedTeamWager;
};

const WagerControls = () => {
  const isDailyDouble = useSelectedClueIsDailyDouble();
  const value = useSelectedClueValue();
  const selectedTeam = useRecoilValue(selectedTeamState);
  const score = useRecoilValue(teamScoreState(selectedTeam));
  const setSelectedTeamWager = useSetRecoilState(teamWagerState(selectedTeam));
  const wager = useWager();

  if (!selectedTeam || !isDailyDouble) return null;

  const maxWager = Math.max(score, value);
  const promptWager = () => {
    let error = "";
    let wagerInt;
    while (true) {
      const w = prompt(
        `${error}Enter ${selectedTeam}'s wager (5-${maxWager}):`,
        ""
      );
      if (w == null) break;
      try {
        wagerInt = parseInt(w.replace(/[^0-9]/g, ""), 10);
        if (wagerInt < 5 || wagerInt > maxWager) {
          error = `Error: wager (${wagerInt}) out of range.\n`;
          continue;
        }
      } catch {
        error = "Error: problem setting team's wager. Only use numbers.\n";
        continue;
      }
      setSelectedTeamWager(wagerInt);
      break;
    }
  };

  const changeWager = !wager
    ? null
    : html` <${Btn} onClick=${promptWager}>change<//>`;
  const makeOrSetWager = wager
    ? `$${wager}`
    : html` <${Btn} onClick=${promptWager}>set wager<//>`;
  return html`
    <dt>Wager${changeWager}</dt>
    <dd>${makeOrSetWager}</dd>
  `;
};

const AnswerControls = () => {
  const selectedTeam = useRecoilValue(selectedTeamState);
  const isDailyDouble = useSelectedClueIsDailyDouble();
  const wager = useWager();
  const unselectTeam = useUnselectTeam();
  const setScore = useSetRecoilState(teamScoreState(selectedTeam));
  const finishSelectedClue = useFinishSelectedClue();
  const isFinalJeopardy = useRecoilValue(gameStageState) == "finalJeopardy";

  if (!selectedTeam || (isDailyDouble && !wager)) return null;

  return html`
    <dt>Correct?</dt>
    <dd>
      <${Btn}
        onClick=${() => {
          setScore((x) => x + wager);
          if (!isFinalJeopardy) unselectTeam();
          finishSelectedClue();
        }}
      >
        Yes, +$${wager}
      <//>
    </dd>
    <dd>
      <${Btn}
        onClick=${() => {
          setScore((x) => x - wager);
          if (!isFinalJeopardy) unselectTeam();
          if (isDailyDouble) finishSelectedClue();
        }}
      >
        No, -$${wager}
      <//>
    </dd>
  `;
};

const ClueControls = () => {
  return html`
    <p>Clue Controls</p>
    <dl>
      <${SelectedClueSection} />
      <${TeamSelectionSection} />
      <${WagerControls} />
      <${AnswerControls} />
    </dl>
  `;
};

const FinalJeopardyTeamControl = ({ name }) => {
  const score = useRecoilValue(teamScoreState(name));
  const [wager, setWager] = useRecoilState(teamWagerState(name));
  const [response, setResponse] = useRecoilState(teamResponseState(name));

  const promptWager = () => {
    let error = "";
    let wagerInt;
    const maxWager = Math.max(0, score);
    while (true) {
      const s = prompt(
        `${error}Enter Team ${name}'s wager: ($0-${maxWager})`,
        ""
      );
      if (s == null || s == "") break;
      try {
        wagerInt = parseInt(s.replace(/[^0-9.-]/g, ""), 10);
        if (wagerInt < 0 || wagerInt > maxWager) {
          error = `Error: wager (${wagerInt}) out of range.\n`;
          continue;
        }
      } catch {
        error = "Error: problem modifying team's wager. Only use numbers.\n";
        continue;
      }
      setWager(wagerInt);
      break;
    }
  };

  const promptResponse = () => {
    const r = prompt(`Enter Team ${name}'s response:`, "");
    if (r == null) return;
    setResponse(r);
  };

  const setResponseBtn = html`<${Btn} onClick=${promptResponse}>Set<//>`;
  const setWagerBtn = html`<${Btn} onClick=${promptWager}>Set<//>`;

  return html`
    <dd>
      ${name}: wager: ${wager} ${setWagerBtn} , response: ${response}
      ${setResponseBtn}
    </dd>
  `;
};

const revealingSteps = {
  0: "starting team reveal",
  1: "revealing team's response",
  2: "reveal team's wager",
  3: "start next team's reveal",
};

const RevealControls = () => {
  const [revealOrder, setRevealOrder] = useState();
  const [revealIndex, setRevealIndex] = useState(-1);

  const originalRevealOrder = useRecoilValue(revealOrderValue);
  const [selectedTeam, setSelectedTeam] = useRecoilState(selectedTeamState);
  const [revealStage, setRevealStage] = useRecoilState(
    revealStageState(selectedTeam)
  );
  const setEndGame = useSetRecoilState(endGameState);
  const setBeginReveal = useSetRecoilState(runningRevealState);

  const nextRevealTeam = revealOrder?.[revealIndex + 1];
  const nextRevealStage = selectedTeam ? revealStage + 1 : 0;

  const revealNextStage = () => {
    if (revealStage === 2 || (!selectedTeam && nextRevealTeam)) {
      setSelectedTeam(nextRevealTeam.name);
      setRevealIndex((x) => x + 1);
      return;
    }
    setRevealStage((x) => x + 1);
  };

  if (!revealOrder) {
    const beginReveal = () => {
      setRevealOrder(originalRevealOrder);
      setBeginReveal(true);
      setSelectedTeam();
    };
    return html`<dd><${Btn} onClick=${beginReveal}>Begin Reveal<//></dd>`;
  }

  let nextBtn = html` <${Btn} onClick=${revealNextStage}>Continue Reveal<//> `;
  if (revealStage === 2 && !nextRevealTeam) {
    const showWinner = () => setEndGame(true);
    nextBtn = html`<${Btn} onClick=${showWinner}>Reveal Winner<//>`;
  }

  return html`
    <dd>Reveal order: ${revealOrder?.map(({ name }) => name)?.join(" ")}</dd>
    <dd>next team to reveal: ${nextRevealTeam?.name}</dd>
    <dd>Current revealing team: ${selectedTeam}</dd>
    <dd>Next revealing step: ${revealingSteps[nextRevealStage]}</dd>
    <dd>${nextBtn}</dd>
  `;
};

const FinalJeopardyControls = () => {
  const teamList = useRecoilValue(teamListState);
  const gameStage = useRecoilValue(gameStageState);

  if (gameStage != "finalJeopardy") return null;

  const teamCtls = teamList.map(
    (name) => html` <${FinalJeopardyTeamControl} name=${name} /> `
  );

  return html`
    <p>Final Jeopardy Controls:</p>
    <dl>
      <dt>Team Controls:</dt>
      ${teamCtls}
      <dt>Reveal Controls:</dt>
      <${RevealControls} />
    </dl>
  `;
};

const SpecificControls = () => html`
  <section class="controls-specific">
    <p style=${{ fontSize: "120%" }}>Specific Controls</p>
    <${ClueControls} />
    <${FinalJeopardyControls} />
  </section>
`;

const ScoreSetControls = () => {
  const teamList = useRecoilValue(teamListState);
  const [changingScore, setChangingScore] = useState();

  const makePromptScore = ({ name, score, setScore }) => () => {
    let error = "";
    let scoreInt;
    while (true) {
      const s = prompt(
        `${error}Enter ${name}'s new score: (currently ${score})`,
        ""
      );
      if (s == null) break;
      try {
        scoreInt = parseInt(s.replace(/[^0-9.-]/g, ""), 10);
      } catch {
        error = "Error: problem setting team's score. Only use numbers.\n";
        continue;
      }
      setScore(scoreInt);
      setChangingScore(false);
      break;
    }
  };

  const teamBtns = teamList.map((name) => {
    const [score, setScore] = useRecoilState(teamScoreState(name));
    const promptScore = makePromptScore({ name, score, setScore });
    return html`
      <p key=${name}><${Btn} onClick=${promptScore}>${name}: $${score}<//></p>
    `;
  });

  const title = "Set";
  if (!changingScore) {
    return html`
      <p><${Btn} onClick=${() => setChangingScore(true)}>${title}<//></p>
    `;
  }

  const cancel = html`
    <${Btn} onClick=${() => setChangingScore(false)}>cancel<//>
  `;

  return html`
    <p key="sstitle">${title} ${cancel}:</p>
    ${teamBtns}
  `;
};

const ScoreChangeControls = () => {
  const teamList = useRecoilValue(teamListState);
  const [changingScore, setChangingScore] = useState();

  const makePromptScore = ({ name, score, setScore }) => () => {
    let error = "";
    let scoreInt;
    while (true) {
      const s = prompt(
        `${error}Enter amount to change ${name}'s score by: (current score ${score})`,
        ""
      );
      if (s == null) break;
      try {
        scoreInt = parseInt(s.replace(/[^0-9.-]/g, ""), 10);
      } catch {
        error = "Error: problem modifying team's score. Only use numbers.\n";
        continue;
      }
      setScore((prev) => prev + scoreInt);
      setChangingScore(false);
      break;
    }
  };

  const teamBtns = teamList.map((name) => {
    const [score, setScore] = useRecoilState(teamScoreState(name));
    const promptScore = makePromptScore({ name, score, setScore });
    return html`
      <p key=${name}><${Btn} onClick=${promptScore}>${name}: $${score}<//></p>
    `;
  });

  const title = "Modify";
  if (!changingScore) {
    return html`
      <p><${Btn} onClick=${() => setChangingScore(true)}>${title}<//></p>
    `;
  }

  const cancel = html`
    <${Btn} onClick=${() => setChangingScore(false)}>cancel<//>
  `;

  return html`
    <p key="sctitle">${title} ${cancel}:</p>
    ${teamBtns}
  `;
};

const GameStageControls = () => {
  const [gameStage, setGameStage] = useRecoilState(gameStageState);
  const options = validGameStages.map(
    ({ id, label }) => html` <option key=${id} value=${id}>${label}</option> `
  );
  const selectOnChange = ({ target }) => setGameStage(target.value);
  return html`
    <p>
      Change:${" "}
      <select
        defaultValue=${gameStage}
        onChange=${selectOnChange}
        style=${{
          fontSize: "calc(var(--width) / 100)",
        }}
      >
        ${options}
      </select>
    </p>
  `;
};

const GeneralControls = () => {
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);

  return html`
    <section class="controls-general">
      <p style=${{ fontSize: "120%" }}>General Controls</p>
      <dl>
        <dt>Board-only Window:</dt>
        <dd>
          <${Btn} onClick=${() => setShowingPopup((x) => !x)}>
            ${showingPopup ? "Close" : "Launch"}
          <//>
        </dd>
        <dd>To maximize after launching, with the window focused:</dd>
        <dd>
          Mac: ⌘-Ctrl-F and/or ⌘-Shift-F (you may need to wait a beat for the
          title/address bar to disappear)
        </dd>
        <dd>Linux/Windows: F11</dd>
        <dt>Game Stage:</dt>
        <dd>
          <${GameStageControls} />
        </dd>
        <dt>Team's Score:</dt>
        <dd>
          <${ScoreSetControls} />
          <${ScoreChangeControls} />
        </dd>
      </dl>
    </section>
  `;
};

export const Controls = () => {
  return html`
    <section class="aspect-ratio controls">
      <${GeneralControls} />
      <${SpecificControls} />
    </div>
  `;
};
