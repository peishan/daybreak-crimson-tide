(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE ROUTE OBSERVATORY. Eighth of the Arc XXI buildings to
  // get a real gameplay system, grounded directly in Ch.13-14's own
  // text.
  //
  // Checked before building: world-catalogue.js already renders exactly
  // what Ch.14 describes wanting — known routes, route conditions,
  // recorded destinations, and horizon stability, one entry per
  // discovered world (window.WORLD_CATALOGUE / worldCatalogueState()).
  // A second panel that just re-displays the same fields would be the
  // same redundancy problem avoided for the Medical House and Workshop
  // — not a new capability, just the same "scattered notes and memory"
  // the Observatory is supposed to replace. This reuses
  // worldCatalogueState() as read-only data (never modifies
  // WORLD_CATALOGUE or its fields) rather than inventing a parallel
  // route list.
  //
  // What Ch.14 actually adds beyond the passive display is the ACT of
  // it — "actually see the network, instead of holding pieces of it in
  // scattered notes and memory," Renn "quietly delighted" that a
  // problem he'd been carrying now has somewhere to live. That's the
  // one-time work of formally recording each already-discovered world
  // into the Observatory's own record — so this reuses Council Hall's
  // one-time, per-item shape (COUNCIL_DECISIONS → one world entry per
  // action) rather than a fifth daily-claim panel in a row, with a flat
  // XP reward standing in for "the research finally has somewhere to
  // live" rather than a gold fee Ch.14's text never mentions.
  // -------------------------------------------------------------------

  const OBSERVATORY_LOG_XP = 45;

  function routeObservatoryUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[14]);
  }
  window.routeObservatoryUnlocked = routeObservatoryUnlocked;

  function observatoryLoggedWorlds(){
    game.routeObservatoryLog = game.routeObservatoryLog || {};
    return game.routeObservatoryLog;
  }

  function isWorldLogged(worldKey){
    return !!observatoryLoggedWorlds()[worldKey];
  }
  window.isWorldLogged = isWorldLogged;

  function logWorldAtObservatory(worldKey){
    if (!routeObservatoryUnlocked()) return;
    if (isWorldLogged(worldKey)) { toast('Already logged.', 2800); return; }
    const known = (typeof window.worldCatalogueState === 'function') ? window.worldCatalogueState() : [];
    const entry = known.find(function(w){ return w.key === worldKey; });
    if (!entry) return; // defensive — the panel only ever offers discovered worlds
    const log = observatoryLoggedWorlds();
    log[worldKey] = true;
    gainXP(OBSERVATORY_LOG_XP);
    toast('🔭 ' + entry.name + ' formally logged at the Observatory. +' + OBSERVATORY_LOG_XP + ' XP.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.logWorldAtObservatory = logWorldAtObservatory;

  function renderRouteObservatoryPanel(){
    if (!routeObservatoryUnlocked()) return '';
    const known = (typeof window.worldCatalogueState === 'function') ? window.worldCatalogueState() : [];
    const loggedCount = known.filter(function(w){ return isWorldLogged(w.key); }).length;
    let html = '<div class="panel-title" style="margin-top:16px;">🔭 The Route Observatory</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a laboratory, not quite a library — somewhere the network finally has a place to live outside Renn\'s own notebooks.</p>'+
      '<p style="font-size:.74rem;opacity:.55;margin-bottom:8px;">'+loggedCount+' / '+known.length+' known worlds logged.</p>';
    known.forEach(function(entry){
      const logged = isWorldLogged(entry.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+entry.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(entry.name)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.7;">Horizon Stability: '+esc(entry.fields.horizonStability)+'</span>'+
        '</div>'+
        (logged
          ? '<span style="font-size:.78rem;opacity:.6;">✓ Logged</span>'
          : '<button class="btn btn-small" onclick="logWorldAtObservatory(\''+entry.key+'\')">🔭 Log (+'+OBSERVATORY_LOG_XP+' XP)</button>')+
        '</div></article>';
    });
    return html;
  }
  window.renderRouteObservatoryPanel = renderRouteObservatoryPanel;

  const oldRenderArchiveScreenForRouteObservatory = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForRouteObservatory) oldRenderArchiveScreenForRouteObservatory();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('routeObservatoryPanelWrap');
    if (existing) existing.remove();
    const panel = renderRouteObservatoryPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="routeObservatoryPanelWrap">'+panel+'</div>');
  };
})();
