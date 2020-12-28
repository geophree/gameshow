import { html } from "htm/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { Btn } from "./Btn.js";

import {
  selectedClueState,
  selectedClueDataValue,
  selectedTeamState,
  showingPopupState,
  teamListState,
  teamScoreState,
  teamWagerState,
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
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  const finishSelectedClue = useFinishSelectedClue();
  const value = useSelectedClueValue();

  if (!selectedClueData) return null;

  const promptSection = !selectedClueData.prompt
    ? null
    : html`
        <dt>MC Prompt:</dt>
        <dd>${selectedClueData.prompt}</dd>
      `;

  return html`
    ${promptSection}
    <dt>Clue:</dt>
    <dd>${selectedClueData.clue}</dd>
    <dt>Response:</dt>
    <dd>${selectedClueData.response}</dd>
    <dt>Value:</dt>
    <dd>$${value}</dd>
    <dt>Daily Double?</dt>
    <dd>${selectedClueData.dailyDouble ? "Yes" : "No"}</dd>
  `;
};

const TeamSelectionSection = () => {
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  const teamList = useRecoilValue(teamListState);
  const [selectedTeam, setSelectedTeam] = useRecoilState(selectedTeamState);
  const unselectTeam = useUnselectTeam();
  const finishSelectedClue = useFinishSelectedClue();

  if (!selectedClueData) return null;

  let teamOrList = null;
  if (selectedTeam) {
    teamOrList = html`<dd>${selectedTeam}</dd>`;
  } else {
    teamOrList = teamList.map((name) => {
      return html`
        <dd key=${name}>
          <${Btn} onClick=${() => setSelectedTeam(name)}>${name}<//>
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

  if (!isDailyDouble) return value;

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

  if (!selectedTeam || (isDailyDouble && !wager)) return null;

  return html`
    <dt>Correct?</dt>
    <dd>
      <${Btn}
        onClick=${() => {
          setScore((x) => x + wager);
          unselectTeam();
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
          unselectTeam();
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
    <dl>
      <${SelectedClueSection} />
      <${TeamSelectionSection} />
      <${WagerControls} />
      <${AnswerControls} />
    </dl>
  `;
};

const SpecificControls = () => html`
  <div
    style=${{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: "50%",
      left: "50%",
      padding: "calc(var(--width) / 100)",
    }}
  >
    <p style=${{ fontSize: "120%" }}>Specific Controls</p>
    <${ClueControls} />
  </div>
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
      <p><${Btn} key=${name} onClick=${promptScore}>${name}: $${score}<//></p>
    `;
  });
  const cancel = html`
    <${Btn} onClick=${() => setChangingScore(false)}>cancel<//>
  `;
  const title = "Set Team's Score";
  if (!changingScore) {
    return html`
      <p><${Btn} onClick=${() => setChangingScore(true)}>${title}<//></p>
    `;
  }

  return html`
    <p>${title} ${cancel}:</p>
    <p>${teamBtns}</p>
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
      <p><${Btn} key=${name} onClick=${promptScore}>${name}: $${score}<//></p>
    `;
  });
  const cancel = html`
    <${Btn} onClick=${() => setChangingScore(false)}>cancel<//>
  `;

  const title = "Modify Team's Score";
  if (!changingScore) {
    return html`
      <p><${Btn} onClick=${() => setChangingScore(true)}>${title}<//></p>
    `;
  }

  return html`
    <p>${title} ${cancel}:</p>
    <p>${teamBtns}</p>
  `;
};

const GeneralControls = () => {
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);

  return html`
    <div class="bottom-half" style=${{ padding: "calc(var(--width) / 100)" }}>
      <p style=${{ fontSize: "120%" }}>General Controls</p>
      <div>
        <${Btn} onClick=${() => setShowingPopup((x) => !x)}>
          ${showingPopup ? "Close" : "Launch"} board-only window
        <//>
        <${ScoreSetControls} />
        <${ScoreChangeControls} />
      </div>
    </div>
  `;
};

export const Controls = () => {
  return html`
    <div
      class="aspect-ratio"
      style=${{
        color: "white",
        textAlign: "left",
        fontSize: "calc(var(--width) / 100)",
      }}
    >
      <${GeneralControls} />
      <${SpecificControls} />
    </div>
  `;
};