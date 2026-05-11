import type { BoardPosition, GameState } from "../types";
import { monsters as monsterDefinitions } from "../data/monsters";
import { getCell, getNeighbors, positionKey } from "./board";

export function getMovementDistanceMap(state: GameState, monsterInstanceId: string): Map<string, number> {
  const monster = state.monsters[monsterInstanceId];
  if (!monster) return new Map();

  const player = state.players[monster.owner];
  const definition = monsterDefinitions[monster.definitionId];
  const maxDistance = Math.min(definition.move, player.crestPool.move);
  const distances = new Map<string, number>();
  const queue: BoardPosition[] = [{ x: monster.x, y: monster.y }];
  distances.set(positionKey(queue[0]), 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDistance = distances.get(positionKey(current)) ?? 0;
    if (currentDistance >= maxDistance) continue;

    for (const next of getNeighbors(current)) {
      const cell = getCell(state.board, next);
      if (!cell || !cell.hasDungeonTile || cell.tileOwner !== monster.owner) continue;
      if (cell.monsterId && cell.monsterId !== monster.instanceId) continue;
      const key = positionKey(next);
      if (distances.has(key)) continue;
      distances.set(key, currentDistance + 1);
      queue.push(next);
    }
  }

  return distances;
}

export function getReachableCells(state: GameState, monsterInstanceId: string): BoardPosition[] {
  const distances = getMovementDistanceMap(state, monsterInstanceId);
  return [...distances.entries()]
    .filter(([, distance]) => distance > 0)
    .map(([key]) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y };
    });
}

export function getMovementDistance(state: GameState, monsterInstanceId: string, target: BoardPosition): number | undefined {
  return getMovementDistanceMap(state, monsterInstanceId).get(positionKey(target));
}
