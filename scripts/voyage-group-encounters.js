(function(){
  // -------------------------------------------------------------------
  // VOYAGE GROUP ENCOUNTERS — San's own request: "Pirates off the port
  // bow" and "A haunting song drifts over the water" (siren_pack) read
  // as a GROUP of foes, not one single HP-pool blob standing in for a
  // frigate or a pack of sirens. A kraken, ghost galleon, sea serpent,
  // or giant octopus stays exactly what it was -- one creature, one
  // fight -- only the two voyage encounters that are narratively a
  // group get split this way.
  //
  // This deliberately reuses Raid Mode's own proven shape (scripts/
  // raid-mode.js: enterRaid/startRaidStage/its handleVictory wrap) --
  // fight one foe at a time, defeat it, the next one steps up ~600ms
  // later in the same encounter, no trip back to port in between --
  // rather than building real simultaneous multi-target combat, which
  // would mean touching every kind-specific branch anywhere in this
  // codebase that reads game.combatEnemy (dozens of files). Every
  // individual foe below still goes through the ordinary single-enemy
  // startCombat/handleVictory/handleDefeat/fleeCombat path, with its own
  // normal reward grant and "Victory!" screen -- only the chaining
  // between foes is new.
  //
  // Total hp/xp/gold across the whole group matches what the single
  // blob would have given -- this is about making the encounter feel
  // like facing several foes, not a reward-inflation stack. Splitting
  // hp N ways without reducing total turns-to-clear also makes an
  // interception genuinely more dangerous than before: the crew no
  // longer gets a free full-HP/MP breather between foes the way a Raid
  // stage does, since this is meant to read as one continuous fight.
  // -------------------------------------------------------------------
  const SEA_GROUP_SIZES = { rival_frigate: 2, siren_pack: 3 };
  window.SEA_GROUP_SIZES = SEA_GROUP_SIZES;

  function buildSeaGroup(baseKey, count){
    const scaled = scaledEnemyForExplore(baseKey, 'sea');
    const group = [];
    for (let i = 0; i < count; i++){
      group.push(Object.assign({}, scaled, {
        name: scaled.name + ' (' + (i + 1) + '/' + count + ')',
        hp: Math.max(1, Math.round(scaled.hp / count)),
        xp: Math.max(1, Math.round(scaled.xp / count)),
        gold: Math.max(1, Math.round(scaled.gold / count))
      }));
    }
    return group;
  }
  window.buildSeaGroup = buildSeaGroup;

  // Entry point for any voyage combat event -- falls back to the
  // ordinary single-enemy fight for every key not in SEA_GROUP_SIZES,
  // so doVoyage() can call this unconditionally for every sea combat
  // event without needing to know which ones are groups.
  function startSeaGroupEncounter(baseKey){
    const count = SEA_GROUP_SIZES[baseKey];
    if (!count) {
      startCombat({ kind: 'sea', key: baseKey, enemy: scaledEnemyForExplore(baseKey, 'sea') });
      return;
    }
    game.seaGroupEncounter = { active: true, baseKey: baseKey, queue: buildSeaGroup(baseKey, count), index: 0 };
    startNextSeaGroupFoe();
  }
  window.startSeaGroupEncounter = startSeaGroupEncounter;

  function startNextSeaGroupFoe(){
    const g = game.seaGroupEncounter;
    if (!g || !g.active) return;
    const enemy = g.queue[g.index];
    if (!enemy) { exitSeaGroupEncounter(); return; }
    toast('⚔️ ' + enemy.name + ' closes in!', 2600);
    startCombat({ kind: 'sea', key: g.baseKey, enemy: enemy });
  }
  window.startNextSeaGroupFoe = startNextSeaGroupFoe;

  function exitSeaGroupEncounter(){
    game.seaGroupEncounter = { active: false, baseKey: null, queue: [], index: 0 };
  }
  window.exitSeaGroupEncounter = exitSeaGroupEncounter;

  // Losing mid-group ends the whole encounter, same pattern as Raid
  // Mode's own handleDefeat wrap clearing game.raid.active.
  const oldHandleDefeatForSeaGroup = window.handleDefeat;
  window.handleDefeat = function(){
    const wasGroup = !!(game.seaGroupEncounter && game.seaGroupEncounter.active);
    if (oldHandleDefeatForSeaGroup) oldHandleDefeatForSeaGroup();
    if (wasGroup) exitSeaGroupEncounter();
  };

  // A successful flee (fleeCombat(), core-engine.js) sets game.inCombat
  // = false directly without ever calling handleDefeat/handleVictory --
  // so unlike a loss, nothing else would clear a mid-group encounter.
  // Detected by whether combat actually ended after the real fleeCombat
  // runs, since a FAILED flee attempt (the enemy gets a free hit instead)
  // must leave the group exactly as it was.
  const oldFleeCombatForSeaGroup = window.fleeCombat;
  window.fleeCombat = function(){
    const wasGroup = !!(game.seaGroupEncounter && game.seaGroupEncounter.active);
    if (oldFleeCombatForSeaGroup) oldFleeCombatForSeaGroup();
    if (wasGroup && !game.inCombat) exitSeaGroupEncounter();
  };

  // Every foe's defeat runs the FULL ordinary handleVictory first --
  // reward grant, logging, and the normal "Victory! Battle complete"
  // post-battle screen -- exactly like Raid Mode's own wrap. Only
  // afterward does this check whether another foe is still queued and,
  // if so, auto-continue ~600ms later (the same transition timing Raid
  // Mode uses between stages), which replaces that just-rendered victory
  // screen with the next foe's fight.
  const oldHandleVictoryForSeaGroup = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForSeaGroup) oldHandleVictoryForSeaGroup();
    const g = game.seaGroupEncounter;
    if (!g || !g.active) return;
    g.index++;
    if (g.index >= g.queue.length) {
      // Full clear, as opposed to a loss or a flee (neither of which
      // reach this branch) -- tracked purely for achievements.js's own
      // "Divide and Conquer"/"The Crew Knows the Drill".
      game.seaGroupClears = (game.seaGroupClears || 0) + 1;
      exitSeaGroupEncounter();
      return;
    }
    setTimeout(startNextSeaGroupFoe, 600);
  };
})();
