(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE MARKET QUARTER. Third of the Arc XXI buildings to get
  // a real gameplay system, grounded directly in Ch.7's own text.
  //
  // Confirmed before building: Fair Tide is NOT one of the regular
  // PORTS entries, so the existing market system (generateMarketPrices/
  // renderMarket/buyGood in core-engine.js) has never applied to it —
  // this genuinely introduces Fair Tide's own trade capability for the
  // first time, not a formalization of something that already worked
  // there.
  //
  // Ch.7's own text is about ORGANIZATION, not a full new buy/sell
  // simulation: "Formalizing it into an actual Market Quarter doesn't
  // change what's being sold so much as it changes how findable
  // everything is." Scoped accordingly — reuses the same daily-claim
  // pattern already proven for the Harbour Office (own distinct
  // flavor/amount) rather than building a second full trading
  // interface, and adds a small rotating "today's travelling vendor"
  // flavor line, directly grounded in Ch.7's own "travelling vendors
  // get somewhere expected to set up" — giving the Quarter some life
  // without inventing a deep new mechanic the text never asked for.
  // -------------------------------------------------------------------

  const MARKET_REVENUE_PER_DAY = 35;

  // Grounded in Ch.7's own "local goods and imported goods" line —
  // matching this game's existing GOODS categories where possible
  // rather than inventing unrelated trade items.
  const TRAVELLING_VENDORS = [
    { icon: '🧵', name: 'A cloth trader from Batavia', goods: 'silk and dyed cotton' },
    { icon: '🍯', name: 'A spice merchant passing through', goods: 'pepper and nutmeg' },
    { icon: '🏺', name: 'A potter from further up the coast', goods: 'glazed jars and tableware' },
    { icon: '🐚', name: 'A pearl diver between voyages', goods: 'pearls and shell work' },
    { icon: '🪵', name: 'A timber trader with a full cart', goods: 'seasoned wood and rope' },
    { icon: '📜', name: 'A paper merchant, quieter than most', goods: 'ink, paper, and record books' }
  ];
  window.ARC21_TRAVELLING_VENDORS = TRAVELLING_VENDORS;

  function marketQuarterUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[7]);
  }
  window.marketQuarterUnlocked = marketQuarterUnlocked;

  function todaysVendor(){
    // Deterministic per-day rotation (not random) so the same vendor
    // shows all day rather than changing on every re-render.
    const idx = (game.day || 0) % TRAVELLING_VENDORS.length;
    return TRAVELLING_VENDORS[idx];
  }
  window.todaysVendor = todaysVendor;

  function canClaimMarketRevenue(){
    if (!marketQuarterUnlocked()) return false;
    game.marketQuarter = game.marketQuarter || { lastClaimDay: -1 };
    return game.marketQuarter.lastClaimDay !== game.day;
  }
  window.canClaimMarketRevenue = canClaimMarketRevenue;

  function claimMarketRevenue(){
    if (!canClaimMarketRevenue()) { toast('Already collected today.', 2800); return; }
    game.marketQuarter = game.marketQuarter || { lastClaimDay: -1 };
    game.marketQuarter.lastClaimDay = game.day;
    game.gold = (game.gold || 0) + MARKET_REVENUE_PER_DAY;
    toast('🛍️ Market Quarter brings in ' + MARKET_REVENUE_PER_DAY + 'g in stall fees.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimMarketRevenue = claimMarketRevenue;

  function renderMarketQuarterPanel(){
    if (!marketQuarterUnlocked()) return '';
    const claimable = canClaimMarketRevenue();
    const vendor = todaysVendor();
    let html = '<div class="panel-title" style="margin-top:16px;">🛍️ Market Quarter</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Somewhere people actually come to trade — not just wherever trade happened to spill out.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+vendor.icon+'</div><div style="flex:1;">'+
      '<strong>Today\'s Vendor</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(vendor.name)+', selling '+esc(vendor.goods)+'.</span>'+
      '</div></div></article>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">💰</div><div style="flex:1;">'+
      '<strong>Stall Fees</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">Local goods and imported goods finally have their own space, instead of competing for the same six square feet of dock.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimMarketRevenue()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '💰 Collect ' + MARKET_REVENUE_PER_DAY + 'g' : '✓ Collected Today')+
      '</button></div></article>';
    return html;
  }
  window.renderMarketQuarterPanel = renderMarketQuarterPanel;

  const oldRenderArchiveScreenForMarketQuarter = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForMarketQuarter) oldRenderArchiveScreenForMarketQuarter();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('marketQuarterPanelWrap');
    if (existing) existing.remove();
    const panel = renderMarketQuarterPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="marketQuarterPanelWrap">'+panel+'</div>');
  };
})();
