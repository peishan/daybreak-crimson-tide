(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE ALERTS -- so the player can tell there is something new.
  //
  // The Requests board refilled and finished its timers silently: nothing
  // said a request had arrived or was ready to claim. This adds, in the
  // style of an RPG notification:
  //   * a banner when the Requests board opens, when new requests arrive,
  //     and when an accepted request is finished (tap it to open the board);
  //   * a red count badge on the Requests tab (and on Fair Tide buttons)
  //     for requests ready to claim plus new ones not yet looked at; it
  //     clears as you open the tab / claim.
  // State is only a "seen" record on the save; the board itself is untouched.
  // A check runs every 15 seconds while a voyage is active, and after every
  // refresh. The first check on a save only records what is already there.
  // -------------------------------------------------------------------
  const STYLE = '' +
    '[data-ct-badge]{position:relative;}' +
    '[data-ct-badge]::after{content:attr(data-ct-badge);position:absolute;top:2px;right:2px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;box-sizing:border-box;' +
      'background:#d4483b;color:#fff;font:700 .68rem/17px Lato,sans-serif;text-align:center;box-shadow:0 0 0 2px rgba(5,12,20,.9);pointer-events:none;}';
  function ensureStyle(){
    if (document.getElementById('ctAlertStyle')) return;
    const s = document.createElement('style'); s.id = 'ctAlertStyle'; s.textContent = STYLE; document.head.appendChild(s);
  }
  function alerts(){
    game.fairTideAlerts = game.fairTideAlerts || {init: false, opened: false, seen: {}, announced: {}};
    return game.fairTideAlerts;
  }
  function unlocked(){ return typeof window.fairTideRequestsUnlocked === 'function' && window.fairTideRequestsUnlocked(); }
  function board(){ return (typeof window.fairTideBoard === 'function' ? window.fairTideBoard() : (typeof window.fairTideRequestBoard === 'function' ? window.fairTideRequestBoard() : [])) || []; }
  function template(slot){
    const all = (window.FAIR_TIDE_REQUESTS || []).concat(window.LEWIS_REQUESTS || []);
    return all.find(function(t){ return t.id === slot.requestId; }) || null;
  }
  function onFairTideScreen(){
    const el = document.querySelector('.screen.active');
    return !!(el && el.id === 'fairTideScreen' && (game.fairTideActiveTab || 'buildings') === 'requests');
  }
  function openRequests(){
    if (game.location !== 'fair_tide') { if (typeof toast === 'function') toast('📋 Sail to Fair Tide to see the Requests board.', 3200); return; }
    if (typeof goScreen === 'function') goScreen('fairtide');
    if (typeof window.switchFairTideTab === 'function') window.switchFairTideTab('requests');
  }

  function badgeCount(){
    if (!unlocked()) return 0;
    const a = alerts();
    return board().reduce(function(n, s){
      if (s.status === 'ready') return n + 1;
      if (s.status === 'available' && !a.seen[s.slotId]) return n + 1;
      return n;
    }, 0);
  }
  function paintBadges(){
    ensureStyle();
    const n = badgeCount();
    const targets = [document.getElementById('ft-tab-btn-requests')];
    document.querySelectorAll('[onclick*="goScreen(\'fairtide\')"]').forEach(function(el){ targets.push(el); });
    targets.forEach(function(el){
      if (!el) return;
      if (n > 0) el.setAttribute('data-ct-badge', n > 9 ? '9+' : String(n)); else el.removeAttribute('data-ct-badge');
    });
  }

  function check(){
    if (typeof game === 'undefined' || !game || typeof gameSessionActive === 'undefined' || !gameSessionActive) return;
    const a = alerts();
    if (!unlocked()) { a.sawLocked = true; paintBadges(); return; }
    if (typeof window.refillFairTideBoard === 'function') { try { window.refillFairTideBoard(); } catch(e) {} }
    const slots = board();
    // Finished timers become claimable (the tab does this on render; do it here so a banner can fire).
    slots.forEach(function(s){ if (s.status === 'active' && Date.now() - s.startedAt >= s.durationMs) s.status = 'ready'; });
    if (onFairTideScreen()) slots.forEach(function(s){ a.seen[s.slotId] = true; });

    const firstRun = !a.init, justOpened = firstRun && !!a.sawLocked;
    const fresh = [], ready = [];
    slots.forEach(function(s){
      if (!a.announced[s.slotId]) {
        a.announced[s.slotId] = 'new';
        if (firstRun) { if (s.status === 'available' && !justOpened) a.seen[s.slotId] = true; }   // an existing save: record, don't announce
        else if (s.status === 'available') fresh.push(s);
      }
      if (s.status === 'ready' && a.announced[s.slotId] !== 'ready') { a.announced[s.slotId] = 'ready'; ready.push(s); }
    });
    a.init = true;
    // drop records for requests that are gone
    Object.keys(a.announced).forEach(function(id){ if (!slots.some(function(s){ return s.slotId === id; })) { delete a.announced[id]; delete a.seen[id]; } });

    if (justOpened && typeof window.notify === 'function') {
      window.notify({icon: '📋', title: 'The Requests board is open', text: 'People now bring their problems to Fair Tide’s dock. Pick who to help.', kind: 'info', duration: 6000, onClick: openRequests, hint: 'Tap to open the Requests board'});
    }
    if (typeof window.notify === 'function') {
      if (fresh.length === 1) {
        const t = template(fresh[0]);
        window.notify({icon: (t && t.icon) || '📋', title: 'New request: ' + (t ? t.title : 'Fair Tide'), text: fresh[0].npcName + ' is waiting at the dock.', kind: 'info', onClick: openRequests, hint: 'Tap to open the Requests board'});
      } else if (fresh.length > 1) {
        window.notify({icon: '📋', title: fresh.length + ' new requests at Fair Tide', text: fresh.map(function(s){ const t = template(s); return t ? t.title : ''; }).filter(Boolean).slice(0, 3).join(' · '), kind: 'info', onClick: openRequests, hint: 'Tap to open the Requests board'});
      }
      ready.forEach(function(s){
        const t = template(s);
        window.notify({icon: '✅', title: (t ? t.title : 'A request') + ' is finished', text: (s.assignedNames && s.assignedNames.length ? s.assignedNames.join(' and ') + (s.assignedNames.length > 1 ? ' are' : ' is') : 'Your crew is') + ' back. Claim the reward at Fair Tide.', kind: 'info', onClick: openRequests, hint: 'Tap to claim'});
      });
    }
    paintBadges();
    if ((fresh.length || ready.length) && typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.checkFairTideAlerts = check;

  // After each refresh, when the Requests tab opens, and on a timer.
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { check(); } catch(e) {}
      return r;
    };
  }
  const oldSwitch = window.switchFairTideTab;
  if (typeof oldSwitch === 'function') {
    window.switchFairTideTab = function(){
      const r = oldSwitch.apply(this, arguments);
      try { check(); } catch(e) {}
      return r;
    };
  }
  const oldClaim = window.claimFairTideRequest;
  if (typeof oldClaim === 'function') {
    window.claimFairTideRequest = function(){
      const r = oldClaim.apply(this, arguments);
      try { check(); } catch(e) {}
      return r;
    };
  }
  setInterval(function(){ try { check(); } catch(e) {} }, 15000);
})();
