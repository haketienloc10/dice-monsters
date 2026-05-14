import { CREST_ICONS } from "./constants";
import { diceCatalog } from "./data/diceCatalog";
import { monsters as monsterDefinitions } from "./data/monsters";
import { createInitialState } from "./initialState";
import { addLog, cloneGameState, getCell, getOpponent, positionKey, samePosition } from "./rules/board";
import { calculateCoreDamage, calculateMonsterDamage, calculatePowerChargeMonsterDamage, getValidAttackTargets } from "./rules/combat";
import { addRolledCrests, getSummonCandidates, rollDicePool } from "./rules/dice";
import { getMovementDistance, getReachableCells } from "./rules/movement";
import { getShapeCells, getValidPlacementAnchors, isValidDungeonPlacement } from "./rules/summon";
import { endTurn } from "./rules/turn";
import type { AttackTarget, GameAction, GameState } from "./types";

function eventId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clearInteraction(state: GameState): void {
  state.interactionMode = "none";
  state.highlightedCells = [];
  state.validAttackTargets = [];
}

function diceById(diceId: string) {
  return diceCatalog.find((die) => die.id === diceId);
}

function targetKey(target: AttackTarget): string {
  return target.type === "monster" ? `monster:${target.monsterId}` : `core:${target.playerId}`;
}

function sameTarget(a: AttackTarget, b: AttackTarget): boolean {
  return targetKey(a) === targetKey(b);
}

function playerLogLabel(state: GameState, playerId = state.currentPlayer): string {
  return state.settings.controls[playerId] === "ai" ? `${playerId} AI` : playerId;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.phase === "gameOver" && action.type !== "RESET_GAME") return state;

  switch (action.type) {
    case "RESET_GAME":
      return createInitialState();

    case "ROLL_DICE": {
      if (state.phase !== "roll") return state;
      const next = cloneGameState(state);
      const player = next.players[next.currentPlayer];
      const roll = rollDicePool(player.dicePool, 3);
      player.crestPool = addRolledCrests(player.crestPool, roll);
      next.latestRoll = roll;
      next.summonCandidates = getSummonCandidates(roll);
      next.phase = next.summonCandidates.length > 0 ? "summon" : "action";
      next.lastEvent = {
        id: eventId("rolled"),
        type: "rolled",
        playerId: next.currentPlayer,
        results: roll
      };
      clearInteraction(next);
      addLog(
        next,
        `${playerLogLabel(next)} rolled: ${roll.map((result) => `${CREST_ICONS[result.face.crest]} ${result.face.crest}`).join(", ")}.`
      );
      return next;
    }

    case "SELECT_SUMMON_CANDIDATE": {
      if (state.phase !== "summon" || !state.summonCandidates.includes(action.diceId)) return state;
      const next = cloneGameState(state);
      const die = diceById(action.diceId);
      if (!die) return state;
      next.selectedSummonDiceId = action.diceId;
      next.interactionMode = "placing";
      next.highlightedCells = getValidPlacementAnchors(next, next.currentPlayer, die.tileShapeId, next.placementRotation);
      next.validAttackTargets = [];
      return next;
    }

    case "ROTATE_PLACEMENT": {
      if (state.interactionMode !== "placing" || !state.selectedSummonDiceId) return state;
      const selectedDiceId = state.selectedSummonDiceId;
      const next = cloneGameState(state);
      const die = diceById(selectedDiceId);
      if (!die) return state;
      next.placementRotation = (next.placementRotation + 1) % 4;
      next.highlightedCells = getValidPlacementAnchors(next, next.currentPlayer, die.tileShapeId, next.placementRotation);
      return next;
    }

    case "PLACE_DUNGEON_SHAPE": {
      if (state.phase !== "summon" || state.interactionMode !== "placing" || !state.selectedSummonDiceId) return state;
      const die = diceById(state.selectedSummonDiceId);
      if (!die) return state;
      const rotation = action.rotation ?? state.placementRotation;
      if (!isValidDungeonPlacement(state, state.currentPlayer, die.tileShapeId, action, rotation)) return state;

      const next = cloneGameState(state);
      const shapeCells = getShapeCells(die.tileShapeId, action, rotation);
      const monsterDefinition = monsterDefinitions[die.monsterId];
      const instanceId = `${die.monsterId}-${next.currentPlayer}-${Date.now()}-${Object.keys(next.monsters).length}`;
      const summonCell = shapeCells[0];

      for (const position of shapeCells) {
        const cell = getCell(next.board, position);
        if (cell) {
          cell.hasDungeonTile = true;
          cell.tileOwner = next.currentPlayer;
          cell.owner = next.currentPlayer;
        }
      }

      next.monsters[instanceId] = {
        instanceId,
        definitionId: monsterDefinition.id,
        owner: next.currentPlayer,
        x: summonCell.x,
        y: summonCell.y,
        hp: monsterDefinition.hp,
        hasActedAttack: false
      };
      const cell = getCell(next.board, summonCell);
      if (cell) cell.monsterId = instanceId;

      next.players[next.currentPlayer].summonedMonsterIds.push(instanceId);
      next.selectedMonsterId = instanceId;
      next.selectedSummonDiceId = undefined;
      next.summonCandidates = [];
      next.phase = "action";
      next.lastEvent = {
        id: eventId("summoned"),
        type: "summoned",
        playerId: next.currentPlayer,
        monsterId: instanceId,
        position: { x: summonCell.x, y: summonCell.y },
        placedCells: shapeCells.map((position) => ({ x: position.x, y: position.y }))
      };
      clearInteraction(next);
      addLog(next, `${playerLogLabel(next)} summoned ${monsterDefinition.name} at (${summonCell.x},${summonCell.y}).`);
      return next;
    }

    case "SKIP_SUMMON": {
      if (state.phase !== "summon") return state;
      const next = cloneGameState(state);
      next.phase = "action";
      next.selectedSummonDiceId = undefined;
      next.summonCandidates = [];
      clearInteraction(next);
      addLog(next, `${playerLogLabel(next)} skipped summon.`);
      return next;
    }

    case "SELECT_MONSTER": {
      const monster = state.monsters[action.monsterId];
      if (!monster) return state;
      const next = cloneGameState(state);
      next.selectedMonsterId = action.monsterId;
      clearInteraction(next);
      return next;
    }

    case "ENTER_MOVE_MODE": {
      if (state.phase !== "action" || !state.selectedMonsterId) return state;
      const monster = state.monsters[state.selectedMonsterId];
      if (!monster || monster.owner !== state.currentPlayer || state.players[state.currentPlayer].crestPool.move <= 0) return state;
      const reachable = getReachableCells(state, monster.instanceId);
      const next = cloneGameState(state);
      next.interactionMode = "moving";
      next.highlightedCells = reachable;
      next.validAttackTargets = [];
      return next;
    }

    case "MOVE_MONSTER": {
      if (state.phase !== "action" || state.interactionMode !== "moving" || !state.selectedMonsterId) return state;
      const distance = getMovementDistance(state, state.selectedMonsterId, action);
      if (!distance || distance <= 0) return state;

      const next = cloneGameState(state);
      const monster = next.monsters[next.selectedMonsterId!];
      const oldCell = getCell(next.board, monster);
      const newCell = getCell(next.board, action);
      if (!newCell || !oldCell) return state;

      oldCell.monsterId = undefined;
      newCell.monsterId = monster.instanceId;
      monster.x = action.x;
      monster.y = action.y;
      next.players[next.currentPlayer].crestPool.move -= distance;
      next.lastEvent = {
        id: eventId("moved"),
        type: "moved",
        playerId: next.currentPlayer,
        monsterId: monster.instanceId,
        from: { x: oldCell.x, y: oldCell.y },
        to: { x: action.x, y: action.y },
        distance
      };
      clearInteraction(next);
      addLog(next, `${playerLogLabel(next)} moved ${monsterDefinitions[monster.definitionId].name} to (${action.x},${action.y}) for ${distance} move.`);
      return next;
    }

    case "ENTER_ATTACK_MODE": {
      if (state.phase !== "action" || !state.selectedMonsterId) return state;
      const monster = state.monsters[state.selectedMonsterId];
      if (
        !monster ||
        monster.owner !== state.currentPlayer ||
        monster.hasActedAttack ||
        state.players[state.currentPlayer].crestPool.attack <= 0
      ) {
        return state;
      }
      const targets = getValidAttackTargets(state, monster.instanceId);
      const next = cloneGameState(state);
      next.interactionMode = "attacking";
      next.validAttackTargets = targets;
      next.highlightedCells = targets.map(({ x, y }) => ({ x, y }));
      return next;
    }

    case "USE_POWER_CHARGE": {
      if (state.phase !== "action") return state;
      const monster = state.monsters[action.monsterId];
      const definition = monster ? monsterDefinitions[monster.definitionId] : undefined;
      const cell = monster ? getCell(state.board, monster) : undefined;
      if (
        !monster ||
        definition?.skillId !== "power-charge" ||
        monster.owner !== state.currentPlayer ||
        cell?.monsterId !== monster.instanceId ||
        monster.powerChargeActive ||
        state.players[state.currentPlayer].crestPool.magic <= 0
      ) {
        return state;
      }

      const next = cloneGameState(state);
      const chargedMonster = next.monsters[action.monsterId];
      const chargedDefinition = monsterDefinitions[chargedMonster.definitionId];
      next.players[next.currentPlayer].crestPool.magic -= 1;
      chargedMonster.powerChargeActive = true;
      next.lastEvent = {
        id: eventId("powerCharged"),
        type: "powerCharged",
        playerId: next.currentPlayer,
        monsterId: chargedMonster.instanceId,
        position: { x: chargedMonster.x, y: chargedMonster.y }
      };
      clearInteraction(next);
      addLog(next, `${playerLogLabel(next)} used Power Charge on ${chargedDefinition.name}: +1 ATK next attack.`);
      return next;
    }

    case "ATTACK_TARGET": {
      if (state.phase !== "action" || state.interactionMode !== "attacking" || !state.selectedMonsterId) return state;
      const validTargets = getValidAttackTargets(state, state.selectedMonsterId);
      if (!validTargets.some((target) => sameTarget(target, action.target))) return state;

      const next = cloneGameState(state);
      const attacker = next.monsters[next.selectedMonsterId!];
      const attackerDefinition = monsterDefinitions[attacker.definitionId];
      const from = { x: attacker.x, y: attacker.y };
      const wasPowerCharged = Boolean(attacker.powerChargeActive);
      next.players[next.currentPlayer].crestPool.attack -= 1;
      attacker.hasActedAttack = true;

      if (action.target.type === "monster") {
        const defender = next.monsters[action.target.monsterId];
        if (!defender) return state;
        const defenderDefinition = monsterDefinitions[defender.definitionId];
        const damage = wasPowerCharged
          ? calculatePowerChargeMonsterDamage(attackerDefinition.atk, defenderDefinition.def)
          : calculateMonsterDamage(attackerDefinition.atk, defenderDefinition.def);
        defender.hp -= damage;
        next.lastEvent = {
          id: eventId("attacked"),
          type: "attacked",
          playerId: next.currentPlayer,
          attackerId: attacker.instanceId,
          target: action.target,
          from,
          to: { x: action.target.x, y: action.target.y },
          damage
        };
        addLog(next, `${playerLogLabel(next)} attacked ${defenderDefinition.name} for ${damage} damage.`);
        if (wasPowerCharged) {
          attacker.powerChargeActive = undefined;
          addLog(next, `${attackerDefinition.name}'s Power Charge was consumed.`);
        }
        if (defender.hp <= 0) {
          const cell = getCell(next.board, defender);
          if (cell) cell.monsterId = undefined;
          delete next.monsters[defender.instanceId];
          next.players[defender.owner].summonedMonsterIds = next.players[defender.owner].summonedMonsterIds.filter(
            (id) => id !== defender.instanceId
          );
          next.lastEvent.destroyedMonsterId = defender.instanceId;
          addLog(next, `${defenderDefinition.name} was destroyed.`);
        }
      } else {
        const damage = calculateCoreDamage(attackerDefinition.atk, wasPowerCharged);
        next.players[action.target.playerId].coreHp = Math.max(0, next.players[action.target.playerId].coreHp - damage);
        next.lastEvent = {
          id: eventId("attacked"),
          type: "attacked",
          playerId: next.currentPlayer,
          attackerId: attacker.instanceId,
          target: action.target,
          from,
          to: { x: action.target.x, y: action.target.y },
          damage,
          coreOwnerHit: action.target.playerId
        };
        addLog(next, `${playerLogLabel(next)} attacked ${action.target.playerId} core for ${damage} damage.`);
        if (wasPowerCharged) {
          attacker.powerChargeActive = undefined;
          addLog(next, `${attackerDefinition.name}'s Power Charge was consumed.`);
        }
        if (next.players[action.target.playerId].coreHp <= 0) {
          next.winner = next.currentPlayer;
          next.phase = "gameOver";
          addLog(next, `${playerLogLabel(next)} destroyed the enemy Heart Core and wins.`);
        }
      }

      clearInteraction(next);
      return next;
    }

    case "END_TURN": {
      if (state.phase !== "action" && state.phase !== "summon") return state;
      const next = endTurn(cloneGameState(state));
      next.lastEvent = {
        id: eventId("turnEnded"),
        type: "turnEnded",
        from: state.currentPlayer,
        to: next.currentPlayer,
        phase: next.phase
      };
      addLog(next, `${playerLogLabel(state)} ended turn. ${next.currentPlayer} begins.`);
      return next;
    }

    default:
      return state;
  }
}

export function cellHasHighlight(cells: { x: number; y: number }[], x: number, y: number): boolean {
  return cells.some((cell) => samePosition(cell, { x, y }));
}

export function cellTargetAt(targets: AttackTarget[], x: number, y: number): AttackTarget | undefined {
  return targets.find((target) => target.x === x && target.y === y);
}

export function canCurrentPlayerSelectForAction(state: GameState, monsterId: string): boolean {
  return state.monsters[monsterId]?.owner === state.currentPlayer;
}

export function keyForPosition(position: { x: number; y: number }): string {
  return positionKey(position);
}
