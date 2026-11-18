(function(){
  // -------------------------------------------------------------------
  // CONTRABAND -- no longer sold anywhere, and no longer fixed to Manila.
  //
  // THE BUG: the original market rule gave contraband a price of 0 at every port
  // but Manila, but the price code rounds to a minimum of 1g, so it was actually
  // offered at 1g in every port while Manila paid hundreds: an easy money loop.
  //
  // NOW:
  //  * You cannot buy contraband. It comes off pirates and smugglers you defeat,
  //    straight into the hold (if there is room).
  //  * Only ONE port at a time has a fence who will buy it, paying hundreds, and
  //    it moves every six days to a different port at random. Everywhere else
  //    there is no buyer.
  //  * While you are carrying contraband the market intel names the current
  //    buyer and how many days that offer stands.
  // -------------------------------------------------------------------
  const WINDOW_DAYS = 6;
  function hash(n){
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
    return ((x >>> 0) % 100000) / 100000;
  }
  function eligible(){
    const seq = (window.CRIMSON_HORIZON_PORTS || []).map(function(p){ return p.id; });
    const out = PORTS.filter(function(p){
      if (p.id === 'fair_tide') return false;
      let open = true;
      try { open = typeof isPortUnlocked === 'function' ? !!isPortUnlocked(p.id) : true; } catch(e) {}
      if (seq.indexOf(p.id) !== -1) return open && !!game.arc42Complete;
      return open;
    }).map(function(p){ return p.id; });
    return out.length ? out : ['singapore'];
  }
  function buyerFor(day){
    day = Math.floor(Number(day) || 0);
    const slot = Math.floor(day / WINDOW_DAYS);
    const list = eligible();
    const id = list[Math.floor(hash(slot * 977 + 13) * list.length) % list.length];
    return { portId: id, left: WINDOW_DAYS - (day % WINDOW_DAYS), slot: slot };
  }
  window.contrabandBuyer = function(day){ return buyerFor(day == null ? game.day : day); };
  window.contrabandPriceAt = function(portId, day){
    const b = buyerFor(day == null ? game.day : day);
    if (b.portId !== portId) return 0;
    return Math.round(GOODS.contraband.basePrice * (1.1 + 0.6 * hash(b.slot * 31 + 5)));   // ~275-425g
  };

  // Not for sale.
  const oldBuyGood = window.buyGood;
  window.buyGood = function(goodId){
    if (goodId === 'contraband') { if (typeof toast === 'function') toast('🏴 Nobody sells contraband openly. It turns up on pirates and smugglers.', 3400); return; }
    return oldBuyGood.apply(this, arguments);
  };

  // Hide the buy buttons for it; say who is buying.
  const oldRenderMarket = window.renderMarket;
  window.renderMarket = function(){
    if (oldRenderMarket) oldRenderMarket.apply(this, arguments);
    try {
      if (game.marketSelectedGood !== 'contraband') return;
      const detail = document.getElementById('marketDetail'); if (!detail) return;
      const buy = detail.querySelector('.market-detail-buybtns');
      if (buy) {
        const label = buy.previousElementSibling; if (label) label.remove();
        buy.outerHTML = '<div style="font-size:.74rem;opacity:.7;margin:6px 0;">🏴 Not for sale. A fence is paying well for it here this week; take it off pirates and smugglers.</div>';
      }
    } catch(e) {}
  };

  const oldRenderIntel = window.renderIntel;
  window.renderIntel = function(){
    if (oldRenderIntel) oldRenderIntel.apply(this, arguments);
    try {
      if (!(game.cargo && game.cargo.contraband > 0)) return;
      const el = document.getElementById('marketIntel'); if (!el) return;
      const b = buyerFor(game.day), p = PORTS.find(function(x){ return x.id === b.portId; });
      el.insertAdjacentHTML('beforeend', '<br><strong>🏴 Contraband:</strong> a fence at ' + esc(p ? p.name : b.portId) + ' is paying hundreds for it (' + b.left + ' day' + (b.left === 1 ? '' : 's') + ' left). Nobody else will touch it.');
    } catch(e) {}
  };

  // Drops: pirates and smugglers carry it. Goes straight into the hold.
  const DROPS = { rival_frigate: 0.30, smuggler_crew: 0.40, lantern_smugglers: 0.45, dock_thief: 0.15 };
  const oldHandleVictory = window.handleVictory;
  if (typeof oldHandleVictory === 'function') {
    window.handleVictory = function(){
      const enemy = (game.inCombat && !game.combatResolved) ? game.combatEnemy : null;
      const r = oldHandleVictory.apply(this, arguments);
      try {
        const chance = enemy && enemy.key && enemy.kind !== 'training' ? DROPS[enemy.key] : 0;
        if (chance && Math.random() < chance) {
          const qty = 1 + Math.floor(Math.random() * 3);
          const w = GOODS.contraband.weight * qty;
          if ((game.cargoUsed || 0) + w <= (game.cargoCapacity || 0)) {
            game.cargo = game.cargo || {};
            const old = Number(game.cargo.contraband || 0);
            game.cargoPurchaseCost = game.cargoPurchaseCost || {};
            const oldCost = Number(game.cargoPurchaseCost.contraband || 0);
            game.cargo.contraband = old + qty;
            game.cargoUsed = (game.cargoUsed || 0) + w;
            game.cargoPurchaseCost.contraband = old > 0 ? (oldCost * old) / (old + qty) : 0;   // it cost you nothing
            const msg = '🏴 Found ' + qty + ' contraband aboard. It goes into the hold.';
            if (typeof logEvent === 'function') logEvent(msg, 'gold');
            if (typeof toast === 'function') toast(msg, 3600);
            if (typeof renderCargo === 'function') { try { renderCargo(); } catch(e) {} }
          } else if (typeof toast === 'function') toast('🏴 There was contraband aboard, but no room in the hold.', 3200);
        }
      } catch(e) {}
      return r;
    };
  }
})();
