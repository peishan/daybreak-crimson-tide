(function(){
  // -------------------------------------------------------------------
  // RESIDENT TASK GATES -- N and Sairen.
  //
  // N's fate (rolled at Arc XXVIII Ch.23) comes from her hidden Bond and
  // Happiness, but chapters take no game time and nothing told the player
  // that mattered, so reading straight through gave her a bad outcome by
  // default. Now the next chapter waits at set points until San has done a
  // short task with her, and the Current Objective says what to do and why.
  // Check-ins are once per game day, so this also lets time pass.
  //
  //   N       before Ch.5  check in once            (she arrives at Ch.4)
  //           before Ch.7  give her a job            (work opens after Ch.6)
  //           before Ch.9  check in 2x, collect a wage
  //           before Ch.13 check in 2x
  //           before Ch.17 check in 2x, collect 2 wages (before her big setback)
  //           before Ch.19 check in 2x
  //   Sairen  before Ch.20 check in once             (he arrives at Ch.19, unnamed)
  //           before Ch.22 check in 2x
  //
  // Each gate counts from when it opens, so a save already part-way through
  // starts fresh at the next gate. Gates already passed are never re-applied.
  //
  // SAIREN PAYOFF: how San treated him as a guest is kept on his resident
  // record. It colours a few lines of his Arc XLI decision (Ch.16) and carries
  // into Crimson Horizon as the Bond he starts with as crew.
  // -------------------------------------------------------------------
  const GATES = [
    {id:'n1', who:'n', before:5,  title:'Spend a little time with N', tasks:[{k:'checkins', n:1}]},
    {id:'n2', who:'n', before:7,  title:'Find N a job', tasks:[{k:'job'}]},
    {id:'n3', who:'n', before:9,  title:'Look in on N, and her first wage', tasks:[{k:'checkins', n:2}, {k:'wages', n:1}]},
    {id:'n4', who:'n', before:13, title:'Keep checking in with N', tasks:[{k:'checkins', n:2}]},
    {id:'n5', who:'n', before:17, title:'Stand by N', tasks:[{k:'checkins', n:2}, {k:'wages', n:2}]},
    {id:'n6', who:'n', before:19, title:'Spend time with N', tasks:[{k:'checkins', n:2}]},
    {id:'s1', who:'sairen', before:20, title:'Look in on the quiet guest', tasks:[{k:'checkins', n:1}]},
    {id:'s2', who:'sairen', before:22, title:'Spend time with the quiet guest', tasks:[{k:'checkins', n:2}]}
  ];
  const WHO = {
    n:      {name: 'N', why: 'How you treat her now decides how her story ends. Her Bond and Happiness are what count.'},
    sairen: {name: 'the quiet guest', why: 'How you treat him now is remembered, and carries into his story later.'}
  };

  function cp(){ return game.comicProgress28 || {}; }
  function counts(who){
    game.residentTaskCounts = game.residentTaskCounts || {};
    const c = game.residentTaskCounts[who] = game.residentTaskCounts[who] || {checkins:0, wages:0, jobs:0};
    return c;
  }
  function rec(who){ return (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[who] : null; }
  function present(who){ const r = rec(who); return !!(r && (r.status === 'resident' || r.status === 'working_resident')); }
  function done(){ game.residentGatesDone = game.residentGatesDone || {}; return game.residentGatesDone; }
  function starts(){ game.residentGateStart = game.residentGateStart || {}; return game.residentGateStart; }

  // A gate is active while the chapter it holds back is the next unread one.
  function activeGate(){
    const c = cp();
    for (let i = 0; i < GATES.length; i++) {
      const g = GATES[i];
      if (done()[g.id]) continue;
      if (c[g.before]) { done()[g.id] = true; continue; }          // already past it
      if (!c[g.before - 1]) continue;                              // not reached yet
      if (!present(g.who)) {
        if (typeof window.syncStoryStateNow === 'function') window.syncStoryStateNow();
        if (!present(g.who)) continue;                             // nobody to do the task with
      }
      return g;
    }
    return null;
  }
  function progress(g){
    const base = starts()[g.id] = starts()[g.id] || Object.assign({}, counts(g.who));
    const cur = counts(g.who), r = rec(g.who);
    return g.tasks.map(function(t){
      if (t.k === 'job') return {label: 'Give her a job', have: (r && r.role) || (cur.jobs > (base.jobs || 0)) ? 1 : 0, need: 1};
      const key = t.k;
      const label = key === 'checkins' ? 'Check in with ' + WHO[g.who].name : 'Collect a wage';
      return {label: label, have: Math.min(t.n, (cur[key] || 0) - (base[key] || 0)), need: t.n};
    });
  }
  function met(g){ return progress(g).every(function(p){ return p.have >= p.need; }); }
  function blockingGate(chId){
    const g = activeGate();
    return (g && g.before === chId && !met(g)) ? g : null;
  }
  window.residentTaskGate = function(){ const g = activeGate(); return g && !met(g) ? {gate: g, progress: progress(g)} : null; };
  window.residentGateHint = function(chId){
    const g = blockingGate(chId);
    if (!g) return '';
    return 'First: ' + progress(g).map(function(p){ return p.label.toLowerCase() + ' (' + p.have + '/' + p.need + ')'; }).join(', ') + '.';
  };

  // Hold the next chapter back while a gate is unmet.
  const oldState = window.arc28ObjectiveState;
  if (typeof oldState === 'function') {
    window.arc28ObjectiveState = function(){
      const s = oldState.apply(this, arguments);
      const m = /^complete_arc28_chapter_(\d+)$/.exec(s || '');
      if (m) {
        const g = blockingGate(+m[1]);
        if (g) return 'arc28_task_' + g.id;
      }
      return s;
    };
  }

  // ---- counting the tasks ----
  function wrap(name, fn){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){ return fn(old, this, arguments); };
  }
  wrap('checkInOnResident', function(old, self, args){
    const id = args[0], can = typeof window.canCheckInOnResident === 'function' && window.canCheckInOnResident(id);
    const r = old.apply(self, args);
    if (can && (id === 'n' || id === 'sairen')) counts(id).checkins++;
    after();
    return r;
  });
  wrap('checkInAllResidents', function(old, self, args){
    const due = ['n', 'sairen'].filter(function(id){ return present(id) && window.canCheckInOnResident(id); });
    const r = old.apply(self, args);
    due.forEach(function(id){ counts(id).checkins++; });
    after();
    return r;
  });
  wrap('collectResidentWages', function(old, self, args){
    const id = args[0], can = typeof window.canCollectResidentWages === 'function' && window.canCollectResidentWages(id);
    const r = old.apply(self, args);
    if (can && id === 'n') counts('n').wages++;
    after();
    return r;
  });
  wrap('assignResidentWork', function(old, self, args){
    const id = args[0], had = rec(id) && rec(id).role;
    const r = old.apply(self, args);
    if (id === 'n' && !had && rec('n') && rec('n').role) counts('n').jobs++;
    after();
    return r;
  });

  // ---- telling the player ----
  function told(){ game.residentGateTold = game.residentGateTold || {}; return game.residentGateTold; }
  function announce(){
    const g = activeGate();
    if (!g) return;
    if (met(g)) {
      if (!told()[g.id + '_met']) { told()[g.id + '_met'] = true; if (typeof window.notify === 'function') window.notify({icon:'📖', title: WHO[g.who].name === 'N' ? 'N’s story can go on' : 'The story can go on', text: 'Chapter ' + g.before + ' is ready to read.', kind:'info'}); }
      return;
    }
    if (!told()[g.id]) {
      told()[g.id] = true;
      if (typeof window.notify === 'function') window.notify({icon: g.who === 'n' ? '💫' : '🎭', title: g.title, text: WHO[g.who].why, kind:'info', duration: 6500});
    }
  }
  function after(){
    try { announce(); if (typeof saveGameQuiet === 'function') saveGameQuiet(); if (typeof renderMainGoal === 'function') renderMainGoal(); if (typeof renderStory === 'function') renderStory(); } catch(e) {}
  }

  // The Current Objective card.
  const oldGoal = window.renderMainGoal;
  if (typeof oldGoal === 'function') {
    window.renderMainGoal = function(){
      const r = oldGoal.apply(this, arguments);
      try {
        const t = window.residentTaskGate();
        const el = document.getElementById('mainGoalPanel');
        if (t && el) {
          const atFT = game.location === 'fair_tide';
          const lines = t.progress.map(function(p){ return (p.have >= p.need ? '✓ ' : '○ ') + p.label + ' (' + p.have + '/' + p.need + ')'; }).join(' · ');
          const button = atFT
            ? '<button class="btn btn-small btn-magic" onclick="goScreen(\'fairtide\'); switchFairTideTab(\'allies\')">🤝 Open Allies & Guests</button>'
            : '<button class="btn btn-small btn-magic" onclick="sailTo(\'fair_tide\')">⛵ Sail to Fair Tide</button>';
          el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ' + esc(t.gate.title) + '</div>' +
            '<div class="ct-goal-text">' + esc(lines) + '<br>' + esc(WHO[t.gate.who].why) + ' Check-ins are once a day, so give it a little time.</div>' +
            '<div style="margin-top:6px;">' + button + '</div><div class="ct-goal-optional">Chapter ' + t.gate.before + ' opens once this is done.</div>';
        }
      } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive && game.comicProgress28) announce(); } catch(e) {}
      return r;
    };
  }

  // ---- Sairen's treatment is remembered ----
  function sairenTier(){
    game.sairenGuestTier = game.sairenGuestTier || (function(){
      const r = rec('sairen'), b = (r && typeof r.bond === 'number') ? r.bond : 50;
      return b >= 60 ? 'warm' : (b >= 40 ? 'steady' : 'distant');
    })();
    return game.sairenGuestTier;
  }
  const TIER_LINE = {
    warm: 'He stops at the door before he goes on. "You asked how I was doing, back at Fair Tide, when I was nobody you had a reason to ask about. I never said anything." A short pause. "It mattered."',
    steady: 'He takes the chair she offers, which he has never done before. "You left the door open for me, back at Fair Tide," he says. "I noticed."',
    distant: 'He keeps the table between them, the way he used to. "You gave me room, at Fair Tide. I never knew whether I had earned it," he says. "I\'d like to find out."'
  };
  window.sairenGuestTier = sairenTier;
  const scenes = window.ARC41_CHAPTER_SCENES;
  if (scenes && typeof scenes[16] === 'string') {
    const base = scenes[16];
    Object.defineProperty(scenes, '16', {configurable: true, enumerable: true,
      get: function(){ return base.replace('<br><br>Later, predictably,', '<br><br>' + TIER_LINE[sairenTier()] + '<br><br>Later, predictably,'); },
      set: function(v){ Object.defineProperty(scenes, '16', {value: v, writable: true, configurable: true, enumerable: true}); }});
  }
  // Joining the crew: he keeps the Bond and Happiness he earned as a guest.
  const oldRecruit = window.grantSairenRecruitIfDue;
  if (typeof oldRecruit === 'function') {
    window.grantSairenRecruitIfDue = function(chapterId){
      const had = game.foundCompanions && game.foundCompanions.sairen;
      const r = oldRecruit.apply(this, arguments);
      try {
        const s = rec('sairen');
        if (!had && game.foundCompanions && game.foundCompanions.sairen && s) {
          s.status = 'crew'; s.awayLocation = null; s.awayCompanion = null; s.relationship = 'Fair Tide Crew'; s.trust = 'Earned';
          if (!game.sairenCrewLogged) { game.sairenCrewLogged = true; if (typeof window.logResidentArrivalDeparture === 'function') window.logResidentArrivalDeparture(s, 'join', 'Joins Fair Tide\'s crew for good.'); }
        }
      } catch(e) {}
      return r;
    };
  }
})();
