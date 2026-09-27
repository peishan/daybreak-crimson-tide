(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE FAIR TIDE LEDGER. Twelfth and last of the Arc XXI
  // buildings, grounded directly in Ch.21's own text, and built last on
  // purpose — flagged back when the Route Observatory went in as
  // something that only makes sense "once everything else actually
  // exists to summarize." It now does.
  //
  // Ch.21 is explicit about what this is and isn't: "not a building this
  // time, just a single place to actually look and know, at a glance,
  // what Fair Tide currently has and where it stands." So this is
  // read-only by design — no new resource, no claim button, no
  // investment tier of its own. It reads every other Arc XXI building's
  // already-exposed window.* state (each one's own *Unlocked() check,
  // plus whatever state that file itself put on window) and renders one
  // line per building that's actually been built, wrapped in typeof
  // guards the same defensive way every cross-file read in this
  // codebase already does. The Commons gets a line too, honestly
  // described as having nothing to report — matching its own Ch.18
  // text ("nobody's managing anything") rather than inventing a status
  // for it just to keep the list uniform.
  // -------------------------------------------------------------------

  function ledgerUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[21]);
  }
  window.fairTideLedgerUnlocked = ledgerUnlocked;

  function ledgerRow(icon, label, value){
    return '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+icon+'</div><div style="flex:1;">'+
      '<strong>'+esc(label)+'</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(value)+'</span>'+
      '</div></div></article>';
  }

  function councilHallLine(){
    if (typeof window.councilHallUnlocked !== 'function' || !window.councilHallUnlocked()) return null;
    const decisions = window.ARC21_COUNCIL_DECISIONS || [];
    const resolved = decisions.filter(function(d){ return typeof window.councilDecisionResolved === 'function' && window.councilDecisionResolved(d.key); }).length;
    return ledgerRow('🏛️', 'Council Hall', resolved + ' / ' + decisions.length + ' decisions made.');
  }

  function harbourOfficeLine(){
    if (typeof window.harbourOfficeUnlocked !== 'function' || !window.harbourOfficeUnlocked()) return null;
    const claimable = typeof window.canClaimHarbourFees === 'function' && window.canClaimHarbourFees();
    return ledgerRow('⚓', 'Harbour Office', claimable ? 'Docking fees ready to collect.' : 'Docking fees already collected today.');
  }

  function marketQuarterLine(){
    if (typeof window.marketQuarterUnlocked !== 'function' || !window.marketQuarterUnlocked()) return null;
    const claimable = typeof window.canClaimMarketRevenue === 'function' && window.canClaimMarketRevenue();
    return ledgerRow('🛍️', 'Market Quarter', claimable ? 'Stall fees ready to collect.' : 'Stall fees already collected today.');
  }

  function supplyHouseLine(){
    if (typeof window.supplyHouseUnlocked !== 'function' || !window.supplyHouseUnlocked()) return null;
    const categories = window.ARC21_SUPPLY_CATEGORIES || [];
    const total = categories.reduce(function(sum, c){
      return sum + (typeof window.supplyHouseStock === 'function' ? window.supplyHouseStock(c.key) : 0);
    }, 0);
    return ledgerRow('📦', 'Supply House', total + ' units stocked across ' + categories.length + ' categories.');
  }

  function medicalHouseLine(){
    if (typeof window.medicalHouseUnlocked !== 'function' || !window.medicalHouseUnlocked()) return null;
    const tiers = window.ARC21_MEDICAL_TIERS || [];
    const tier = typeof window.medicalHouseTier === 'function' ? window.medicalHouseTier() : 0;
    return ledgerRow('🏥', 'Medical House', 'Tier ' + tier + ' / ' + tiers.length + ' funded.');
  }

  function workshopLine(){
    if (typeof window.workshopUnlocked !== 'function' || !window.workshopUnlocked()) return null;
    const claimable = typeof window.canClaimWorkshopRevenue === 'function' && window.canClaimWorkshopRevenue();
    return ledgerRow('⚒️', 'The Workshop', claimable ? 'Repair fees ready to collect.' : 'Repair fees already collected today.');
  }

  function wardensHallLine(){
    if (typeof window.wardensHallUnlocked !== 'function' || !window.wardensHallUnlocked()) return null;
    const claimable = typeof window.canClaimWardensWatch === 'function' && window.canClaimWardensWatch();
    return ledgerRow('🛡️', "Warden's Hall", claimable ? 'Watch report ready to file.' : 'Watch report already filed today.');
  }

  function routeObservatoryLine(){
    if (typeof window.routeObservatoryUnlocked !== 'function' || !window.routeObservatoryUnlocked()) return null;
    const known = typeof window.worldCatalogueState === 'function' ? window.worldCatalogueState() : [];
    const logged = known.filter(function(w){ return typeof window.isWorldLogged === 'function' && window.isWorldLogged(w.key); }).length;
    return ledgerRow('🔭', 'Route Observatory', logged + ' / ' + known.length + ' known worlds logged.');
  }

  function horizonChamberLine(){
    if (typeof window.horizonChamberUnlocked !== 'function' || !window.horizonChamberUnlocked()) return null;
    const tiers = window.ARC21_HORIZON_CHAMBER_TIERS || [];
    const tier = typeof window.horizonChamberTier === 'function' ? window.horizonChamberTier() : 0;
    const bonusPct = typeof window.horizonChamberXpBonus === 'function' ? Math.round(window.horizonChamberXpBonus() * 100) : 0;
    return ledgerRow('🌌', 'Horizon Chamber', 'Tier ' + tier + ' / ' + tiers.length + ' funded (+' + bonusPct + '% party XP).');
  }

  function routePreparationLine(){
    if (typeof window.routePreparationUnlocked !== 'function' || !window.routePreparationUnlocked()) return null;
    const checklist = window.ARC21_ROUTE_PREP_CHECKLIST || [];
    const confirmed = checklist.filter(function(item){ return typeof window.isRoutePrepItemConfirmed === 'function' && window.isRoutePrepItemConfirmed(item.key); }).length;
    const complete = confirmed === checklist.length && checklist.length > 0;
    return ledgerRow('🧭', 'Route Preparation', confirmed + ' / ' + checklist.length + ' checklist items confirmed' + (complete ? ' — complete.' : '.'));
  }

  function commonsLine(){
    if (typeof window.commonsUnlocked !== 'function' || !window.commonsUnlocked()) return null;
    return ledgerRow('🏠', 'The Commons', "Open. Nothing to report — by design, nobody's managing anything here.");
  }

  const LEDGER_SECTIONS = [
    councilHallLine, harbourOfficeLine, marketQuarterLine, supplyHouseLine,
    medicalHouseLine, workshopLine, wardensHallLine, routeObservatoryLine,
    horizonChamberLine, routePreparationLine, commonsLine
  ];

  function renderFairTideLedgerPanel(){
    if (!ledgerUnlocked()) return '';
    const rows = LEDGER_SECTIONS.map(function(fn){ return fn(); }).filter(Boolean);
    let html = '<div class="panel-title" style="margin-top:16px;">📖 The Fair Tide Ledger</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a new place to manage — just, finally, a single place to actually look and know, at a glance, what Fair Tide currently has and where it stands.</p>';
    html += ledgerRow('💰', 'Fair Tide Overview', (game.gold||0) + ' gold · ' + (game.reputation||0) + ' reputation · Level ' + (typeof level === 'function' ? level() : '?') + '.');
    if (!rows.length) {
      html += '<p style="font-size:.78rem;opacity:.6;">Nothing else built yet to summarize.</p>';
    } else {
      html += rows.join('');
    }
    return html;
  }
  window.renderFairTideLedgerPanel = renderFairTideLedgerPanel;

  const oldRenderArchiveScreenForLedger = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForLedger) oldRenderArchiveScreenForLedger();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideLedgerPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideLedgerPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="fairTideLedgerPanelWrap">'+panel+'</div>');
  };
})();
