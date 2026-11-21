(function(){
  // -------------------------------------------------------------------
  // RESTING TIP. After the first harbor fight (the Bilge Rat Gang, for most players) and the first rest, a one-time tip
  // explains how to heal when the free rest is spent (a 15g Tavern Rest) and where to buy potions. It waits until the player is back on a
  // normal screen (not mid-fight, no other popup), and only runs for early saves (below Level 30). State: game.restTip.
  // -------------------------------------------------------------------
  function st(){ game.restTip = game.restTip || {}; return game.restTip; }
  function busy(){
    const c = document.getElementById('combatScreen'), m = document.getElementById('modalOverlay');
    return !!((c && c.classList.contains('active')) || (m && m.classList.contains('active')));
  }
  function maybeShow(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive) return;
      const s = st();
      if (s.shown || !s.fought || !s.rested) return;
      if (typeof level === 'function' && level() >= 30) { s.shown = true; return; }
      if (busy() || typeof showModal !== 'function') return;
      s.shown = true;
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      showModal('💡 Tip: Resting and Potions',
        'Hurt after a fight? Press <b>🛏️ Rest Here</b> on the Port screen: it is free once a day and restores everyone\'s HP and MP.<br><br>' +
        'When that is used up, open the <b>🍺 Tavern</b> and take a <b>Tavern Rest for 15g</b>. It fully restores everyone aboard, and you can do it as often as you need while you are away from Fair Tide.<br><br>' +
        'The Tavern also sells <b>potions</b>: 🧪 Health and 🔵 Mana potions, 🔧 Repair Kits and 💣 Cannon Shot. What you buy waits in your Cargo screen under Consumables, ready to use in a fight or between them. Stronger ones turn up later at the Temple.',
        [{ text:'Got it', action:function(){ if (typeof closeModal === 'function') closeModal(); } }]);
    } catch(e) {}
  }

  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') {
    window.handleVictory = function(){
      const enemy = game.combatEnemy;
      const r = oldVictory.apply(this, arguments);
      try { if (enemy && enemy.kind === 'harbor') { st().fought = true; if (typeof saveGameQuiet === 'function') saveGameQuiet(); } } catch(e) {}
      return r;
    };
  }
  const oldFree = window.freeRestAtPort;
  if (typeof oldFree === 'function') {
    window.freeRestAtPort = function(){
      const before = game.freeRestDay;
      const r = oldFree.apply(this, arguments);
      try { if (game.freeRestDay !== before || game.freeRestDay === game.day) { st().rested = true; setTimeout(maybeShow, 900); } } catch(e) {}
      return r;
    };
  }
  const oldTavern = window.restAtTavern;
  if (typeof oldTavern === 'function') {
    window.restAtTavern = function(){
      const gold = game.gold;
      const r = oldTavern.apply(this, arguments);
      try { if (game.gold < gold) { st().rested = true; st().shown = true; } } catch(e) {}   // they already found the Tavern rest
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { const s = st(); if (!s.shown && s.fought && s.rested) setTimeout(maybeShow, 700); } catch(e) {}
      return r;
    };
  }
})();
