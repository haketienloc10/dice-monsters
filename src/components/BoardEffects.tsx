import type { CSSProperties } from "react";
import type { BoardPosition, PlayerId } from "../game/types";

export type VisualEffect =
  | { id: string; type: "summon"; x: number; y: number }
  | { id: string; type: "move"; from: BoardPosition; to: BoardPosition }
  | { id: string; type: "attack"; from: BoardPosition; to: BoardPosition; ranged: boolean }
  | { id: string; type: "damage"; x: number; y: number; amount: number }
  | { id: string; type: "death"; x: number; y: number }
  | { id: string; type: "coreHit"; x: number; y: number; owner: PlayerId; amount: number };

function cellStyle(position: BoardPosition) {
  return {
    "--effect-x": position.x,
    "--effect-y": position.y
  } as CSSProperties;
}

function lineStyle(from: BoardPosition, to: BoardPosition) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    "--effect-x": from.x,
    "--effect-y": from.y,
    "--effect-dx": dx,
    "--effect-dy": dy,
    "--effect-distance": distance,
    "--effect-angle": `${angle}deg`
  } as CSSProperties;
}

type Props = {
  effects: VisualEffect[];
};

export function BoardEffects({ effects }: Props) {
  return (
    <div className="board-effects" aria-hidden="true">
      {effects.map((effect) => {
        if (effect.type === "summon") {
          return <span key={effect.id} className="summon-burst board-effect-cell" style={cellStyle(effect)} />;
        }

        if (effect.type === "move") {
          return <span key={effect.id} className="movement-trail" style={lineStyle(effect.from, effect.to)} />;
        }

        if (effect.type === "attack") {
          return (
            <span
              key={effect.id}
              className={effect.ranged ? "attack-projectile" : "attack-slash"}
              style={lineStyle(effect.from, effect.to)}
            />
          );
        }

        if (effect.type === "damage") {
          return <span key={effect.id} className="damage-float board-effect-cell" style={cellStyle(effect)}>-{effect.amount}</span>;
        }

        if (effect.type === "death") {
          return <span key={effect.id} className="death-burst board-effect-cell" style={cellStyle(effect)} />;
        }

        return (
          <span
            key={effect.id}
            className={`core-hit-wave core-hit-wave--${effect.owner.toLowerCase()} board-effect-cell`}
            style={cellStyle(effect)}
          />
        );
      })}
    </div>
  );
}
