import { CREST_ICONS } from "../game/constants";
import type { GameState } from "../game/types";

type Props = {
  state: GameState;
  onRoll: () => void;
  disabled?: boolean;
  rolling?: boolean;
};

export function DiceTray({ state, onRoll, disabled = false, rolling = false }: Props) {
  const diceSlots = [0, 1, 2].map((slot) => state.latestRoll[slot]);

  return (
    <section className="dice-tray" aria-label="Dice tray">
      <div className="dice-tray__header">
        <span>Rune Dice Tray</span>
        <small>{state.phase === "roll" ? "Roll 3 dice. Use crests to act." : "Final faces match the latest roll."}</small>
      </div>
      <div className="dice-results">
        {diceSlots.map((result, index) => (
          <div
            className={rolling ? "die-card die-card--rolling" : result ? "die-card" : "die-card die-card--empty"}
            key={result ? `${result.diceId}-${result.diceName}-${index}` : `empty-die-${index}`}
          >
            <span className="die-card__corner" aria-hidden="true">{index + 1}</span>
            <strong>{result?.diceName ?? "Unrolled Die"}</strong>
            <span className="crest-face">{result ? CREST_ICONS[result.face.crest] : "◇"}</span>
            <small>{result?.face.crest ?? "awaiting"}</small>
          </div>
        ))}
      </div>
      <button className="primary-button roll-button" type="button" onClick={onRoll} disabled={disabled || state.phase !== "roll"}>
        Roll Dice
      </button>
    </section>
  );
}
