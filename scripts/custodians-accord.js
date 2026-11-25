(function(){
  // -------------------------------------------------------------------
  // CUSTODIANS' ACCORD: the first gameplay payoff of the Black Pearl research (Crimson Horizon Arc XXIX).
  //
  // Unlocked by the story (Ch.345, id 346) through the Black Pearl research code (black-pearl-research.js: onPearlAccordRead).
  // A shared ward that San and Joel raise together. In a fight, from the Skill menu of either one, while BOTH are alive and in the party:
  //   * the whole party takes 35% less damage for 3 turns (a stronger version of the Daybreak Ward's 25%; never lowers a stronger shield),
  //   * and for those 3 turns the party shrugs off harmful effects (the Signal-Eater's static, the Unpaid Oath's interest, the off-beat echo),
  //   * then a recovery period: it cannot be raised again for 5 rounds. Costs the actor's turn, no MP.
  // It protects the party only: no damage to the enemy, no healing, no cure of anything already on them. Numbers are a first pass for balancing.
  // State: game.pearlAccord = { unlocked } (kept); per-fight: game.accordTurns, game.accordRound. The Pearl's ownership is unchanged.
  // -------------------------------------------------------------------
  const WARD_PCT = 0.35, WARD_TURNS = 3, COOLDOWN_ROUNDS = 5;
  function st(){ return (game.pearlAccord = game.pearlAccord || { unlocked: false }); }
  window.custodiansAccordUnlocked = function(){ return !!(typeof game !== 'undefined' && game && game.pearlAccord && game.pearlAccord.unlocked); };
  window.unlockCustodiansAccord = function(){
    const s = st();
    if (s.unlocked) return false;
    s.unlocked = true;
    if (typeof window.notify === 'function') window.notify({ icon: '🤝', title: 'Custodians’ Accord', text: 'San and Joel can now raise a shared ward in a fight. Find it in the Skill menu.', kind: 'info', duration: 8000 });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return true;
  };
  function aliveIds(){ try { return getCrimsonCombatParty().filter(function(m){ return partyHpOf(m) > 0; }).map(function(m){ return m.id; }); } catch (e) { return []; } }
  window.accordRoundsLeft = function(){
    if (game.accordRound == null) return 0;
    return Math.max(0, COOLDOWN_ROUNDS - ((game.combatRound || 1) - game.accordRound));
  };
  window.accordActive = function(){ return !!(game && game.inCombat && !game.combatResolved && (game.accordTurns || 0) > 0); };
  window.accordAvailable = function(actor){
    if (!window.custodiansAccordUnlocked() || !actor || (actor.id !== 'san' && actor.id !== 'joel')) return false;
    if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return false;
    const ids = aliveIds();
    if (ids.indexOf('san') === -1 || ids.indexOf('joel') === -1) return false;
    return window.accordRoundsLeft() === 0;
  };
  // why it is not offered (for the menu): '' when it is
  window.accordStatus = function(actor){
    if (!window.custodiansAccordUnlocked() || !actor || (actor.id !== 'san' && actor.id !== 'joel')) return null;
    const ids = aliveIds();
    if (ids.indexOf('san') === -1 || ids.indexOf('joel') === -1) return 'Needs both San and Joel standing.';
    const left = window.accordRoundsLeft();
    return left > 0 ? 'Recovering: ready in ' + left + ' round' + (left === 1 ? '' : 's') + '.' : '';
  };
  window.useCustodiansAccord = function(){
    if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return;
    const alive = getCrimsonCombatParty().filter(function(m){ return partyHpOf(m) > 0; });
    const actor = alive[game.combatTurn];
    if (!window.accordAvailable(actor)) { if (typeof toast === 'function') toast('🤝 ' + (window.accordStatus(actor) || 'Not available right now.')); return; }
    game.accordRound = game.combatRound || 1;
    game.accordTurns = WARD_TURNS;
    game.shieldTurns = Math.max(game.shieldTurns || 0, WARD_TURNS);
    game.shieldPct = Math.max(game.shieldPct || 0, WARD_PCT);
    logCombat('🤝 <b>Custodians’ Accord!</b> San and Joel raise one shared ward. The whole party takes ' + Math.round(WARD_PCT * 100) + '% less damage for ' + WARD_TURNS + ' turns, and shrugs off harmful effects while it holds.');
    game.skillMenuOpen = false; game.spellMenuOpen = false; game.itemMenuOpen = false;
    if (typeof endTurn === 'function') endTurn();
  };

  // per-fight state resets with the fight; the effect counts down on the enemy's turns
  const oldStart = window.startCombat;
  if (typeof oldStart === 'function') {
    window.startCombat = function(){
      const r = oldStart.apply(this, arguments);
      game.accordTurns = 0; game.accordRound = null;
      return r;
    };
  }
  const oldCounter = window.enemyCounterAttack;
  if (typeof oldCounter === 'function') {
    window.enemyCounterAttack = function(){
      const r = oldCounter.apply(this, arguments);
      try {
        if ((game.accordTurns || 0) > 0) {
          game.accordTurns--;
          if (game.accordTurns === 0 && game.inCombat && !game.combatResolved) logCombat('🤝 The Accord fades. San and Joel can raise it again in ' + window.accordRoundsLeft() + ' round' + (window.accordRoundsLeft() === 1 ? '' : 's') + '.');
        }
      } catch (e) {}
      return r;
    };
  }

  // The training bout at Ch.348 (id 349) is friendly, like sparring: no trophy, and losing costs nothing (no gold, no hull damage).
  function friendly(){ const e = game.combatEnemy; return !!(e && e.kind === 'crimson_horizon' && String(e.key) === '349' && game.inCombat && !game.combatResolved); }
  const oldDefeat = window.handleDefeat;
  if (typeof oldDefeat === 'function') {
    window.handleDefeat = function(){
      if (!friendly()) return oldDefeat.apply(this, arguments);
      game.combatResolved = true; game.inCombat = false; game.combatPartyOverride = null;
      if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
      logCombat('🤝 <b>A close bout.</b> Devon helps San up. Nothing is lost: try the Accord again.');
      game.pendingPostBattle = { message: 'A close bout, well fought. Nothing is lost.', buttonsHtml: '<button class="btn btn-success" onclick="exitBattleToPort(); setTimeout(function(){ if (window.__ctResumeCrimsonHorizonChapter) window.__ctResumeCrimsonHorizonChapter(); }, 600);">📖 Back to the Chapter</button>' };
      if (typeof renderPendingPostBattle === 'function') renderPendingPostBattle();
      if (typeof renderCombat === 'function') renderCombat();
    };
  }
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') {
    window.handleVictory = function(){
      const e = game.combatEnemy, isBout = !!(e && e.kind === 'crimson_horizon' && String(e.key) === '349');
      const r = oldVictory.apply(this, arguments);
      try {
        if (isBout) {
          game.inventory = (game.inventory || []).filter(function(it){ return !(it && it.desc === 'Taken from ' + e.name); });
          game.combatLog = (game.combatLog || []).map(function(l){ return /VICTORY/.test(l) ? l.replace(/, and [^!]*Trophy!/, '.') : l; });
          if (typeof renderCombat === 'function') renderCombat();
        }
      } catch (er) {}
      return r;
    };
  }

  // Black Pearl Study: one line for the unlocked technique
  const oldHtml = window.blackPearlStudyHtml;
  if (typeof oldHtml === 'function') {
    window.blackPearlStudyHtml = function(){
      const h = oldHtml.apply(this, arguments);
      if (!h || !window.custodiansAccordUnlocked()) return h;
      return h + '<div class="rt-status" style="margin-top:4px;">🤝 <b>Custodians’ Accord</b> is recorded. San and Joel raise it together from the Skill menu in a fight: a brief shared ward, then a recovery period.</div>';
    };
  }
})();
