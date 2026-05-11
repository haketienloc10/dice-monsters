import type { PlayerState } from "../game/types";

type Props = {
  player: PlayerState;
  active: boolean;
};

export function PlayerCorePanel({ player, active }: Props) {
  return (
    <section className={`panel core-panel core-panel--${player.id.toLowerCase()} ${active ? "core-panel--active" : ""}`}>
      <span>{player.id}</span>
      <strong>{player.name}</strong>
      <div className="core-hp">Heart Core {player.coreHp}/10</div>
    </section>
  );
}
