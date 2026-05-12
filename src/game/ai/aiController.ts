import { useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { GameAction, GameState } from "../types";
import { AI_ACTION_DELAY_MS, MAX_AI_ACTIONS_PER_TURN } from "./aiTypes";
import type { AITurnMemory } from "./aiTypes";
import { getNextAIAction } from "./aiPlanner";
import { isCurrentPlayerAI } from "./aiUtils";

function createMemory(): AITurnMemory {
  return {
    attemptedMoveMonsterIds: [],
    attemptedAttackMonsterIds: [],
    actionCountThisTurn: 0
  };
}

function rememberAttempt(memory: AITurnMemory, state: GameState, action: GameAction): void {
  const selectedMonsterId = state.selectedMonsterId;
  if (action.type === "MOVE_MONSTER" && selectedMonsterId && !memory.attemptedMoveMonsterIds.includes(selectedMonsterId)) {
    memory.attemptedMoveMonsterIds.push(selectedMonsterId);
  }
  if (action.type === "ATTACK_TARGET" && selectedMonsterId && !memory.attemptedAttackMonsterIds.includes(selectedMonsterId)) {
    memory.attemptedAttackMonsterIds.push(selectedMonsterId);
  }
}

export function useAIController(state: GameState, dispatch: Dispatch<GameAction>): boolean {
  const memoryRef = useRef<AITurnMemory>(createMemory());
  const turnKeyRef = useRef(`${state.currentPlayer}:${state.turnNumber}`);
  const turnKey = `${state.currentPlayer}:${state.turnNumber}`;

  if (turnKeyRef.current !== turnKey) {
    turnKeyRef.current = turnKey;
    memoryRef.current = createMemory();
  }

  const isAI = isCurrentPlayerAI(state);

  useEffect(() => {
    if (!isAI || state.phase === "gameOver") return;

    const memory = memoryRef.current;
    const plannedAction: GameAction =
      memory.actionCountThisTurn >= MAX_AI_ACTIONS_PER_TURN ? { type: "END_TURN" } : getNextAIAction(state) ?? { type: "END_TURN" };

    const timer = window.setTimeout(() => {
      memory.actionCountThisTurn += 1;
      rememberAttempt(memory, state, plannedAction);
      dispatch(plannedAction);
    }, AI_ACTION_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [dispatch, isAI, state]);

  return isAI;
}
