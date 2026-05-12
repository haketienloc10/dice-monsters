import type { BoardPosition, GameState } from "../game/types";
import { BoardEffects, type VisualEffect } from "./BoardEffects";
import { BoardCell } from "./BoardCell";

type PlacementPreview = {
  cells: BoardPosition[];
  valid: boolean;
};

type Props = {
  state: GameState;
  placementPreview?: PlacementPreview;
  effects: VisualEffect[];
  onCellClick: (x: number, y: number) => void;
  onCellHover: (position: BoardPosition) => void;
};

export function Board({ state, placementPreview, effects, onCellClick, onCellHover }: Props) {
  return (
    <div className="board-frame">
      <div className="board-grid" role="grid" aria-label="13 by 9 dungeon board">
        {state.board.flat().map((cell) => (
          <BoardCell
            key={`${cell.x}-${cell.y}`}
            cell={cell}
            state={state}
            placementPreview={placementPreview}
            onClick={() => onCellClick(cell.x, cell.y)}
            onHover={() => onCellHover({ x: cell.x, y: cell.y })}
          />
        ))}
        <BoardEffects effects={effects} />
      </div>
    </div>
  );
}
