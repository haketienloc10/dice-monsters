export type PlayerId = "P1" | "P2";

export type PlayerControl = "human" | "ai";

export type GameSettings = {
  controls: Record<PlayerId, PlayerControl>;
};

export type CrestType = "summon" | "move" | "attack" | "defense" | "magic" | "trap";

export type CrestPool = Record<CrestType, number>;

export type DiceFace = {
  crest: CrestType;
  summonLevel?: number;
};

export type DiceDefinition = {
  id: string;
  name: string;
  level: number;
  monsterId: string;
  faces: DiceFace[];
  tileShapeId: string;
};

export type PlayerState = {
  id: PlayerId;
  name: string;
  coreHp: number;
  dicePool: DiceDefinition[];
  crestPool: CrestPool;
  summonedMonsterIds: string[];
};

export type BoardCell = {
  x: number;
  y: number;
  owner?: PlayerId;
  hasDungeonTile: boolean;
  tileOwner?: PlayerId;
  monsterId?: string;
  isCore?: boolean;
  coreOwner?: PlayerId;
};

export type BoardPosition = {
  x: number;
  y: number;
};

export type MonsterDefinition = {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  atk: number;
  def: number;
  range: number;
  move: number;
  skillName?: string;
  skillText?: string;
};

export type MonsterInstance = {
  instanceId: string;
  definitionId: string;
  owner: PlayerId;
  x: number;
  y: number;
  hp: number;
  hasActedAttack: boolean;
};

export type TileOffset = {
  dx: number;
  dy: number;
};

export type TileShape = {
  id: string;
  name: string;
  offsets: TileOffset[];
};

export type RollResult = {
  diceId: string;
  diceName: string;
  monsterId: string;
  tileShapeId: string;
  face: DiceFace;
};

export type AttackTarget =
  | { type: "monster"; monsterId: string; x: number; y: number }
  | { type: "core"; playerId: PlayerId; x: number; y: number };

export type GamePhase = "roll" | "summon" | "action" | "gameOver";

export type InteractionMode = "none" | "placing" | "moving" | "attacking";

export type GameState = {
  board: BoardCell[][];
  players: Record<PlayerId, PlayerState>;
  settings: GameSettings;
  currentPlayer: PlayerId;
  turnNumber: number;
  phase: GamePhase;
  monsters: Record<string, MonsterInstance>;
  selectedMonsterId?: string;
  selectedSummonDiceId?: string;
  placementRotation: number;
  latestRoll: RollResult[];
  summonCandidates: string[];
  interactionMode: InteractionMode;
  highlightedCells: BoardPosition[];
  validAttackTargets: AttackTarget[];
  winner?: PlayerId;
  log: string[];
};

export type GameAction =
  | { type: "ROLL_DICE" }
  | { type: "SELECT_SUMMON_CANDIDATE"; diceId: string }
  | { type: "ROTATE_PLACEMENT" }
  | { type: "PLACE_DUNGEON_SHAPE"; x: number; y: number; rotation?: number }
  | { type: "SKIP_SUMMON" }
  | { type: "SELECT_MONSTER"; monsterId: string }
  | { type: "ENTER_MOVE_MODE" }
  | { type: "MOVE_MONSTER"; x: number; y: number }
  | { type: "ENTER_ATTACK_MODE" }
  | { type: "ATTACK_TARGET"; target: AttackTarget }
  | { type: "END_TURN" }
  | { type: "RESET_GAME" };
