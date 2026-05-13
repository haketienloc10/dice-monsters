import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { monsters } from "../game/data/monsters";
import { createInitialState } from "../game/initialState";
import { getCell } from "../game/rules/board";
import type { GameAction, GameState, MonsterInstance } from "../game/types";
import { ActionPanel } from "./ActionPanel";
import { GameScreen } from "./GameScreen";
import { MonsterInfoPanel } from "./MonsterInfoPanel";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("GameScreen smoke flow", () => {
  it("loads the board, rolls dice, and ends turn", () => {
    render(<GameScreen />);

    expect(screen.getAllByRole("gridcell")).toHaveLength(117);
    fireEvent.click(screen.getByRole("button", { name: /roll dice/i }));
    expect(screen.getAllByText(/dice/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /^end turn$/i }));
    expect(screen.getByText(/current: crimson overlord/i)).toBeTruthy();
  });

  it("lets P2 AI act automatically and return control to P1", async () => {
    vi.useFakeTimers();
    render(<GameScreen />);

    fireEvent.click(screen.getByRole("button", { name: /roll dice/i }));
    fireEvent.click(screen.getByRole("button", { name: /^end turn$/i }));

    expect(screen.getByText(/crimson overlord \[ai\]/i)).toBeTruthy();
    expect(screen.getAllByText(/ai is thinking/i).length).toBeGreaterThan(0);
    expect((screen.getByRole("button", { name: /roll dice/i }) as HTMLButtonElement).disabled).toBe(true);

    for (let index = 0; index < 24; index += 1) {
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      if (screen.queryByText(/current: blue warden/i)) break;
    }

    expect(screen.getByText(/current: blue warden/i)).toBeTruthy();
  });
});

function addMonster(state: GameState, monster: MonsterInstance): void {
  state.monsters[monster.instanceId] = monster;
  const cell = getCell(state.board, monster);
  if (cell) cell.monsterId = monster.instanceId;
  state.players[monster.owner].summonedMonsterIds.push(monster.instanceId);
}

describe("Power Charge UI", () => {
  it("shows the 1 Magic action only enabled for a valid selected current-player monster", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    state.players.P1.crestPool.magic = 1;
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false
    });
    state.selectedMonsterId = "p1-mage";
    const actions: GameAction[] = [];

    render(<ActionPanel state={state} dispatch={(action) => actions.push(action)} />);

    const button = screen.getByRole("button", { name: /power charge 1 magic/i });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(button);
    expect(actions).toContainEqual({ type: "USE_POWER_CHARGE", monsterId: "p1-mage" });
  });

  it("shows active Power Charge status on the selected monster panel", () => {
    const state = { ...createInitialState(), phase: "action" as const };
    addMonster(state, {
      instanceId: "p1-mage",
      definitionId: "rune-mage",
      owner: "P1",
      x: 1,
      y: 4,
      hp: monsters["rune-mage"].hp,
      hasActedAttack: false,
      powerChargeActive: true
    });
    state.selectedMonsterId = "p1-mage";

    render(<MonsterInfoPanel state={state} />);

    expect(screen.getByText("+1 ATK next attack")).toBeTruthy();
  });
});
