(function(){
  // -------------------------------------------------------------------
  // ARC XXXIX MECHANICS — the soft tie-in to Lewis's existing Ally
  // request system the outline's own notes call for ("Use Lewis's
  // existing Fair Tide requests as the main gameplay connection").
  // Kept OUT of arc39.js itself, same split used since Arc XXIII.
  //
  // Deliberately NOT a gate on any chapter's unlock. fairtide-systems.js's
  // request board rotation is partly random (pickRequesterForBoard()
  // weights toward known names but never guarantees one), and Lewis's
  // own LEWIS_REQUESTS only ever has a 20% chance of being the one
  // offered when he's eligible at all (grantLewisAllyCaptainIfDue's own
  // offerLewis roll) -- hard-gating a story chapter on "resolve a
  // specific Lewis request" risked a player sitting locked out of this
  // arc indefinitely waiting on board RNG that may never cooperate.
  //
  // Instead this just surfaces the existing, already-tracked count
  // (game.fairTideRequesters['Lewis'].visits, incremented by
  // claimFairTideRequest() every time a Lewis-sourced request resolves
  // -- fairtide-systems.js, nothing new) as a small panel on the Archive
  // screen once Arc XXXIX is underway, giving the "practical matter"
  // Ch.1/Ch.11 keep referencing an actual number behind it without
  // ever blocking on it.
  // -------------------------------------------------------------------

  function lewisRequestsResolved(){
    const rs = (typeof window.fairTideRequesterState === 'function') ? window.fairTideRequesterState() : (game.fairTideRequesters || {});
    return (rs && rs['Lewis'] && rs['Lewis'].visits) || 0;
  }
  window.lewisRequestsResolvedCount = lewisRequestsResolved;

  function renderSteadyReachPanel(){
    if (!game.comicProgress39) return '';
    const count = lewisRequestsResolved();
    return '<div class="panel-title" style="margin-top:16px;">⚓ The Steady Reach</div>'+
      '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">Requests resolved for Lewis: '+count+'</span><br>'+
      '<span style="font-size:.74rem;opacity:.65;">Routes, cargo, the occasional favor neither of you calls a favor. Comes up through the Fair Tide request board whenever Lewis has something to ask.</span></article>';
  }
  window.renderSteadyReachPanel = renderSteadyReachPanel;

  const oldRenderArchiveScreenForArc39 = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc39) oldRenderArchiveScreenForArc39();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('steadyReachPanelWrap');
    if (existing) existing.remove();
    const panel = renderSteadyReachPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="steadyReachPanelWrap">'+panel+'</div>');
  };
})();
