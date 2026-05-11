import type { TileShape } from "../types";

export const tileShapes: Record<string, TileShape> = {
  straight2: {
    id: "straight2",
    name: "Straight 2",
    offsets: [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 }
    ]
  },
  straight3: {
    id: "straight3",
    name: "Straight 3",
    offsets: [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 2, dy: 0 }
    ]
  },
  l3: {
    id: "l3",
    name: "L 3",
    offsets: [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }
    ]
  },
  t4: {
    id: "t4",
    name: "T 4",
    offsets: [
      { dx: 0, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }
    ]
  },
  cross5: {
    id: "cross5",
    name: "Cross 5",
    offsets: [
      { dx: 0, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 }
    ]
  }
};
