(function(){
  // -------------------------------------------------------------------
  // BESTIARY ROUND RULES (release 2). Some optional bosses change one rule of a fight, tied to the combat round:
  //   rule 'tide'  (Nerith)        every third round the tide rises: 30% of the damage you deal comes straight back as healing
  //   rule 'jam'   (Signal-Eater)  on odd rounds skills and spells are jammed: the turn becomes a basic attack
  //   rule 'oath'  (Unpaid Oath)   each enemy turn it takes 1% of your gold; everything is returned if you win
  //   rule 'beat'  (Cantor)        every fourth round is the beat: your damage is tripled. Off the beat, a fifth of the damage you deal echoes back at the crew
  // Release 3 adds phases (enemy.phases: at a share of its health a new stage starts) and two more rules:
  //   rule 'lights' (False Light)  three stages: each one puts out a lamp, the next kindles, the lights mend, and the last mends every round
  //   rule 'gate'   (Ashk)         odd rounds the gate is open (your damage doubles); even rounds it is shut (he takes nothing and hits 35% harder)
  //   rule 'cold'   (Snow Wyrm)    each round it chills a crew member, who loses their next action unless a crewmate Defends; it rages at half health
  // Release 4 adds:
  //   rule 'audit'   (Hedda)       each of her blows takes goods from the hold; everything is handed back when the fight ends, win, loss or flight
  //   rule 'keeping' (the Keeping) no extra rule: its three stages are enemy.phases
  // New-area bosses add:
  //   rule 'drain' (Heart-Rot)    it heals by half of the damage it deals to the crew, so a long fight loses; Defend and shields beat it
  //   rule 'echo'  (Hollow Bell)  every second round it throws the strongest blow you dealt last round back at the crew
  // (the cold rule's flavour text can be set per enemy with enemy.chillText)
  // The rules live on the enemy (enemy.rule) and only apply to Crimson Horizon fights.
  // -------------------------------------------------------------------
  function active(){ const e = game.combatEnemy; return e && e.rule && e.kind === 'crimson_horizon' && game.inCombat && !game.combatResolved ? e : null; }
  function log(t){ try { if (typeof logCombat === 'function') logCombat(t); } catch (er) {} }
  function round(){ return game.combatRound || 1; }

  function phaseCheck(e){
    if (!e.phases) return;
    let i = e.phaseIdx || 0;
    while (i < e.phases.length && game.combatEnemyHp > 0 && game.combatEnemyHp <= e.phases[i].at * e.hp) {
      const p = e.phases[i]; i++;
      log('<b>' + p.text + '</b>');
      if (p.heal) game.combatEnemyHp = Math.min(e.hp, game.combatEnemyHp + Math.round(e.hp * p.heal));
      if (p.dmgMult) e.phaseMult = (e.phaseMult || 1) * p.dmgMult;
      if (p.twist) { e.twist = p.twist; e.twistText = p.twistText || e.twistText; e.baseDmg = e.baseDmg || e.dmg; }
      e.phaseIdx = i;
      try { if (typeof toast === 'function') toast('⚠️ ' + p.text.replace(/^\S+\s/, ''), 3200); } catch (er) {}
    }
  }
  function isShut(e, r){ return e.rule === 'gate' && r % 2 === 0; }
  function recount(){ try { game.cargoUsed = Object.keys(game.cargo || {}).reduce(function(a, g){ return a + (game.cargo[g] || 0); }, 0); } catch (er) {} }
  function returnGoods(e){
    if (!e || e.rule !== 'audit' || !e.taken) return;
    const t = e.taken; e.taken = null;
    let n = 0;
    Object.keys(t).forEach(function(g){ game.cargo[g] = (game.cargo[g] || 0) + t[g]; n += t[g]; });
    recount();
    if (n > 0) { try { if (typeof window.notify === 'function') window.notify({ icon: '⚖️', title: 'The scales settle', text: 'Everything Hedda weighed out (' + n + ' units) is back in the hold.', kind: 'info', duration: 5000 }); } catch (er) {} }
    try { if (typeof updateUI === 'function') updateUI(); } catch (er) {}
  }
  window.__returnAuditGoods = returnGoods;
  function afterDamage(e, hpBefore, r){
    const dealt = Math.max(0, hpBefore - game.combatEnemyHp);
    if (!dealt) return;
    if (e.rule === 'echo') { e.maxByRound = e.maxByRound || {}; e.maxByRound[r] = Math.max(e.maxByRound[r] || 0, dealt); }
    if (e.rule === 'gate') {
      if (isShut(e, r)) {
        game.combatEnemyHp = Math.min(e.hp, game.combatEnemyHp + dealt);
        log('🚪 The gate is shut: ' + e.name + ' takes nothing. Wait for it to open.');
      } else {
        const extra = dealt;
        game.combatEnemyHp = Math.max(0, game.combatEnemyHp - extra);
        log('🚪 <b>The gate is open!</b> Your blow lands twice: +' + extra + ' damage.');
        if (game.combatEnemyHp <= 0 && !game.combatResolved && typeof handleVictory === 'function') { handleVictory(); return; }
      }
    }
    phaseCheck(e);
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

  // Before the crew acts: the gate remembers whether it is shut, and a chilled crew member loses their turn (Defend warms everyone).
  function currentActor(){
    const party = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).filter(function(m){ return (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) > 0; });
    return party[game.combatTurn];
  }
  function preAction(e, action){
    const r = round();
    if (e.rule === 'gate') { e.shut = isShut(e, r); e.hpBefore = game.combatEnemyHp; }
    if (e.rule === 'cold') {
      const a = currentActor(); e.chilled = e.chilled || {};
      if (action === 'DEFEND') {
        if (Object.keys(e.chilled).length) { e.chilled = {}; log('🔥 ' + (a ? a.name : 'A crewmate') + ' braces and shares warmth: the chill lifts from the crew.'); }
        return false;
      }
      if (a && e.chilled[a.id]) {
        delete e.chilled[a.id];
        log('❄️ ' + a.name + ' is too cold to act and loses the turn.');
        if (typeof toast === 'function') toast('❄️ ' + a.name + ' is chilled and loses the turn. A crewmate can Defend to warm the crew.', 2800);
        game.skillMenuOpen = false; game.spellMenuOpen = false; game.itemMenuOpen = false;
        if (typeof endTurn === 'function') endTurn();
        return true;
      }
    }
    return false;
  }

  const oldAction = window.combatAction;
  if (typeof oldAction === 'function') window.combatAction = function(action){
    const e = active();
    if (!e) return oldAction.apply(this, arguments);
    const r = round();
    if (preAction(e, action)) return;
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
    if (preAction(e, 'SPELL')) return;
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
      const e0 = active();
      if (e0 && (e0.rule === 'gate' || e0.rule === 'cold' || e0.phases)) {
        e0.baseDmg = e0.baseDmg || e0.dmg;
        e0.dmg = Math.round(e0.baseDmg * (e0.phaseMult || 1) * (isShut(e0, round()) ? 1.35 : 1));
      }
      if (e0 && e0.rule === 'cold' && e0.chillRound !== round() && game.combatEnemyHp > 0) {
        const pool = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).filter(function(m){ return (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) > 0 && !(e0.chilled && e0.chilled[m.id]); });
        if (pool.length) {
          const m = pool[Math.floor(Math.random() * pool.length)];
          e0.chilled = e0.chilled || {}; e0.chilled[m.id] = true; e0.chillRound = round();
          log('❄️ ' + (e0.chillText || 'The wyrm’s breath rolls over') + ' ' + m.name + ': their next action is lost unless a crewmate Defends.');
        }
      }
      if (e0 && e0.rule === 'echo' && round() % 2 === 0 && e0.echoRound !== round() && game.combatEnemyHp > 0) {
        const prev = (e0.maxByRound || {})[round() - 1] || 0;
        const alive = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).filter(function(m){ return (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) > 0; });
        if (prev > 0 && alive.length) {
          const m = alive[Math.floor(Math.random() * alive.length)], dmg = Math.max(1, Math.round(prev * 0.8));
          game.partyHp[m.id] = Math.max(0, (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) - dmg);
          e0.echoRound = round();
          log('🔔 <b>The echo comes back.</b> ' + e0.name + ' throws your strongest blow of last round, ' + prev + ', at ' + m.name + ' for ' + dmg + '.');
        }
      }
      if (e0 && e0.rule === 'audit' && game.cargo) {
        const have = Object.keys(game.cargo).filter(function(g){ return (game.cargo[g] || 0) > 0; });
        if (have.length) {
          const total = have.reduce(function(a, g){ return a + game.cargo[g]; }, 0);
          const g = have[Math.floor(Math.random() * have.length)], n = Math.min(game.cargo[g], 1 + Math.floor(total / 40));
          game.cargo[g] -= n; if (game.cargo[g] <= 0) delete game.cargo[g];
          e0.taken = e0.taken || {}; e0.taken[g] = (e0.taken[g] || 0) + n;
          game.combatEnemy.taken = e0.taken;
          recount();
          log('⚖️ Hedda weighs ' + n + ' ' + String(g).replace(/_/g, ' ') + ' out of the hold (' + Object.keys(e0.taken).reduce(function(a, k){ return a + e0.taken[k]; }, 0) + ' held). It all goes back when the fight ends.');
        }
      }
    } catch (er) {}
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
    let drainBefore = null;
    try {
      const ed = active();
      if (ed && ed.rule === 'drain') drainBefore = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).reduce(function(a, m){ return a + (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp); }, 0);
    } catch (er) {}
    const counterResult = oldCounter.apply(this, arguments);
    try {
      const ed = game.combatEnemy;
      if (drainBefore !== null && ed && ed.rule === 'drain' && game.combatEnemyHp > 0) {
        const after = (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).reduce(function(a, m){ return a + (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp); }, 0);
        const heal = Math.round(Math.max(0, drainBefore - after) * 0.5);
        if (heal > 0) { game.combatEnemyHp = Math.min(ed.hp, game.combatEnemyHp + heal); log('🌿 ' + ed.name + ' drinks the blow: it heals ' + heal + '.'); }
      }
    } catch (er) {}
    return counterResult;
  };
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') window.handleVictory = function(){
    const g = game.combatEnemy;
    if (g && g.rule === 'gate' && g.kind === 'crimson_horizon' && g.shut && !game.combatResolved && g.hpBefore > 0) {
      game.combatEnemyHp = g.hpBefore; g.shut = false;
      log('🚪 The gate is shut: ' + g.name + ' takes nothing. Wait for it to open.');
      if (typeof renderCombat === 'function') setTimeout(function(){ try { renderCombat(); } catch (er) {} }, 0);
      return;
    }
    try { if (game.combatEnemy && game.combatEnemy.rule === 'audit') returnGoods(game.combatEnemy); } catch (er) {}
    const e = game.combatEnemy, refund = e && e.rule === 'oath' && e.kind === 'crimson_horizon' && !game.combatResolved ? (e.owed || 0) : 0;
    const r = oldVictory.apply(this, arguments);
    if (refund > 0) {
      game.gold = (game.gold || 0) + refund;
      if (typeof window.notify === 'function') window.notify({ icon: '📜', title: 'The debt is settled', text: 'Everything it took (' + refund + 'g) is returned.', kind: 'info', duration: 5000 });
      if (typeof updateUI === 'function') updateUI();
    }
    return r;
  };

  const oldDefeat = window.handleDefeat;
  if (typeof oldDefeat === 'function') window.handleDefeat = function(){
    const e = game.combatEnemy, was = game.combatResolved;
    const r = oldDefeat.apply(this, arguments);
    try { if (e && e.rule === 'audit' && !was) returnGoods(e); } catch (er) {}
    return r;
  };
  const oldFlee = window.fleeCombat;
  if (typeof oldFlee === 'function') window.fleeCombat = function(){
    const e = game.combatEnemy;
    const r = oldFlee.apply(this, arguments);
    try { if (e && e.rule === 'audit' && !game.inCombat) returnGoods(e); } catch (er) {}
    return r;
  };

  // Status marks on the enemy: the gate, the chilled crew, the lamps.
  const oldRender = window.renderCombat;
  if (typeof oldRender === 'function') window.renderCombat = function(){
    const out = oldRender.apply(this, arguments);
    try {
      const e = active(), el = document.getElementById('enemyBuffs');
      if (e && el) {
        let mark = '';
        if (e.rule === 'gate') mark = isShut(e, round()) ? '🚪 Gate SHUT: no damage, it hits harder' : '🚪 Gate OPEN: your blows count double';
        if (e.rule === 'cold' && e.chilled) {
          const names = Object.keys(e.chilled).map(function(id){ const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; }); return m ? m.name : id; });
          if (names.length) mark = '❄️ Chilled: ' + names.join(', ') + ' (Defend to warm)';
        }
        if (e.rule === 'lights') mark = '🏮 Lamp ' + Math.min(3, (e.phaseIdx || 0) + 1) + ' of 3';
        if (mark) el.insertAdjacentHTML('beforeend', '<span class="buff-icon buff-mark">' + mark + '</span>');
      }
    } catch (er) {}
    return out;
  };
  // Rewards that cut the danger of sailing to the Gates for good
  const oldVoyage = window.doVoyage;
  if (typeof oldVoyage === 'function') window.doVoyage = function(portId, days, danger){
    const cut = (game.portDangerCut && game.portDangerCut[portId]) || 0;
    return oldVoyage.call(this, portId, days, cut ? Math.max(1, (danger || 1) - cut) : danger);
  };
})();
