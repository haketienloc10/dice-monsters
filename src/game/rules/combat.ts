import { monsters as monsterDefinitions } from "../data/monsters";
import type { AttackTarget, GameState } from "../types";
import { getCorePosition, getOpponent, manhattanDistance } from "./board";

export function calculateMonsterDamage(attackerAtk: number, defenderDef: number): number {
  return Math.max(1, attackerAtk - defenderDef);
}

export function calculatePowerChargeMonsterDamage(attackerAtk: number, defenderDef: number): number {
  return Math.max(0, attackerAtk + 1 - defenderDef);
}

export function getValidAttackTargets(state: GameState, attackerId: string): AttackTarget[] {
  const attacker = state.monsters[attackerId];
  if (!attacker) return [];
  const attackerDefinition = monsterDefinitions[attacker.definitionId];
  const targets: AttackTarget[] = [];

  for (const monster of Object.values(state.monsters)) {
    if (monster.owner === attacker.owner) continue;
    if (manhattanDistance(attacker, monster) <= attackerDefinition.range) {
      targets.push({ type: "monster", monsterId: monster.instanceId, x: monster.x, y: monster.y });
    }
  }

  const opponent = getOpponent(attacker.owner);
  const corePosition = getCorePosition(opponent);
  if (manhattanDistance(attacker, corePosition) <= attackerDefinition.range) {
    targets.push({ type: "core", playerId: opponent, x: corePosition.x, y: corePosition.y });
  }

  return targets;
}
