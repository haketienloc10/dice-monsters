import { tileShapes } from "../data/tileShapes";
import type { BoardCell, BoardPosition, GameState, PlayerId, TileOffset } from "../types";
import { getCell, getCorePosition, getNeighbors, getOpponent, isInsideBoard } from "./board";

export function rotateOffset90(offset: TileOffset): TileOffset {
  return { dx: -offset.dy, dy: offset.dx };
}

export function rotateOffset(offset: TileOffset, rotation: number): TileOffset {
  let next = { ...offset };
  for (let index = 0; index < rotation % 4; index += 1) {
    next = rotateOffset90(next);
  }
  return next;
}

export function getShapeCells(shapeId: string, anchor: BoardPosition, rotation: number): BoardPosition[] {
  const shape = tileShapes[shapeId];
  return shape.offsets.map((offset) => {
    const rotated = rotateOffset(offset, rotation);
    return { x: anchor.x + rotated.dx, y: anchor.y + rotated.dy };
  });
}

function isOwnedNetworkCell(cell: BoardCell | undefined, playerId: PlayerId): boolean {
  return Boolean(
    cell &&
      ((cell.isCore && cell.coreOwner === playerId) || (cell.hasDungeonTile && cell.tileOwner === playerId))
  );
}

export function isValidDungeonPlacement(
  state: GameState,
  playerId: PlayerId,
  shapeId: string,
  anchor: BoardPosition,
  rotation: number
): boolean {
  const cells = getShapeCells(shapeId, anchor, rotation);
  const opponentCore = getCorePosition(getOpponent(playerId));

  if (!cells.every(isInsideBoard)) return false;

  for (const position of cells) {
    const cell = getCell(state.board, position);
    if (!cell || cell.hasDungeonTile || cell.isCore || cell.monsterId) return false;
    if (getNeighbors(position).some((neighbor) => neighbor.x === opponentCore.x && neighbor.y === opponentCore.y)) {
      return false;
    }
  }

  return cells.some((position) =>
    getNeighbors(position).some((neighbor) => isOwnedNetworkCell(getCell(state.board, neighbor), playerId))
  );
}

export function getValidPlacementAnchors(
  state: GameState,
  playerId: PlayerId,
  shapeId: string,
  rotation: number
): BoardPosition[] {
  return state.board
    .flat()
    .filter((cell) => isValidDungeonPlacement(state, playerId, shapeId, cell, rotation))
    .map(({ x, y }) => ({ x, y }));
}
