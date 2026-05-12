import { monsters } from "../game/data/monsters";
import type { MonsterInstance } from "../game/types";

type Props = {
  monster: MonsterInstance;
  selected?: boolean;
  damaged?: boolean;
  attacking?: boolean;
  moved?: boolean;
};

const monsterVisuals: Record<string, { icon: string; label: string; tone: string }> = {
  "little-swordsman": { icon: "⚔", label: "Sword", tone: "steel" },
  "stone-guardian": { icon: "◆", label: "Guard", tone: "green" },
  "skyblade-avian": { icon: "✦", label: "Avian", tone: "cyan" },
  "ember-dragon": { icon: "▲", label: "Dragon", tone: "red" },
  "rune-mage": { icon: "✹", label: "Mage", tone: "purple" },
  "wolf-scout": { icon: "◈", label: "Scout", tone: "gray" },
  "iron-golem": { icon: "⬟", label: "Golem", tone: "steel" },
  "shadow-imp": { icon: "✧", label: "Imp", tone: "violet" }
};

export function MonsterToken({ monster, selected = false, damaged = false, attacking = false, moved = false }: Props) {
  const definition = monsters[monster.definitionId];
  const visual = monsterVisuals[monster.definitionId] ?? { icon: "◆", label: definition.name, tone: "steel" };

  const className = [
    "monster-token",
    `monster-token--${monster.owner.toLowerCase()}`,
    `monster-token--${visual.tone}`,
    selected ? "monster-token--selected" : "",
    damaged ? "monster-token--damaged" : "",
    attacking ? "monster-token--attacking" : "",
    moved ? "monster-token--moved" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} title={`${definition.name} HP ${monster.hp}/${definition.hp}`}>
      <span className="monster-token__shadow" />
      <span className="monster-token__icon" aria-hidden="true">{visual.icon}</span>
      <span className="monster-token__label">{visual.label}</span>
      <span className="monster-token__level">L{definition.level}</span>
      <span className="monster-token__hp">{monster.hp}</span>
    </span>
  );
}
