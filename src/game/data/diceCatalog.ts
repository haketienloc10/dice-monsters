import type { DiceDefinition } from "../types";

export const diceCatalog: DiceDefinition[] = [
  {
    id: "dice-little-swordsman",
    name: "Little Swordsman Dice",
    level: 1,
    monsterId: "little-swordsman",
    tileShapeId: "straight2",
    faces: [
      { crest: "summon", summonLevel: 1 },
      { crest: "summon", summonLevel: 1 },
      { crest: "move" },
      { crest: "move" },
      { crest: "attack" },
      { crest: "defense" }
    ]
  },
  {
    id: "dice-stone-guardian",
    name: "Stone Guardian Dice",
    level: 2,
    monsterId: "stone-guardian",
    tileShapeId: "l3",
    faces: [
      { crest: "summon", summonLevel: 2 },
      { crest: "summon", summonLevel: 2 },
      { crest: "defense" },
      { crest: "defense" },
      { crest: "move" },
      { crest: "magic" }
    ]
  },
  {
    id: "dice-skyblade-avian",
    name: "Skyblade Avian Dice",
    level: 2,
    monsterId: "skyblade-avian",
    tileShapeId: "t4",
    faces: [
      { crest: "summon", summonLevel: 2 },
      { crest: "summon", summonLevel: 2 },
      { crest: "move" },
      { crest: "move" },
      { crest: "attack" },
      { crest: "magic" }
    ]
  },
  {
    id: "dice-ember-dragon",
    name: "Ember Dragon Dice",
    level: 3,
    monsterId: "ember-dragon",
    tileShapeId: "cross5",
    faces: [
      { crest: "summon", summonLevel: 3 },
      { crest: "summon", summonLevel: 3 },
      { crest: "attack" },
      { crest: "attack" },
      { crest: "move" },
      { crest: "magic" }
    ]
  },
  {
    id: "dice-rune-mage",
    name: "Rune Mage Dice",
    level: 2,
    monsterId: "rune-mage",
    tileShapeId: "straight3",
    faces: [
      { crest: "summon", summonLevel: 2 },
      { crest: "summon", summonLevel: 2 },
      { crest: "attack" },
      { crest: "magic" },
      { crest: "magic" },
      { crest: "move" }
    ]
  },
  {
    id: "dice-wolf-scout",
    name: "Wolf Scout Dice",
    level: 1,
    monsterId: "wolf-scout",
    tileShapeId: "straight3",
    faces: [
      { crest: "summon", summonLevel: 1 },
      { crest: "summon", summonLevel: 1 },
      { crest: "move" },
      { crest: "move" },
      { crest: "move" },
      { crest: "trap" }
    ]
  },
  {
    id: "dice-iron-golem",
    name: "Iron Golem Dice",
    level: 3,
    monsterId: "iron-golem",
    tileShapeId: "cross5",
    faces: [
      { crest: "summon", summonLevel: 3 },
      { crest: "summon", summonLevel: 3 },
      { crest: "defense" },
      { crest: "defense" },
      { crest: "attack" },
      { crest: "move" }
    ]
  },
  {
    id: "dice-shadow-imp",
    name: "Shadow Imp Dice",
    level: 1,
    monsterId: "shadow-imp",
    tileShapeId: "l3",
    faces: [
      { crest: "summon", summonLevel: 1 },
      { crest: "summon", summonLevel: 1 },
      { crest: "attack" },
      { crest: "attack" },
      { crest: "move" },
      { crest: "trap" }
    ]
  }
];
