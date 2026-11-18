(function(){
  // -------------------------------------------------------------------
  // NOTIFICATION BANNER + COMING UP.
  //
  // 1. A banner at the top of the screen for the moments worth noticing
  //    ("N joined Fair Tide", "Rashid left Fair Tide", level ups). Bigger
  //    type than the bottom toasts and the quest/bounty progress lines, a few
  //    seconds on screen, tap to dismiss, up to three stacked. A burst
  //    (three or more arrivals/departures at once, e.g. three pirates taken in, or a save catching up) collapses into
  //    one summary line. window.notify({icon, title, text, kind, duration}).
  //
  // 2. "Coming Up": what opens at the next levels, nearest first (story arcs,
  //    raids, Crimson Horizon) plus the arc in progress. Shown as a panel
  //    under the Current Objective, and as a "Next up" line on the level-up
  //    banner. Read straight from existing data, nothing new tracked.
  // -------------------------------------------------------------------

  // ---------------- banner ----------------
  const STYLE = '' +
    '#ctNotifyStack{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:min(94vw,470px);z-index:1450;display:flex;flex-direction:column;gap:8px;pointer-events:none;}' +
    '.ct-notify{pointer-events:auto;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:14px;cursor:pointer;' +
      'background:linear-gradient(160deg,rgba(24,52,78,.97),rgba(6,16,28,.98));border:1px solid var(--gold,#e8c547);color:var(--parchment,#f5e6c8);' +
      'box-shadow:0 10px 30px rgba(0,0,0,.55),0 0 18px rgba(232,197,71,.18);animation:ctNotifyIn .35s ease-out both;}' +
    '.ct-notify.out{animation:ctNotifyOut .3s ease-in both;}' +
    '.ct-notify .cn-icon{font-size:2rem;line-height:1;flex:0 0 auto;}' +
    '.ct-notify .cn-title{font-family:Cinzel,serif;font-size:1.2rem;line-height:1.25;font-weight:700;color:var(--gold,#e8c547);}' +
    '.ct-notify .cn-text{font-size:.95rem;line-height:1.35;opacity:.92;margin-top:2px;}' +
    '.ct-notify .cn-hint{font-size:.72rem;opacity:.6;margin-top:3px;letter-spacing:.04em;}' +
    '.ct-notify.leave{border-color:var(--sand,#c4a35a);} .ct-notify.leave .cn-title{color:var(--parchment,#f5e6c8);}' +
    '.ct-notify.level .cn-title{font-size:1.3rem;}' +
    '@keyframes ctNotifyIn{from{opacity:0;transform:translateY(-18px) scale(.97)}to{opacity:1;transform:none}}' +
    '@keyframes ctNotifyOut{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-14px)}}' +
    '.ct-coming-up .cu-row{display:flex;align-items:baseline;gap:8px;padding:5px 0;border-bottom:1px solid rgba(196,163,90,.14);font-size:.88rem;}' +
    '.ct-coming-up .cu-row:last-child{border-bottom:0;} .ct-coming-up .cu-ico{flex:0 0 1.6em;text-align:center;}' +
    '.ct-coming-up .cu-txt{flex:1;} .ct-coming-up .cu-lv{font-size:.74rem;opacity:.7;white-space:nowrap;}';
  function ensureStyle(){
    if (document.getElementById('ctNotifyStyle')) return;
    const s = document.createElement('style'); s.id = 'ctNotifyStyle'; s.textContent = STYLE; document.head.appendChild(s);
  }
  function stack(){
    ensureStyle();
    let el = document.getElementById('ctNotifyStack');
    if (!el) { el = document.createElement('div'); el.id = 'ctNotifyStack'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
    return el;
  }
  function dismiss(node){
    if (!node || node.__gone) return; node.__gone = true;
    node.classList.add('out'); setTimeout(function(){ if (node.parentNode) node.parentNode.removeChild(node); }, 320);
  }
  const DEFAULT_MS = 3000;
  function show(n){
    const el = stack();
    // A banner with a `group` is updated in place if one from the same group is still on screen
    // (three new requests arriving a few seconds apart become one banner that counts up, not three).
    if (n.group) {
      const live = Array.prototype.find.call(el.children, function(c){ return !c.__gone && c.__group === n.group; });
      if (live) {
        const t = live.querySelector('.cn-title'), x = live.querySelector('.cn-text');
        if (t) t.textContent = n.title || '';
        if (x) x.textContent = n.text || '';
        clearTimeout(live.__timer);
        live.__timer = setTimeout(function(){ dismiss(live); }, n.duration || DEFAULT_MS);
        live.onclick = function(){ dismiss(live); if (typeof n.onClick === 'function') { try { n.onClick(); } catch(e) {} } };
        return;
      }
    }
    const node = document.createElement('div');
    node.__group = n.group || null;
    node.className = 'ct-notify' + (n.kind ? ' ' + n.kind : '');
    const icon = document.createElement('div'); icon.className = 'cn-icon'; icon.textContent = n.icon || '🔔';
    const body = document.createElement('div');
    const title = document.createElement('div'); title.className = 'cn-title'; title.textContent = n.title || '';
    body.appendChild(title);
    if (n.text) { const t = document.createElement('div'); t.className = 'cn-text'; t.textContent = n.text; body.appendChild(t); }
    if (typeof n.onClick === 'function') { const h = document.createElement('div'); h.className = 'cn-hint'; h.textContent = n.hint || 'Tap to open'; body.appendChild(h); }
    node.appendChild(icon); node.appendChild(body);
    node.onclick = function(){ dismiss(node); if (typeof n.onClick === 'function') { try { n.onClick(); } catch(e) {} } };
    el.appendChild(node);
    // Keep at most three on screen. (A dismissed banner stays in the DOM for its exit animation, so
    // count only the live ones; counting children here would loop forever once a fourth arrives.)
    const live = Array.prototype.filter.call(el.children, function(c){ return !c.__gone; });
    while (live.length > 3) dismiss(live.shift());
    node.__timer = setTimeout(function(){ dismiss(node); }, n.duration || DEFAULT_MS);
  }

  // Collect everything fired within a short window; a burst of three or more arrivals/departures becomes one summary.
  let pending = [], flushTimer = null;
  function flush(){
    flushTimer = null;
    const batch = pending; pending = [];
    if (!batch.length) return;
    // Only arrivals and departures collapse into a summary; instructions and level ups always show.
    const people = batch.filter(function(b){ return b.kind === 'join' || b.kind === 'leave'; });
    const rest = batch.filter(function(b){ return !(b.kind === 'join' || b.kind === 'leave'); });
    if (people.length >= 3) show({icon:'🏘️', title: people.length + ' updates at Fair Tide', text: people.slice(0, 3).map(function(b){ return b.title; }).join(' · ') + (people.length > 3 ? ' and more' : '') + '. See Allies & Guests.', duration: 5200});
    else people.forEach(show);
    rest.forEach(show);
  }
  // ---------------- phone reminders ----------------
  // Local notifications only, shown through the service worker while the app is open or recently
  // in the background. Nothing can wake a fully closed app: that needs a push server, and this is a
  // static site. A banner marked remind:true is also sent as a phone notification when the page is
  // hidden. The choice is per device (localStorage), since the browser permission is too.
  const REM_KEY = 'ct_reminders';
  function remSupported(){ return typeof window !== 'undefined' && 'Notification' in window; }
  function remOn(){
    let v = null; try { v = localStorage.getItem(REM_KEY); } catch(e) {}
    return v === '1' && remSupported() && Notification.permission === 'granted';
  }
  window.ctReminderStatus = function(){
    return {supported: remSupported(), permission: remSupported() ? Notification.permission : 'unsupported', on: remOn()};
  };
  function sendOs(title, body, tag){
    if (!remOn()) return;
    const opts = {body: body || '', icon: 'assets/icons/icon-192x192.png', badge: 'assets/icons/icon-192x192.png', tag: 'ct-' + (tag || 'reminder'), renotify: true};
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function(reg){ return reg.showNotification(title, opts); }).catch(function(){
        try { new Notification(title, opts); } catch(e) {}
      });
    } else { try { new Notification(title, opts); } catch(e) {} }
  }
  window.ctSendReminder = sendOs;
  window.ctEnableReminders = function(){
    if (!remSupported()) return Promise.resolve(false);
    return Notification.requestPermission().then(function(p){
      try { localStorage.setItem(REM_KEY, p === 'granted' ? '1' : '0'); } catch(e) {}
      if (p === 'granted') sendOs('Reminders are on', 'You will hear from Crimson Tide when something at Fair Tide needs you.', 'on');
      return p === 'granted';
    });
  };
  window.ctDisableReminders = function(){ try { localStorage.setItem(REM_KEY, '0'); } catch(e) {} };

  // Settings: a Reminders row above Difficulty.
  const oldSettings = window.showSettings;
  if (typeof oldSettings === 'function') {
    window.showSettings = function(){
      const r = oldSettings.apply(this, arguments);
      try {
        const diff = document.getElementById('landingDifficultyEdit');
        if (diff && !document.getElementById('ctReminderRow')) {
          const wrap = document.createElement('div'); wrap.id = 'ctReminderRow'; wrap.style.cssText = 'display:grid;gap:6px;';
          const paint = function(){
            const st = window.ctReminderStatus();
            let msg, btn = '';
            if (!st.supported) msg = 'This browser cannot show notifications.';
            else if (st.permission === 'denied') msg = 'Notifications are blocked for this site. Allow them in the browser’s site settings to turn reminders on.';
            else if (st.on) { msg = 'On. You will get a phone notification for finished requests, a returning gathering party, Watchtower alerts and Captain’s Decisions while the game is open or in the background. It cannot wake a fully closed app.'; btn = 'Turn reminders off'; }
            else { msg = 'Off. Get a phone notification for finished requests, a returning gathering party, Watchtower alerts and Captain’s Decisions while the game is open or in the background.'; btn = 'Turn reminders on'; }
            wrap.innerHTML = '<label style="font-size:.8rem;color:var(--gold);">Phone reminders</label><div style="font-size:.76rem;opacity:.8;line-height:1.4;"></div>' + (btn ? '<button type="button" class="btn btn-small" style="justify-self:start;"></button>' : '');
            wrap.children[1].textContent = msg;
            if (btn) {
              const b = wrap.children[2]; b.textContent = btn;
              b.onclick = function(){
                if (window.ctReminderStatus().on) { window.ctDisableReminders(); paint(); }
                else window.ctEnableReminders().then(function(ok){ paint(); if (!ok && typeof toast === 'function') toast('🔕 Reminders stay off. Allow notifications to turn them on.', 3600); });
              };
            }
          };
          paint();
          const diffLabel = diff.previousElementSibling;
          diff.parentNode.insertBefore(wrap, diffLabel || diff);
        }
      } catch(e) {}
      return r;
    };
  }

  window.notify = function(n){
    if (!n || (!n.title && !n.text)) return;
    // Fair Tide arrivals and departures are not news until the player has unlocked Fair Tide
    if ((n.kind === 'join' || n.kind === 'leave') && typeof window.ctFairTideKnown === 'function' && !window.ctFairTideKnown()) return;
    if (n.remind && typeof document !== 'undefined' && document.hidden) sendOs(n.title || 'Crimson Tide', n.text || '', n.tag || n.kind);
    pending.push(n);
    if (!flushTimer) flushTimer = setTimeout(flush, 350);
  };

  // Residents joining or leaving Fair Tide.
  const oldLog = window.logResidentArrivalDeparture;
  if (typeof oldLog === 'function') {
    window.logResidentArrivalDeparture = function(r, type, note){
      const out = oldLog.apply(this, arguments);
      try {
        const name = (r && r.nameKnown === false) ? 'Someone' : (r && r.name) || 'Someone';
        if (type === 'join') window.notify({icon: (r && r.icon) || '🏠', title: name + ' joined Fair Tide', text: note || '', kind: 'join'});
        else if (type === 'leave') window.notify({icon: (r && r.icon) || '👋', title: name + ' left Fair Tide', text: note || '', kind: 'leave'});
      } catch(e) {}
      return out;
    };
  }

  // ---------------- coming up ----------------
  function roman(n){
    const m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let s = ''; m.forEach(function(p){ while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s;
  }
  function lvl(){ return (typeof level === 'function') ? level() : 0; }
  function arcRows(){
    const rows = [];
    const segs = (window.STORY_XP_REBALANCE && window.STORY_XP_REBALANCE.segments) || [];
    segs.forEach(function(s){
      const first = String(s.arrays || '').split('+')[0];
      let label = null;
      const m = /^ARC(\d+)_CHAPTERS$/.exec(first);
      if (m) label = 'Arc ' + roman(+m[1]);
      else if (first === 'CRIMSON_HORIZON_CHAPTERS') label = 'Crimson Horizon';
      if (label) rows.push({lv: s.lo, label: label, names: String(s.arrays).split('+')});
    });
    return rows;
  }
  function progressKey(name){
    const m = /^ARC(\d+)_CHAPTERS$/.exec(name);
    if (m) return 'comicProgress' + m[1];
    return ({ARC20_INTERLUDE_CHAPTERS:'comicProgress20Interlude', ARC41_INTERLUDE_CHAPTERS:'comicProgress41Interlude', ARC41_BRIDGE_CHAPTERS:'comicProgressArc41Bridge', CRIMSON_HORIZON_CHAPTERS:'comicProgressCrimsonHorizon'})[name] || null;
  }
  window.getComingUp = function(){
    const L = lvl(), rows = [];
    arcRows().forEach(function(a){
      if (a.label === 'Crimson Horizon') {
        // The sequel opens when Arc XLII is finished (its chapters pay the XP up to this level), so
        // it is not shown as a plain level countdown until that arc is done.
        const done = typeof game !== 'undefined' && game && game.arc42Complete;
        if (a.lv > L || !done) rows.push({lv: a.lv, icon: '🌅', text: 'Crimson Horizon begins', after: done ? '' : 'after Arc XLII'});
        return;
      }
      if (a.lv > L) rows.push({lv: a.lv, icon: '📖', text: a.label + ' opens'});
    });
    (window.RAIDS || []).forEach(function(r){
      if (r.unlockLevel > L) rows.push({lv: r.unlockLevel, icon: r.icon || '🏆', text: 'Raid: ' + r.name});
    });
    return rows.sort(function(a, b){ return a.lv - b.lv; }).slice(0, 4);
  };
  // The arcs already open but not finished (one or two, most recent first).
  window.getInProgress = function(){
    const L = lvl(), out = [];
    arcRows().forEach(function(a){
      if (a.lv > L) return;
      let total = 0, read = 0;
      a.names.forEach(function(n){
        const list = window[n], key = progressKey(n), done = key && game[key];
        if (!Array.isArray(list)) return;
        list.forEach(function(ch){ if (CH_SIDE_SKIP(n, ch)) return; total++; if (done && done[ch.id]) read++; });
      });
      if (total && read < total) out.push({lv: a.lv, label: a.label, read: read, total: total});
    });
    return out.sort(function(a, b){ return b.lv - a.lv; }).slice(0, 2);
  };
  function CH_SIDE_SKIP(name, ch){
    return name === 'CRIMSON_HORIZON_CHAPTERS' && (window.CRIMSON_HORIZON_SIDE_IDS || []).indexOf(ch.id) !== -1;
  }
  function comingUpHtml(){
    const ahead = window.getComingUp(), prog = window.getInProgress(), L = lvl();
    if (!ahead.length && !prog.length) return '';
    let h = '<div class="panel-title" style="margin-bottom:6px;">🔭 Coming Up</div>';
    prog.forEach(function(p){
      h += '<div class="cu-row"><span class="cu-ico">📖</span><span class="cu-txt">' + p.label + ': ' + p.read + ' of ' + p.total + ' chapters read</span></div>';
    });
    ahead.forEach(function(r){
      h += '<div class="cu-row"><span class="cu-ico">' + r.icon + '</span><span class="cu-txt">' + r.text + '</span><span class="cu-lv">' + (r.after ? r.after : 'Lv ' + r.lv + ' · ' + (r.lv - L) + ' to go') + '</span></div>';
    });
    return h;
  }
  function renderComingUp(){
    ensureStyle();
    let el = document.getElementById('ctComingUp');
    if (!el) {
      const anchor = document.getElementById('objectiveActionPanel') || document.getElementById('mainGoalPanel');
      if (!anchor || !anchor.parentNode) return;
      el = document.createElement('div'); el.id = 'ctComingUp'; el.className = 'panel ct-coming-up'; el.style.margin = '10px 0';
      anchor.parentNode.insertBefore(el, anchor.nextSibling);
    }
    const h = comingUpHtml();
    el.style.display = h ? '' : 'none';
    if (h && el.__h !== h) { el.innerHTML = h; el.__h = h; }
  }
  window.renderComingUp = renderComingUp;

  // Refresh with the goal card; announce level ups with a Next up line.
  const oldGoal = window.renderMainGoal;
  if (typeof oldGoal === 'function') {
    window.renderMainGoal = function(){
      const r = oldGoal.apply(this, arguments);
      try { renderComingUp(); } catch(e) {}
      return r;
    };
  }
  let lastLevel = null;
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try {
        if (typeof gameSessionActive !== 'undefined' && gameSessionActive) {
          const L = lvl();
          if (lastLevel !== null && L > lastLevel) {
            const next = window.getComingUp()[0];
            window.notify({icon:'⭐', title:'Level ' + L, text: next ? 'Next up: ' + next.text + (next.after ? ' ' + next.after : ' (Lv ' + next.lv + ', ' + (next.lv - L) + ' to go)') : '', kind:'level'});
          }
          lastLevel = L;
          renderComingUp();
        }
      } catch(e) {}
      return r;
    };
  }
})();
