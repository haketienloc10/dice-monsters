import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Board } from "./Board";
import { ActionPanel } from "./ActionPanel";
import type { VisualEffect } from "./BoardEffects";
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
import type { BoardPosition, GameAction } from "../game/types";

type AnimationLockReason = "dice" | "summon" | "move" | "attack";

function effectId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [hoveredCell, setHoveredCell] = useState<BoardPosition | undefined>();
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [animationLock, setAnimationLock] = useState<AnimationLockReason | undefined>();
  const [phaseBannerKey, setPhaseBannerKey] = useState(0);
  const seenEventId = useRef<string | undefined>(undefined);
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

  function pushTimedEffect(effect: VisualEffect, duration = 900) {
    setVisualEffects((effects) => [...effects, effect]);
    window.setTimeout(() => {
      setVisualEffects((effects) => effects.filter((candidate) => candidate.id !== effect.id));
    }, duration);
  }

  function lockAnimation(reason: AnimationLockReason, duration: number) {
    setAnimationLock(reason);
    window.setTimeout(() => setAnimationLock((current) => (current === reason ? undefined : current)), duration);
  }

  function dispatchHumanAction(action: GameAction, lock?: { reason: AnimationLockReason; duration: number }) {
    if (isAITurn) return;
    if (animationLock && (action.type === "ROLL_DICE" || action.type === "MOVE_MONSTER" || action.type === "ATTACK_TARGET")) return;
    if (lock) lockAnimation(lock.reason, lock.duration);
    dispatch(action);
  }

  useEffect(() => {
    if (!state.lastEvent || seenEventId.current === state.lastEvent.id) return;
    seenEventId.current = state.lastEvent.id;

    if (state.lastEvent.type === "rolled") {
      lockAnimation("dice", 850);
      setPhaseBannerKey((key) => key + 1);
      return;
    }

    if (state.lastEvent.type === "summoned") {
      lockAnimation("summon", 700);
      pushTimedEffect({ id: effectId("summon"), type: "summon", x: state.lastEvent.position.x, y: state.lastEvent.position.y }, 760);
      return;
    }

    if (state.lastEvent.type === "moved") {
      lockAnimation("move", 500);
      pushTimedEffect({ id: effectId("move"), type: "move", from: state.lastEvent.from, to: state.lastEvent.to }, 540);
      return;
    }

    if (state.lastEvent.type === "attacked") {
      const ranged = Math.abs(state.lastEvent.from.x - state.lastEvent.to.x) + Math.abs(state.lastEvent.from.y - state.lastEvent.to.y) > 1;
      lockAnimation("attack", 850);
      pushTimedEffect({ id: effectId("attack"), type: "attack", from: state.lastEvent.from, to: state.lastEvent.to, ranged }, 420);
      pushTimedEffect({ id: effectId("damage"), type: "damage", x: state.lastEvent.to.x, y: state.lastEvent.to.y, amount: state.lastEvent.damage }, 900);
      if (state.lastEvent.destroyedMonsterId) {
        pushTimedEffect({ id: effectId("death"), type: "death", x: state.lastEvent.to.x, y: state.lastEvent.to.y }, 720);
      }
      if (state.lastEvent.coreOwnerHit) {
        pushTimedEffect({
          id: effectId("coreHit"),
          type: "coreHit",
          x: state.lastEvent.to.x,
          y: state.lastEvent.to.y,
          owner: state.lastEvent.coreOwnerHit,
          amount: state.lastEvent.damage
        }, 720);
      }
      return;
    }

    if (state.lastEvent.type === "turnEnded") {
      setPhaseBannerKey((key) => key + 1);
    }
  }, [state.lastEvent]);

  function handleCellClick(x: number, y: number) {
    if (isAITurn || animationLock) return;

    if (state.interactionMode === "placing") {
      dispatchHumanAction({ type: "PLACE_DUNGEON_SHAPE", x, y }, { reason: "summon", duration: 700 });
      return;
    }

    if (state.interactionMode === "moving" && cellHasHighlight(state.highlightedCells, x, y)) {
      dispatchHumanAction({ type: "MOVE_MONSTER", x, y }, { reason: "move", duration: 500 });
      return;
    }

    if (state.interactionMode === "attacking") {
      const target = cellTargetAt(state.validAttackTargets, x, y);
      if (target) dispatchHumanAction({ type: "ATTACK_TARGET", target }, { reason: "attack", duration: 850 });
      return;
    }

    const cell = state.board[y][x];
    if (cell.monsterId) {
      dispatchHumanAction({ type: "SELECT_MONSTER", monsterId: cell.monsterId });
    }
  }

  const phaseLabel = state.phase === "gameOver" ? "GAME OVER" : `${state.phase.toUpperCase()} PHASE`;
  const isDiceRolling = animationLock === "dice";
  const isActionAnimating = animationLock === "summon" || animationLock === "move" || animationLock === "attack";

  return (
    <main className="game-root">
      <div className="game-shell">
        <TopBar state={state} />
        <div key={`${phaseBannerKey}-${state.phase}-${state.currentPlayer}`} className="phase-banner" role="status">
          {isAITurn && state.phase !== "gameOver" ? "P2 AI THINKING" : phaseLabel}
        </div>

        <section className="main-layout">
          <aside className="left-column">
            <PlayerCorePanel player={state.players.P1} active={state.currentPlayer === "P1"} />
            <PlayerCorePanel player={state.players.P2} active={state.currentPlayer === "P2"} />
          </aside>

          <section className="board-area" aria-label="Dungeon board area">
            <Board
              state={state}
              placementPreview={placementPreview}
              effects={visualEffects}
              onCellClick={handleCellClick}
              onCellHover={(position) => setHoveredCell(position)}
            />
            {isAITurn && <div className="ai-status" role="status">AI is thinking...</div>}
          </section>

          <aside className="right-column">
            <MonsterInfoPanel state={state} />
            <ActionPanel state={state} dispatch={dispatchHumanAction} disabled={isAITurn} animationLocked={isActionAnimating} />
            <TileShapePreview state={state} />
            <GameLog log={state.log} />
          </aside>
        </section>

        <section className="bottom-hud" aria-label="Command deck">
          <div className="stock-card" aria-label="Dungeon stock">
            <span>Dungeon Stock</span>
            <strong>{state.summonCandidates.length || "Ready"}</strong>
            <small>{state.phase === "summon" ? "Shape candidates" : `Turn ${state.turnNumber} command line`}</small>
          </div>
          <div className="bottom-hud__dice">
            <DiceTray
              state={state}
              onRoll={() => dispatchHumanAction({ type: "ROLL_DICE" }, { reason: "dice", duration: 850 })}
              disabled={isAITurn || isDiceRolling}
              rolling={isDiceRolling}
            />
          </div>
          <div className="bottom-hud__crests">
            <CrestBar player={state.players[state.currentPlayer]} lastEvent={state.lastEvent} />
          </div>
        </section>

        <div className="desktop-warning" role="status">This game UI is optimized for desktop screens.</div>
      </div>

      {state.phase === "gameOver" && (
        <section className="game-over-overlay" role="dialog" aria-label="Game over">
          <div className="game-over-card">
            <span>Heart Core Shattered</span>
            <strong>{state.winner} Wins</strong>
            <button type="button" className="primary-button" onClick={() => dispatch({ type: "RESET_GAME" })}>
              Reset Game
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
