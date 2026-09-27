(function(){
  // -------------------------------------------------------------------
  // FLEET TRADE ROUTES — per San's own request, following up on a design
  // review: fleet ships designated 'trade' only ever did a flat 25g/day
  // click (claimTradeIncome, this same file), which left the whole
  // pirate-capture-and-fleet system feeling disconnected from the
  // game's actual trading half, and gave high-level gold nothing real
  // to compete for. This adds a genuine risk/reward layer on top —
  // send a trade-designated ship on a real route to any port the player
  // has already discovered (isPortUnlocked, core-engine.js), using the
  // PORTS table's own distances for both cost and duration, with a real
  // chance of losing the shipment scaled by the destination's own
  // danger rating. Deliberately doesn't touch claimTradeIncome or the
  // daily-claim flow at all — both stay available side by side, so a
  // trade ship can still earn its safe daily trickle while also being
  // sent out on a longer, riskier run.
  //
  // Kept entirely in this new file rather than editing the dense ship-
  // rendering loop in fairtide-buildings-and-arc6.js beyond one line —
  // that function delegates to window.renderFleetTradeRouteUI(ship) for
  // the ship.tradeIncome branch instead of having this logic inlined,
  // so nothing about how fleet/stats ships render is at any risk.
  // -------------------------------------------------------------------

  const ROUTE_COST_PER_DISTANCE = 30;   // gold invested per distance unit — the actual gold sink
  const ROUTE_BASE_MULTIPLIER = 1.6;    // return on a successful run, before the danger bonus
  const ROUTE_RISK_PER_DANGER = 0.05;   // +5% loss chance per point of the destination's own danger rating
  const ROUTE_RISK_CAP = 0.5;           // never worse than a coin flip

  function fairTidePort(){
    return (typeof PORTS !== 'undefined') ? PORTS.find(function(p){ return p.id === 'fair_tide'; }) : null;
  }

  function eligibleDestinations(){
    const home = fairTidePort();
    if (!home) return [];
    return PORTS.filter(function(p){
      return p.id !== 'fair_tide' &&
        (typeof isPortUnlocked === 'function' ? isPortUnlocked(p.id) : true) &&
        !!home.distances[p.id];
    });
  }
  window.fleetRouteDestinations = eligibleDestinations;

  function routeCost(distance){ return distance * ROUTE_COST_PER_DISTANCE; }
  window.fleetRouteCost = routeCost;

  window.assignFleetRoute = function(shipId, destId){
    const ship = (game.inheritedShips || []).find(function(s){ return s.id === shipId; });
    if (!ship || !ship.tradeIncome) { toast('Not a trade vessel.'); return; }
    if (ship.route) { toast('Already out on a route.'); return; }
    const home = fairTidePort();
    const dest = home && PORTS.find(function(p){ return p.id === destId; });
    if (!home || !dest || !home.distances[destId]) { toast('Unknown destination.'); return; }
    const distance = home.distances[destId];
    const cost = routeCost(distance);
    if ((game.gold || 0) < cost) { toast('Not enough gold to stock the shipment.'); return; }
    game.gold -= cost;
    ship.route = { destId: destId, distance: distance, invested: cost, departDay: game.day, arriveDay: game.day + distance };
    toast('🗺️ ' + ship.name + ' sets out for ' + dest.name + ' — back in ' + distance + ' day' + (distance === 1 ? '' : 's') + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.collectFleetRoute = function(shipId){
    const ship = (game.inheritedShips || []).find(function(s){ return s.id === shipId; });
    if (!ship || !ship.route) { toast('Not out on a route.'); return; }
    if (game.day < ship.route.arriveDay) { toast('Still en route.'); return; }
    const dest = PORTS.find(function(p){ return p.id === ship.route.destId; });
    const dangerLevel = dest ? dest.danger : 1;
    const destName = dest ? dest.name : 'the destination';
    const invested = ship.route.invested;
    const lossChance = Math.min(ROUTE_RISK_CAP, dangerLevel * ROUTE_RISK_PER_DANGER);
    if (Math.random() < lossChance) {
      toast('💨 ' + ship.name + ' returns empty-handed — the shipment to ' + destName + ' never made it. ' + invested + 'g lost.', 4200);
      if (typeof logEvent === 'function') logEvent('💨 ' + ship.name + '\'s shipment to ' + destName + ' was lost — ' + invested + 'g gone.', 'bad');
    } else {
      const profit = Math.round(invested * ROUTE_BASE_MULTIPLIER * (1 + dangerLevel * 0.05));
      game.gold = (game.gold || 0) + profit;
      toast('💰 ' + ship.name + ' returns from ' + destName + ' with ' + profit + 'g.', 4200);
      if (typeof logEvent === 'function') logEvent('💰 ' + ship.name + ' completes its run to ' + destName + ' — ' + profit + 'g.', 'gold');
    }
    ship.route = null;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.renderFleetTradeRouteUI = function(ship){
    const canClaimDaily = (typeof window.canClaimTradeIncome === 'function') ? window.canClaimTradeIncome(ship.id) : false;
    let html = '<div style="margin-top:6px;"><button class="btn btn-small btn-success" ' + (canClaimDaily ? '' : 'disabled') + ' onclick="claimTradeIncome(\'' + ship.id + '\')">💰 Collect Trade Income</button></div>';

    if (ship.route) {
      const dest = (typeof PORTS !== 'undefined') ? PORTS.find(function(p){ return p.id === ship.route.destId; }) : null;
      const destName = dest ? dest.name : ship.route.destId;
      const daysLeft = ship.route.arriveDay - game.day;
      if (daysLeft > 0) {
        html += '<div style="margin-top:6px;font-size:.78rem;opacity:.8;">🗺️ En route to ' + esc(destName) + ' — back in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + '.</div>';
      } else {
        html += '<div style="margin-top:6px;"><button class="btn btn-small btn-magic" onclick="collectFleetRoute(\'' + ship.id + '\')">⚓ Returned from ' + esc(destName) + ' — Collect</button></div>';
      }
      return html;
    }

    const destinations = eligibleDestinations();
    if (destinations.length) {
      const home = fairTidePort();
      html += '<div style="margin-top:6px;font-size:.76rem;opacity:.7;">🗺️ Send on a trade route:</div>' +
        '<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">' +
        destinations.map(function(p){
          const distance = home.distances[p.id];
          const cost = routeCost(distance);
          const afford = (game.gold || 0) >= cost;
          return '<button class="btn btn-small" ' + (afford ? '' : 'disabled') + ' onclick="assignFleetRoute(\'' + ship.id + '\',\'' + p.id + '\')">' + p.icon + ' ' + esc(p.name) + ' (' + cost + 'g, ' + distance + 'd)</button>';
        }).join('') +
        '</div>';
    }
    return html;
  };
})();
