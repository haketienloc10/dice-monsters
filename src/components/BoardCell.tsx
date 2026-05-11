import { Shield, Swords } from "lucide-react";
import { monsters } from "../game/data/monsters";
import { cellHasHighlight, cellTargetAt } from "../game/reducer";
import type { BoardCell as BoardCellType, BoardPosition, GameState } from "../game/types";

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
  const definition = monster ? monsters[monster.definitionId] : undefined;
  const inPlacementPreview = placementPreview?.cells.some((position) => position.x === cell.x && position.y === cell.y);
  const isReachable = state.interactionMode === "moving" && cellHasHighlight(state.highlightedCells, cell.x, cell.y);
  const attackTarget = state.interactionMode === "attacking" ? cellTargetAt(state.validAttackTargets, cell.x, cell.y) : undefined;
  const isValidPlacementAnchor =
    state.interactionMode === "placing" && cellHasHighlight(state.highlightedCells, cell.x, cell.y);

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
    inPlacementPreview && !placementPreview?.valid ? "cell--placement-invalid" : ""
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
      {cell.isCore && (
        <span className="core-token" title={`${cell.coreOwner} Heart Core`}>
          <Shield size={18} />
          <span>♥</span>
        </span>
      )}
      {monster && definition && (
        <span className={`monster-token monster--${monster.owner.toLowerCase()}`} title={definition.name}>
          <Swords size={14} />
          <strong>{definition.name.slice(0, 2)}</strong>
          <small>{monster.hp}</small>
        </span>
      )}
    </button>
  );
}
