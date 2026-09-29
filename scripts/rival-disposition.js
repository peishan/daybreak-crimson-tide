(function(){
  // -------------------------------------------------------------------
  // RIVAL DISPOSITION — San's request: once a captured rival's finite
  // community-service term completes (claimCommunityLabor sets
  // cs.active=false, cs.completedDay — fairtide-buildings-and-arc6.js),
  // nothing further ever happened to them. They just silently stopped
  // appearing in the Community Service list forever ("completed entries
  // are hidden entirely," per that file's own comment) with no
  // resolution of any kind. This gives San an actual one-time choice for
  // what happens to them next: fine and release them, or take them in
  // for good.
  //
  // Scoped to the generic pool only — both the fixed 52 names and the
  // now-actually-working endless generated pool (see the recent
  // captainKey closure-bug fix in arc9-and-systems.js).
  //
  // Robin is deliberately excluded, permanently (briefly tried gating his
  // own version of this choice on Ch.15/"Robin's Last Day" being read —
  // reverted on San's direction: he has a real story beat planned much
  // later, post-Arc 50, that will resolve his fate properly. This
  // mechanical fine/retain choice would preempt that, so this system
  // stays hands-off him entirely; don't re-add him without checking
  // where that later beat has landed). Jeff's service has no end date
  // (totalDays: null) — his arc isn't about service ending at all, so he
  // never reaches "completed" and never shows up here either.
  //
  // "Take Them In" reuses the exact same window.fairTideRoster +
  // FT_ROSTER_BONUSES pattern already used for Maera/Jovie/every other
  // named civilian resident, at the same goldBonus scale the Civilian
  // Roles' own sailor/trader tier already uses (0.01) — not a new
  // combat-companion slot. Building unique combat kit for a pool that
  // can generate 2,500+ distinct procedural names would be wildly
  // disproportionate; joining Fair Tide's civilian roster is the
  // appropriately-scoped version of "ally" for this specific system.
  // -------------------------------------------------------------------

  function rivalDispositionState(){
    game.rivalDisposition = game.rivalDisposition || {};
    return game.rivalDisposition;
  }
  window.rivalDispositionState = rivalDispositionState;

  function pendingRivalDispositions(){
    const captured = Object.keys(game.rivalsCaptured || {}).filter(function(key){
      return typeof window.rivalCaptured === 'function' && window.rivalCaptured(key);
    });
    const cs = (typeof window.communityServiceState === 'function') ? window.communityServiceState() : {};
    const disposition = rivalDispositionState();
    return captured.filter(function(key){
      if (key === 'robin') return false; // his own future story beat handles this, not this system — see the file-level comment above
      const record = cs[key];
      return !!(record && record.active === false && record.completedDay != null && !disposition[key]);
    });
  }
  window.pendingRivalDispositions = pendingRivalDispositions;

  const RIVAL_FINE_GOLD = 200;
  const RIVAL_RETAIN_GOLD_BONUS = 0.01; // matches the Civilian Roles' own sailor/trader tier

  function resolveRivalDisposition(key, choice){
    const disposition = rivalDispositionState();
    if (disposition[key]) return; // one-time, matching every other settlement decision in this codebase
    if (pendingRivalDispositions().indexOf(key) === -1) return;
    const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
    if (choice === 'fine') {
      disposition[key] = 'fined';
      game.gold = (game.gold || 0) + RIVAL_FINE_GOLD;
      toast('💰 ' + name + ' pays a fine and leaves Fair Tide for good. (+' + RIVAL_FINE_GOLD + 'g)', 3600);
      logEvent('💰 ' + name + ' is fined and released.', 'gold');
    } else if (choice === 'retain') {
      disposition[key] = 'retained';
      game.fairTideRoster = game.fairTideRoster || {};
      if (!game.fairTideRoster[key]) {
        game.fairTideRoster[key] = {
          name: name, role: 'Reformed Captain', icon: '🏴',
          desc: 'Once captured, now choosing to stay — working off more than just a sentence.'
        };
      }
      window.FT_ROSTER_BONUSES = window.FT_ROSTER_BONUSES || {};
      window.FT_ROSTER_BONUSES[key] = {goldBonus: RIVAL_RETAIN_GOLD_BONUS};
      toast('🤝 ' + name + ' stays at Fair Tide for good.', 3600);
      logEvent('🤝 ' + name + ' joins Fair Tide\'s roster.', 'gold');
    } else {
      return;
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderExplore === 'function') window.renderExplore();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }
  window.resolveRivalDisposition = resolveRivalDisposition;

  function renderRivalDispositionPanel(){
    const pending = pendingRivalDispositions();
    if (!pending.length) return '';
    let html = '<div class="panel-title" style="margin-top:14px;">⚖️ Deciding Their Fate</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Their term is served. What happens to them now is San\'s call.</p>';
    pending.forEach(function(key){
      const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">⚖️</div><div style="flex:1;">'+
        '<strong>'+esc(name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">Their community service is complete. Fine them and send them on their way, or take them in for good.</span>'+
        '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">'+
        '<button class="btn btn-small" onclick="resolveRivalDisposition(\''+key+'\',\'fine\')">💰 Fine & Release (+'+RIVAL_FINE_GOLD+'g)</button>'+
        '<button class="btn btn-small" onclick="resolveRivalDisposition(\''+key+'\',\'retain\')">🤝 Take Them In</button>'+
        '</div>'+
        '</div></div></article>';
    });
    return html;
  }
  window.renderRivalDispositionPanel = renderRivalDispositionPanel;

  const oldRenderExploreForDisposition = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExploreForDisposition) oldRenderExploreForDisposition();
    const container = document.getElementById('exploreContent');
    if (!container) return;
    const existing = document.getElementById('rivalDispositionPanelWrap');
    if (existing) existing.remove();
    const panel = renderRivalDispositionPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="rivalDispositionPanelWrap">'+panel+'</div>');
  };
})();
