(function(){
  // -------------------------------------------------------------------
  // LOCAL PORT STANDING — per-port reputation, additive and separate from
  // game.reputation (the existing global number that drives the rank tiers
  // in REPUTATION_RANKS / getReputationBonus(), already feeding xpBonus/
  // goldBonus/critBonus across the game). This tracks how well known the
  // crew is AT EACH PORT individually — a busy trader at Fair Tide can
  // still be a total stranger at Manila — earned through trading volume
  // and harbor-patrol kills fought AT that port, and grants a small buy
  // discount there once it builds up. Nothing here touches
  // game.reputation or any of its existing readers.
  // -------------------------------------------------------------------

  const TIERS = [
    { min: 0,   label: 'Stranger',       discount: 0    },
    { min: 50,  label: 'Familiar Face',  discount: 0.02 },
    { min: 150, label: 'Regular',        discount: 0.04 },
    { min: 350, label: 'Trusted Trader', discount: 0.07 },
    { min: 700, label: 'Local Legend',   discount: 0.10 }
  ];
  const HARBOR_KILL_STANDING = 15;

  function standingFor(portId){
    game.portStanding = game.portStanding || {};
    return game.portStanding[portId] || 0;
  }
  function addStanding(portId, amount){
    if (!portId || !amount) return;
    game.portStanding = game.portStanding || {};
    game.portStanding[portId] = (game.portStanding[portId] || 0) + amount;
  }
  function tierFor(points){
    let tier = TIERS[0];
    for (let i = 0; i < TIERS.length; i++) { if (points >= TIERS[i].min) tier = TIERS[i]; }
    return tier;
  }
  window.portStandingFor = standingFor;
  window.portStandingTier = function(portId){ return tierFor(standingFor(portId)); };
  window.PORT_STANDING_TIERS = TIERS;

  // --- Earning: trading volume at this port ---------------------------
  // Measured as actual cargo delta rather than the requested qty, since
  // buyGood/sellGood (and the price-validity guard already wrapped around
  // them in safety-and-fixes.js) can legitimately buy/sell less than
  // asked — insufficient gold, a full hold, a clamped sell qty, or a
  // blocked non-finite price. Standing should only reflect trade that
  // actually happened.
  const oldBuyGoodForStanding = window.buyGood;
  window.buyGood = function(goodId, qty){
    const port = game.location;
    const before = game.cargo[goodId] || 0;
    const result = oldBuyGoodForStanding.apply(this, arguments);
    const actual = (game.cargo[goodId] || 0) - before;
    if (actual > 0) addStanding(port, actual);
    return result;
  };
  const oldSellGoodForStanding = window.sellGood;
  window.sellGood = function(goodId, qty){
    const port = game.location;
    const before = game.cargo[goodId] || 0;
    const result = oldSellGoodForStanding.apply(this, arguments);
    const actual = before - (game.cargo[goodId] || 0);
    if (actual > 0) addStanding(port, actual);
    return result;
  };

  // --- Earning: harbor-patrol kills fought at this port ----------------
  // Scoped to kind==='harbor' only (the Harbor Defense encounters at
  // core-engine.js's Explore tab and clan-settlement-and-sw.js) — not
  // guardian bosses, story fights, training bouts, or Uncharted Reach/
  // Expedition/Pirate Cove encounters, which aren't tied to a single port
  // the same way.
  const oldHandleVictoryForStanding = window.handleVictory;
  window.handleVictory = function(){
    const enemy = game.combatEnemy;
    const wasHarborFight = !!(enemy && enemy.kind === 'harbor');
    const port = game.location;
    const result = oldHandleVictoryForStanding.apply(this, arguments);
    if (wasHarborFight) addStanding(port, HARBOR_KILL_STANDING);
    return result;
  };

  // --- Spending: buy-price discount, stacks with existing haggle logic -
  const oldHaggleForStanding = window.haggleMultiplier;
  window.haggleMultiplier = function(){
    let m = oldHaggleForStanding ? oldHaggleForStanding() : 1;
    const tier = tierFor(standingFor(game.location));
    if (tier.discount > 0) m *= (1 - tier.discount);
    return m;
  };

  // --- UI: standing panel appended to the Market detail view -----------
  const oldRenderMarketForStanding = window.renderMarket;
  window.renderMarket = function(){
    oldRenderMarketForStanding();
    const detail = document.getElementById('marketDetail');
    if (!detail || !game.location) return;
    const points = standingFor(game.location);
    const tier = tierFor(points);
    const idx = TIERS.indexOf(tier);
    const next = TIERS[idx + 1];
    const port = (typeof PORTS !== 'undefined' && PORTS.find) ? PORTS.find(function(p){ return p.id === game.location; }) : null;
    const portName = port ? port.name : game.location;
    const pct = next ? Math.max(0, Math.min(100, Math.round((points / next.min) * 100))) : 100;
    const progressLine = next
      ? (points + ' / ' + next.min + ' to ' + next.label)
      : (points + ' pts · maximum standing reached');
    detail.insertAdjacentHTML('beforeend',
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(232,201,106,0.15);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;font-size:.75rem;opacity:.85;">' +
          '<span>🏮 Standing at ' + esc(portName) + ': <strong style="color:var(--gold);">' + esc(tier.label) + '</strong></span>' +
          (tier.discount > 0 ? '<span style="color:var(--gold);">-' + Math.round(tier.discount * 100) + '% buy</span>' : '') +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.08);border-radius:4px;height:5px;margin-top:4px;overflow:hidden;">' +
          '<div style="background:var(--gold);height:100%;width:' + pct + '%;"></div>' +
        '</div>' +
        '<div style="font-size:.68rem;opacity:.6;margin-top:2px;">' + progressLine + '</div>' +
      '</div>');
  };
})();
