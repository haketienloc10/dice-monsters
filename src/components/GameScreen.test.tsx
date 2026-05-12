import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameScreen } from "./GameScreen";

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
