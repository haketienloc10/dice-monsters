import type { GameState, PlayerId } from "../types";
import { getOpponent } from "./board";

export function startTurn(state: GameState, playerId: PlayerId): GameState {
  const nextMonsters = Object.fromEntries(
    Object.entries(state.monsters).map(([id, monster]) => [
      id,
      monster.owner === playerId ? { ...monster, hasActedAttack: false } : { ...monster }
    ])
  );

  return {
    ...state,
    currentPlayer: playerId,
    phase: state.winner ? "gameOver" : "roll",
    selectedMonsterId: undefined,
    selectedSummonDiceId: undefined,
    placementRotation: 0,
    latestRoll: [],
    summonCandidates: [],
    interactionMode: "none",
    highlightedCells: [],
    validAttackTargets: [],
    monsters: nextMonsters
  };
}

export function endTurn(state: GameState): GameState {
  const nextPlayer = getOpponent(state.currentPlayer);
  const nextTurnNumber = state.currentPlayer === "P2" ? state.turnNumber + 1 : state.turnNumber;
  return startTurn({ ...state, turnNumber: nextTurnNumber }, nextPlayer);
}
