import { Hourglass, RotateCw, ShieldCheck, Snowflake, Sparkles, StepForward, Sword, TimerReset } from "lucide-react";
import { getCell } from "../game/rules/board";
import { diceCatalog } from "../game/data/diceCatalog";
import { monsters } from "../game/data/monsters";
import type { GameAction, GameState } from "../game/types";

type Props = {
  state: GameState;
  dispatch: (action: GameAction, lock?: { reason: "dice" | "summon" | "move" | "attack"; duration: number }) => void;
  disabled?: boolean;
  animationLocked?: boolean;
};

export function ActionPanel({ state, dispatch, disabled = false, animationLocked = false }: Props) {
  const selectedMonster = state.selectedMonsterId ? state.monsters[state.selectedMonsterId] : undefined;
  const selectedMonsterDefinition = selectedMonster ? monsters[selectedMonster.definitionId] : undefined;
  const canMove =
    state.phase === "action" &&
    selectedMonster?.owner === state.currentPlayer &&
    state.players[state.currentPlayer].crestPool.move > 0;
  const canAttack =
    state.phase === "action" &&
    selectedMonster?.owner === state.currentPlayer &&
    !selectedMonster.hasActedAttack &&
    state.players[state.currentPlayer].crestPool.attack > 0;
  const selectedMonsterCell = selectedMonster ? getCell(state.board, selectedMonster) : undefined;
  const canPowerCharge =
    state.phase === "action" &&
    selectedMonsterDefinition?.skillId === "power-charge" &&
    selectedMonster?.owner === state.currentPlayer &&
    selectedMonsterCell?.monsterId === selectedMonster.instanceId &&
    !selectedMonster.powerChargeActive &&
    state.players[state.currentPlayer].crestPool.magic > 0;

  return (
    <section className="panel action-panel" aria-label="Actions">
      <div className="panel-heading">
        <h2>Actions</h2>
        {animationLocked && <span>Resolving...</span>}
      </div>

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
                disabled={disabled || animationLocked}
              >
                <strong>{monster.name}</strong>
                <span>Level {monster.level} · {die.tileShapeId}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="button-stack">
        <button className="action-button action-button--summon" type="button" onClick={() => dispatch({ type: "ROTATE_PLACEMENT" })} disabled={disabled || animationLocked || state.interactionMode !== "placing"}>
          <RotateCw size={16} /> Rotate Shape
        </button>
        <button className="action-button action-button--summon" type="button" onClick={() => dispatch({ type: "SKIP_SUMMON" })} disabled={disabled || animationLocked || state.phase !== "summon"}>
          <Snowflake size={16} /> Skip Summon
        </button>
        <button className="action-button action-button--move" type="button" onClick={() => dispatch({ type: "ENTER_MOVE_MODE" })} disabled={disabled || animationLocked || !canMove}>
          <StepForward size={16} /> Move
        </button>
        <button className="action-button action-button--attack" type="button" onClick={() => dispatch({ type: "ENTER_ATTACK_MODE" })} disabled={disabled || animationLocked || !canAttack}>
          <Sword size={16} /> Attack
        </button>
        <button className="action-button action-button--skill" type="button" onClick={() => selectedMonster && dispatch({ type: "USE_POWER_CHARGE", monsterId: selectedMonster.instanceId })} disabled={disabled || animationLocked || !canPowerCharge}>
          <Sparkles size={16} /> Power Charge <small>1 Magic</small>
        </button>
        <button className="action-button action-button--guard" type="button" disabled>
          <ShieldCheck size={16} /> Guard
        </button>
        <button className="action-button action-button--end" type="button" onClick={() => dispatch({ type: "END_TURN" })} disabled={disabled || (state.phase !== "action" && state.phase !== "summon")}>
          <Hourglass size={16} /> End Turn
        </button>
        <button type="button" className="action-button danger-button" onClick={() => dispatch({ type: "RESET_GAME" })}>
          <TimerReset size={16} /> Reset
        </button>
      </div>
    </section>
  );
}
