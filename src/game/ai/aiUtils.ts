import { diceCatalog } from "../data/diceCatalog";
import { getValidAttackTargets } from "../rules/combat";
import { getMovementDistanceMap, getReachableCells } from "../rules/movement";
import { getValidPlacementAnchors, isValidDungeonPlacement } from "../rules/summon";
import type { AttackTarget, GameState, PlayerId } from "../types";
import type { AIMoveOption, AIPlacementOption } from "./aiTypes";

export function isCurrentPlayerAI(state: GameState): boolean {
  return state.settings.controls[state.currentPlayer] === "ai";
}

export function getLegalSummonCandidates(state: GameState, playerId: PlayerId): string[] {
  if (state.currentPlayer !== playerId || state.phase !== "summon") return [];
  return state.summonCandidates.filter((diceId) => diceCatalog.some((die) => die.id === diceId));
}

export function getLegalPlacementOptions(state: GameState, playerId: PlayerId, diceId: string): AIPlacementOption[] {
  const die = diceCatalog.find((candidate) => candidate.id === diceId);
  if (!die || state.currentPlayer !== playerId || state.phase !== "summon") return [];

  const options: AIPlacementOption[] = [];
  for (let rotation = 0; rotation < 4; rotation += 1) {
    for (const anchor of getValidPlacementAnchors(state, playerId, die.tileShapeId, rotation)) {
      if (isValidDungeonPlacement(state, playerId, die.tileShapeId, anchor, rotation)) {
        options.push({ ...anchor, rotation });
      }
    }
  }
  return options;
}

export function getMovableMonsters(state: GameState, playerId: PlayerId): string[] {
  if (state.phase !== "action" || state.players[playerId].crestPool.move <= 0) return [];
  return Object.values(state.monsters)
    .filter((monster) => monster.owner === playerId && getReachableCells(state, monster.instanceId).length > 0)
    .map((monster) => monster.instanceId);
}

export function getLegalMoveOptions(state: GameState, monsterId: string): AIMoveOption[] {
  const monster = state.monsters[monsterId];
  if (!monster || state.phase !== "action" || state.players[monster.owner].crestPool.move <= 0) return [];

  return [...getMovementDistanceMap(state, monsterId).entries()]
    .filter(([, distance]) => distance > 0)
    .map(([key, distance]) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y, distance };
    });
}

export function getLegalAttackOptions(state: GameState, monsterId: string): AttackTarget[] {
  const monster = state.monsters[monsterId];
  if (
    !monster ||
    state.phase !== "action" ||
    monster.owner !== state.currentPlayer ||
    monster.hasActedAttack ||
    state.players[monster.owner].crestPool.attack <= 0
  ) {
    return [];
  }

  return getValidAttackTargets(state, monsterId);
}
