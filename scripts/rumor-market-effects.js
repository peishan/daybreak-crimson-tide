(function(){
  // -------------------------------------------------------------------
  // RUMOR MARKET EFFECTS — another follow-up on the same design review:
  // listenForRumors() (Tavern, core-engine.js) was already a real,
  // interactive mechanic (costs 5g, picks a random rumor, logs it) —
  // but the rumor TEXT had zero mechanical effect. Three of the eight
  // existing rumors are explicitly about market prices at a named port
  // ("Rice prices are crashing in Bangkok," "Spice prices in Batavia
  // are at a 10-year low," "Contraband is selling for triple in
  // Manila") — this makes exactly those three actually move that
  // good's price at that port for a few days, closing the loop between
  // hearing a rumor and it mattering. The other five (pirate/monster
  // warnings, story-companion hints) are left as pure flavor — they
  // don't describe a price, and inventing a numeric effect for "a
  // ghost ship haunts the waters" would be reaching for something the
  // text never asked for.
  //
  // Wraps listenForRumors() rather than editing it — reads which rumor
  // it just picked off the game.rumors array it already pushes to,
  // instead of duplicating or intercepting its random selection.
  // Similarly wraps generateMarketPrices() (which fully rebuilds ALL
  // port prices from scratch on every arrival, per its own existing
  // design) to re-apply any still-active rumor multiplier on top of
  // whatever fresh price it just rolled, and prune expired effects —
  // same "recompute live from state" pattern already used everywhere
  // else in this codebase, nothing cached that could go stale.
  // -------------------------------------------------------------------

  const RUMOR_MARKET_EFFECTS = {
    "Rice prices are crashing in Bangkok — flood season.": { portId: 'bangkok', goodId: 'rice', multiplier: 0.5, days: 5 },
    "Spice prices in Batavia are at a 10-year low.": { portId: 'batavia', goodId: 'spices', multiplier: 0.5, days: 5 },
    "Contraband is selling for triple in Manila.": { portId: 'manila', goodId: 'contraband', multiplier: 3, days: 5 }
  };

  function activeRumorEffects(){
    game.activeRumorEffects = game.activeRumorEffects || [];
    return game.activeRumorEffects;
  }
  window.activeRumorEffects = activeRumorEffects;

  window.rumorEffectFor = function(portId, goodId){
    return activeRumorEffects().find(function(e){
      return e.portId === portId && e.goodId === goodId && game.day < e.expiresDay;
    }) || null;
  };

  const oldListenForRumorsForMarket = window.listenForRumors;
  window.listenForRumors = function(){
    const before = (game.rumors || []).length;
    oldListenForRumorsForMarket();
    const rumors = game.rumors || [];
    if (rumors.length <= before) return; // didn't actually hear one (e.g. not enough gold)
    const heard = rumors[rumors.length - 1];
    const effectDef = RUMOR_MARKET_EFFECTS[heard];
    if (!effectDef) return;

    const list = activeRumorEffects();
    // Refresh an already-active effect for the same port+good instead of
    // stacking a second multiplier on top of it.
    let existing = list.find(function(e){ return e.portId === effectDef.portId && e.goodId === effectDef.goodId; });
    if (existing) {
      existing.expiresDay = game.day + effectDef.days;
    } else {
      list.push({ portId: effectDef.portId, goodId: effectDef.goodId, multiplier: effectDef.multiplier, expiresDay: game.day + effectDef.days });
    }

    if (typeof generateMarketPrices === 'function') generateMarketPrices();
    const goodName = (typeof GOODS !== 'undefined' && GOODS[effectDef.goodId]) ? GOODS[effectDef.goodId].name : effectDef.goodId;
    const portDef = (typeof PORTS !== 'undefined') ? PORTS.find(function(p){ return p.id === effectDef.portId; }) : null;
    const portName = portDef ? portDef.name : effectDef.portId;
    toast('📢 Word travels fast — ' + goodName + ' prices at ' + portName + ' will move for the next ' + effectDef.days + ' days.', 4200);
    if (typeof renderMarket === 'function') renderMarket();
  };

  const oldGenerateMarketPricesForRumors = window.generateMarketPrices;
  window.generateMarketPrices = function(){
    oldGenerateMarketPricesForRumors();
    const list = activeRumorEffects().filter(function(e){ return game.day < e.expiresDay; });
    game.activeRumorEffects = list; // prune anything expired
    list.forEach(function(e){
      if (game.marketPrices[e.portId] && game.marketPrices[e.portId][e.goodId] != null) {
        game.marketPrices[e.portId][e.goodId] = Math.max(1, Math.round(game.marketPrices[e.portId][e.goodId] * e.multiplier));
      }
    });
  };

  // Small, purely additive UI note on the market detail panel — doesn't
  // touch renderMarket()'s own markup, just appends a note after it runs
  // when the currently selected good has a live rumor effect at this port.
  const oldRenderMarketForRumors = window.renderMarket;
  window.renderMarket = function(){
    oldRenderMarketForRumors();
    const detail = document.getElementById('marketDetail');
    if (!detail || !game.marketSelectedGood) return;
    const effect = window.rumorEffectFor(game.location, game.marketSelectedGood);
    if (!effect) return;
    const direction = effect.multiplier < 1 ? 'depressed' : 'inflated';
    detail.insertAdjacentHTML('beforeend',
      '<div style="margin-top:6px;font-size:.72rem;opacity:.75;">📢 A rumor has ' + direction + ' this price here — ' +
      (effect.expiresDay - game.day) + ' day' + ((effect.expiresDay - game.day) === 1 ? '' : 's') + ' left.</div>');
  };
})();
