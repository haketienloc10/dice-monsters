import { monsters } from "../game/data/monsters";
import type { GameState } from "../game/types";
import { monsterVisuals } from "./MonsterToken";

type Props = {
  state: GameState;
};

export function MonsterInfoPanel({ state }: Props) {
  const monster = state.selectedMonsterId ? state.monsters[state.selectedMonsterId] : undefined;
  const definition = monster ? monsters[monster.definitionId] : undefined;
  const visual = monster && definition ? monsterVisuals[monster.definitionId] ?? { icon: "◆", label: definition.name, tone: "steel" } : undefined;

  return (
    <section className="panel monster-info" aria-label="Monster info">
      <h2>Monster</h2>
      {!monster || !definition ? (
        <p className="muted">Select a monster on the board.</p>
      ) : (
        <>
          <div className={`monster-card-portrait monster-card-portrait--${monster.owner.toLowerCase()}`}>
            <span className={`monster-card-portrait__sigil monster-card-portrait__sigil--${visual?.tone ?? "steel"}`}>
              {visual?.icon ?? definition.name.slice(0, 1)}
            </span>
            <i aria-hidden="true" />
            <em>{monster.owner}</em>
          </div>
          <h3>{definition.name}</h3>
          <p className="monster-subtitle">{definition.type}</p>
          <div className="hp-bar" aria-label={`HP ${monster.hp} of ${definition.hp}`}>
            <span style={{ width: `${Math.max(0, (monster.hp / definition.hp) * 100)}%` }} />
          </div>
          <div className="stat-grid">
            <span>Owner</span>
            <strong>{monster.owner}</strong>
            <span>Type</span>
            <strong>{definition.type}</strong>
            <span>Level</span>
            <strong>{definition.level}</strong>
            <span>HP</span>
            <strong>
              {monster.hp}/{definition.hp}
            </strong>
            <span>ATK</span>
            <strong>{definition.atk}</strong>
            <span>DEF</span>
            <strong>{definition.def}</strong>
            <span>Range</span>
            <strong>{definition.range}</strong>
            <span>Move</span>
            <strong>{definition.move}</strong>
          </div>
          {definition.skillName && (
            <div className="skill-text">
              <strong>{definition.skillName}</strong>
              <span>{definition.skillText}</span>
            </div>
          )}
          <div className="status-row" aria-label="Monster status badges">
            <span>{monster.hasActedAttack ? "Acted" : "Ready"}</span>
            <span>{visual?.label ?? "Unit"}</span>
          </div>
        </>
      )}
    </section>
  );
}
