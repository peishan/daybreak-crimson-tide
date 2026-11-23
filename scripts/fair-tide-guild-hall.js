(function(){
  // -------------------------------------------------------------------
  // THE FAIR TIDE GUILD HALL. Your Fair Tide members run charters (small jobs around the harbour) in real time, including while you are
  // away, and pay into a shared Hall Fund. The fund is spent on Hall projects (more output, longer time away), on Hall events, and (next)
  // on summoning a Tide Titan. Chests unlock as the fund's lifetime earnings pass milestones. State: game.guildHall.
  // -------------------------------------------------------------------
  const HOUR = 3600 * 1000;
  const CHARTERS = ['Harbour ledger audit', 'Mending the nets', 'Supply run to the quay', 'Escorting a ferry crew', 'Sorting the cargo shed',
    'Training the dockhands', 'Haggling with a rope-maker', 'Patching the lift ropes', 'Teaching a market class', 'The lantern round',
    'Clearing a drain after the rain', 'Reading shipping notices aloud', 'Carrying tea up the stairs', 'Counting the barrels'];
  const CHARTER_HOURS = 2;                                   // one charter takes about this long
  const CHARTER_COSTS = [30000, 90000, 220000, 500000];      // Charter Board 1 -> 5
  const STRONGBOX_COSTS = [20000, 60000, 150000];            // Strongbox 1 -> 4
  const CHEST_STEPS = [25000, 75000, 175000, 400000, 800000, 1500000];
  const EVENTS = {
    lantern: { name: 'Lantern Night', icon: '🏮', cost: 8000,  hours: 2, text: 'The whole hall hangs lanterns along the quay for the evening.', reward: { gold: 3000,  rep: 2, mood: 8 } },
    drill:   { name: 'Crew Drill',    icon: '🥁', cost: 15000, hours: 4, text: 'Members run a harbour drill: lines, lifts and lamps, start to finish.', reward: { gold: 6000,  rep: 5, mood: 3 } },
    run:     { name: 'Harbour Run',   icon: '📦', cost: 30000, hours: 8, text: 'A big joint delivery, split between every member that can carry.', reward: { gold: 14000, rep: 8, mood: 2 } }
  };

  function hall(){
    const h = game.guildHall = game.guildHall || {};
    if (h.fund == null) h.fund = 0;
    if (h.totalEarned == null) h.totalEarned = 0;
    if (!h.charter) h.charter = 1;
    if (!h.strongbox) h.strongbox = 1;
    if (h.chests == null) h.chests = 0;
    if (!h.log) h.log = [];
    if (!h.lastTick) h.lastTick = Date.now();
    return h;
  }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function fmt(n){ return Math.round(n).toLocaleString(); }
  function members(){
    const out = [], seen = {};
    const add = function(id, name, icon){ const k = String(name || id).toLowerCase(); if (seen[k]) return; seen[k] = 1; out.push({ id: id, name: name || id, icon: icon || '⚓' }); };
    Object.keys(game.fairTideRoster || {}).forEach(function(id){ const m = game.fairTideRoster[id]; if (m) add(id, m.name, m.icon); });
    try {
      const res = typeof window.fairTideResidentsState === 'function' ? window.fairTideResidentsState() : {};
      Object.keys(res).forEach(function(id){ const r = res[id]; if (r && (r.status === 'resident' || r.status === 'working_resident')) add(id, r.name || (id.charAt(0).toUpperCase() + id.slice(1)), r.icon); });
    } catch (e) {}
    return out;
  }
  function perHour(){ return Math.round((40 + lvl() * 0.5) * (1 + 0.2 * (hall().charter - 1))); }   // per member
  function windowHours(){ return 12 + 4 * (hall().strongbox - 1); }
  function hash(s){ let n = 0; for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function charterFor(id, k){ return CHARTERS[hash(id + ':' + k) % CHARTERS.length]; }

  // Pay out what the members earned since the last tick (never more than the idle window).
  function tick(){
    const h = hall(), now = Date.now();
    const ms = members();
    const elapsed = Math.max(0, Math.min(now - h.lastTick, windowHours() * HOUR));
    if (now - h.lastTick < 60 * 1000) return 0;
    h.lastTick = now;
    if (!ms.length || elapsed <= 0) return 0;
    const hours = elapsed / HOUR;
    const gain = Math.round(ms.length * perHour() * hours);
    h.fund += gain; h.totalEarned += gain;
    // a few readable log lines: the charters members finished meanwhile
    const per = Math.max(0, Math.floor(hours / CHARTER_HOURS));
    h.charterCount = (h.charterCount || 0) + per * ms.length;
    for (let i = 0; i < Math.min(ms.length, 4) && per > 0; i++) {
      const m = ms[(h.charterCount + i) % ms.length];
      h.log.unshift({ t: now, text: m.icon + ' ' + m.name + ' finished: ' + charterFor(m.id, h.charterCount + i) + '.' });
    }
    h.log = h.log.slice(0, 12);
    // finish a Hall event whose time is up
    if (h.event && now >= h.event.endsAt) h.event.done = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return gain;
  }
  window.guildHallTick = tick;
  window.guildHallMembers = members;
  window.guildHallWindowHours = windowHours;
  window.guildHallSpend = function(n){ const h = hall(); if (h.fund < n) return false; h.fund -= n; return true; };
  window.guildHallFund = function(){ return hall().fund; };
  window.guildHallAdd = function(n){ const h = hall(); h.fund += n; h.totalEarned += n; };

  function unlockedChests(){ const t = hall().totalEarned; return CHEST_STEPS.filter(function(s){ return t >= s; }).length; }

  // ---- actions ----
  function refresh(){ if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub(); }
  window.__ctHallBuy = function(kind){
    const h = hall();
    const list = kind === 'charter' ? CHARTER_COSTS : STRONGBOX_COSTS, cur = kind === 'charter' ? h.charter : h.strongbox;
    const cost = list[cur - 1];
    if (cost == null) return;
    if (h.fund < cost) { toast('The Hall Fund needs ' + fmt(cost - h.fund) + ' more.'); return; }
    h.fund -= cost; h[kind] = cur + 1;
    toast((kind === 'charter' ? '📋 Charter Board' : '🧰 Strongbox') + ' upgraded to level ' + (cur + 1) + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  window.__ctHallGive = function(n){
    const h = hall();
    if ((game.gold || 0) < n) { toast('Not enough gold.'); return; }
    game.gold -= n; h.fund += n;
    toast('💰 ' + fmt(n) + 'g added to the Hall Fund.', 3200);
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  window.__ctHallEvent = function(key){
    const h = hall(), e = EVENTS[key];
    if (!e || (h.event && !h.event.claimed)) return;
    if (!members().length) { toast('The Hall needs members first.'); return; }
    if (h.fund < e.cost) { toast('The Hall Fund needs ' + fmt(e.cost - h.fund) + ' more.'); return; }
    h.fund -= e.cost;
    h.event = { key: key, endsAt: Date.now() + e.hours * HOUR };
    h.log.unshift({ t: Date.now(), text: e.icon + ' ' + e.name + ' has begun.' });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  window.__ctHallClaimEvent = function(){
    const h = hall(), ev = h.event;
    if (!ev || ev.claimed || Date.now() < ev.endsAt) return;
    const e = EVENTS[ev.key]; if (!e) { h.event = null; return; }
    ev.claimed = true; h.event = null;
    const scale = Math.max(1, lvl() / 400);
    const gold = Math.round(e.reward.gold * scale);
    game.gold = (game.gold || 0) + gold;
    game.reputation = (game.reputation || 0) + e.reward.rep;
    if (e.reward.mood && typeof window.addFairTideMood === 'function') window.addFairTideMood(e.reward.mood);
    h.log.unshift({ t: Date.now(), text: e.icon + ' ' + e.name + ' finished: +' + fmt(gold) + 'g, +' + e.reward.rep + ' reputation.' });
    if (typeof window.notify === 'function') window.notify({ icon: e.icon, title: e.name + ' is done', text: '+' + fmt(gold) + 'g, +' + e.reward.rep + ' reputation' + (e.reward.mood ? ', and Fair Tide is in a better mood.' : '.'), kind: 'info', duration: 6000 });
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  window.__ctHallChest = function(){
    const h = hall();
    if (h.chests >= unlockedChests()) return;
    const step = CHEST_STEPS[h.chests];
    h.chests += 1;
    const gold = Math.round(step * 0.2), rep = 2 + h.chests;
    game.gold = (game.gold || 0) + gold;
    game.reputation = (game.reputation || 0) + rep;
    h.log.unshift({ t: Date.now(), text: '🎁 Hall chest ' + h.chests + ' opened: +' + fmt(gold) + 'g, +' + rep + ' reputation.' });
    if (typeof window.notify === 'function') window.notify({ icon: '🎁', title: 'Hall chest opened', text: '+' + fmt(gold) + 'g and +' + rep + ' reputation. The members add a little more every day.', kind: 'info', duration: 7000 });
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };

  // ---- the tab ----
  function timeLeft(ms){ const m = Math.max(0, Math.ceil(ms / 60000)); return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + 'm'; }
  function render(){
    const el = document.getElementById('ft-tab-guildhall');
    if (!el) return;
    const gained = tick();
    const h = hall(), ms = members(), now = Date.now();
    const ph = perHour(), total = ms.length * ph;
    let html = '<div class="panel-title">🏛️ Fair Tide Guild Hall</div>' +
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Your Fair Tide members run charters around the harbour, even while you are away, and pay into the Hall Fund. Spend it on Hall projects and events.</p>';
    if (gained > 0) html += '<div class="story-chip" style="margin-bottom:8px;">💰 +' + fmt(gained) + ' arrived in the fund since you were last here.</div>';
    html += '<article class="quest-item"><strong>💰 Hall Fund: ' + fmt(h.fund) + '</strong> <span class="story-chip">' + fmt(h.totalEarned) + ' earned in all</span><br>' +
      '<span style="font-size:.82rem;opacity:.85;">' + (ms.length ? ms.length + ' member' + (ms.length === 1 ? '' : 's') + ' working · about ' + fmt(total) + ' an hour · ' : 'No members yet · ') +
      'keeps earning for up to ' + windowHours() + ' hours away.</span><br>' +
      '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">' +
      [1000, 10000, 100000].map(function(n){ return '<button class="btn btn-small"' + ((game.gold || 0) < n ? ' disabled' : '') + ' onclick="__ctHallGive(' + n + ')">Add ' + fmt(n) + 'g</button>'; }).join('') +
      '</div></article>';
    // members at work
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">👥 At work</div>';
    if (!ms.length) html += '<div class="story-chip">No one has joined Fair Tide yet. Members that join the roster, and residents, start working here automatically.</div>';
    else {
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      ms.slice(0, 16).forEach(function(m){
        const k = (h.charterCount || 0) + hash(m.id) % 7;
        html += '<div class="quest-item" style="padding:6px;"><strong style="font-size:.82rem;">' + m.icon + ' ' + esc(m.name) + '</strong><br><span style="font-size:.74rem;opacity:.8;">' + esc(charterFor(m.id, k)) + '</span></div>';
      });
      html += '</div>' + (ms.length > 16 ? '<div style="font-size:.75rem;opacity:.7;margin-top:4px;">and ' + (ms.length - 16) + ' more</div>' : '');
    }
    // projects
    const cc = CHARTER_COSTS[h.charter - 1], sc = STRONGBOX_COSTS[h.strongbox - 1];
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">🏗️ Hall projects</div>' +
      '<article class="quest-item"><strong>📋 Charter Board · level ' + h.charter + '</strong><br><span style="font-size:.8rem;opacity:.85;">Each level makes every member earn 20% more.</span><br>' +
      (cc != null ? '<button class="btn btn-small btn-success" style="margin-top:6px;"' + (h.fund < cc ? ' disabled' : '') + ' onclick="__ctHallBuy(\'charter\')">Upgrade · ' + fmt(cc) + '</button>' : '<span style="font-size:.78rem;opacity:.75;">✓ Fully upgraded.</span>') + '</article>' +
      '<article class="quest-item"><strong>🧰 Strongbox · level ' + h.strongbox + '</strong><br><span style="font-size:.8rem;opacity:.85;">Each level lets the members keep earning 4 more hours while you are away.</span><br>' +
      (sc != null ? '<button class="btn btn-small btn-success" style="margin-top:6px;"' + (h.fund < sc ? ' disabled' : '') + ' onclick="__ctHallBuy(\'strongbox\')">Upgrade · ' + fmt(sc) + '</button>' : '<span style="font-size:.78rem;opacity:.75;">✓ Fully upgraded.</span>') + '</article>';
    // events
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">🎉 Hall events</div>';
    if (h.event) {
      const e = EVENTS[h.event.key];
      if (now >= h.event.endsAt) html += '<article class="quest-item"><strong>' + e.icon + ' ' + e.name + '</strong> is done.<br><button class="btn btn-small btn-success" style="margin-top:6px;" onclick="__ctHallClaimEvent()">Collect rewards</button></article>';
      else html += '<article class="quest-item"><strong>' + e.icon + ' ' + e.name + '</strong> is on.<br><span style="font-size:.8rem;opacity:.85;">' + esc(e.text) + ' Ready in ' + timeLeft(h.event.endsAt - now) + '.</span></article>';
    } else {
      Object.keys(EVENTS).forEach(function(k){
        const e = EVENTS[k];
        html += '<article class="quest-item"><strong>' + e.icon + ' ' + e.name + '</strong> <span class="story-chip">' + e.hours + 'h</span><br><span style="font-size:.8rem;opacity:.85;">' + esc(e.text) + ' Pays gold, reputation' + (e.reward.mood > 5 ? ' and a Fair Tide mood boost' : '') + '.</span><br>' +
          '<button class="btn btn-small" style="margin-top:6px;"' + (h.fund < e.cost || !ms.length ? ' disabled' : '') + ' onclick="__ctHallEvent(\'' + k + '\')">Hold it · ' + fmt(e.cost) + '</button></article>';
      });
    }
    // chests
    const unlocked = unlockedChests(), next = CHEST_STEPS[unlocked];
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">🎁 Hall chests</div><article class="quest-item">' +
      '<span style="font-size:.82rem;opacity:.85;">A chest opens each time the fund\'s lifetime earnings pass a milestone. ' + (next ? 'Next at ' + fmt(next) + '.' : 'All milestones passed.') + '</span><br>' +
      (h.chests < unlocked ? '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="__ctHallChest()">🎁 Open chest ' + (h.chests + 1) + '</button>' : '<span style="font-size:.78rem;opacity:.75;">' + h.chests + ' of ' + CHEST_STEPS.length + ' opened.</span>') + '</article>';
    // log
    if (h.log.length) html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">📜 Recent</div>' + h.log.slice(0, 8).map(function(l){ return '<div style="font-size:.78rem;opacity:.85;margin:2px 0;">' + esc(l.text) + '</div>'; }).join('');
    el.innerHTML = html;
  }

  const oldRender = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-guildhall'), btn = document.getElementById('ft-tab-btn-guildhall');
    if (el) el.classList.toggle('active', tab === 'guildhall');
    if (btn) btn.classList.toggle('active', tab === 'guildhall');
    if (oldRender) oldRender.apply(this, arguments);
    if (tab === 'guildhall') render();
  };
  // Pay out while the game is open, and tell you once when you come back to an idle haul.
  setInterval(function(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive || !game) return;
      const g = tick();
      if (g > 0 && !((game.fairTideActiveTab || '') === 'guildhall')) game.guildHallUnseen = (game.guildHallUnseen || 0) + g;
    } catch (e) {}
  }, 60 * 1000);
  window.addEventListener('focus', function(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive || !game) return;
      const g = tick();
      if (g > 5000 && typeof window.notify === 'function') window.notify({ icon: '🏛️', title: 'The Guild Hall kept working', text: '+' + fmt(g) + ' in the Hall Fund while you were away.', kind: 'info', duration: 6000 });
    } catch (e) {}
  });
})();
