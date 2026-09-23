(function(){
  // -------------------------------------------------------------------
  // PERSISTENT LOCATION SUBTITLE FIX (San's report: "the ship should
  // dock there, not return to the last dock"). game.location is the
  // single source of truth for normal ports — used for market prices,
  // quest completion checks, and more — so it's deliberately never
  // touched when visiting the Harbour/Tide Network/Clan Settlement,
  // which aren't real ports. But updateUI()'s persistent header
  // ("Port of X", visible on every screen) reads game.location directly
  // with no awareness of these other locations at all, so it kept
  // showing whatever normal port was last visited even while the player
  // was actually standing at the Harbour — exactly the "still shows the
  // old dock" symptom. Fixed with a separate override, set on arrival at
  // any of the three unknown locations and cleared on leaving, checked
  // by a wrap around updateUI() rather than ever touching game.location
  // itself — so nothing downstream that depends on it (market prices,
  // quest checks) is at any risk.
  // -------------------------------------------------------------------

  const UNKNOWN_LOCATION_SCREENS = {
    harbour: function(){
      const hs = window.harbourState ? window.harbourState() : null;
      return { icon: '⚓', name: (hs && hs.nameKnown) ? hs.name : 'Unknown Harbour' };
    },
    tidenetwork: function(){
      const ts = window.tideNetworkState ? window.tideNetworkState() : null;
      return { icon: '🌊', name: (ts && ts.nameKnown) ? ts.name : 'Unknown Tide Settlement' };
    },
    clansettlement: function(){
      const cs = window.clanSettlementState ? window.clanSettlementState() : null;
      return { icon: '🌕', name: (cs && cs.nameKnown) ? cs.name : 'Unknown Settlement' };
    }
  };

  const oldGoScreenForLocationSubtitle = window.goScreen;
  window.goScreen = function(name){
    if (UNKNOWN_LOCATION_SCREENS[name]) {
      game.currentLocationOverride = UNKNOWN_LOCATION_SCREENS[name]();
    } else {
      game.currentLocationOverride = null;
    }
    return oldGoScreenForLocationSubtitle(name);
  };

  const oldUpdateUIForLocationSubtitle = window.updateUI;
  window.updateUI = function(){
    const result = oldUpdateUIForLocationSubtitle.apply(this, arguments);
    if (game.currentLocationOverride) {
      const subtitleEl = document.getElementById('locationSubtitle');
      const marketNameEl = document.getElementById('marketPortName');
      if (subtitleEl) subtitleEl.textContent = game.currentLocationOverride.icon + ' ' + game.currentLocationOverride.name;
      if (marketNameEl) marketNameEl.textContent = game.currentLocationOverride.name;
    }
    return result;
  };
})();


(function(){
  // -------------------------------------------------------------------
  // TRADE / MARKET CONTENT (San's report: "no trades for the earlier
  // harbours despite clearing the arc"). Confirmed the actual bug: the
  // Trade/Market/Underwater Market/Crafts sections were correctly
  // defined and correctly unlocked once their arcs completed, but NONE
  // of them ever had real render content — every one fell through to
  // the generic "Nothing here yet." placeholder, forever, regardless of
  // unlock state. This gives all five a working sell panel: cargo sold
  // here at a bonus rate reflecting the established trade relationship,
  // reusing the existing GOODS/game.cargo data rather than inventing a
  // new economy. Deliberately NOT routed through the normal sellGood(),
  // since that prices off game.marketPrices[game.location] — these
  // aren't real ports, and game.location is deliberately never touched
  // for them (see the location-subtitle fix above), so a separate,
  // self-contained sell function is used instead.
  //
  // Detected and replaced via the rendered "Nothing here yet." fallback
  // itself, matched by each section's own panel title — the section
  // each location's screen currently has active is a variable private
  // to that file's own closure, not something reachable from here.
  // -------------------------------------------------------------------

  const TRADE_BONUS_MULTIPLIER = 1.15; // 15% above base price, reflecting the established relationship

  function sellAtUnknownLocation(goodId, locationKey, refreshFn){
    const good = GOODS[goodId];
    if (!good) return;
    const available = game.cargo[goodId] || 0;
    if (available <= 0) { toast('Nothing to sell.'); return; }
    const price = Math.round(good.basePrice * TRADE_BONUS_MULTIPLIER);
    const total = price * available;
    game.gold += total;
    game.cargoUsed -= good.weight * available;
    delete game.cargo[goodId];
    if (game.cargoPurchaseCost) delete game.cargoPurchaseCost[goodId];
    logEvent('💰 Sold ' + available + ' ' + good.name + ' for ' + total + 'g.', 'gold');
    toast('💰 Sold ' + available + ' ' + good.icon + ' ' + good.name + ' for ' + total + 'g.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof window[refreshFn] === 'function') window[refreshFn]();
  }
  window.sellAtUnknownLocation = sellAtUnknownLocation;

  function tradePanelHtml(sectionKey, sectionName, sectionIcon, refreshFn, flavor){
    const cargoEntries = Object.keys(game.cargo || {}).filter(function(id){ return (game.cargo[id]||0) > 0 && GOODS[id]; });
    let html = '<div class="panel-title">'+sectionIcon+' '+sectionName+'</div>'+
      '<p style="font-size:.82rem;opacity:.8;margin-bottom:10px;">'+flavor+'</p>';
    if (!cargoEntries.length) {
      html += '<p style="font-size:.8rem;opacity:.6;">Nothing in the hold worth offering right now.</p>';
    } else {
      cargoEntries.forEach(function(id){
        const good = GOODS[id];
        const qty = game.cargo[id];
        const price = Math.round(good.basePrice * TRADE_BONUS_MULTIPLIER);
        html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
          '<div style="font-size:1.4rem;">'+good.icon+'</div>'+
          '<div style="flex:1;"><strong>'+good.name+'</strong><br>'+
          '<span style="font-size:.78rem;opacity:.75;">'+qty+' in hold · '+price+'g each</span></div>'+
          '<button class="btn btn-small btn-success" onclick="sellAtUnknownLocation(\''+id+'\',\''+sectionKey+'\',\''+refreshFn+'\')">Sell All</button>'+
          '</div></article>';
      });
    }
    return html;
  }
  window.__ctTradePanelHtml = tradePanelHtml;

  const FALLBACK_MARKER = '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';

  function replaceFallback(container, icon, name, panelHtml){
    if (!container) return false;
    const needle = '<div class="panel-title">'+icon+' '+name+'</div>'+FALLBACK_MARKER;
    if (container.innerHTML.indexOf(needle) === -1) return false;
    container.innerHTML = container.innerHTML.replace(needle, panelHtml);
    return true;
  }

  const oldRenderHarbourForTrade = window.renderHarbourScreen;
  window.renderHarbourScreen = function(){
    oldRenderHarbourForTrade.apply(this, arguments);
    const container = document.getElementById('harbourContent');
    replaceFallback(container, '🏪', 'Market', tradePanelHtml('market','Market','🏪','renderHarbourScreen',
      'Local goods, sold in the other direction — what the crew brings in gets a fair look here, now that the harbour actually knows them.'));
    replaceFallback(container, '💰', 'Trade', tradePanelHtml('trade','Trade','💰','renderHarbourScreen',
      'A real trade relationship, established. Cargo sells for more here than it ever did as strangers.'));
  };

  const oldRenderTideNetworkForTrade = window.renderTideNetworkScreen;
  window.renderTideNetworkScreen = function(){
    oldRenderTideNetworkForTrade.apply(this, arguments);
    const container = document.getElementById('tideNetworkContent');
    replaceFallback(container, '🐚', 'Underwater Market', tradePanelHtml('underwater_market','Underwater Market','🐚','renderTideNetworkScreen',
      'What the current carries in, the settlement is willing to take off your hands — at a rate that reflects how far you\'ve actually come.'));
  };

  const oldRenderClanSettlementForTrade = window.renderClanSettlementScreen;
  window.renderClanSettlementScreen = function(){
    oldRenderClanSettlementForTrade.apply(this, arguments);
    const container = document.getElementById('clanSettlementContent');
    replaceFallback(container, '🛍️', 'Market', tradePanelHtml('market','Market','🛍️','renderClanSettlementScreen',
      'Furs, herbs, and everything the forest doesn\'t need back — the settlement trades fairly now that the crew has actually shown their face here.'));
    replaceFallback(container, '🛠️', 'Crafts', tradePanelHtml('crafts','Crafts','🛠️','renderClanSettlementScreen',
      'The settlement\'s own craftspeople will take raw goods off the crew\'s hands, same as anyone they\'ve come to trust.'));
  };
})();


(function(){
  // -------------------------------------------------------------------
  // PROGRESS TOAST — top-right, stacked, auto-dismissing. San's request,
  // matching the exact pattern from her Daybreak project (uploaded as
  // reference): a small, ephemeral progress indicator ("3/10") distinct
  // from the existing bottom-center toast(), which stays reserved for
  // single, more prominent messages. Used for quest/bounty/temple-vow
  // progress — this naturally covers "port trades" and "requests, market,
  // trade" too, since delivery-type quests already flow through the same
  // checkQuestProgress() this hooks into; nothing separate was needed for
  // those.
  // -------------------------------------------------------------------
  window.progressToast = function(text){
    let stack = document.getElementById('ctProgressToastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'ctProgressToastStack';
      stack.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);right:12px;z-index:1400;display:flex;flex-direction:column;gap:6px;align-items:flex-end;pointer-events:none;max-width:70vw;';
      document.body.appendChild(stack);
    }
    const item = document.createElement('div');
    item.style.cssText = 'background:rgba(10,14,20,.92);border:1px solid rgba(232,197,71,.5);color:#f0e4c2;padding:7px 12px;border-radius:8px;font-family:Cinzel,serif;font-size:.74rem;box-shadow:0 4px 14px rgba(0,0,0,.4);opacity:0;transition:opacity .2s ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    item.textContent = text;
    stack.appendChild(item);
    requestAnimationFrame(function(){ item.style.opacity = '1'; });
    setTimeout(function(){
      item.style.opacity = '0';
      setTimeout(function(){ item.remove(); }, 250);
    }, 3000);
    while (stack.children.length > 4) stack.removeChild(stack.firstChild);
  };
})();
