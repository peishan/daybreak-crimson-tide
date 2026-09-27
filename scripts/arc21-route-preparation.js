(function(){
  // -------------------------------------------------------------------
  // ARC XXI — ROUTE PREPARATION. Tenth of the Arc XXI buildings to get a
  // real gameplay system, grounded directly in Ch.16's own text.
  //
  // Ch.16 lists its own scope precisely: "Destination. Route. Crew.
  // Supplies. Ship readiness. Known hazards. What support is actually
  // available if something goes wrong." Seven items, not a vague
  // "prepare better" gesture — the checklist below is built directly
  // from that list, one entry each.
  //
  // Checked before building: the actual voyage loop (sailTo/doVoyage,
  // core-engine.js) is exactly the kind of shared, heavily-used code
  // Workshop's own comment already flagged as too risky to touch for a
  // side system — so this doesn't hook into departure itself. Instead
  // it's a one-time checklist (reusing the Council Hall/Route
  // Observatory per-item shape a third time) that reads real existing
  // state where it's cheap and safe to do so: crew count from
  // game.foundCompanions, ship condition from game.health/maxHealth, and
  // — honoring Supply House's own comment that it exposed
  // window.supplyHouseStock specifically for this screen — total
  // Supply House stock, guarded with a typeof check since Supply House
  // may or may not be loaded/unlocked yet. Completing all seven grants a
  // one-time finale bonus, matching Ch.16's own "this is what she should
  // have been doing from the very first voyage" beat.
  // -------------------------------------------------------------------

  const ROUTE_PREP_XP_PER_ITEM = 20;
  const ROUTE_PREP_COMPLETION_BONUS_XP = 60;

  const ROUTE_PREP_CHECKLIST = [
    { key: 'destination', icon: '🎯', label: 'Destination', desc: 'Not just "somewhere out there" — a specific port, named and agreed on before the ship leaves the dock.' },
    { key: 'route',       icon: '🗺️', label: 'Route', desc: "The actual path there, not just the destination — charted, not improvised once underway." },
    { key: 'crew',        icon: '🧑‍🤝‍🧑', label: 'Crew', desc: 'Who is actually coming, confirmed ahead of time rather than sorted out on the dock.' },
    { key: 'supplies',    icon: '📦', label: 'Supplies', desc: 'What the ship is carrying, checked against what the voyage will actually need.' },
    { key: 'ship',        icon: '⚓', label: 'Ship Readiness', desc: 'The ship itself, confirmed fit for the water before it\'s asked to prove it out there.' },
    { key: 'hazards',     icon: '⚠️', label: 'Known Hazards', desc: 'What could go wrong, named ahead of time instead of discovered the hard way.' },
    { key: 'support',     icon: '🛟', label: 'Available Support', desc: 'What Fair Tide can actually do if something goes wrong out there — not assumed, confirmed.' }
  ];
  window.ARC21_ROUTE_PREP_CHECKLIST = ROUTE_PREP_CHECKLIST;

  function routePreparationUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[16]);
  }
  window.routePreparationUnlocked = routePreparationUnlocked;

  function routePrepState(){
    game.routePrepChecklist = game.routePrepChecklist || {};
    return game.routePrepChecklist;
  }

  function isRoutePrepItemConfirmed(key){
    return !!routePrepState()[key];
  }
  window.isRoutePrepItemConfirmed = isRoutePrepItemConfirmed;

  function routePrepAllConfirmed(){
    return ROUTE_PREP_CHECKLIST.every(function(item){ return isRoutePrepItemConfirmed(item.key); });
  }
  window.routePrepAllConfirmed = routePrepAllConfirmed;

  // Live read-outs for the three items where real game state is cheap
  // and safe to surface — the other four stay flavor-only, matching
  // Ch.16's own text rather than inventing tracking systems it never
  // asked for.
  function routePrepLiveNote(key){
    if (key === 'crew') {
      const count = 1 + Object.keys(game.foundCompanions || {}).length; // +1 for San, always present
      return count + ' crew member' + (count === 1 ? '' : 's') + ' currently with the Crimson Tide.';
    }
    if (key === 'ship') {
      const hp = Number(game.health || 0), maxHp = Number(game.maxHealth || 0);
      return 'Ship condition: ' + hp + ' / ' + maxHp + '.';
    }
    if (key === 'supplies') {
      if (typeof window.supplyHouseStock !== 'function') return "The Supply House hasn't been built yet — supplies are still tracked informally.";
      const categories = window.ARC21_SUPPLY_CATEGORIES || [];
      const total = categories.reduce(function(sum, c){ return sum + window.supplyHouseStock(c.key); }, 0);
      return total + ' units stocked at the Supply House.';
    }
    return '';
  }

  function confirmRoutePrepItem(key){
    if (!routePreparationUnlocked()) return;
    if (isRoutePrepItemConfirmed(key)) { toast('Already confirmed.', 2800); return; }
    const item = ROUTE_PREP_CHECKLIST.find(function(i){ return i.key === key; });
    if (!item) return;
    const state = routePrepState();
    state[key] = true;
    gainXP(ROUTE_PREP_XP_PER_ITEM);
    toast('🧭 ' + item.label + ' confirmed. +' + ROUTE_PREP_XP_PER_ITEM + ' XP.', 3200);
    if (routePrepAllConfirmed() && !game.routePrepComplete) {
      game.routePrepComplete = true;
      gainXP(ROUTE_PREP_COMPLETION_BONUS_XP);
      toast('🧭 Full Route Preparation checklist complete! +' + ROUTE_PREP_COMPLETION_BONUS_XP + ' bonus XP.', 4200);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.confirmRoutePrepItem = confirmRoutePrepItem;

  function renderRoutePreparationPanel(){
    if (!routePreparationUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🧭 Route Preparation</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a new kind of danger — just the departure finally getting the same care Fair Tide itself just got.</p>';
    if (game.routePrepComplete) {
      html += '<div class="story-chip" style="margin-bottom:8px;">✓ Full checklist complete</div>';
    }
    ROUTE_PREP_CHECKLIST.forEach(function(item){
      const confirmed = isRoutePrepItemConfirmed(item.key);
      const liveNote = routePrepLiveNote(item.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+item.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(item.label)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(item.desc)+'</span>'+
        (liveNote ? '<br><span style="font-size:.74rem;opacity:.6;">'+esc(liveNote)+'</span>' : '')+
        '</div>'+
        (confirmed
          ? '<span style="font-size:.78rem;opacity:.6;">✓ Confirmed</span>'
          : '<button class="btn btn-small" onclick="confirmRoutePrepItem(\''+item.key+'\')">Confirm (+'+ROUTE_PREP_XP_PER_ITEM+' XP)</button>')+
        '</div></article>';
    });
    return html;
  }
  window.renderRoutePreparationPanel = renderRoutePreparationPanel;

  const oldRenderArchiveScreenForRoutePreparation = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForRoutePreparation) oldRenderArchiveScreenForRoutePreparation();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('routePreparationPanelWrap');
    if (existing) existing.remove();
    const panel = renderRoutePreparationPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="routePreparationPanelWrap">'+panel+'</div>');
  };
})();
