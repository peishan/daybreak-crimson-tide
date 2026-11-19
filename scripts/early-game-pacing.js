(function(){
  // -------------------------------------------------------------------
  // EARLY GAME PACING.
  //
  // 1. DAYBREAK WARD: San's starting skill used to do nothing at all (only a log line). It is now a party-wide
  //    shield: 10 MP, incoming damage cut by 25% for 3 turns (the same shield the Shield spell uses,
  //    which cuts only 4%). It never lowers a stronger shield that is already up.
  // (Crew hiring waits for Level 5: that check now lives in core-engine.js, hireTemporaryCrew and the Tavern list.)
  // (Chapter 1 now pays 800 Story XP, so Level 5 comes after a few fights, not a long grind: core-engine.js.)
  // -------------------------------------------------------------------
  const WARD_PCT = 0.25, WARD_TURNS = 3;

  // ---- Daybreak Ward ----
  window.CT_WARD = { pct: WARD_PCT, turns: WARD_TURNS };
  const oldAction = window.combatAction;
  if (typeof oldAction === 'function') {
    window.combatAction = function(action){
      try {
        if (action === 'SKILL' && game.inCombat && !game.combatResolved && game.combatEnemyHp > 0) {
          const party = getCrimsonCombatParty().filter(function(m){ return partyHpOf(m) > 0; });
          const actor = party[game.combatTurn];
          const kit = actor && kitFor(actor.id);
          if (kit && kit.skill && kit.skill.effect === 'ward') {
            const cost = kit.skill.mp || 0, mp = game.partyMp[actor.id] || 0;
            if (mp < cost) { toast('Not enough MP!'); return; }
            game.partyMp[actor.id] = mp - cost;
            game.shieldTurns = Math.max(game.shieldTurns || 0, WARD_TURNS);
            game.shieldPct = Math.max(game.shieldPct || 0, WARD_PCT);
            logCombat(esc(actor.name) + ' raises ' + kit.skill.icon + ' ' + kit.skill.name + '! The whole party takes ' + Math.round(WARD_PCT * 100) + '% less damage for ' + WARD_TURNS + ' turns.');
            game.spellMenuOpen = false; game.itemMenuOpen = false; game.skillMenuOpen = false;
            endTurn();
            return;
          }
        }
      } catch(e) { if (window.console) console.warn('ward failed', e); }
      return oldAction.apply(this, arguments);
    };
  }
})();
