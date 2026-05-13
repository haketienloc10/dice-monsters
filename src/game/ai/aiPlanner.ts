import { monsters } from "../data/monsters";
import { calculateMonsterDamage, calculatePowerChargeMonsterDamage } from "../rules/combat";
import type { AttackTarget, GameState } from "../types";
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

type PowerChargeAttack = {
  attackerId: string;
  target: Extract<AttackTarget, { type: "monster" }>;
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

function findPowerChargeAttack(state: GameState): PowerChargeAttack | undefined {
  const playerId = state.currentPlayer;
  if (
    state.phase !== "action" ||
    state.players[playerId].crestPool.magic <= 0 ||
    state.players[playerId].crestPool.attack <= 0
  ) {
    return undefined;
  }

  const candidates: PowerChargeAttack[] = [];

  for (const attacker of Object.values(state.monsters).filter(
    (monster) => monster.owner === playerId && !monster.hasActedAttack && !monster.powerChargeActive
  )) {
    const attackerDefinition = monsters[attacker.definitionId];
    for (const target of getLegalAttackOptions(state, attacker.instanceId)) {
      if (target.type !== "monster") continue;
      const defender = state.monsters[target.monsterId];
      if (!defender) continue;
      const defenderDefinition = monsters[defender.definitionId];
      const normalDamage = calculateMonsterDamage(attackerDefinition.atk, defenderDefinition.def);
      const chargedDamage = calculatePowerChargeMonsterDamage(attackerDefinition.atk, defenderDefinition.def);
      if (normalDamage >= defender.hp || chargedDamage < defender.hp) continue;
      candidates.push({
        attackerId: attacker.instanceId,
        target,
        score: 6000 + defenderDefinition.level * 100 + defenderDefinition.atk * 10
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score || a.attackerId.localeCompare(b.attackerId))[0];
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
  const powerChargeAttack = bestAttack?.target.type === "core" ? undefined : findPowerChargeAttack(state);
  if (powerChargeAttack) {
    if (state.selectedMonsterId !== powerChargeAttack.attackerId) {
      return { type: "SELECT_MONSTER", monsterId: powerChargeAttack.attackerId };
    }
    if (!state.monsters[powerChargeAttack.attackerId]?.powerChargeActive) {
      return { type: "USE_POWER_CHARGE", monsterId: powerChargeAttack.attackerId };
    }
    if (state.interactionMode !== "attacking") {
      return { type: "ENTER_ATTACK_MODE" };
    }
    return { type: "ATTACK_TARGET", target: powerChargeAttack.target };
  }

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
