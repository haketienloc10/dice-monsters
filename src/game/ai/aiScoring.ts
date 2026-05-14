import { diceCatalog } from "../data/diceCatalog";
import { monsters } from "../data/monsters";
import { tileShapes } from "../data/tileShapes";
import { calculateCoreDamage, calculateMonsterDamage, calculatePowerChargeMonsterDamage } from "../rules/combat";
import { getCorePosition, getNeighbors, getOpponent, manhattanDistance } from "../rules/board";
import { getShapeCells } from "../rules/summon";
import type { AttackTarget, BoardPosition, GameState, PlayerId } from "../types";
import type { AIMoveOption, AIPlacementOption } from "./aiTypes";
import { getLegalPlacementOptions } from "./aiUtils";

export function manhattan(a: BoardPosition, b: BoardPosition): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function scoreAttackTarget(state: GameState, attackerId: string, target: AttackTarget): number {
  const attacker = state.monsters[attackerId];
  if (!attacker) return 0;
  const attackerDefinition = monsters[attacker.definitionId];

  if (target.type === "core") {
    return 10000 + calculateCoreDamage(attackerDefinition.atk, Boolean(attacker.powerChargeActive));
  }

  const defender = state.monsters[target.monsterId];
  if (!defender) return 0;
  const defenderDefinition = monsters[defender.definitionId];
  const damage = attacker.powerChargeActive
    ? calculatePowerChargeMonsterDamage(attackerDefinition.atk, defenderDefinition.def)
    : calculateMonsterDamage(attackerDefinition.atk, defenderDefinition.def);

  if (damage >= defender.hp) {
    return 5000 + defenderDefinition.level * 100 + defenderDefinition.atk * 10;
  }

  return 1000 + damage * 100 + defenderDefinition.atk * 10;
}

export function scoreMoveOption(state: GameState, monsterId: string, option: AIMoveOption): number {
  const monster = state.monsters[monsterId];
  if (!monster) return 0;
  const definition = monsters[monster.definitionId];
  const targetCore = getCorePosition(getOpponent(monster.owner));
  const currentDistance = manhattanDistance(monster, targetCore);
  const nextDistance = manhattanDistance(option, targetCore);
  const distanceImprovement = currentDistance - nextDistance;
  const enemyMonsters = Object.values(state.monsters).filter((candidate) => candidate.owner !== monster.owner);
  const canAttackCoreNext = nextDistance <= definition.range ? 1 : 0;
  const canAttackEnemyNext = enemyMonsters.some((enemy) => manhattanDistance(option, enemy) <= definition.range) ? 1 : 0;

  return (
    distanceImprovement * 100 +
    canAttackCoreNext * 1000 +
    canAttackEnemyNext * 300 +
    definition.atk * 10 -
    option.distance * 5
  );
}

export function scoreSummonCandidate(state: GameState, diceId: string): number {
  const die = diceCatalog.find((candidate) => candidate.id === diceId);
  if (!die) return Number.NEGATIVE_INFINITY;
  const definition = monsters[die.monsterId];
  const hasLegalPlacement = getLegalPlacementOptions(state, state.currentPlayer, diceId).length > 0;
  if (!hasLegalPlacement) return Number.NEGATIVE_INFINITY;

  return definition.level * 500 + definition.atk * 100 + definition.hp * 30 + definition.move * 20 + 1000;
}

function getCurrentNetworkMinimumDistance(state: GameState, playerId: PlayerId): number {
  const targetCore = getCorePosition(getOpponent(playerId));
  return state.board
    .flat()
    .filter((cell) => (cell.isCore && cell.coreOwner === playerId) || (cell.hasDungeonTile && cell.tileOwner === playerId))
    .reduce((best, cell) => Math.min(best, manhattanDistance(cell, targetCore)), Number.POSITIVE_INFINITY);
}

export function scorePlacementOption(
  state: GameState,
  playerId: PlayerId,
  diceId: string,
  option: AIPlacementOption
): number {
  const die = diceCatalog.find((candidate) => candidate.id === diceId);
  if (!die) return Number.NEGATIVE_INFINITY;
  const targetCore = getCorePosition(getOpponent(playerId));
  const cells = getShapeCells(die.tileShapeId, option, option.rotation);
  const currentBestDistance = getCurrentNetworkMinimumDistance(state, playerId);
  const distanceToTargetCore = cells.reduce((best, cell) => Math.min(best, manhattanDistance(cell, targetCore)), Number.POSITIVE_INFINITY);
  const distanceImprovement = currentBestDistance - distanceToTargetCore;
  const branchCount = cells.reduce((count, cell) => {
    return count + getNeighbors(cell).filter((neighbor) => !cells.some((shapeCell) => shapeCell.x === neighbor.x && shapeCell.y === neighbor.y)).length;
  }, 0);
  const shape = tileShapes[die.tileShapeId];

  return distanceImprovement * 200 + shape.offsets.length * 20 + branchCount * 30 - distanceToTargetCore * 10;
}
