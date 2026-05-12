import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";
import type { BoardCell, BoardPosition, GameState, PlayerId } from "../types";

export function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: BOARD_HEIGHT }, (_, y) =>
    Array.from({ length: BOARD_WIDTH }, (_, x) => ({
      x,
      y,
      hasDungeonTile: false
    }))
  );
}

export function isInsideBoard({ x, y }: BoardPosition): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

export function getCell(board: BoardCell[][], position: BoardPosition): BoardCell | undefined {
  if (!isInsideBoard(position)) return undefined;
  return board[position.y][position.x];
}

export function samePosition(a: BoardPosition, b: BoardPosition): boolean {
  return a.x === b.x && a.y === b.y;
}

export function positionKey({ x, y }: BoardPosition): string {
  return `${x},${y}`;
}

export function getNeighbors(position: BoardPosition): BoardPosition[] {
  return [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y - 1 }
  ].filter(isInsideBoard);
}

export function getOpponent(playerId: PlayerId): PlayerId {
  return playerId === "P1" ? "P2" : "P1";
}

export function getCorePosition(playerId: PlayerId): BoardPosition {
  return playerId === "P1" ? { x: 0, y: 4 } : { x: 12, y: 4 };
}

export function manhattanDistance(a: BoardPosition, b: BoardPosition): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function cloneGameState(state: GameState): GameState {
  return {
    ...state,
    board: state.board.map((row) => row.map((cell) => ({ ...cell }))),
    players: {
      P1: {
        ...state.players.P1,
        crestPool: { ...state.players.P1.crestPool },
        dicePool: state.players.P1.dicePool,
        summonedMonsterIds: [...state.players.P1.summonedMonsterIds]
      },
      P2: {
        ...state.players.P2,
        crestPool: { ...state.players.P2.crestPool },
        dicePool: state.players.P2.dicePool,
        summonedMonsterIds: [...state.players.P2.summonedMonsterIds]
      }
    },
    settings: {
      controls: { ...state.settings.controls }
    },
    monsters: Object.fromEntries(Object.entries(state.monsters).map(([id, monster]) => [id, { ...monster }])),
    latestRoll: state.latestRoll.map((roll) => ({ ...roll, face: { ...roll.face } })),
    summonCandidates: [...state.summonCandidates],
    highlightedCells: state.highlightedCells.map((cell) => ({ ...cell })),
    validAttackTargets: state.validAttackTargets.map((target) => ({ ...target })),
    log: [...state.log]
  };
}

export function addLog(state: GameState, message: string): void {
  state.log = [message, ...state.log].slice(0, 20);
}
