import { diceCatalog } from "../game/data/diceCatalog";
import { tileShapes } from "../game/data/tileShapes";
import type { GameState } from "../game/types";

type Props = {
  state: GameState;
};

export function TileShapePreview({ state }: Props) {
  const die = diceCatalog.find((candidate) => candidate.id === state.selectedSummonDiceId);
  const shape = die ? tileShapes[die.tileShapeId] : undefined;

  return (
    <section className="panel shape-panel" aria-label="Tile shape preview">
      <h2>Tile Shape</h2>
      {!shape ? (
        <p className="muted">Choose a summon candidate to place a dungeon shape.</p>
      ) : (
        <>
          <strong>{shape.name}</strong>
          <span>Rotation: {state.placementRotation * 90}°</span>
          <div className="mini-shape">
            {shape.offsets.map((offset) => (
              <span
                key={`${offset.dx}-${offset.dy}`}
                style={{
                  gridColumn: offset.dx + 3,
                  gridRow: offset.dy + 3
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
