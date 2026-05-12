import type { GameState } from "../game/types";

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

  return (
    <header className="top-bar">
      <div className="top-player top-player--p1">
        <strong>{p1.name}</strong>
        <span>Core HP: {p1.coreHp}</span>
      </div>
      <div className="turn-display">
        <span>Turn {state.turnNumber}</span>
        <strong>{state.winner ? `${state.winner} Wins` : phaseLabel[state.phase]}</strong>
        <span>Current: {state.players[state.currentPlayer].name}</span>
        {currentIsAI && state.phase !== "gameOver" && <span className="ai-thinking">AI is thinking...</span>}
      </div>
      <div className="top-player top-player--p2">
        <strong>{p2.name} [AI]</strong>
        <span>Core HP: {p2.coreHp}</span>
      </div>
    </header>
  );
}
