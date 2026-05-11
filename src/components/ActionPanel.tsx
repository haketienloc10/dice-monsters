import { RotateCw, ShieldCheck, Sparkles, StepForward, Sword, TimerReset } from "lucide-react";
import { diceCatalog } from "../game/data/diceCatalog";
import { monsters } from "../game/data/monsters";
import type { GameAction, GameState } from "../game/types";

type Props = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function ActionPanel({ state, dispatch }: Props) {
  const selectedMonster = state.selectedMonsterId ? state.monsters[state.selectedMonsterId] : undefined;
  const canMove =
    state.phase === "action" &&
    selectedMonster?.owner === state.currentPlayer &&
    state.players[state.currentPlayer].crestPool.move > 0;
  const canAttack =
    state.phase === "action" &&
    selectedMonster?.owner === state.currentPlayer &&
    !selectedMonster.hasActedAttack &&
    state.players[state.currentPlayer].crestPool.attack > 0;

  return (
    <section className="panel action-panel" aria-label="Actions">
      <h2>Actions</h2>

      {state.phase === "summon" && (
        <div className="summon-list">
          {state.summonCandidates.map((diceId) => {
            const die = diceCatalog.find((candidate) => candidate.id === diceId);
            if (!die) return null;
            const monster = monsters[die.monsterId];
            return (
              <button
                type="button"
                className={state.selectedSummonDiceId === diceId ? "choice-button choice-button--active" : "choice-button"}
                key={diceId}
                onClick={() => dispatch({ type: "SELECT_SUMMON_CANDIDATE", diceId })}
              >
                <strong>{monster.name}</strong>
                <span>Level {monster.level} · {die.tileShapeId}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="button-stack">
        <button type="button" onClick={() => dispatch({ type: "ROTATE_PLACEMENT" })} disabled={state.interactionMode !== "placing"}>
          <RotateCw size={16} /> Rotate Shape
        </button>
        <button type="button" onClick={() => dispatch({ type: "SKIP_SUMMON" })} disabled={state.phase !== "summon"}>
          Skip Summon
        </button>
        <button type="button" onClick={() => dispatch({ type: "ENTER_MOVE_MODE" })} disabled={!canMove}>
          <StepForward size={16} /> Move
        </button>
        <button type="button" onClick={() => dispatch({ type: "ENTER_ATTACK_MODE" })} disabled={!canAttack}>
          <Sword size={16} /> Attack
        </button>
        <button type="button" disabled>
          <ShieldCheck size={16} /> Guard
        </button>
        <button type="button" disabled>
          <Sparkles size={16} /> Skill
        </button>
        <button type="button" onClick={() => dispatch({ type: "END_TURN" })} disabled={state.phase !== "action" && state.phase !== "summon"}>
          End Turn
        </button>
        <button type="button" className="danger-button" onClick={() => dispatch({ type: "RESET_GAME" })}>
          <TimerReset size={16} /> Reset
        </button>
      </div>
    </section>
  );
}
