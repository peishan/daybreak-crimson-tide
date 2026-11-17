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
    game.fairTideAlerts = game.fairTideAlerts || {init: false, opened: false, seen: {}, announced: {}, tag: {}};
    if (!game.fairTideAlerts.tag) game.fairTideAlerts.tag = {};
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
  function openTab(tab){
    if (game.location !== 'fair_tide') { if (typeof toast === 'function') toast('⚓ Sail to Fair Tide for that.', 3200); return; }
    if (typeof goScreen === 'function') goScreen('fairtide');
    if (typeof window.switchFairTideTab === 'function') window.switchFairTideTab(tab);
  }
  function openRequests(){ openTab('requests'); }

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
    const dTab = document.getElementById('ft-tab-btn-dispatch');
    if (dTab) { const d = (typeof window.fairTideDispatchStatus === 'function') ? window.fairTideDispatchStatus() : null; if (d && d.state === 'ready') dTab.setAttribute('data-ct-badge', '1'); else dTab.removeAttribute('data-ct-badge'); }
    targets.forEach(function(el){
      if (!el) return;
      if (n > 0) el.setAttribute('data-ct-badge', n > 9 ? '9+' : String(n)); else el.removeAttribute('data-ct-badge');
    });
  }

  function check(){
    if (typeof game === 'undefined' || !game || typeof gameSessionActive === 'undefined' || !gameSessionActive) return;
    const a = alerts();
    if (!unlocked()) { a.sawLocked = true; otherEvents(a); paintBadges(); return; }
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
        if (firstRun) { if (s.status === 'available' && !justOpened) a.seen[s.slotId] = true; else if (s.status === 'available') a.tag[s.slotId] = 0; }   // an existing save: record, don't announce
        else if (s.status === 'available') { fresh.push(s); a.tag[s.slotId] = 0; }
      }
      if (s.status === 'ready' && a.announced[s.slotId] !== 'ready') { a.announced[s.slotId] = 'ready'; ready.push(s); }
    });
    a.init = true;
    // drop records for requests that are gone
    Object.keys(a.announced).forEach(function(id){ if (!slots.some(function(s){ return s.slotId === id; })) { delete a.announced[id]; delete a.seen[id]; delete a.tag[id]; } });

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
        window.notify({icon: '✅', title: (t ? t.title : 'A request') + ' is finished', text: (s.assignedNames && s.assignedNames.length ? s.assignedNames.join(' and ') + (s.assignedNames.length > 1 ? ' are' : ' is') : 'Your crew is') + ' back. Claim the reward at Fair Tide.', kind: 'info', remind: true, tag: 'request-ready', onClick: openRequests, hint: 'Tap to claim'});
      });
    }
    otherEvents(a);
    paintBadges();
    if ((fresh.length || ready.length) && typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.checkFairTideAlerts = check;

  // Dispatch, the Watchtower, the Captain's Decision and daily research check-ins.
  function otherEvents(a){
    const say = typeof window.notify === 'function' ? window.notify : function(){};
    // The gathering party is back.
    const d = (typeof window.fairTideDispatchStatus === 'function') ? window.fairTideDispatchStatus() : null;
    if (d && d.state === 'ready') {
      if (!a.dispatchTold) { a.dispatchTold = true; say({icon: '⛵', title: 'The gathering party is back', text: 'Collect their haul from Dispatch.', kind: 'info', remind: true, tag: 'dispatch', onClick: function(){ openTab('dispatch'); }, hint: 'Tap to collect'}); }
    } else a.dispatchTold = false;
    // A Watchtower alert (generated here as well as on the hub render, so it can be announced).
    if (typeof window.checkWatchtowerAlert === 'function') { try { window.checkWatchtowerAlert(); } catch(e) {} }
    const ws = (typeof window.watchtowerStatus === 'function') ? window.watchtowerStatus() : null;
    if (ws && ws.state === 'ready') {
      if (a.watchTold !== ws.alert) {
        a.watchTold = ws.alert;
        const al = (window.WATCHTOWER_ALERTS || []).find(function(x){ return x.id === ws.alert; });
        say({icon: (al && al.icon) || '🔭', title: 'Watchtower: ' + (al ? al.title : 'something on the horizon'), text: 'Imah thinks it is worth a look.', kind: 'info', remind: true, tag: 'watchtower', onClick: function(){ openTab('buildings'); }, hint: 'Tap to investigate'});
      }
    } else a.watchTold = null;
    // A Captain's Decision has run its course.
    const cd = (typeof window.captainsDecisionStatus === 'function') ? window.captainsDecisionStatus() : null;
    if (cd && cd.state === 'active') a.decisionActive = cd.id;
    else if (a.decisionActive) {
      const def = (window.CAPTAINS_DECISIONS || []).find(function(x){ return x.id === a.decisionActive; });
      a.decisionActive = null;
      say({icon: (def && def.icon) || '⚓', title: (def ? def.name : 'The Captain’s Decision') + ' has run its course', text: 'You can issue a new decision once its cooldown ends.', kind: 'info', remind: true, tag: 'decision'});
    }
    // Research check-ins, once per game day.
    if (a.researchDay !== (game.day || 0) && typeof window.canAdvanceResearch === 'function' && window.ARCHIVE_RESEARCHERS) {
      let due = 0;
      try {
        const st = (typeof window.archiveResearchState === 'function') ? window.archiveResearchState() : {};
        Object.keys(window.ARCHIVE_RESEARCHERS).forEach(function(rid){
          const r = window.ARCHIVE_RESEARCHERS[rid];
          if (typeof r.visible === 'function' && !r.visible()) return;
          if (st[rid] && st[rid].activeProjectKey && window.canAdvanceResearch(rid)) due++;
        });
      } catch(e) {}
      a.researchDay = game.day || 0;
      if (due > 0) say({icon: '🔬', title: 'Research check-in', text: due === 1 ? 'One project can move forward today.' : due + ' projects can move forward today.', kind: 'info', onClick: function(){ if (typeof goScreen === 'function') goScreen('archive'); }, hint: 'Tap to open the Archive'});
    }
  }

  // "NEW" chips on request cards that arrived since you last looked.
  function tagNewRequests(){
    if (!unlocked() || (game.fairTideActiveTab || 'buildings') !== 'requests') return;
    const el = document.getElementById('ft-tab-requests');
    if (!el) return;
    const a = alerts(), now = Date.now();
    Object.keys(a.tag).forEach(function(id){
      const shown = a.tag[id];
      if (shown && now - shown > 30000) { delete a.tag[id]; return; }
      const btn = el.querySelector('[onclick*="' + id + '"]');
      const card = btn && btn.closest('article');
      if (!card || card.querySelector('.ct-new-chip')) return;
      if (!shown) a.tag[id] = now;
      const chip = document.createElement('span');
      chip.className = 'ct-new-chip'; chip.textContent = 'NEW';
      chip.style.cssText = 'background:#d4483b;color:#fff;font:700 .62rem Lato,sans-serif;letter-spacing:.06em;padding:2px 6px;border-radius:8px;margin-right:6px;vertical-align:middle;';
      const first = card.querySelector('strong');
      if (first) first.insertBefore(chip, first.firstChild);
    });
  }
  const oldHub = window.renderFairTideHub;
  if (typeof oldHub === 'function') {
    window.renderFairTideHub = function(){
      const r = oldHub.apply(this, arguments);
      try { tagNewRequests(); } catch(e) {}
      return r;
    };
  }

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
