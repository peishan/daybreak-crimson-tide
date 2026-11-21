(function(){
  // -------------------------------------------------------------------
  // SAN & JOEL: BOND MOMENTS. The bond ladder (arc9-and-systems.js, "Spend time" and the hang-out activities) used to do
  // nothing but raise a number. Now:
  //   * once the bond first exists (Arc V Ch.4, "Bonded by the Tide") a one-time note says where to find it;
  //   * reaching "Two Hearts, One Ship" (tier 4) and "One Ship, One Life" (tier 5) plays a short scene, then a splash.
  // A splash whose art is not in the game yet simply does not show, and is tried again the next time you spend time
  // together, so adding the image later is enough. Scenes and splashes each show once per save.
  // -------------------------------------------------------------------
  const TIERS = {
    4: { splash:'sanjoel_t4', title:'💞 Two Hearts, One Ship',
      text:'It is late, and the harbor lights have come on one by one. San and Joel sit on the deck with their backs against the rail, not talking, with the tide moving under the hull. After a long while San says that she has stopped counting how many times he has been there. Joel says he has never been counting. Neither of them says anything else, and nobody comes to find them.' },
    5: { splash:'sanjoel_t5', title:'💞 One Ship, One Life',
      text:'Somewhere between one voyage and the next, it stopped being a question. San notices it on an ordinary morning, over coffee, when Joel hands her the cup before she has asked for it, and she realises that she has not thought about where the ship would go if he were not on it for a very long time. She says so. Joel looks at her as if she had said something obvious, and then he smiles, because it is.' }
  };
  function seen(){ game.sanJoelTierSeen = game.sanJoelTierSeen || {}; return game.sanJoelTierSeen; }
  function tier(){ try { return window.bondTier('san_joel') || 0; } catch(e) { return 0; } }

  function playFor(t){
    const def = TIERS[t]; if (!def) return;
    const splash = function(){ return (typeof window.playMilestoneSplashOnce === 'function') ? window.playMilestoneSplashOnce(def.splash) : null; };
    if (!seen()[t]) {
      seen()[t] = true;
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      if (typeof showModal === 'function') {
        showModal(def.title, def.text, [{ text:'Continue', action:function(){ if (typeof closeModal === 'function') closeModal(); setTimeout(splash, 350); } }]);
        return;
      }
    }
    splash();   // the scene was seen already: only the splash is retried (its art may not have existed before)
  }

  function check(){
    try {
      const cur = tier();
      if (cur >= 1 && !game.sanJoelBondHint) {
        game.sanJoelBondHint = true;
        if (typeof window.notify === 'function') window.notify({ icon:'💞', title:'Bonded by the Tide', text:'San and Joel\'s bond is open. Spend a little time together each day from the Crew tab to deepen it.', kind:'info', duration:6500 });
      }
      [4, 5].forEach(function(t){ if (cur >= t) playFor(t); });
    } catch(e) {}
  }

  const oldSpend = window.spendTimeWithBond;
  if (typeof oldSpend === 'function') {
    window.spendTimeWithBond = function(trackKey){
      const before = tier();
      const r = oldSpend.apply(this, arguments);
      if (trackKey === 'san_joel') setTimeout(check, before === tier() ? 900 : 600);
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive && !game.sanJoelBondHint && tier() >= 1) check(); } catch(e) {}
      return r;
    };
  }
})();
