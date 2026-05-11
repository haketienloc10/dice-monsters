import { CREST_ICONS, CREST_LABELS, CREST_TYPES } from "../game/constants";
import type { PlayerState } from "../game/types";

type Props = {
  player: PlayerState;
};

export function CrestBar({ player }: Props) {
  return (
    <section className="panel crest-bar" aria-label="Current player crests">
      <h2>Crests</h2>
      <div className="crest-grid">
        {CREST_TYPES.map((crest) => (
          <div className="crest-pill" key={crest}>
            <span>{CREST_ICONS[crest]}</span>
            <strong>{CREST_LABELS[crest]}</strong>
            <em>{player.crestPool[crest]}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
