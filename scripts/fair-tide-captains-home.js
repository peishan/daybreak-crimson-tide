(function(){
  // -------------------------------------------------------------------
  // THE CAPTAIN'S QUARTERS AS A HOME -- the same format as the Tribute
  // House (fair-tide-tribute-house.js), itself after Tribute's homes (the
  // Gold Manor and Devon's Palace). The tab already offers a free rest; this
  // adds, underneath it:
  //
  //   * ROOMS AND MOODS -- San and Joel's room, and the twins' once they are
  //     part of the household. A household mood drifts UP toward the home's
  //     comfort each day (never down); a shared meal and the nursery lift it.
  //   * FIVE WINGS, each level 0-5, with a household tender, bought with Fair
  //     Tide's stores:
  //       Bedchamber (San and Joel)   resting here also lifts Fair Tide Mood
  //       Kitchen (Aisyah)            once a day: Food
  //       Chart Room (Joel)           once a day: Trade
  //       Nursery (Soel)              once a day: story time lifts the household
  //       Terrace (the twins)         once a day: a quiet hour, Fair Tide Mood
  //     The Nursery and the Terrace open once the twins are part of the
  //     household (fairTideChildrenUnlocked).
  //     TENDERS, NAMES, COSTS AND NUMBERS ARE FIRST-PASS: edit freely.
  //   * HOME MEMORIES -- small permanent details tied to real state, shown
  //     once and written to the Fair Tide Chronicle.
  // -------------------------------------------------------------------

  const WING_MAX = 5;
  const WINGS = {
    bedchamber: {n:'Bedchamber', icon:'🛏️', tender:'San and Joel', names:['A Bedroll','A Proper Bed','The Bedchamber','A Room with a View','The Captain\'s Chamber'],
                 d:'Resting here also lifts Fair Tide Mood (+1 per level)', cost:{timber:15, stone:10}},
    kitchen:    {n:'Kitchen', icon:'🍲', tender:'Aisyah', names:['Cookfire Corner','Galley Nook','Kitchen','The Long Table','Hearth Hall'],
                 d:'Once a day: Food (more with each level)', cost:{food:15, timber:10}},
    chart_room: {n:'Chart Room', icon:'🗺️', tender:'Joel', names:['A Chart Shelf','A Chart Table','Chart Room','The Map Wall','The Harbor Atlas'],
                 d:'Once a day: Trade, from what the charts say about the ports', cost:{trade:15, timber:10}},
    nursery:    {n:'Nursery', icon:'🧸', tender:'Soel', names:['A Corner for Toys','The Little Room','Nursery','Story Room','The Wide Nursery'],
                 d:'Once a day: story time lifts the household\'s mood', cost:{food:15, trade:10}, needsChildren:true},
    terrace:    {n:'Terrace', icon:'🌅', tender:'the twins', names:['A Bench by the Door','The Small Terrace','Terrace','The Harbor Terrace','The Lantern Terrace'],
                 d:'Once a day: a quiet hour, Fair Tide Mood up', cost:{stone:15, timber:10}, needsChildren:true}
  };
  const WING_IDS = Object.keys(WINGS);
  const RES_ICON = {timber:'🪵', stone:'🪨', food:'🍲', trade:'💱'};

  function children(){ return typeof window.fairTideChildrenUnlocked === 'function' && window.fairTideChildrenUnlocked(); }
  function hs(){
    if (!game.captainsQuarters) game.captainsQuarters = {};
    const h = game.captainsQuarters;
    if (!h.wings) h.wings = {};
    if (!h.claim) h.claim = {};
    if (!h.mem) h.mem = {};
    if (typeof h.mood !== 'number') h.mood = 60;
    if (typeof h.rests !== 'number') h.rests = 0;
    if (typeof h.meals !== 'number') h.meals = 0;
    return h;
  }
  function wingLv(w){ return hs().wings[w] || 0; }
  function wingTotal(){ return WING_IDS.reduce(function(s, w){ return s + wingLv(w); }, 0); }
  function res(){ game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0}; return game.fairTideResources; }
  function cap(){ return (typeof window.fairTideResourceCap === 'function') ? window.fairTideResourceCap() : 999999; }
  function addRes(k, n){ const r = res(); r[k] = Math.min(cap(), (r[k] || 0) + n); }
  function wingOpen(w){ return !WINGS[w].needsChildren || children(); }

  // ---- rooms and comfort ----
  function roomsTotal(){ return 2 + Math.floor(wingTotal() / 2); }
  function roomsTaken(){ return 1 + (children() ? 1 : 0); }
  function comfortTarget(){
    let t = 55 + Math.min(25, Math.round(wingTotal() * 1.2));
    if (roomsTaken() > roomsTotal()) t -= 10;
    return Math.max(0, Math.min(100, t));
  }
  function addMood(n){ const h = hs(); h.mood = Math.max(0, Math.min(100, h.mood + n)); }
  function syncHousehold(){
    const h = hs();
    if (typeof h.moodDay !== 'number') { h.moodDay = game.day || 0; return; }
    const steps = Math.min(10, (game.day || 0) - h.moodDay);
    if (steps <= 0) return;
    h.moodDay = game.day;
    const t = comfortTarget();
    if (h.mood < t) h.mood = Math.min(t, h.mood + 3 * steps);
  }
  function moodTier(){ return (typeof window.residentHappinessTier === 'function') ? window.residentHappinessTier({happiness: hs().mood}) : null; }

  // ---- wings ----
  function wingCost(w, L){ const c = {}; Object.keys(WINGS[w].cost).forEach(function(k){ c[k] = WINGS[w].cost[k] * L * L; }); return c; }
  function costText(c){ return Object.keys(c).map(function(k){ return RES_ICON[k] + ' ' + c[k]; }).join(' · '); }
  function canAfford(c){ const r = res(); return Object.keys(c).every(function(k){ return (r[k] || 0) >= c[k]; }); }

  window.upgradeQuartersWing = function(w){
    if (!WINGS[w] || !wingOpen(w)) return;
    const L = wingLv(w) + 1;
    if (L > WING_MAX) { toast('That wing is complete.'); return; }
    const c = wingCost(w, L);
    if (!canAfford(c)) { toast('Not enough resources.'); return; }
    const r = res(); Object.keys(c).forEach(function(k){ r[k] -= c[k]; });
    hs().wings[w] = L;
    const name = WINGS[w].names[L - 1];
    const line = name + ' in the Captain\'s Quarters (tended by ' + WINGS[w].tender + ')';
    logEvent('🏠 ' + (L === 1 ? 'Built' : 'Improved') + ': ' + WINGS[w].icon + ' ' + line + '.', 'gold');
    if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry((L === 1 ? 'Built: ' : 'Improved: ') + line + '.', '🏠');
    toast('🏠 ' + (L === 1 ? 'Built' : 'Improved') + ': ' + name);
    syncMemories();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.claimQuartersWing = function(w){
    if (!WINGS[w] || !wingOpen(w) || !wingLv(w) || w === 'bedchamber') return;
    const h = hs();
    if (h.claim[w] === game.day) { toast('Already done here today.'); return; }
    h.claim[w] = game.day;
    const L = wingLv(w), t = WINGS[w].tender;
    let msg;
    if (w === 'kitchen') { const n = 4 + 3 * L; addRes('food', n); msg = '🍲 ' + t + ' has the kitchen busy: ' + RES_ICON.food + ' Food +' + n + '.'; }
    else if (w === 'chart_room') { const n = 3 + 2 * L; addRes('trade', n); msg = '🗺️ ' + t + ' reads the charts for what the ports want: ' + RES_ICON.trade + ' Trade +' + n + '.'; }
    else if (w === 'nursery') { const n = 4 + 2 * L; addMood(n); msg = '🧸 Story time in the nursery, with ' + t + ' keeping watch. The household is brighter (+' + n + ' mood).'; }
    else if (w === 'terrace') { const n = 2 + L; if (typeof window.addFairTideMood === 'function') window.addFairTideMood(n); msg = '🌅 A quiet hour on the terrace: Fair Tide Mood +' + n + '.'; }
    logEvent(msg, 'good'); toast(msg, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.shareQuartersMeal = function(){
    const h = hs();
    if (h.mealDay === game.day) { toast('The household has already shared a meal today.'); return; }
    if ((res().food || 0) < 10) { toast('A shared meal costs 10 Food.'); return; }
    res().food -= 10; h.mealDay = game.day; h.meals++;
    addMood(8);
    logEvent('🍲 The Captain\'s Quarters share a meal. Everyone is a little brighter.', 'good');
    toast('🍲 The household shares a meal (+8 mood).');
    syncMemories();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // Resting here lifts the mood: the Bedchamber adds +1 Fair Tide Mood per level, and a
  // household that is already happy adds one more.
  const oldRest = window.restInCaptainsQuarters;
  if (typeof oldRest === 'function') {
    window.restInCaptainsQuarters = function(){
      const r = oldRest.apply(this, arguments);
      try {
        const h = hs(); h.rests++;
        const bonus = wingLv('bedchamber') + (h.mood >= 80 ? 1 : 0);
        if (bonus > 0 && typeof window.addFairTideMood === 'function') window.addFairTideMood(bonus);
        addMood(3);
        syncMemories();
        if (typeof saveGameQuiet === 'function') saveGameQuiet();
      } catch(e) {}
      return r;
    };
  }

  // ---- home memories ----
  const MEMORIES = [
    {id:'dent', icon:'🛏️', t:'The bed in the Captain\'s Quarters has a dent on each side, and nobody has suggested a different arrangement.',
      when:function(){ return hs().rests >= 5; }},
    {id:'cots', icon:'🧸', t:'Two small cots stand at the foot of the bed, and neither has been moved in a long while.',
      when:function(){ return children(); }},
    {id:'soel_cushion', icon:'🐾', t:"A cushion by the window has become Soel's, and is defended accordingly.",
      when:function(){ return typeof window.soelWatchUnlocked === 'function' && window.soelWatchUnlocked(); }},
    {id:'bedchamber', icon:'🛏️', t:'The bedchamber window has been widened for a better view of the quay.',
      when:function(){ return wingLv('bedchamber') >= 1; }},
    {id:'kitchen_ledger', icon:'🍲', t:"Aisyah's ledger lives on the kitchen shelf, between the salt and the lamp oil.",
      when:function(){ return wingLv('kitchen') >= 1; }},
    {id:'chart_ring', icon:'🗺️', t:"Joel's chart table has a ring on it from the same cup, every morning.",
      when:function(){ return wingLv('chart_room') >= 1; }},
    {id:'nursery_marks', icon:'🧸', t:'The nursery doorframe has pencil marks on it, each one with a date.',
      when:function(){ return wingLv('nursery') >= 1; }},
    {id:'terrace_chairs', icon:'🌅', t:'Two chairs on the terrace face the harbor. One is always a little warmer than the other.',
      when:function(){ return wingLv('terrace') >= 1; }},
    {id:'long_table', icon:'🍲', t:'The kitchen table has had to be extended, twice.',
      when:function(){ return hs().meals >= 5; }},
    {id:'five_wings', icon:'🏠', t:'Every wing of the Captain\'s Quarters is lived in now, and the crew call it home without thinking about it.',
      when:function(){ return WING_IDS.every(function(w){ return wingLv(w) >= 1; }); }}
  ];
  function syncMemories(){
    const h = hs();
    MEMORIES.forEach(function(m){
      if (h.mem[m.id] || !m.when()) return;
      h.mem[m.id] = game.day || 1;
      if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(m.t, m.icon);
    });
  }
  window.syncCaptainsQuarters = function(){ if (typeof game === 'undefined' || !game) return; syncHousehold(); syncMemories(); };

  // ---- rendering ----
  function wingRow(w){
    const W = WINGS[w];
    if (!wingOpen(w)) {
      return '<article class="quest-item" style="opacity:.65;"><strong>' + W.icon + ' ' + esc(W.n) + '</strong> <span style="font-size:.76rem;">· tended by ' + esc(W.tender) + '</span><br>' +
        '<span style="font-size:.78rem;">🔒 Opens once the twins are part of the household.</span></article>';
    }
    const L = wingLv(w), next = L < WING_MAX ? wingCost(w, L + 1) : null, ok = next && canAfford(next);
    const claimed = hs().claim[w] === game.day;
    let btns = '';
    if (next) btns += '<button class="btn btn-small ' + (ok ? 'btn-success' : '') + '" ' + (ok ? '' : 'disabled') + ' onclick="upgradeQuartersWing(\'' + w + '\')">' + (L ? 'Improve' : 'Build') + '</button> ';
    if (L && w !== 'bedchamber') btns += '<button class="btn btn-small" ' + (claimed ? 'disabled' : '') + ' onclick="claimQuartersWing(\'' + w + '\')">' + (claimed ? 'Done today' : (w === 'nursery' ? 'Story time' : w === 'terrace' ? 'Sit a while' : 'Collect')) + '</button>';
    return '<article class="quest-item"><strong>' + W.icon + ' ' + esc(L ? W.names[L - 1] : W.n) + '</strong> ' +
      '<span style="font-size:.76rem;opacity:.7;">Lv ' + L + '/' + WING_MAX + ' · tended by ' + esc(W.tender) + '</span><br>' +
      '<span style="font-size:.78rem;opacity:.8;">' + esc(W.d) + '</span>' +
      (next ? '<br><span style="font-size:.76rem;opacity:.7;">Next, ' + esc(W.names[L]) + ': ' + costText(next) + '</span>' : '') +
      (btns ? '<div style="margin-top:6px;">' + btns + '</div>' : '') + '</article>';
  }

  function homeHtml(){
    const h = hs();
    const taken = roomsTaken(), total = roomsTotal(), crowded = taken > total, t = moodTier();
    const fed = h.mealDay === game.day;
    let html = '<div id="quartersHomeWrap" style="margin-top:14px;">' +
      '<div class="panel-title" style="font-size:.95rem;">Household</div>' +
      '<div style="font-size:.8rem;opacity:.85;">' + taken + ' of ' + total + ' rooms taken' + (t ? ' · Household: ' + t.icon + ' ' + esc(t.label) : '') +
        (crowded ? ' · <span style="color:var(--danger,#e74c3c);">crowded: build a wing</span>' : '') + '</div>' +
      '<div style="font-size:.74rem;opacity:.65;margin:2px 0 6px;">San and Joel' + (children() ? ', and the twins' : '') + '. More wings mean more rooms and a more comfortable home. The household\'s mood drifts up toward its comfort each day.</div>' +
      '<div style="margin-bottom:6px;"><button class="btn btn-small" ' + (fed || (res().food || 0) < 10 ? 'disabled' : '') + ' onclick="shareQuartersMeal()">🍲 ' + (fed ? 'Shared a meal today' : 'Share a meal (' + RES_ICON.food + ' 10)') + '</button></div>';
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">🏗️ The home and its wings</div>' +
      '<div style="font-size:.74rem;opacity:.65;margin-bottom:4px;">Paid for with Fair Tide\'s stores. Effects are small.</div>' + WING_IDS.map(wingRow).join('');
    const got = MEMORIES.filter(function(m){ return h.mem[m.id]; });
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">Memories of this home <span style="font-size:.74rem;opacity:.6;">(' + got.length + '/' + MEMORIES.length + ')</span></div>' +
      (got.length ? got.map(function(m){ return '<div style="font-size:.8rem;opacity:.85;margin:3px 0;">' + m.icon + ' ' + esc(m.t) + '</div>'; }).join('')
                  : '<div style="font-size:.78rem;opacity:.6;">Nothing yet. Small details appear as the home fills.</div>') +
      '</div>';
    return html;
  }

  const oldRenderFairTideHubForQuartersHome = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForQuartersHome) oldRenderFairTideHubForQuartersHome();
    if ((game.fairTideActiveTab || 'buildings') !== 'quarters') return;
    const el = document.getElementById('ft-tab-quarters');
    if (!el) return;
    syncHousehold(); syncMemories();
    const old = document.getElementById('quartersHomeWrap'); if (old) old.remove();
    el.insertAdjacentHTML('beforeend', homeHtml());
  };

  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) window.syncCaptainsQuarters(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
