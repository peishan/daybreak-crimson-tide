(function(){
  // -------------------------------------------------------------------
  // THE TRIBUTE HOUSE (working name) -- a special Fair Tide building for
  // the Tribute people who live at Fair Tide in the sequel.
  //
  // A Fair Tide hub tab, shaped after Tribute's homes (the Gold Manor and
  // Devon's Palace: estates.js, base.js, residents.js in the Tribute repo)
  // and rebuilt on Crimson Tide's own systems. It opens as of the sequel
  // (the Crimson Horizon Prologue is read) and has three layers:
  //
  //   1. HOME MEMORIES -- small permanent details that appear as the story
  //      and the house grow (Tribute's "home memories", Crimson Tide's
  //      settlement memories). Each is tied to real game state, revealed
  //      once, and written to the Fair Tide Chronicle.
  //   2. FIVE WINGS, each level 0-5 with a named tender, bought with Fair
  //      Tide resources (the same pool as the Fair Tide buildings):
  //        Study        +1% XP per level
  //        Apothecary   once a day: Food
  //        Workshop     once a day: Timber and Stone
  //        Stables      once a day: Trade
  //        Training Yard once a day: a little party XP
  //      TENDERS, NAMES, COSTS AND NUMBERS ARE FIRST-PASS: edit freely.
  //   3. ROOMS AND MOODS -- the house has rooms (more with each wing level)
  //      and a household comfort. Residents' happiness drifts UP toward it
  //      a little each day (never down), a shared meal lifts everyone, and
  //      a crowded house pulls the comfort down.
  //
  // Who lives here: only Sera, as of the sequel (Crimson Horizon 080: "She
  // says she's grown fond of deciding how to spend a day before anyone
  // else decides for her"). She moves off the Residents list on the Allies
  // & Guests tab. Jade and Devon, and Sally and Levi, still sail with the
  // Crimson Tide; once Ch.079 is read the house keeps the rooms they have
  // agreed to look at (they count toward rooms taken), nothing more.
  //
  // TRIBUTE_HOUSE_RESIDENTS is an array on purpose: each later Tribute
  // arrival is one more entry with its own eligibility.
  // -------------------------------------------------------------------

  const RESIDENTS = [
    {id:'sera', name:'Sera', icon:'🌊', room:'Her room at the Tribute House',
      note:"Has grown fond of deciding how to spend a day before anyone else decides for her.",
      eligible:function(){
        const r = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState().sera : null;
        return !!(r && r.status === 'resident');
      }}
  ];
  window.TRIBUTE_HOUSE_RESIDENTS = RESIDENTS;

  // From Ch.079 ("The Cabin Across the Hall", id 80): the rooms being looked at.
  const ROOMS_BEING_LOOKED_AT = [
    {who:'Jade and Devon', icon:'🌙', text:'Near Sky and the infirmary, if their due windows do overlap.'},
    {who:'Sally and Levi', icon:'🏹', text:'A room of their own, with Jade close enough to complain through the wall.'}
  ];

  const WING_MAX = 5;
  const WINGS = {
    study:      {n:'Study',        icon:'📚', tender:'Devon', names:['Reading Nook','Study','Records Room','Scriptorium','Hall of Letters'],
                 d:'+1% XP per level', cost:{trade:15, timber:10}},
    apothecary: {n:'Apothecary',   icon:'🌿', tender:'Sky',   names:['Herb Shelf','Still Room','Apothecary','Physic Garden','Healing House'],
                 d:'Once a day: the tender brings in Food (more with each level)', cost:{food:15, timber:10}},
    workshop:   {n:'Workshop',     icon:'⚒️', tender:'Fen',   names:['Workbench','Forge Corner','Workshop','Artisans\' Hall','Master Forge'],
                 d:'Once a day: Timber and Stone for the stores', cost:{stone:15, timber:10}},
    stables:    {n:'Stables',      icon:'🐴', tender:'Levi',  names:['Hitching Post','Stable','Coach House','Road Stables','Royal Mews'],
                 d:'Once a day: a little Trade from carriers and caravans', cost:{timber:15, trade:10}},
    yard:       {n:'Training Yard',icon:'🥋', tender:'Jade',  names:['Sparring Patch','Practice Yard','Drill Court','Warriors\' Court','Phoenix Yard'],
                 d:'Once a day: the party trains for a little XP', cost:{stone:15, food:10}}
  };
  const WING_IDS = Object.keys(WINGS);
  const RES_ICON = {timber:'🪵', stone:'🪨', food:'🍲', trade:'💱'};

  function unlocked(){
    return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]);
  }
  window.tributeHouseUnlocked = unlocked;

  function hs(){
    if (!game.tributeHouse) game.tributeHouse = {};
    const h = game.tributeHouse;
    if (!h.wings) h.wings = {};
    if (!h.claim) h.claim = {};
    if (!h.mem) h.mem = {};
    if (typeof h.visits !== 'number') h.visits = 0;
    if (typeof h.visitDay !== 'number') h.visitDay = game.tributeHouseVisitDay || 0;
    return h;
  }
  function wingLv(w){ return hs().wings[w] || 0; }
  function wingTotal(){ return WING_IDS.reduce(function(s, w){ return s + wingLv(w); }, 0); }
  function res(){ game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0}; return game.fairTideResources; }
  function residentsHere(){ return RESIDENTS.filter(function(r){ return !r.eligible || r.eligible(); }); }
  window.tributeHouseResidentIds = function(){ return unlocked() ? residentsHere().map(function(r){ return r.id; }) : []; };

  // ---- rooms and comfort ----
  function roomsTotal(){ return 2 + Math.floor(wingTotal() / 2); }
  function reservedRooms(){ return (game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[80]) ? ROOMS_BEING_LOOKED_AT.length : 0; }
  function roomsTaken(){ return residentsHere().length + reservedRooms(); }
  function comfortTarget(){
    let t = 55 + Math.min(25, Math.round(wingTotal() * 1.2));
    if (roomsTaken() > roomsTotal()) t -= 10;
    return Math.max(0, Math.min(100, t));
  }
  function resRec(id){ return (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[id] : null; }
  function averageHappiness(){
    const list = residentsHere().map(function(r){ return resRec(r.id); }).filter(Boolean);
    if (!list.length) return null;
    return Math.round(list.reduce(function(s, r){ return s + (typeof r.happiness === 'number' ? r.happiness : 60); }, 0) / list.length);
  }
  // Once per new day: happiness drifts up toward the household comfort. Never down.
  function syncHousehold(){
    const h = hs();
    if (typeof h.moodDay !== 'number') { h.moodDay = game.day || 0; return; }
    const steps = Math.min(10, (game.day || 0) - h.moodDay);
    if (steps <= 0) return;
    h.moodDay = game.day;
    const t = comfortTarget();
    residentsHere().forEach(function(r){
      const rec = resRec(r.id);
      if (!rec) return;
      if (typeof rec.happiness !== 'number') rec.happiness = 60;
      if (rec.happiness < t) rec.happiness = Math.min(t, rec.happiness + 3 * steps);
    });
  }

  // ---- wings ----
  function wingCost(w, L){
    const c = {}; Object.keys(WINGS[w].cost).forEach(function(k){ c[k] = WINGS[w].cost[k] * L * L; }); return c;
  }
  function costText(c){ return Object.keys(c).map(function(k){ return RES_ICON[k] + ' ' + c[k]; }).join(' · '); }
  function canAfford(c){ const r = res(); return Object.keys(c).every(function(k){ return (r[k] || 0) >= c[k]; }); }

  window.upgradeTributeWing = function(w){
    if (!unlocked() || !WINGS[w]) return;
    const L = wingLv(w) + 1;
    if (L > WING_MAX) { toast('That wing is complete.'); return; }
    const c = wingCost(w, L);
    if (!canAfford(c)) { toast('Not enough resources.'); return; }
    const r = res(); Object.keys(c).forEach(function(k){ r[k] -= c[k]; });
    hs().wings[w] = L;
    const name = WINGS[w].names[L - 1];
    const line = name + ' at the Tribute House (tended by ' + WINGS[w].tender + ')';
    logEvent('🏡 ' + (L === 1 ? 'Built' : 'Improved') + ': ' + WINGS[w].icon + ' ' + line + '.', 'gold');
    if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry((L === 1 ? 'Built: ' : 'Improved: ') + line + '.', '🏡');
    toast('🏡 ' + (L === 1 ? 'Built' : 'Improved') + ': ' + name);
    syncMemories();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.claimTributeWing = function(w){
    if (!unlocked() || !WINGS[w] || !wingLv(w) || w === 'study') return;
    const h = hs();
    if (h.claim[w] === game.day) { toast('Already done here today.'); return; }
    h.claim[w] = game.day;
    const L = wingLv(w), r = res(), t = WINGS[w].tender;
    let msg;
    if (w === 'apothecary') { const n = 4 + 3 * L; r.food = (r.food || 0) + n; msg = '🌿 ' + t + ' brings in the day\'s herbs and broth: ' + RES_ICON.food + ' Food +' + n + '.'; }
    else if (w === 'workshop') { const a = 3 + 2 * L, b = 2 + 2 * L; r.timber = (r.timber || 0) + a; r.stone = (r.stone || 0) + b; msg = '⚒️ ' + t + ' has the bench busy: ' + RES_ICON.timber + ' Timber +' + a + ', ' + RES_ICON.stone + ' Stone +' + b + '.'; }
    else if (w === 'stables') { const n = 3 + 2 * L; r.trade = (r.trade || 0) + n; msg = '🐴 ' + t + ' hears what the carriers are saying: ' + RES_ICON.trade + ' Trade +' + n + '.'; }
    else if (w === 'yard') {
      const xp = Math.max(1, (typeof level === 'function' ? level() : 1) * L);
      msg = '🥋 ' + t + ' runs the party through drills: +' + xp.toLocaleString() + ' XP.';
      if (typeof gainXP === 'function') gainXP(xp);
    }
    logEvent(msg, 'good'); toast(msg, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // Study: +1% XP per level, through the same channel the Fair Tide roster uses.
  const oldGetRepBonus = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    let v = oldGetRepBonus ? oldGetRepBonus.apply(this, arguments) : 0;
    if (statKey === 'xpBonus' && typeof game !== 'undefined' && game && unlocked()) v += 0.01 * wingLv('study');
    return v;
  };

  // ---- the shared meal and the daily visit ----
  window.shareTributeHouseMeal = function(){
    if (!unlocked()) return;
    const h = hs(), r = res();
    if (h.mealDay === game.day) { toast('The house has already shared a meal today.'); return; }
    if (!residentsHere().length) { toast('No one is living here yet.'); return; }
    if ((r.food || 0) < 10) { toast('A shared meal costs 10 Food.'); return; }
    r.food -= 10; h.mealDay = game.day;
    residentsHere().forEach(function(x){ if (typeof window.adjustResidentHappiness === 'function') window.adjustResidentHappiness(x.id, 8); });
    logEvent('🍲 The Tribute House shares a meal. Everyone is a little brighter.', 'good');
    toast('🍲 The house shares a meal (+8 happiness).');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  const LINES = [
    "The kettle at the Tribute House is already on. Sera doesn't ask who it's for.",
    "A lantern from Lunareth hangs beside the harbor window. Sera says it's for the view.",
    "Sera has pinned a hand-drawn map of Lunareth to the wall, with Fair Tide marked beside it.",
    "Sera is rearranging a shelf by colour. Nobody asked her to, and nobody stops her.",
    "A spare room stands ready with its door open, in case anyone from Tribute needs it.",
    "The house is quiet the way a home is quiet: unhurried, and nobody keeping score."
  ];
  window.visitTributeHouse = function(){
    if (!unlocked()) return;
    const h = hs();
    if (h.visitDay === game.day) { toast('You already stopped by the Tribute House today. Come back tomorrow.'); return; }
    h.visitDay = game.day; game.tributeHouseVisitDay = game.day; h.visits++;
    const line = LINES[Math.floor(Math.random() * LINES.length)];
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    logEvent('🏡 ' + line, 'good');
    toast('🏡 ' + line, 4200);
    syncMemories();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // ---- home memories ----
  function ch(id){ return !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]); }
  const MEMORIES = [
    {id:'lantern', icon:'🏮', t:'A lantern from Lunareth hangs beside the harbor window of the Tribute House. Sera says it is for the view.',
      when:function(){ return hs().visits >= 3; }},
    {id:'sera_shelf', icon:'🌊', t:"A shelf by the window has become Sera's. She decides what goes on it.",
      when:function(){ return ch(81); }},
    {id:'sera_tea', icon:'🍵', t:'A tea set that nobody owned before Sera arrived now has a shelf of its own.',
      when:function(){ const r = resRec('sera'); return !!(r && r.status === 'resident' && (r.bond || 0) >= 60); }},
    {id:'map', icon:'🗺️', t:'A hand-drawn map of Lunareth is pinned beside a chart of Fair Tide.',
      when:function(){ return hs().visits >= 7; }},
    {id:'rooms_open', icon:'🚪', t:'Two rooms upstairs stand with their doors open, kept for Jade and Devon and for Sally and Levi.',
      when:function(){ return ch(80); }},
    {id:'wall_plan', icon:'📐', t:'Someone has marked the wall between two of the rooms on the plan, with a small, rude drawing beside it.',
      when:function(){ return ch(80) && hs().visits >= 2; }},
    {id:'desks', icon:'📚', t:"Devon's study corner has two desks now, and only one of them is tidy.",
      when:function(){ return wingLv('study') >= 1; }},
    {id:'jars', icon:'🌿', t:"Sky's herb jars line the sill, labelled in two different hands.",
      when:function(){ return wingLv('apothecary') >= 1; }},
    {id:'charts', icon:'⚙️', t:"Fen's charts have spread across the workbench, and nobody has been brave enough to move them.",
      when:function(){ return wingLv('workshop') >= 1; }},
    {id:'bow_rack', icon:'🏹', t:"A bow rack hangs by the door. Levi's is the one with the mended string.",
      when:function(){ return wingLv('stables') >= 1; }},
    {id:'yard_patch', icon:'🥋', t:'The practice yard has a worn patch where Jade keeps rehearsing the same turn.',
      when:function(){ return wingLv('yard') >= 1; }},
    {id:'five_wings', icon:'🏡', t:'All five wings stand now, and the Tribute House no longer looks like a place for visitors.',
      when:function(){ return WING_IDS.every(function(w){ return wingLv(w) >= 1; }); }}
  ];
  function syncMemories(){
    if (!unlocked()) return;
    const h = hs();
    MEMORIES.forEach(function(m){
      if (h.mem[m.id] || !m.when()) return;
      h.mem[m.id] = game.day || 1;
      if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(m.t, m.icon);
    });
  }
  window.syncTributeHouse = function(){ if (typeof game === 'undefined' || !game || !unlocked()) return; syncHousehold(); syncMemories(); };

  // ---- rendering ----
  function residentRow(r){
    const rec = resRec(r.id);
    let extra = '';
    if (rec && typeof window.residentHappinessTier === 'function' && typeof window.residentBondTier === 'function') {
      const hh = window.residentHappinessTier(rec), b = window.residentBondTier(rec);
      extra = '<br><span style="font-size:.76rem;opacity:.7;">' + hh.icon + ' Happiness: ' + esc(hh.label) + ' · ' + b.icon + ' Bond with San: ' + esc(b.label) + '</span>';
    }
    let btn = '';
    if (rec && typeof window.canCheckInOnResident === 'function') {
      const can = window.canCheckInOnResident(r.id);
      btn = '<div style="margin-top:6px;"><button class="btn btn-small" onclick="checkInOnResident(\'' + r.id + '\')" ' + (can ? '' : 'disabled') + '>💬 ' + (can ? 'Check In' : 'Checked In Today') + '</button></div>';
    }
    return '<article class="quest-item"><strong>' + r.icon + ' ' + esc(r.name) + '</strong> — <span style="opacity:.8;">' + esc(r.room) + '</span><br>' +
      '<span style="font-size:.8rem;opacity:.8;">' + esc(r.note) + '</span>' + extra + btn + '</article>';
  }

  function wingRow(w){
    const W = WINGS[w], L = wingLv(w);
    const next = L < WING_MAX ? wingCost(w, L + 1) : null;
    const ok = next && canAfford(next);
    const claimed = hs().claim[w] === game.day;
    let btns = '';
    if (next) btns += '<button class="btn btn-small ' + (ok ? 'btn-success' : '') + '" ' + (ok ? '' : 'disabled') + ' onclick="upgradeTributeWing(\'' + w + '\')">' + (L ? 'Improve' : 'Build') + '</button> ';
    if (L && w !== 'study') btns += '<button class="btn btn-small" ' + (claimed ? 'disabled' : '') + ' onclick="claimTributeWing(\'' + w + '\')">' + (claimed ? 'Done today' : (w === 'yard' ? 'Train' : 'Collect')) + '</button>';
    return '<article class="quest-item"><strong>' + W.icon + ' ' + esc(L ? W.names[L - 1] : W.n) + '</strong> ' +
      '<span style="font-size:.76rem;opacity:.7;">Lv ' + L + '/' + WING_MAX + ' · tended by ' + esc(W.tender) + '</span><br>' +
      '<span style="font-size:.78rem;opacity:.8;">' + esc(W.d) + '</span>' +
      (next ? '<br><span style="font-size:.76rem;opacity:.7;">Next, ' + esc(W.names[L]) + ': ' + costText(next) + '</span>' : '') +
      (btns ? '<div style="margin-top:6px;">' + btns + '</div>' : '') + '</article>';
  }

  function renderTributeHouseTab(){
    const el = document.getElementById('ft-tab-tribute_house');
    if (!el) return;
    if (!unlocked()) {
      el.innerHTML = '<div class="panel-title">🏡 The Tribute House</div>' +
        '<p style="font-size:.85rem;opacity:.7;">🔒 Not built yet. It opens when the Crimson Horizon voyage begins.</p>';
      return;
    }
    syncHousehold(); syncMemories();
    const h = hs(), here = residentsHere();
    const avg = averageHappiness();
    const taken = roomsTaken(), total = roomsTotal();
    const crowded = taken > total;
    let html = '<div class="panel-title">🏡 The Tribute House</div>' +
      '<p style="font-size:.8rem;opacity:.7;margin-bottom:10px;">A house at Fair Tide for the people from Tribute who live here. (Working name.)</p>';

    // household
    let mood = '';
    if (avg !== null && typeof window.residentHappinessTier === 'function') { const t = window.residentHappinessTier({happiness: avg}); mood = ' · Household: ' + t.icon + ' ' + esc(t.label); }
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:6px;">Household</div>' +
      '<div style="font-size:.8rem;opacity:.85;">' + taken + ' of ' + total + ' rooms taken' + mood + (crowded ? ' · <span style="color:var(--danger,#e74c3c);">crowded: build a wing</span>' : '') + '</div>' +
      '<div style="font-size:.74rem;opacity:.65;margin:2px 0 6px;">More wings mean more rooms and a more comfortable house. Happiness drifts up toward the house\'s comfort each day.</div>';
    const fed = h.mealDay === game.day;
    html += '<div style="margin-bottom:6px;"><button class="btn btn-small" ' + (fed || !here.length || (res().food || 0) < 10 ? 'disabled' : '') + ' onclick="shareTributeHouseMeal()">🍲 ' + (fed ? 'Shared a meal today' : 'Share a meal (' + RES_ICON.food + ' 10)') + '</button></div>';

    html += '<div class="panel-title" style="font-size:.95rem;margin-top:10px;">Who lives here</div>';
    html += here.length ? here.map(residentRow).join('') : '<div class="story-chip">Nobody yet.</div>';
    if (ch(80)) {
      html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">Rooms being looked at</div>' +
        ROOMS_BEING_LOOKED_AT.map(function(r){
          return '<article class="quest-item"><strong>' + r.icon + ' ' + esc(r.who) + '</strong><br><span style="font-size:.8rem;opacity:.8;">' + esc(r.text) + '</span></article>';
        }).join('') +
        '<p style="font-size:.74rem;opacity:.6;margin:4px 0 0;">They still sail with the Crimson Tide.</p>';
    }

    // wings
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">🏗️ The house and its wings</div>' +
      '<div style="font-size:.74rem;opacity:.65;margin-bottom:4px;">Paid for with Fair Tide\'s stores. Effects are small.</div>' +
      WING_IDS.map(wingRow).join('');

    // memories
    const got = MEMORIES.filter(function(m){ return h.mem[m.id]; });
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">Memories of this house <span style="font-size:.74rem;opacity:.6;">(' + got.length + '/' + MEMORIES.length + ')</span></div>' +
      (got.length ? got.map(function(m){ return '<div style="font-size:.8rem;opacity:.85;margin:3px 0;">' + m.icon + ' ' + esc(m.t) + '</div>'; }).join('')
                  : '<div style="font-size:.78rem;opacity:.6;">Nothing yet. Small details appear as the house fills.</div>');

    // daily visit
    const visited = h.visitDay === game.day;
    html += '<div style="margin-top:12px;">' +
      '<span style="font-size:.8rem;opacity:.8;">Once per day · +3 Fair Tide Mood</span><br>' +
      (visited
        ? '<span style="font-size:.76rem;opacity:.65;">Already stopped by today.</span>'
        : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="visitTributeHouse()">🏡 Stop by the House</button>') +
      '</div>';
    el.innerHTML = html;
  }
  window.renderTributeHouseTab = renderTributeHouseTab;

  // Sera lives here now, so she leaves the Residents list on the Allies & Guests tab.
  const oldHidden = window.residentHiddenFromRosterPanel;
  window.residentHiddenFromRosterPanel = function(id){
    if (unlocked() && RESIDENTS.some(function(r){ return r.id === id; }) && residentsHere().some(function(r){ return r.id === id; })) return true;
    return oldHidden ? oldHidden.apply(this, arguments) : false;
  };

  const oldRenderFairTideHubForTributeHouse = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-tribute_house');
    const btn = document.getElementById('ft-tab-btn-tribute_house');
    if (el) el.classList.toggle('active', tab === 'tribute_house');
    if (btn) btn.classList.toggle('active', tab === 'tribute_house');
    if (oldRenderFairTideHubForTributeHouse) oldRenderFairTideHubForTributeHouse();
    if (tab === 'tribute_house') renderTributeHouseTab();
  };

  // Keep the household and memories current as days pass and chapters are read.
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) window.syncTributeHouse(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
