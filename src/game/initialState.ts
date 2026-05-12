import { CORE_HP, CREST_TYPES } from "./constants";
import { diceCatalog } from "./data/diceCatalog";
import type { BoardCell, CrestPool, GameState, PlayerId } from "./types";
import { createEmptyBoard } from "./rules/board";

function emptyCrestPool(): CrestPool {
  return Object.fromEntries(CREST_TYPES.map((crest) => [crest, 0])) as CrestPool;
}

function markCore(board: BoardCell[][], x: number, y: number, owner: PlayerId): void {
  board[y][x] = {
    ...board[y][x],
    isCore: true,
    coreOwner: owner,
    owner
  };
}

function markStartingTile(board: BoardCell[][], x: number, y: number, owner: PlayerId): void {
  board[y][x] = {
    ...board[y][x],
    hasDungeonTile: true,
    tileOwner: owner,
    owner
  };
}

export function createInitialState(): GameState {
  const board = createEmptyBoard();
  markCore(board, 0, 4, "P1");
  markCore(board, 12, 4, "P2");
  markStartingTile(board, 1, 4, "P1");
  markStartingTile(board, 11, 4, "P2");

  return {
    board,
    players: {
      P1: {
        id: "P1",
        name: "Blue Warden",
        coreHp: CORE_HP,
        dicePool: diceCatalog,
        crestPool: emptyCrestPool(),
        summonedMonsterIds: []
      },
      P2: {
        id: "P2",
        name: "Crimson Overlord",
        coreHp: CORE_HP,
        dicePool: diceCatalog,
        crestPool: emptyCrestPool(),
        summonedMonsterIds: []
      }
    },
    settings: {
      controls: {
        P1: "human",
        P2: "ai"
      }
    },
    currentPlayer: "P1",
    turnNumber: 1,
    phase: "roll",
    monsters: {},
    placementRotation: 0,
    latestRoll: [],
    summonCandidates: [],
    interactionMode: "none",
    highlightedCells: [],
    validAttackTargets: [],
    log: ["Match started. P1 begins in roll phase."]
  };
}
