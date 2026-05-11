import type { CrestType } from "./types";

export const BOARD_WIDTH = 13;
export const BOARD_HEIGHT = 9;
export const CORE_HP = 10;
export const CREST_CAP = 5;

export const CREST_TYPES: CrestType[] = ["summon", "move", "attack", "defense", "magic", "trap"];

export const CREST_LABELS: Record<CrestType, string> = {
  summon: "Summon",
  move: "Move",
  attack: "Attack",
  defense: "Defense",
  magic: "Magic",
  trap: "Trap"
};

export const CREST_ICONS: Record<CrestType, string> = {
  summon: "✦",
  move: "👢",
  attack: "⚔",
  defense: "🛡",
  magic: "✨",
  trap: "⛓"
};
