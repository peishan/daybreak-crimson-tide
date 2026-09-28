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

  // Keeps the panel's contents live while it's left open (e.g. a Bounty
  // ticking up mid-session) without paying the cost of rebuilding it on
  // every single updateUI() call while collapsed.
  const oldUpdateUIForQuestTracker = window.updateUI;
  window.updateUI = function(){
    const result = oldUpdateUIForQuestTracker.apply(this, arguments);
    if (open) renderQuestTrackerContent();
    return result;
  };
})();
