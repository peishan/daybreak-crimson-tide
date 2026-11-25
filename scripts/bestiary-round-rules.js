(function(){
  // -------------------------------------------------------------------
  // BESTIARY ROUND RULES (release 2). Some optional bosses change one rule of a fight, tied to the combat round:
  //   rule 'tide'  (Nerith)        every third round the tide rises: 30% of the damage you deal comes straight back as healing
  //   rule 'jam'   (Signal-Eater)  on odd rounds skills and spells are jammed: the turn becomes a basic attack
  //   rule 'oath'  (Unpaid Oath)   each enemy turn it takes 1% of your gold; everything is returned if you win
  //   rule 'beat'  (Cantor)        every fourth round is the beat: your damage is tripled. Off the beat, a fifth of the damage you deal echoes back at the crew
  // The rules live on the enemy (enemy.rule) and only apply to Crimson Horizon fights.
  // -------------------------------------------------------------------
  function active(){ const e = game.combatEnemy; return e && e.rule && e.kind === 'crimson_horizon' && game.inCombat && !game.combatResolved ? e : null; }
  function log(t){ try { if (typeof logCombat === 'function') logCombat(t); } catch (er) {} }
  function round(){ return game.combatRound || 1; }

  function afterDamage(e, hpBefore, r){
    const dealt = Math.max(0, hpBefore - game.combatEnemyHp);
    if (!dealt) return;
    if (e.rule === 'tide' && r % 3 === 0 && game.combatEnemyHp > 0) {
      const back = Math.round(dealt * 0.3);
      game.combatEnemyHp = Math.min(e.hp, game.combatEnemyHp + back);
      log('🌊 The tide rises: ' + e.name + ' takes back ' + back + ' health.');
    }
    if (e.rule === 'beat') {
      if (r % 4 === 0) {
        const extra = dealt * 2;
        game.combatEnemyHp = Math.max(0, game.combatEnemyHp - extra);
        log('🎵 <b>On the beat!</b> Your blow lands for triple: +' + extra + ' damage.');
        if (game.combatEnemyHp <= 0 && !game.combatResolved && typeof handleVictory === 'function') { handleVictory(); return; }
      } else if (game.combatEnemyHp > 0 && !(window.accordActive && window.accordActive())) {
        const party = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).filter(function(m){ return (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) > 0; });
        if (party.length) {
          const m = party[Math.floor(Math.random() * party.length)], echo = Math.max(1, Math.round(dealt * 0.2));
          game.partyHp[m.id] = Math.max(0, (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) - echo);
          log('🎶 Off the beat: the echo throws ' + echo + ' damage back at ' + m.name + '.');
        }
      }
    }
    if (typeof renderCombat === 'function') renderCombat();
  }

  const oldAction = window.combatAction;
  if (typeof oldAction === 'function') window.combatAction = function(action){
    const e = active();
    if (!e) return oldAction.apply(this, arguments);
    const r = round();
    if (e.rule === 'jam' && r % 2 === 1 && !(window.accordActive && window.accordActive()) && (action === 'SKILL' || action === 'HIGHSKILL')) {
      if (typeof toast === 'function') toast('📡 Static: skills and spells are jammed this round. A basic attack instead.', 2600);
      action = 'ATTACK';
    }
    const hp0 = game.combatEnemyHp;
    const res = oldAction.call(this, action);
    try { if (action === 'ATTACK' || action === 'SKILL' || action === 'HIGHSKILL') afterDamage(e, hp0, r); } catch (er) { console.error('round rule', er); }
    return res;
  };
  const oldCast = window.castSpell;
  if (typeof oldCast === 'function') window.castSpell = function(i){
    const e = active();
    if (!e) return oldCast.apply(this, arguments);
    const r = round();
    if (e.rule === 'jam' && r % 2 === 1 && !(window.accordActive && window.accordActive())) {
      if (typeof toast === 'function') toast('📡 Static: spells are jammed this round. A basic attack instead.', 2600);
      return window.combatAction('ATTACK');
    }
    const hp0 = game.combatEnemyHp;
    const res = oldCast.apply(this, arguments);
    try { afterDamage(e, hp0, r); } catch (er) { console.error('round rule', er); }
    return res;
  };
  // Unpaid Oath: interest each enemy turn, all returned on a win
  const oldCounter = window.enemyCounterAttack;
  if (typeof oldCounter === 'function') window.enemyCounterAttack = function(){
    try {
      const e = active();
      if (e && e.rule === 'oath' && (game.gold || 0) > 0 && !(window.accordActive && window.accordActive())) {
        const amt = Math.max(1, Math.round((game.gold || 0) * 0.01));
        game.gold -= amt; e.owed = (e.owed || 0) + amt;
        game.combatEnemy.owed = e.owed;
        log('📜 Interest: ' + e.name + ' takes ' + amt + 'g (' + e.owed + 'g owed so far).');
        if (typeof updateUI === 'function') updateUI();
      }
    } catch (er) {}
    return oldCounter.apply(this, arguments);
  };
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') window.handleVictory = function(){
    const e = game.combatEnemy, refund = e && e.rule === 'oath' && e.kind === 'crimson_horizon' && !game.combatResolved ? (e.owed || 0) : 0;
    const r = oldVictory.apply(this, arguments);
    if (refund > 0) {
      game.gold = (game.gold || 0) + refund;
      if (typeof window.notify === 'function') window.notify({ icon: '📜', title: 'The debt is settled', text: 'Everything it took (' + refund + 'g) is returned.', kind: 'info', duration: 5000 });
      if (typeof updateUI === 'function') updateUI();
    }
    return r;
  };
})();
