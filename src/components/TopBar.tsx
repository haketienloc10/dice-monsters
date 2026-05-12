import type { GameState } from "../game/types";
import { CREST_ICONS } from "../game/constants";

type Props = {
  state: GameState;
};

const phaseLabel: Record<GameState["phase"], string> = {
  roll: "Roll Phase",
  summon: "Summon Phase",
  action: "Action Phase",
  gameOver: "Game Over"
};

export function TopBar({ state }: Props) {
  const p1 = state.players.P1;
  const p2 = state.players.P2;
  const currentIsAI = state.settings.controls[state.currentPlayer] === "ai";
  const p1Active = state.currentPlayer === "P1";
  const p2Active = state.currentPlayer === "P2";
  const latestFaces = state.latestRoll.slice(0, 3);

  return (
    <header className="top-bar">
      <div className={p1Active ? "top-player top-player--p1 top-player--active" : "top-player top-player--p1"}>
        <span className="player-emblem" aria-hidden="true">◆</span>
        <div className="top-player__copy">
          <span className="player-crest">Player 1</span>
          <strong>{p1.name}</strong>
        </div>
        <span className="core-readout"><small>HP</small>{p1.coreHp}</span>
      </div>
      <div className="turn-display">
        <span>Turn {state.turnNumber}</span>
        <strong>{state.winner ? `${state.winner} Wins` : phaseLabel[state.phase]}</strong>
        <span>Current: {state.players[state.currentPlayer].name}</span>
        <div className="top-dice-strip" aria-label="Latest dice results">
          {latestFaces.length === 0 ? (
            <>
              <span className="top-die top-die--empty">◇</span>
              <span className="top-die top-die--empty">◇</span>
              <span className="top-die top-die--empty">◇</span>
            </>
          ) : (
            latestFaces.map((result, index) => (
              <span className="top-die" title={`${result.diceName}: ${result.face.crest}`} key={`${result.diceId}-${index}`}>
                {CREST_ICONS[result.face.crest]}
              </span>
            ))
          )}
        </div>
        {currentIsAI && state.phase !== "gameOver" && <span className="ai-thinking">AI is thinking...</span>}
      </div>
      <div className={p2Active ? "top-player top-player--p2 top-player--active" : "top-player top-player--p2"}>
        <span className="core-readout"><small>HP</small>{p2.coreHp}</span>
        <div className="top-player__copy">
          <span className="player-crest">Player 2 {state.settings.controls.P2 === "ai" ? "[AI]" : ""}</span>
          <strong>{p2.name}{state.settings.controls.P2 === "ai" ? " [AI]" : ""}</strong>
        </div>
        <span className="player-emblem" aria-hidden="true">▲</span>
      </div>
    </header>
  );
}
