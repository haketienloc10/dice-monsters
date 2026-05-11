import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GameScreen } from "./GameScreen";

afterEach(() => cleanup());

describe("GameScreen smoke flow", () => {
  it("loads the board, rolls dice, and ends turn", () => {
    render(<GameScreen />);

    expect(screen.getAllByRole("gridcell")).toHaveLength(117);
    fireEvent.click(screen.getByRole("button", { name: /roll dice/i }));
    expect(screen.getAllByText(/dice/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /^end turn$/i }));
    expect(screen.getByText(/current: crimson overlord/i)).toBeTruthy();
  });
});
