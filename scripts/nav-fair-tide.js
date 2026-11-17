(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE NAV TAB -- a 🌅 Fair Tide button in the top nav bar.
  //
  // Fair Tide was only reachable from the Port screen or through the
  // Navigate screen's special-locations grid. Like the Archive button
  // (scripts/archive-nav-button.js), the nav bar has no shared template
  // (it is hand-copied into every screen), so this injects one button into
  // every nav bar and re-syncs on each screen change.
  //
  //   * Shown once Fair Tide is unlocked, or the crew is there.
  //   * At Fair Tide: opens the Hub.
  //   * Elsewhere: opens it through Remote Access when that is unlocked,
  //     otherwise says to sail there.
  //   * The onclick keeps the literal goScreen('fairtide') so the red
  //     request badge (scripts/fair-tide-alerts.js) lands on this button too.
  // -------------------------------------------------------------------
  function fairTideAvailable(){
    try {
      if (game.location === 'fair_tide') return true;
      if (typeof isPortUnlocked === 'function' && isPortUnlocked('fair_tide')) return true;
      if (typeof window.remoteAccessUnlocked === 'function' && window.remoteAccessUnlocked()) return true;
    } catch(e) {}
    return false;
  }
  // Returns true when the Hub may be opened (a shortcut for the onclick below).
  window.ctNavToFairTide = function(){
    if (game.location === 'fair_tide') return true;
    if (typeof window.remoteAccessUnlocked === 'function' && window.remoteAccessUnlocked()) {
      game.fairTideEnteringRemotely = true;
      return true;
    }
    if (typeof toast === 'function') toast('⚓ Sail to Fair Tide first.', 3000);
    return false;
  };

  function findButtonByScreen(bar, screenName){
    const buttons = bar.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      if ((buttons[i].getAttribute('onclick') || '').indexOf("goScreen('" + screenName + "')") !== -1) return buttons[i];
    }
    return null;
  }

  function sync(){
    const show = fairTideAvailable();
    document.querySelectorAll('.nav-bar').forEach(function(bar){
      const existing = bar.querySelector('.fairtide-nav-btn');
      const anchor = findButtonByScreen(bar, 'navigate') || findButtonByScreen(bar, 'port');
      if (!anchor || !show) { if (existing) existing.remove(); return; }
      if (!existing) {
        anchor.insertAdjacentHTML('afterend', '<button class="nav-btn fairtide-nav-btn" onclick="if (ctNavToFairTide()) goScreen(\'fairtide\')">🌅 Fair Tide</button>');
      }
      const btn = bar.querySelector('.fairtide-nav-btn');
      const onFT = !!bar.closest('#fairTideScreen');
      if (btn) btn.classList.toggle('active', onFT);
    });
    if (typeof window.checkFairTideAlerts === 'function') { try { window.checkFairTideAlerts(); } catch(e) {} }
  }
  window.syncFairTideNavButtons = sync;

  const oldGoScreen = window.goScreen;
  window.goScreen = function(name){
    const r = oldGoScreen ? oldGoScreen.apply(this, arguments) : undefined;
    try { sync(); } catch(e) {}
    return r;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, {once:true}); else sync();
})();
