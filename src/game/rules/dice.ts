import { CREST_CAP } from "../constants";
import type { CrestPool, DiceDefinition, RollResult } from "../types";

export function rollDicePool(
  dicePool: DiceDefinition[],
  count = 3,
  random: () => number = Math.random
): RollResult[] {
  return dicePool.slice(0, count).map((die) => {
    const face = die.faces[Math.floor(random() * die.faces.length)];
    return {
      diceId: die.id,
      diceName: die.name,
      monsterId: die.monsterId,
      tileShapeId: die.tileShapeId,
      face
    };
  });
}

export function addRolledCrests(pool: CrestPool, roll: RollResult[]): CrestPool {
  const next = { ...pool };
  for (const result of roll) {
    if (result.face.crest !== "summon") {
      next[result.face.crest] = Math.min(CREST_CAP, next[result.face.crest] + 1);
    }
  }
  return next;
}

export function getSummonCandidates(roll: RollResult[]): string[] {
  const summonRolls = roll.filter((result) => result.face.crest === "summon");
  if (summonRolls.length < 2) return [];
  return [...new Set(summonRolls.map((result) => result.diceId))];
}
