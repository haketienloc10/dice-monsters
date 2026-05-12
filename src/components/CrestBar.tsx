import { CREST_ICONS, CREST_LABELS, CREST_TYPES } from "../game/constants";
import type { GameEvent, PlayerState } from "../game/types";

type Props = {
  player: PlayerState;
  lastEvent?: GameEvent;
};

export function CrestBar({ player, lastEvent }: Props) {
  const shouldPop = lastEvent?.type === "rolled" || lastEvent?.type === "moved" || lastEvent?.type === "attacked";

  return (
    <section className="panel crest-bar" aria-label="Current player crests">
      <div className="panel-heading">
        <h2>Crests</h2>
        <span>{player.name}</span>
      </div>
      <div className="crest-grid">
        {CREST_TYPES.map((crest) => (
          <div className={shouldPop ? "crest-pill crest-pill--pop" : "crest-pill"} key={`${crest}-${player.crestPool[crest]}-${lastEvent?.id ?? "none"}`}>
            <span className={`crest-gem crest-gem--${crest}`}>{CREST_ICONS[crest]}</span>
            <strong>{CREST_LABELS[crest]}</strong>
            <em>{player.crestPool[crest]}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
