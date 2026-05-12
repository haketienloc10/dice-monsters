import { CREST_ICONS } from "../game/constants";
import type { GameState } from "../game/types";

type Props = {
  state: GameState;
  onRoll: () => void;
  disabled?: boolean;
  rolling?: boolean;
};

export function DiceTray({ state, onRoll, disabled = false, rolling = false }: Props) {
  return (
    <section className="dice-tray" aria-label="Dice tray">
      <div className="dice-results">
        {state.latestRoll.length === 0 ? (
          <div className="empty-dice">Dice await the command</div>
        ) : (
          state.latestRoll.map((result) => (
            <div className={rolling ? "die-card die-card--rolling" : "die-card"} key={`${result.diceId}-${result.diceName}`}>
              <strong>{result.diceName}</strong>
              <span className="crest-face">{CREST_ICONS[result.face.crest]}</span>
              <small>{result.face.crest}</small>
            </div>
          ))
        )}
      </div>
      <button className="primary-button roll-button" type="button" onClick={onRoll} disabled={disabled || state.phase !== "roll"}>
        Roll Dice
      </button>
    </section>
  );
}
