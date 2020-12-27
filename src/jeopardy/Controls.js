import { html } from "htm/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  selectedClueState,
  selectedClueDataValue,
  selectedTeamState,
  showingPopupState,
  teamListState,
  teamScoreState,
} from "./state.js";
import { useFinishSelectedClue } from "./hooks.js";

export const Controls = () => {
  const setSelectedClue = useSetRecoilState(selectedClueState);
  const [showingPopup, setShowingPopup] = useRecoilState(showingPopupState);
  const selectedClueData = useRecoilValue(selectedClueDataValue);
  const finishSelectedClue = useFinishSelectedClue();

  const value = selectedClueData?.value ?? 0;
  const selectedClueSection = !selectedClueData
    ? null
    : html`
        <dl>
          <dt>Clue:</dt>
          <dd>${selectedClueData.clue}</dd>
          <dt>Response:</dt>
          <dd>${selectedClueData.response}</dd>
          <dt>Value:</dt>
          <dd>$${value}</dd>
        </dl>
      `;

  const teamList = useRecoilValue(teamListState);
  const [selectedTeam, setSelectedTeam] = useRecoilState(selectedTeamState);
  let teamOrList = selectedTeam;
  const innerList = teamList.map((name) => {
    const score = useRecoilValue(teamScoreState(name));
    return html`
      <li
        key=${name}
        style=${{ cursor: "pointer" }}
        onClick=${() => setSelectedTeam(name)}
      >
        ${name}
      </li>
    `;
  });
  innerList.push(html`
    <li key="None" style=${{ cursor: "pointer" }} onClick=${finishSelectedClue}>
      None
    </li>
  `);
  if (!teamOrList) {
    teamOrList = html`
      <ul>
        ${innerList}
      </ul>
    `;
  }
  const responseControls = !selectedClueData
    ? null
    : html`
        <dl>
          <dt>Team answering${selectedTeam ? "" : " (click one)"}:</dt>
          <dd>${teamOrList}</dd>
          <dt></dt>
          <dd></dd>
          <dt></dt>
          <dd></dd>
        </dl>
      `;
  const setScore = useSetRecoilState(teamScoreState(selectedTeam));
  const unselectTeam = () => setSelectedTeam(null);

  const answerControls = !selectedTeam
    ? null
    : html`
        <dl>
          <dt>Correct?</dt>
          <dd>
            <ul>
              <li
                onClick=${() => {
                  setScore((x) => x + value);
                  unselectTeam();
                  finishSelectedClue();
                }}
                style=${{ cursor: "pointer" }}
              >
                Yes (+$${value})
              </li>
              <li
                onClick=${() => {
                  setScore((x) => x - value);
                  unselectTeam();
                }}
                style=${{ cursor: "pointer" }}
              >
                No (-$${value})
              </li>
              <li onClick="${unselectTeam}" style=${{ cursor: "pointer" }}>
                Change Team Selection
              </li>
            </ul>
          </dd>
          <dt></dt>
          <dd></dd>
          <dt></dt>
          <dd></dd>
        </dl>
      `;

  return html`
    <div
      class="aspect-ratio"
      style=${{
        color: "white",
        textAlign: "left",
        fontSize: "calc(var(--width) / 100)",
      }}
    >
      <div class="bottom-half" style=${{ padding: "calc(var(--width) / 100)" }}>
        <p style=${{ fontSize: "120%" }}>General Controls</p>
        <div
          onClick=${() => setShowingPopup((x) => !x)}
          style=${{ cursor: "pointer" }}
        >
          ${showingPopup ? "Close" : "Launch"} board-only window
        </div>
      </div>
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
        ${selectedClueSection} ${responseControls} ${answerControls}
      </div>
    </div>
  `;
};
