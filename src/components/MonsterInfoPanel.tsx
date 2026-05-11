import { monsters } from "../game/data/monsters";
import type { GameState } from "../game/types";

type Props = {
  state: GameState;
};

export function MonsterInfoPanel({ state }: Props) {
  const monster = state.selectedMonsterId ? state.monsters[state.selectedMonsterId] : undefined;
  const definition = monster ? monsters[monster.definitionId] : undefined;

  return (
    <section className="panel monster-info" aria-label="Monster info">
      <h2>Monster</h2>
      {!monster || !definition ? (
        <p className="muted">Select a monster on the board.</p>
      ) : (
        <>
          <h3>{definition.name}</h3>
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
            <p className="skill-text">
              <strong>{definition.skillName}:</strong> {definition.skillText}
            </p>
          )}
        </>
      )}
    </section>
  );
}
