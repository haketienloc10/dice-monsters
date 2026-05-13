import { describe, expect, it } from "vitest";
import { monsters } from "../data/monsters";
import { createInitialState } from "../initialState";
import { getCell } from "../rules/board";
import { isValidDungeonPlacement } from "../rules/summon";
import type { GameState, MonsterInstance, PlayerId } from "../types";
import { getNextAIAction } from "./aiPlanner";
import { getLegalMoveOptions, getLegalPlacementOptions } from "./aiUtils";

function addMonster(state: GameState, monster: MonsterInstance): void {
  state.monsters[monster.instanceId] = monster;
  const cell = getCell(state.board, monster);
  if (cell) cell.monsterId = monster.instanceId;
  state.players[monster.owner].summonedMonsterIds.push(monster.instanceId);
}

function markDungeonTile(state: GameState, x: number, y: number, owner: PlayerId): void {
  state.board[y][x] = { ...state.board[y][x], hasDungeonTile: true, tileOwner: owner, owner };
}

function makeP2ActionState(): GameState {
  return {
    ...createInitialState(),
    currentPlayer: "P2",
    phase: "action"
  };
}

describe("AI planner", () => {
  it("chooses attacking the enemy core over attacking a monster", () => {
    const state = makeP2ActionState();
    state.players.P2.crestPool.attack = 1;
    addMonster(state, {
      instanceId: "p2-attacker",
      definitionId: "little-swordsman",
      owner: "P2",
      x: 1,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "p1-target",
      definitionId: "wolf-scout",
      owner: "P1",
      x: 1,
      y: 5,
      hp: monsters["wolf-scout"].hp,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p2-attacker";
    state.interactionMode = "attacking";

    expect(getNextAIAction(state)).toEqual({ type: "ATTACK_TARGET", target: { type: "core", playerId: "P1", x: 0, y: 4 } });
  });

  it("chooses a killable monster over non-lethal damage", () => {
    const state = makeP2ActionState();
    state.players.P2.crestPool.attack = 1;
    addMonster(state, {
      instanceId: "p2-mage",
      definitionId: "rune-mage",
      owner: "P2",
      x: 5,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "killable-wolf",
      definitionId: "wolf-scout",
      owner: "P1",
      x: 6,
      y: 4,
      hp: monsters["wolf-scout"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "durable-guardian",
      definitionId: "stone-guardian",
      owner: "P1",
      x: 5,
      y: 6,
      hp: monsters["stone-guardian"].hp,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p2-mage";
    state.interactionMode = "attacking";

    expect(getNextAIAction(state)).toEqual({
      type: "ATTACK_TARGET",
      target: { type: "monster", monsterId: "killable-wolf", x: 6, y: 4 }
    });
  });

  it("uses Power Charge when it makes a legal monster attack lethal", () => {
    const state = makeP2ActionState();
    state.players.P2.crestPool.attack = 1;
    state.players.P2.crestPool.magic = 1;
    addMonster(state, {
      instanceId: "p2-mage",
      definitionId: "rune-mage",
      owner: "P2",
      x: 5,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "p1-avian",
      definitionId: "skyblade-avian",
      owner: "P1",
      x: 6,
      y: 4,
      hp: 2,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p2-mage";

    expect(getNextAIAction(state)).toEqual({ type: "USE_POWER_CHARGE", monsterId: "p2-mage" });
  });

  it("attacks the boosted lethal monster target after Power Charge is active", () => {
    const state = makeP2ActionState();
    state.players.P2.crestPool.attack = 1;
    state.players.P2.crestPool.magic = 1;
    addMonster(state, {
      instanceId: "p2-mage",
      definitionId: "rune-mage",
      owner: "P2",
      x: 5,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });
    addMonster(state, {
      instanceId: "p1-avian",
      definitionId: "skyblade-avian",
      owner: "P1",
      x: 6,
      y: 4,
      hp: 2,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p2-mage";
    state.interactionMode = "attacking";

    expect(getNextAIAction(state)).toEqual({
      type: "ATTACK_TARGET",
      target: { type: "monster", monsterId: "p1-avian", x: 6, y: 4 }
    });
  });

  it("does not use Power Charge for core attacks or without Magic Crest", () => {
    const coreState = makeP2ActionState();
    coreState.players.P2.crestPool.attack = 1;
    coreState.players.P2.crestPool.magic = 1;
    addMonster(coreState, {
      instanceId: "p2-mage",
      definitionId: "rune-mage",
      owner: "P2",
      x: 1,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    addMonster(coreState, {
      instanceId: "p1-avian",
      definitionId: "skyblade-avian",
      owner: "P1",
      x: 1,
      y: 5,
      hp: 2,
      hasActedAttack: false
    });
    coreState.selectedMonsterId = "p2-mage";

    expect(getNextAIAction(coreState)).toEqual({ type: "ENTER_ATTACK_MODE" });

    const noMagicState = makeP2ActionState();
    noMagicState.players.P2.crestPool.attack = 1;
    noMagicState.players.P2.crestPool.magic = 0;
    addMonster(noMagicState, {
      instanceId: "p2-mage",
      definitionId: "rune-mage",
      owner: "P2",
      x: 5,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    addMonster(noMagicState, {
      instanceId: "p1-avian",
      definitionId: "skyblade-avian",
      owner: "P1",
      x: 6,
      y: 4,
      hp: 2,
      hasActedAttack: false
    });
    noMagicState.selectedMonsterId = "p2-mage";

    expect(getNextAIAction(noMagicState)).toEqual({ type: "ENTER_ATTACK_MODE" });
  });

  it("does not include illegal movement through occupied cells", () => {
    const state = makeP2ActionState();
    state.players.P2.crestPool.move = 3;
    markDungeonTile(state, 10, 4, "P2");
    markDungeonTile(state, 9, 4, "P2");
    addMonster(state, {
      instanceId: "p2-runner",
      definitionId: "little-swordsman",
      owner: "P2",
      x: 11,
      y: 4,
      hp: monsters["little-swordsman"].hp,
      hasActedAttack: false
    });
    addMonster(state, {
      instanceId: "blocker",
      definitionId: "shadow-imp",
      owner: "P1",
      x: 10,
      y: 4,
      hp: monsters["shadow-imp"].hp,
      hasActedAttack: false
    });

    expect(getLegalMoveOptions(state, "p2-runner")).not.toContainEqual({ x: 9, y: 4, distance: 2 });
  });

  it("only returns valid dungeon placement options", () => {
    const state = { ...createInitialState(), currentPlayer: "P2" as const, phase: "summon" as const };
    state.summonCandidates = ["dice-little-swordsman"];

    const options = getLegalPlacementOptions(state, "P2", "dice-little-swordsman");

    expect(options.length).toBeGreaterThan(0);
    expect(options.every((option) => isValidDungeonPlacement(state, "P2", "straight2", option, option.rotation))).toBe(true);
  });

  it("skips summon when no placement is legal", () => {
    const state = { ...createInitialState(), currentPlayer: "P2" as const, phase: "summon" as const };
    state.summonCandidates = ["dice-ember-dragon"];
    for (const cell of state.board.flat()) {
      if (!cell.isCore) {
        cell.hasDungeonTile = true;
        cell.tileOwner = "P1";
      }
    }

    expect(getNextAIAction(state)).toEqual({ type: "SKIP_SUMMON" });
  });

  it("ends turn when no legal action exists", () => {
    const state = makeP2ActionState();

    expect(getNextAIAction(state)).toEqual({ type: "END_TURN" });
  });
});
