(function(){
  // -------------------------------------------------------------------
  // THE LODESTAR -- the new ship with the magical compass.
  //
  // Arc XLII opens "aboard the enormous junk", and the story has San and Joel buy a new
  // ship that comes with a magical compass before the crossing. Until now that was only
  // text. It is now a real step in the story chain, between Arc XLI and the Bridge to
  // Arc XLII:
  //   * Once Arc XLI is complete and the captain is Level 455, the Current Objective
  //     becomes "Commission the new ship" at the Shipyard.
  //   * The Bridge (and so Arc XLII) stays locked until she is bought.
  //   * The Lodestar is the largest hull in the game (it holds the whole sequel crew)
  //     and her compass cuts the odds of being attacked and shows tomorrow's weather.
  //   * A save that is already past the Bridge is given the ship for free, once: the
  //     story it already read has them aboard her.
  // The name, cost and numbers are placeholders for the author to change.
  // -------------------------------------------------------------------
  const ID = 'horizon_junk';
  const GATE_LEVEL = 455;
  if (!VESSELS.some(function(v){ return v.id === ID; })) {
    VESSELS.push({ id: ID, name: 'The Lodestar', icon: '🧭', minLevel: GATE_LEVEL, cost: 1250000, cargoBase: 2400, hpBase: 3400, statCap: 115, fieldCap: 12,
      desc: 'An enormous junk whose shipwright would not say where the compass came from. It does not point north. It points at worlds.' });
  }
  function idx(){ return VESSELS.findIndex(function(v){ return v.id === ID; }); }
  function owned(){ return game.shipTier >= idx() || !!game.horizonShipAcquired; }
  function pastBridge(){
    return !!(game.comicProgressArc41Bridge && game.comicProgressArc41Bridge[1]) || !!game.arc41BridgeComplete || !!game.arc42Complete ||
      !!(game.comicProgress42 && Object.keys(game.comicProgress42).length);
  }
  // A save already past the Bridge is given her, once.
  function ensure(){
    try {
      if (game.horizonShipAcquired || owned()) { game.horizonShipAcquired = true; return; }
      if (pastBridge()) {
        game.horizonShipAcquired = true;
        game.shipTier = Math.max(Number(game.shipTier) || 0, idx());
        const v = VESSELS[idx()];
        game.cargoCapacity = Math.max(Number(game.cargoCapacity) || 0, v.cargoBase);
        game.maxHealth = Math.max(Number(game.maxHealth) || 0, v.hpBase);
        game.health = game.maxHealth;
        if (typeof logEvent === 'function') logEvent('🧭 The Lodestar, the ship with the compass that points at worlds, is yours: the crossing story already had them aboard her.', 'gold');
      }
    } catch(e) {}
  }
  window.horizonShipObjectiveActive = function(){ ensure(); return !!game.arc41Complete && !owned(); };
  window.hasHorizonCompass = function(){ return game.shipTier >= idx(); };

  // Buying her.
  const oldBuy = window.buyVessel;
  window.buyVessel = function(vesselId){
    if (vesselId === ID && !game.arc41Complete) { if (typeof toast === 'function') toast('🔒 This ship is not for sale yet. Finish Arc XLI first.', 3400); return; }
    const before = game.shipTier;
    const r = oldBuy.apply(this, arguments);
    try {
      if (vesselId === ID && game.shipTier >= idx() && before < idx()) {
        game.horizonShipAcquired = true;
        const msg = 'San and Joel commission The Lodestar. The compass at her helm does not point north: it swings, settles, and points at something far beyond the charts.';
        if (typeof window.notify === 'function') window.notify({ icon: '🧭', title: 'The Lodestar is yours', text: 'Her compass points at another world. The Bridge to Arc XLII is open.', kind: 'info', duration: 6500 });
        if (typeof logEvent === 'function') logEvent('🧭 ' + msg, 'gold');
        if (typeof renderMainGoal === 'function') renderMainGoal();
      }
    } catch(e) {}
    return r;
  };
  const oldRenderVessels = window.renderVessels;
  window.renderVessels = function(){
    if (oldRenderVessels) oldRenderVessels.apply(this, arguments);
    try {
      if (game.arc41Complete) return;
      const btn = document.querySelector('#vesselContent button[onclick*="' + ID + '"]');
      if (btn) btn.outerHTML = '<span style="font-size:0.8rem;opacity:0.7;">🔒 After Arc XLI</span>';
    } catch(e) {}
  };

  // The Bridge waits for her.
  const oldBridge = window.arc41BridgeObjectiveState;
  if (typeof oldBridge === 'function') {
    window.arc41BridgeObjectiveState = function(){
      const r = oldBridge.apply(this, arguments);
      if (r !== null && window.horizonShipObjectiveActive()) return null;
      return r;
    };
  }

  // The Current Objective.
  const oldGoal = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldGoal) oldGoal.apply(this, arguments);
    try {
      const el = document.getElementById('mainGoalPanel');
      if (!el || !window.horizonShipObjectiveActive() || (level() < GATE_LEVEL && !game.arc41Complete)) return;
      const v = VESSELS[idx()];
      const lvOk = level() >= v.minLevel, goldOk = (game.gold || 0) >= v.cost;
      const text = 'San and Joel have found a ship worth crossing worlds in: an enormous junk with a compass that points at worlds, not north. Commission ' + v.name + ' at the Shipyard (' + v.cost.toLocaleString() + 'g, Level ' + v.minLevel + '). ' +
        'Level ' + level() + ' / ' + v.minLevel + (lvOk ? ' ✓' : '') + ' · Gold ' + Math.round(game.gold || 0).toLocaleString() + ' / ' + v.cost.toLocaleString() + (goldOk ? ' ✓' : '');
      el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 Commission the New Ship</div><div class="ct-goal-text">' + esc(text) + '</div>' +
        '<div style="margin-top:6px;"><button class="btn btn-small btn-magic" onclick="goScreen(\'shipyard\')">⚓ Go to the Shipyard</button></div>' +
        '<div class="ct-goal-optional">Optional: trade, run bounties and raid for the gold. The Bridge to Arc XLII opens once she is yours.</div>';
    } catch(e) {}
  };

  // The compass: fewer attacks, and tomorrow's weather.
  const oldSafety = window.voyageSafety;
  if (typeof oldSafety === 'function') {
    window.voyageSafety = function(){
      const s = oldSafety.apply(this, arguments);
      return window.hasHorizonCompass() ? Math.min(1, s + 0.15) : s;
    };
  }
  const oldWeatherLine = window.seaWeatherLine;
  if (typeof oldWeatherLine === 'function') {
    window.seaWeatherLine = function(){
      let t = oldWeatherLine.apply(this, arguments);
      try {
        if (window.hasHorizonCompass() && typeof window.seaWeather === 'function') {
          const w = window.seaWeather(game.day + 1);
          t += '<br>🧭 The compass shows tomorrow: ' + w.icon + ' ' + w.name + '.';
        }
      } catch(e) {}
      return t;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){ ensure(); return oldUpdateUI.apply(this, arguments); };
  }
})();
