import type { GameState } from "../types";
import type { AIPlannedAction } from "./aiTypes";
import { scoreAttackTarget, scoreMoveOption, scorePlacementOption, scoreSummonCandidate } from "./aiScoring";
import {
  getLegalAttackOptions,
  getLegalMoveOptions,
  getLegalPlacementOptions,
  getLegalSummonCandidates,
  getMovableMonsters
} from "./aiUtils";

type BestAttack = {
  attackerId: string;
  target: ReturnType<typeof getLegalAttackOptions>[number];
  score: number;
};

type BestMove = {
  monsterId: string;
  x: number;
  y: number;
  score: number;
};

function findBestAttack(state: GameState): BestAttack | undefined {
  const playerId = state.currentPlayer;
  return Object.values(state.monsters)
    .filter((monster) => monster.owner === playerId)
    .flatMap((monster) =>
      getLegalAttackOptions(state, monster.instanceId).map((target) => ({
        attackerId: monster.instanceId,
        target,
        score: scoreAttackTarget(state, monster.instanceId, target)
      }))
    )
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.attackerId.localeCompare(b.attackerId))[0];
}

function findBestMove(state: GameState): BestMove | undefined {
  return getMovableMonsters(state, state.currentPlayer)
    .flatMap((monsterId) =>
      getLegalMoveOptions(state, monsterId).map((option) => ({
        monsterId,
        x: option.x,
        y: option.y,
        score: scoreMoveOption(state, monsterId, option)
      }))
    )
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.monsterId.localeCompare(b.monsterId))[0];
}

function getSummonPhaseAIAction(state: GameState): AIPlannedAction {
  if (!state.selectedSummonDiceId) {
    const bestDiceId = getLegalSummonCandidates(state, state.currentPlayer)
      .map((diceId) => ({ diceId, score: scoreSummonCandidate(state, diceId) }))
      .filter((candidate) => candidate.score > Number.NEGATIVE_INFINITY)
      .sort((a, b) => b.score - a.score || a.diceId.localeCompare(b.diceId))[0]?.diceId;

    return bestDiceId ? { type: "SELECT_SUMMON_CANDIDATE", diceId: bestDiceId } : { type: "SKIP_SUMMON" };
  }

  const bestPlacement = getLegalPlacementOptions(state, state.currentPlayer, state.selectedSummonDiceId)
    .map((option) => ({
      ...option,
      score: scorePlacementOption(state, state.currentPlayer, state.selectedSummonDiceId!, option)
    }))
    .sort((a, b) => b.score - a.score || a.x - b.x || a.y - b.y || a.rotation - b.rotation)[0];

  return bestPlacement
    ? { type: "PLACE_DUNGEON_SHAPE", x: bestPlacement.x, y: bestPlacement.y, rotation: bestPlacement.rotation }
    : { type: "SKIP_SUMMON" };
}

function getActionPhaseAIAction(state: GameState): AIPlannedAction {
  const bestAttack = findBestAttack(state);
  if (bestAttack) {
    if (state.selectedMonsterId !== bestAttack.attackerId) {
      return { type: "SELECT_MONSTER", monsterId: bestAttack.attackerId };
    }
    if (state.interactionMode !== "attacking") {
      return { type: "ENTER_ATTACK_MODE" };
    }
    return { type: "ATTACK_TARGET", target: bestAttack.target };
  }

  const bestMove = findBestMove(state);
  if (bestMove) {
    if (state.selectedMonsterId !== bestMove.monsterId) {
      return { type: "SELECT_MONSTER", monsterId: bestMove.monsterId };
    }
    if (state.interactionMode !== "moving") {
      return { type: "ENTER_MOVE_MODE" };
    }
    return { type: "MOVE_MONSTER", x: bestMove.x, y: bestMove.y };
  }

  return { type: "END_TURN" };
}

export function getNextAIAction(state: GameState): AIPlannedAction | null {
  if (state.settings.controls[state.currentPlayer] !== "ai" || state.phase === "gameOver") return null;
  if (state.phase === "roll") return { type: "ROLL_DICE" };
  if (state.phase === "summon") return getSummonPhaseAIAction(state);
  return getActionPhaseAIAction(state);
}
