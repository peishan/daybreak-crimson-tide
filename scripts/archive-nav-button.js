(function(){
  // -------------------------------------------------------------------
  // ARCHIVE NAV BUTTON — San's report: the Archive screen (where every
  // ambient system — Flavour Events, Hobbies, Crew Conversations, Port
  // Visitors, Nursery Life, Birthdays/Birthday Treats, Settlement
  // Memories, Tide Stories... — renders its panel) was only reachable
  // through a small dashed card buried in the Navigate screen's
  // special-locations grid (see scripts/arc17-archive-hub.js). Easy to
  // never notice at all.
  //
  // The game's persistent nav bar has no shared render function — it's
  // the same 9+ buttons hand-copied into every screen's own HTML block
  // in index.html (index.html:1363 etc.), so there's no single template
  // to patch. Rather than hand-editing every one of those blocks (and
  // keeping them all in sync by hand forever after), this follows the
  // same wrap-and-inject convention arc17-archive-hub.js itself already
  // uses for the dashed card: find every nav bar that already has a
  // button to the Log screen (i.e. every "full" nav bar, plus the two
  // reduced ones that still include Log) and insert an Archive button
  // right before it, once per bar, re-synced on every screen change so
  // it appears/disappears correctly around window.archiveUnlocked().
  // -------------------------------------------------------------------

  function findButtonByScreen(bar, screenName){
    const buttons = bar.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const onclick = buttons[i].getAttribute('onclick') || '';
      if (onclick.indexOf("goScreen('" + screenName + "')") !== -1) return buttons[i];
    }
    return null;
  }

  function syncArchiveNavButtons(){
    const unlocked = typeof window.archiveUnlocked === 'function' && window.archiveUnlocked();
    document.querySelectorAll('.nav-bar').forEach(function(bar){
      const existing = bar.querySelector('.archive-nav-btn');
      const logBtn = findButtonByScreen(bar, 'log');
      if (!logBtn || !unlocked) {
        if (existing) existing.remove();
        return;
      }
      if (existing) return;
      logBtn.insertAdjacentHTML('beforebegin', '<button class="nav-btn archive-nav-btn" onclick="goScreen(\'archive\')">🏛️ Archive</button>');
    });
  }
  window.syncArchiveNavButtons = syncArchiveNavButtons;

  const oldGoScreenForArchiveNav = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForArchiveNav) oldGoScreenForArchiveNav(name);
    syncArchiveNavButtons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncArchiveNavButtons, {once:true});
  } else {
    syncArchiveNavButtons();
  }
})();
