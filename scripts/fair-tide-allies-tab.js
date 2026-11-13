(function(){
  // -------------------------------------------------------------------
  // ALLIES & GUESTS -- a Fair Tide hub tab of its own.
  //
  // The Fair Tide Residents panel (temporary guests, arrivals and
  // departures log) and the Wider Ally Network panel (Lewis and his crew,
  // the former TM colleagues, Ju, WH, Rahmah, Syafiqah...) used to be
  // stacked at the bottom of the Roster tab. That list was already long
  // and the sequel's former Tribute crew will add more, so they live here
  // now. Nothing about who appears, or when, has changed; the panels are
  // the same renderers (arc28-mechanics.js, fair-tide-ally-network.js),
  // and "Check In With Everyone" is shown here as well as on the Roster.
  // -------------------------------------------------------------------

  function renderAlliesTab(){
    const el = document.getElementById('ft-tab-allies');
    if (!el) return;
    let html = '<div class="panel-title">🤝 Allies & Guests</div>' +
      '<p style="font-size:.78rem;opacity:.7;margin:0 0 8px;">People who aren\'t on the Roster: guests staying at Fair Tide, and the wider network of allies.</p>';
    if (typeof window.checkInAllButtonHtml === 'function') html += window.checkInAllButtonHtml();
    const guests = (typeof window.renderFairTideResidentsPanel === 'function') ? window.renderFairTideResidentsPanel() : '';
    const allies = (typeof window.renderAllyNetworkPanel === 'function') ? window.renderAllyNetworkPanel() : '';
    html += guests + allies;
    if (!guests && !allies) html += '<div class="rt-status" style="opacity:.7;">No guests or allies yet. They arrive as the story goes on.</div>';
    el.innerHTML = html;
  }
  window.renderAlliesTab = renderAlliesTab;

  const oldRenderFairTideHubForAllies = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-allies');
    const btn = document.getElementById('ft-tab-btn-allies');
    if (el) el.classList.toggle('active', tab === 'allies');
    if (btn) btn.classList.toggle('active', tab === 'allies');
    if (oldRenderFairTideHubForAllies) oldRenderFairTideHubForAllies();
    if (tab === 'allies') renderAlliesTab();
  };
})();
