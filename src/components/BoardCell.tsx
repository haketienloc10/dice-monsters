import { cellHasHighlight, cellTargetAt } from "../game/reducer";
import type { BoardCell as BoardCellType, BoardPosition, GameState } from "../game/types";
import { CoreBase } from "./CoreBase";
import { MonsterToken } from "./MonsterToken";

type PlacementPreview = {
  cells: BoardPosition[];
  valid: boolean;
};

type Props = {
  cell: BoardCellType;
  state: GameState;
  placementPreview?: PlacementPreview;
  onClick: () => void;
  onHover: () => void;
};

export function BoardCell({ cell, state, placementPreview, onClick, onHover }: Props) {
  const monster = cell.monsterId ? state.monsters[cell.monsterId] : undefined;
  const inPlacementPreview = placementPreview?.cells.some((position) => position.x === cell.x && position.y === cell.y);
  const isReachable = state.interactionMode === "moving" && cellHasHighlight(state.highlightedCells, cell.x, cell.y);
  const attackTarget = state.interactionMode === "attacking" ? cellTargetAt(state.validAttackTargets, cell.x, cell.y) : undefined;
  const isValidPlacementAnchor =
    state.interactionMode === "placing" && cellHasHighlight(state.highlightedCells, cell.x, cell.y);
  const lastEvent = state.lastEvent;
  const isNewTile = lastEvent?.type === "summoned" && lastEvent.placedCells.some((position) => position.x === cell.x && position.y === cell.y);
  const isMovedMonster = lastEvent?.type === "moved" && lastEvent.monsterId === cell.monsterId;
  const isAttackingMonster = lastEvent?.type === "attacked" && lastEvent.attackerId === cell.monsterId;
  const isDamagedMonster =
    lastEvent?.type === "attacked" && lastEvent.target.type === "monster" && lastEvent.target.monsterId === cell.monsterId;
  const isCoreHit = lastEvent?.type === "attacked" && lastEvent.coreOwnerHit === cell.coreOwner;
  const coreHp = cell.coreOwner ? state.players[cell.coreOwner].coreHp : 0;

  const classNames = [
    "board-cell",
    !cell.hasDungeonTile && !cell.isCore ? "cell--empty" : "",
    cell.tileOwner === "P1" ? "cell--p1-tile" : "",
    cell.tileOwner === "P2" ? "cell--p2-tile" : "",
    cell.coreOwner === "P1" ? "cell--core-p1" : "",
    cell.coreOwner === "P2" ? "cell--core-p2" : "",
    state.selectedMonsterId === cell.monsterId ? "cell--selected" : "",
    isReachable ? "cell--reachable" : "",
    attackTarget ? "cell--attackable" : "",
    isValidPlacementAnchor ? "cell--placement-anchor" : "",
    inPlacementPreview && placementPreview?.valid ? "cell--placement-valid" : "",
    inPlacementPreview && !placementPreview?.valid ? "cell--placement-invalid" : "",
    isNewTile ? "cell--new-tile" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      type="button"
      role="gridcell"
      aria-label={`Cell ${cell.x},${cell.y}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      {cell.isCore && cell.coreOwner && <CoreBase owner={cell.coreOwner} hp={coreHp} hit={isCoreHit} />}
      {monster && (
        <MonsterToken
          monster={monster}
          selected={state.selectedMonsterId === cell.monsterId}
          damaged={isDamagedMonster}
          attacking={isAttackingMonster}
          moved={isMovedMonster}
        />
      )}
    </button>
  );
}
