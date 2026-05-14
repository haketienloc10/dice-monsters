import type { MonsterDefinition } from "../types";

export const monsters: Record<string, MonsterDefinition> = {
  "little-swordsman": {
    id: "little-swordsman",
    name: "Little Swordsman",
    type: "Warrior",
    level: 1,
    hp: 2,
    atk: 2,
    def: 0,
    range: 1,
    move: 3,
    skillName: "Brave Step",
    skillText: "A nimble duelist built for early pressure."
  },
  "stone-guardian": {
    id: "stone-guardian",
    name: "Stone Guardian",
    type: "Construct",
    level: 2,
    hp: 5,
    atk: 2,
    def: 2,
    range: 1,
    move: 1,
    skillName: "Granite Hide",
    skillText: "High defense makes it hard to remove."
  },
  "skyblade-avian": {
    id: "skyblade-avian",
    name: "Skyblade Avian",
    type: "Avian",
    level: 2,
    hp: 3,
    atk: 3,
    def: 1,
    range: 1,
    move: 4,
    skillName: "Wing Rush",
    skillText: "Fast striker that can cross long corridors."
  },
  "ember-dragon": {
    id: "ember-dragon",
    name: "Ember Dragon",
    type: "Dragon",
    level: 3,
    hp: 6,
    atk: 4,
    def: 2,
    range: 1,
    move: 2,
    skillName: "Cinder Bite",
    skillText: "Heavy melee threat for finishing fights."
  },
  "rune-mage": {
    id: "rune-mage",
    name: "Rune Mage",
    type: "Caster",
    level: 2,
    hp: 3,
    atk: 2,
    def: 0,
    range: 2,
    move: 2,
    skillId: "power-charge",
    skillName: "Power Charge",
    skillText: "Spend 1 Magic to gain +1 ATK on this monster's next attack."
  },
  "wolf-scout": {
    id: "wolf-scout",
    name: "Wolf Scout",
    type: "Beast",
    level: 1,
    hp: 2,
    atk: 1,
    def: 0,
    range: 1,
    move: 4,
    skillName: "Trail Finder",
    skillText: "Quick unit for claiming routes."
  },
  "iron-golem": {
    id: "iron-golem",
    name: "Iron Golem",
    type: "Golem",
    level: 3,
    hp: 7,
    atk: 3,
    def: 3,
    range: 1,
    move: 1,
    skillName: "Iron Bulwark",
    skillText: "Slow, durable front line."
  },
  "shadow-imp": {
    id: "shadow-imp",
    name: "Shadow Imp",
    type: "Fiend",
    level: 1,
    hp: 2,
    atk: 2,
    def: 0,
    range: 1,
    move: 3,
    skillName: "Sneak Jab",
    skillText: "Cheap attacker with good tempo."
  }
};
