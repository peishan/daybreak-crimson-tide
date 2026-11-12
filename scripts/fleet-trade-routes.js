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

  // Core of "send this ship to that port". Returns {ok, destName, distance,
  // cost} or {ok:false, reason}. No toast/save/render — callers decide, so
  // the one-click dispatch below can batch them into one summary.
  function startRoute(ship, destId){
    if (!ship || !ship.tradeIncome) return { ok:false, reason:'Not a trade vessel.' };
    if (ship.route) return { ok:false, reason:'Already out on a route.' };
    const home = fairTidePort();
    const dest = home && PORTS.find(function(p){ return p.id === destId; });
    if (!home || !dest || !home.distances[destId]) return { ok:false, reason:'Unknown destination.' };
    const distance = home.distances[destId];
    const cost = routeCost(distance);
    if ((game.gold || 0) < cost) return { ok:false, reason:'Not enough gold to stock the shipment.' };
    game.gold -= cost;
    ship.route = { destId: destId, distance: distance, invested: cost, departDay: game.day, arriveDay: game.day + distance };
    return { ok:true, destName: dest.name, distance: distance, cost: cost };
  }

  // Core of "collect a returned shipment". Returns {ok, lost, amount,
  // destName} or {ok:false, reason}. Logs the event, but no toast/save/render.
  function finishRoute(ship){
    if (!ship || !ship.route) return { ok:false, reason:'Not out on a route.' };
    if (game.day < ship.route.arriveDay) return { ok:false, reason:'Still en route.' };
    const dest = PORTS.find(function(p){ return p.id === ship.route.destId; });
    const dangerLevel = dest ? dest.danger : 1;
    const destName = dest ? dest.name : 'the destination';
    const invested = ship.route.invested;
    const lossChance = Math.min(ROUTE_RISK_CAP, dangerLevel * ROUTE_RISK_PER_DANGER);
    let result;
    if (Math.random() < lossChance) {
      if (typeof logEvent === 'function') logEvent('💨 ' + ship.name + '\'s shipment to ' + destName + ' was lost — ' + invested + 'g gone.', 'bad');
      result = { ok:true, lost:true, amount:invested, destName:destName };
    } else {
      const profit = Math.round(invested * ROUTE_BASE_MULTIPLIER * (1 + dangerLevel * 0.05));
      game.gold = (game.gold || 0) + profit;
      if (typeof logEvent === 'function') logEvent('💰 ' + ship.name + ' completes its run to ' + destName + ' — ' + profit + 'g.', 'gold');
      result = { ok:true, lost:false, amount:profit, destName:destName };
    }
    ship.route = null;
    return result;
  }

  function refreshFleetUI(){
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }

  window.assignFleetRoute = function(shipId, destId){
    const ship = (game.inheritedShips || []).find(function(s){ return s.id === shipId; });
    const r = startRoute(ship, destId);
    if (!r.ok) { toast(r.reason); return; }
    toast('🗺️ ' + ship.name + ' sets out for ' + r.destName + ' — back in ' + r.distance + ' day' + (r.distance === 1 ? '' : 's') + '.', 3600);
    refreshFleetUI();
  };

  window.collectFleetRoute = function(shipId){
    const ship = (game.inheritedShips || []).find(function(s){ return s.id === shipId; });
    const r = finishRoute(ship);
    if (!r.ok) { toast(r.reason); return; }
    if (r.lost) toast('💨 ' + ship.name + ' returns empty-handed — the shipment to ' + r.destName + ' never made it. ' + r.amount + 'g lost.', 4200);
    else toast('💰 ' + ship.name + ' returns from ' + r.destName + ' with ' + r.amount + 'g.', 4200);
    refreshFleetUI();
  };

  // ONE-CLICK DISPATCH — per San's report that managing the trade fleet
  // one ship and one destination button at a time is tiring. A single pass:
  //   1. collect every shipment that has returned,
  //   2. take today's flat trade income from each ship that hasn't yet,
  //   3. send every idle trade ship to a RANDOM eligible port it can
  //      afford (gold is spent as it goes, so earlier ships can't starve
  //      later ones of a pick — a ship with no affordable route is simply
  //      skipped and left idle for next time).
  // Same costs, risk and payouts as the manual buttons; the manual picker
  // stays for anyone who wants to choose a specific port.
  window.dispatchAllTradeShips = function(){
    const ships = (game.inheritedShips || []).filter(function(s){ return !!s.tradeIncome; });
    if (!ships.length) { toast('No trade ships to dispatch.'); return; }

    let collected = 0, lostCount = 0, lostGold = 0, profitGold = 0, dailyGold = 0;
    ships.forEach(function(ship){
      if (ship.route) {
        const r = finishRoute(ship);
        if (r.ok) { collected++; if (r.lost) { lostCount++; lostGold += r.amount; } else { profitGold += r.amount; } }
      }
      if (typeof window.claimTradeIncome === 'function') dailyGold += window.claimTradeIncome(ship.id, { quiet:true });
    });

    const dests = eligibleDestinations();
    let sent = 0, spent = 0, noFunds = 0;
    const sentLines = [];
    ships.forEach(function(ship){
      if (ship.route) return;
      const affordable = dests.filter(function(p){
        return (game.gold || 0) >= routeCost(fairTidePort().distances[p.id]);
      });
      if (!affordable.length) { noFunds++; return; }
      const pick = affordable[Math.floor(Math.random() * affordable.length)];
      const r = startRoute(ship, pick.id);
      if (r.ok) { sent++; spent += r.cost; sentLines.push(ship.name + ' → ' + r.destName + ' (' + r.distance + 'd)'); }
    });

    if (!collected && !dailyGold && !sent) {
      toast(dests.length ? 'Nothing to do — every ship is already out, and you can\'t afford another shipment right now.'
                         : 'No ports are unlocked for trade routes yet.', 3600);
      return;
    }
    const parts = [];
    if (collected) parts.push('💰 ' + (collected - lostCount) + ' return' + ((collected - lostCount) === 1 ? '' : 's') + ' collected (+' + profitGold + 'g)' +
      (lostCount ? ', 💨 ' + lostCount + ' shipment' + (lostCount === 1 ? '' : 's') + ' lost (−' + lostGold + 'g)' : ''));
    if (dailyGold) parts.push('+' + dailyGold + 'g trade income');
    if (sent) parts.push('🗺️ ' + sent + ' ship' + (sent === 1 ? '' : 's') + ' sent out (−' + spent + 'g): ' + sentLines.join(', '));
    if (noFunds) parts.push(noFunds + ' left in port — not enough gold');
    toast(parts.join(' · '), 6000);
    refreshFleetUI();
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
