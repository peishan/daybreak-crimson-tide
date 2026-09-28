(function(){
  // -------------------------------------------------------------------
  // QUEST TRACKER WIDGET — a small collapsible side panel, always
  // reachable regardless of which screen is active (San's report:
  // checking Tavern's Quest Board or the Explore tab's Bounty Board
  // meant navigating all the way back to a regular Port, which isn't
  // even possible without first leaving Pirate Cove/Inter-World's own
  // screen). Sits outside every .screen div (appended directly near
  // </body>, not inside any of them), so toggling between screens never
  // hides it — it's the one piece of UI that's genuinely always there.
  //
  // Purely a read-only mirror of the exact same questBoardHTML()/
  // bountyBoardHTML() output already used by the Tavern and Explore tabs
  // — same data, same markup, nothing new invented, nothing duplicated
  // or re-tracked. Both boards are already fully passive displays (no
  // buttons of their own — progress is driven entirely by
  // checkQuestProgress()/checkBountyProgress() elsewhere), so reusing
  // their markup here carries no interactivity risk.
  // -------------------------------------------------------------------

  let open = false;

  function renderQuestTrackerContent(){
    const content = document.getElementById('ctQuestTrackerContent');
    if (!content) return;
    let html = '';
    // Captain's Rewards first — the most time-sensitive item (claiming
    // resets once a real day), and San's whole reason for this addition:
    // claiming a daily reward used to mean a trip to the Tavern first.
    // Reuses loginRewardsHTML() verbatim (core-engine.js) — same markup,
    // same claimDailyReward() button, nothing duplicated.
    try {
      html += '<div class="panel"><div class="panel-title">🎁 Captain\'s Rewards</div>' + loginRewardsHTML() + '</div>';
    } catch(e) {}
    try {
      html += '<div class="panel"><div class="panel-title">🎯 Quest Board</div>' + questBoardHTML() + '</div>';
    } catch(e) {}
    try {
      html += '<div class="panel">' + bountyBoardHTML() + '</div>';
    } catch(e) {}
    content.innerHTML = html || '<p style="font-size:.85rem;opacity:.6;">Nothing to report yet.</p>';
  }
  window.renderQuestTrackerWidget = renderQuestTrackerContent;

  window.toggleQuestTracker = function(){
    open = !open;
    const panel = document.getElementById('ctQuestTrackerPanel');
    if (panel) panel.classList.toggle('open', open);
    if (open) renderQuestTrackerContent();
  };

  // Small badge on the collapsed tab itself when a daily reward is ready
  // to claim, so it's noticeable without opening the panel at all.
  function refreshQuestTrackerBadge(){
    const badge = document.getElementById('ctQuestTrackerBadge');
    if (!badge) return;
    try {
      prepareLoginRewards();
      badge.style.display = game.dailyRewardClaimed ? 'none' : 'block';
    } catch(e) {}
  }

  // Keeps the panel's contents live while it's left open (e.g. a Bounty
  // ticking up mid-session) without paying the cost of rebuilding it on
  // every single updateUI() call while collapsed. The badge, being cheap,
  // is still checked every time either way.
  const oldUpdateUIForQuestTracker = window.updateUI;
  window.updateUI = function(){
    const result = oldUpdateUIForQuestTracker.apply(this, arguments);
    if (open) renderQuestTrackerContent();
    refreshQuestTrackerBadge();
    return result;
  };
})();
