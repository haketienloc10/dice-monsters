import { useMemo, useReducer, useState } from "react";
import { Board } from "./Board";
import { ActionPanel } from "./ActionPanel";
import { CrestBar } from "./CrestBar";
import { DiceTray } from "./DiceTray";
import { GameLog } from "./GameLog";
import { MonsterInfoPanel } from "./MonsterInfoPanel";
import { PlayerCorePanel } from "./PlayerCorePanel";
import { TileShapePreview } from "./TileShapePreview";
import { TopBar } from "./TopBar";
import { useAIController } from "../game/ai/aiController";
import { diceCatalog } from "../game/data/diceCatalog";
import { createInitialState } from "../game/initialState";
import { cellHasHighlight, cellTargetAt, gameReducer } from "../game/reducer";
import { getShapeCells, isValidDungeonPlacement } from "../game/rules/summon";
import type { BoardPosition } from "../game/types";

export function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [hoveredCell, setHoveredCell] = useState<BoardPosition | undefined>();
  const isAITurn = useAIController(state, dispatch);

  const selectedDie = useMemo(
    () => diceCatalog.find((die) => die.id === state.selectedSummonDiceId),
    [state.selectedSummonDiceId]
  );

  const placementPreview = useMemo(() => {
    if (!hoveredCell || state.interactionMode !== "placing" || !selectedDie) return undefined;
    return {
      cells: getShapeCells(selectedDie.tileShapeId, hoveredCell, state.placementRotation),
      valid: isValidDungeonPlacement(state, state.currentPlayer, selectedDie.tileShapeId, hoveredCell, state.placementRotation)
    };
  }, [hoveredCell, selectedDie, state]);

  function handleCellClick(x: number, y: number) {
    if (isAITurn) return;

    if (state.interactionMode === "placing") {
      dispatch({ type: "PLACE_DUNGEON_SHAPE", x, y });
      return;
    }

    if (state.interactionMode === "moving" && cellHasHighlight(state.highlightedCells, x, y)) {
      dispatch({ type: "MOVE_MONSTER", x, y });
      return;
    }

    if (state.interactionMode === "attacking") {
      const target = cellTargetAt(state.validAttackTargets, x, y);
      if (target) dispatch({ type: "ATTACK_TARGET", target });
      return;
    }

    const cell = state.board[y][x];
    if (cell.monsterId) {
      dispatch({ type: "SELECT_MONSTER", monsterId: cell.monsterId });
    }
  }

  return (
    <main className="game-shell">
      <TopBar state={state} />

      <section className="game-layout">
        <aside className="side-panel">
          <PlayerCorePanel player={state.players.P1} active={state.currentPlayer === "P1"} />
          <PlayerCorePanel player={state.players.P2} active={state.currentPlayer === "P2"} />
          <CrestBar player={state.players[state.currentPlayer]} />
          <MonsterInfoPanel state={state} />
        </aside>

        <section className="board-stage" aria-label="Dungeon board area">
          <Board
            state={state}
            placementPreview={placementPreview}
            onCellClick={handleCellClick}
            onCellHover={(position) => setHoveredCell(position)}
          />
          <DiceTray state={state} onRoll={() => dispatch({ type: "ROLL_DICE" })} disabled={isAITurn} />
          {isAITurn && <div className="ai-status" role="status">AI is thinking...</div>}
        </section>

        <aside className="side-panel side-panel--right">
          <ActionPanel state={state} dispatch={dispatch} disabled={isAITurn} />
          <TileShapePreview state={state} />
          <GameLog log={state.log} />
        </aside>
      </section>
    </main>
  );
}
