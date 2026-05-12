import type { AttackTarget } from "../types";

export type AIPlannedAction =
  | { type: "ROLL_DICE" }
  | { type: "SELECT_SUMMON_CANDIDATE"; diceId: string }
  | { type: "PLACE_DUNGEON_SHAPE"; x: number; y: number; rotation: number }
  | { type: "SKIP_SUMMON" }
  | { type: "SELECT_MONSTER"; monsterId: string }
  | { type: "ENTER_MOVE_MODE" }
  | { type: "MOVE_MONSTER"; x: number; y: number }
  | { type: "ENTER_ATTACK_MODE" }
  | { type: "ATTACK_TARGET"; target: AttackTarget }
  | { type: "END_TURN" };

export type AIPlacementOption = { x: number; y: number; rotation: number };

export type AIMoveOption = { x: number; y: number; distance: number };

export type AITurnMemory = {
  attemptedMoveMonsterIds: string[];
  attemptedAttackMonsterIds: string[];
  actionCountThisTurn: number;
};

export const AI_ACTION_DELAY_MS = 500;
export const MAX_AI_ACTIONS_PER_TURN = 20;
