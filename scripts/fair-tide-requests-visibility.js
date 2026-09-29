(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE REQUESTS — TRUST VISIBILITY (San's report: population
  // "isn't going beyond 57"). Traced to the Requests board's trust/
  // resident system (fairtide-systems.js) being real and working, but
  // completely invisible — the Requests tab shows each NPC's current
  // request, never their trust or status, so there was no way to tell
  // whether any of this was actually progressing. Paired with the
  // pacing fix in that same file (faster, more concentrated trust
  // gains), this appends a "🤝 Familiar Faces" panel listing every
  // currently-known, not-yet-resident NPC and their progress toward
  // becoming one — including anyone not currently occupying a board
  // slot, so nobody's progress just disappears between visits.
  //
  // Purely additive/read-only: reuses window.fairTideRequesterState()
  // and window.fairTideResidentStatusLabel(), both already exposed by
  // fairtide-systems.js, and appends into the existing #ft-tab-requests
  // container rather than touching that file's own rendering.
  // -------------------------------------------------------------------

  function trustPanelHtml(){
    const rs = (typeof window.fairTideRequesterState === 'function') ? window.fairTideRequesterState() : {};
    const names = Object.keys(rs).filter(function(name){ return rs[name].status !== 'resident'; });
    if (!names.length) {
      return '<div class="panel-title" style="margin-top:14px;">🤝 Familiar Faces</div>'+
        '<p style="font-size:.8rem;opacity:.6;">Nobody\'s asked for help yet — check back after the first few requests come in.</p>';
    }
    names.sort(function(a,b){ return (rs[b].trust||0) - (rs[a].trust||0); });
    let html = '<div class="panel-title" style="margin-top:14px;">🤝 Familiar Faces</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Everyone Fair Tide has helped so far, and how close they are to staying for good.</p>';
    names.forEach(function(name){
      const entry = rs[name];
      const trust = entry.trust || 0;
      const statusLabel = (typeof window.fairTideResidentStatusLabel === 'function') ? window.fairTideResidentStatusLabel(entry.status) : entry.status;
      const pct = Math.max(0, Math.min(100, trust));
      html += '<div style="margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;font-size:.8rem;">'+
          '<strong>'+esc(name)+'</strong><span style="opacity:.75;">'+esc(statusLabel)+' · '+trust+'/100</span>'+
        '</div>'+
        '<div style="background:rgba(255,255,255,0.08);border-radius:4px;height:5px;margin-top:3px;overflow:hidden;">'+
          '<div style="background:var(--gold);height:100%;width:'+pct+'%;"></div>'+
        '</div>'+
      '</div>';
    });
    return html;
  }

  const oldRenderFairTideHubForTrustVisibility = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForTrustVisibility) oldRenderFairTideHubForTrustVisibility();
    if (!(typeof window.fairTideRequestsUnlocked === 'function' && window.fairTideRequestsUnlocked())) return;
    const tab = game.fairTideActiveTab || 'buildings';
    if (tab !== 'requests') return;
    const el = document.getElementById('ft-tab-requests');
    if (!el) return;
    el.innerHTML += trustPanelHtml();
  };
})();
