(function(){
  // -------------------------------------------------------------------
  // STORY TASK GATES for Arc XLII and the Crimson Horizon sequel: the same idea as N's
  // gates (resident-task-gates.js). The next chapter waits at set points until you have done
  // a small task, and the Current Objective says what to do and why. Gates count from when
  // they open (a save part-way through starts fresh) and gates already passed are never
  // re-applied.
  //
  // ARC XLII, "Host the guests": the visitors from Lunareth and Dragonvale stay at Fair Tide
  // for a few chapters. Before the last chapter of each visit you check in with the guests who
  // are there (once each, once a day), so the visits are ones you took part in.
  //
  // CRIMSON HORIZON, "use the trade systems": before each arc after the first, one task from
  // the sequel's trading: sell goods at the port the last arc ended in, finish a delivery
  // contract, or have prices from several ports in your Price Book. Like the level gates, only
  // the START of an arc is held back; once an arc is under way it is never stopped.
  // -------------------------------------------------------------------
  // ---- the gates ----
  const HOST = [
    { id: 'h1', before: 15, ids: ['jade', 'devon'],                          title: 'Host Jade and Devon' },
    { id: 'h2', before: 22, ids: ['jade', 'devon', 'sally', 'levi'],          title: 'Host the four guests' },
    { id: 'h3', before: 28, ids: ['hugh', 'sera'],                            title: 'Host Hugh and Sera' },
    { id: 'h4', before: 33, ids: ['adrian', 'eve'],                           title: 'Host Adrian and Eve' },
    { id: 'h5', before: 36, ids: ['sky', 'jenika'],                           title: 'Host Sky and Jenika' },
    { id: 'h6', before: 38, ids: ['rheon', 'mirelle'],                        title: 'Host Rheon and Mirelle' },
    { id: 'h7', before: 41, ids: ['aster', 'fen', 'roc', 'delilah'],          title: 'Host the Dragonvale guests' }
  ];
  // Sequel arc N (2..14) is held until the task is done. port: where the previous arc ended.
  const TRADE = [
    { id: 't2',  arc: 2,  title: 'Make a first trade run',        tasks: [{ k: 'sell', port: 'harbor_beyond_charts', n: 10 }] },
    { id: 't3',  arc: 3,  title: 'Trade at Storm Shelf',          tasks: [{ k: 'sell', port: 'storm_shelf', n: 20 }] },
    { id: 't4',  arc: 4,  title: 'Take on a delivery contract',   tasks: [{ k: 'contract', n: 1 }] },
    { id: 't5',  arc: 5,  title: 'Trade at the West Gate',        tasks: [{ k: 'sell', port: 'west_gate', n: 20 }] },
    { id: 't6',  arc: 6,  title: 'Learn the coast’s prices',      tasks: [{ k: 'book', n: 6 }] },
    { id: 't7',  arc: 7,  title: 'Trade at Island Harbor',        tasks: [{ k: 'sell', port: 'island_harbor', n: 20 }] },
    { id: 't8',  arc: 8,  title: 'Finish a delivery contract',    tasks: [{ k: 'contract', n: 1 }] },
    { id: 't9',  arc: 9,  title: 'Trade at Channel Island',       tasks: [{ k: 'sell', port: 'channel_island', n: 20 }] },
    { id: 't10', arc: 10, title: 'Trade at Terrace Harbor',       tasks: [{ k: 'sell', port: 'terrace_harbor', n: 20 }] },
    { id: 't11', arc: 11, title: 'Deliver for a merchant',        tasks: [{ k: 'contract', n: 1 }] },
    { id: 't12', arc: 12, title: 'Trade at the Timber Port',      tasks: [{ k: 'sell', port: 'timber_port', n: 20 }] },
    { id: 't13', arc: 13, title: 'Trade at Nestcliff Harbor',     tasks: [{ k: 'sell', port: 'nestcliff_harbor', n: 20 }] },
    { id: 't14', arc: 14, title: 'Trade at Farshore Estuary',     tasks: [{ k: 'sell', port: 'farshore_estuary', n: 20 }] },
    { id: 't15', arc: 15, title: 'Trade at Salt Coast Harbor',    tasks: [{ k: 'sell', port: 'salt_coast_harbor', n: 20 }] },
    { id: 't16', arc: 16, title: 'Trade at Orchard Harbor',       tasks: [{ k: 'sell', port: 'orchard_harbor', n: 20 }] },
    { id: 't17', arc: 17, title: 'Trade at Dragonvale',          tasks: [{ k: 'sell', port: 'dragonvale', n: 20 }] },
    { id: 't18', arc: 18, title: 'Trade at Forest Inlet',         tasks: [{ k: 'sell', port: 'forest_inlet', n: 20 }] },
    { id: 't19', arc: 19, title: 'Trade at Outer Quay Harbor',    tasks: [{ k: 'sell', port: 'outer_quay_harbor', n: 20 }] },
    { id: 't20', arc: 20, title: 'Trade at Winter Harbor',        tasks: [{ k: 'sell', port: 'winter_harbor', n: 20 }] },
    { id: 't21', arc: 21, title: 'Trade at Glass Harbor',         tasks: [{ k: 'sell', port: 'glass_harbor', n: 20 }] },
    { id: 't22', arc: 22, title: 'Trade at Star Cove Harbor',     tasks: [{ k: 'sell', port: 'star_cove_harbor', n: 20 }] },
    { id: 't23', arc: 23, title: 'Trade at Highbridge Harbor',    tasks: [{ k: 'sell', port: 'highbridge_harbor', n: 20 }] },
    { id: 't24', arc: 24, title: 'Trade at Paper Harbor',         tasks: [{ k: 'sell', port: 'paper_harbor', n: 20 }] }
  ];

  // More than one trade task per gate: every gate now asks for delivery contracts as well as selling, and the asks grow with the arcs.
  // A gate with a sell task gets a delivery contract added (1, then 2 from Arc XII); a contract-only gate asks for 2 (3 from Arc XII).
  // Selling asks for more later on (30 from Arc XII, 40 from Arc XVIII). A gate that was already met stays met.
  TRADE.forEach(function(g){
    const hasContract = g.tasks.some(function(t){ return t.k === 'contract'; });
    if (!hasContract) g.tasks.push({ k: 'contract', n: g.arc >= 12 ? 2 : 1 });
    g.tasks.forEach(function(t){
      if (t.k === 'contract' && hasContract) t.n = g.arc >= 12 ? 3 : 2;
      if (t.k === 'sell') t.n = g.arc >= 18 ? 40 : g.arc >= 12 ? 30 : t.n;
    });
    if (g.tasks.length === 1) g.tasks.push({ k: 'sell', port: g.arc <= 4 ? 'harbor_beyond_charts' : g.arc <= 8 ? 'island_harbor' : 'terrace_harbor', n: 20 });
  });

  // MID-ARC GATES (Arc XVIII onward): an arc no longer runs through on story XP alone. After the 5th and
  // the 10th chapter of each arc, the next chapter waits for some trading and a level a little ahead of
  // what the chapters themselves give. Tune here: where the gates fall, the extra levels, the trade needed.
  const MID_FROM_ARC = 18, MID_AFTER_READ = [5, 10], MID_LEVEL_OVER_ARC_GATE = [2, 4], MID_SELL = 30;
  function midGate(next){
    if (next.arc < MID_FROM_ARC) return null;
    const side = sideIds();
    const read = chapterList().filter(function(o){ return o.arc === next.arc && side.indexOf(o.id) === -1 && ch()[o.id]; }).length;
    const k = MID_AFTER_READ.indexOf(read);
    if (k < 0) return null;
    const id = 'm' + next.arc + '_' + (k + 1);
    if (done()[id]) return null;
    const port = typeof window.crimsonHorizonChapterPort === 'function' ? window.crimsonHorizonChapterPort(next.id) : null;
    const lvl = (typeof window.crimsonHorizonArcLevel === 'function' ? window.crimsonHorizonArcLevel(next.arc) : 0) + MID_LEVEL_OVER_ARC_GATE[k];
    const tasks = [];
    if (k === 0 && port && typeof isPortUnlocked === 'function' && isPortUnlocked(port)) { tasks.push({ k: 'sell', port: port, n: MID_SELL }); tasks.push({ k: 'contract', n: 1 }); }
    else tasks.push({ k: 'contract', n: 2 });
    tasks.push({ k: 'level', n: lvl });
    return { id: id, arc: next.arc, mid: true, title: k === 0 ? 'Restock before the next leg' : 'Earn your keep on the water', tasks: tasks };
  }

  function done(){ game.storyGateDone = game.storyGateDone || {}; return game.storyGateDone; }
  function starts(){ game.storyGateStart = game.storyGateStart || {}; return game.storyGateStart; }
  function told(){ game.storyGateTold = game.storyGateTold || {}; return game.storyGateTold; }
  function tc(){ game.storyTaskCounts = game.storyTaskCounts || { soldAt: {}, contracts: 0, visitCheckins: {} }; const c = game.storyTaskCounts; c.soldAt = c.soldAt || {}; c.visitCheckins = c.visitCheckins || {}; return c; }
  function portName(id){ const p = (typeof PORTS !== 'undefined') ? PORTS.find(function(x){ return x.id === id; }) : null; return p ? p.name : id; }
  function personName(id){
    const c = (window.TRIBUTE_CROSSOVER_CAST || []).find(function(x){ return x.id === id; });
    if (c) return c.name;
    const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; });
    return m ? m.name.charAt(0) + m.name.slice(1).toLowerCase() : id.charAt(0).toUpperCase() + id.slice(1);
  }
  function rec(id){ return (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[id] : null; }
  function present(id){ const r = rec(id); return !!(r && (r.status === 'resident' || r.status === 'working_resident')); }
  function cp42(){ return game.comicProgress42 || {}; }
  function ch(){ return game.comicProgressCrimsonHorizon || {}; }

  // ---- which gate is active right now ----
  function hostGate(){
    const c = cp42();
    for (let i = 0; i < HOST.length; i++) {
      const g = HOST[i];
      if (done()[g.id]) continue;
      if (c[g.before]) { done()[g.id] = true; continue; }
      if (!c[g.before - 1]) continue;
      if (!g.ids.some(present)) continue;                 // nobody here to host
      return { kind: 'host', g: g };
    }
    return null;
  }
  function chapterList(){ return window.CRIMSON_HORIZON_CHAPTERS || []; }
  function sideIds(){ return window.CRIMSON_HORIZON_SIDE_IDS || []; }
  // Story-flavoured gates (pilot: Arc XXII). A gate listed here keeps its task, but is dressed as part of the plot: its own title, a line
  // for the Current Objective, and the notice shown when it opens. Gates not listed keep the generic wording.
  const FLAVOUR = {
    t22:   { title: 'Fill the hold for the new crossing',
             text: 'A recently charted crossing means a long haul, and Aisyah will not take a passenger across it with a half-empty hold. Sell some goods at Star Cove Harbor and she will price the run',
             why: 'Aisyah wants the hold earning before anyone is taken across the new crossing.' },
    m22_1: { title: 'Find out what the mountain buys',
             text: 'Before the walk to the far village, Aisyah wants to know what Highbridge Harbor pays for. Sell some goods here and she will know what the temporary boat service can carry back',
             why: 'Aisyah wants a feel for the mountain market before the walk across the gorge.' },
    m22_2: { title: "Carry the village's tea order",
             text: "The far village's pickers have asked for their first leaf to reach Fair Tide while the bridge is down. Take the Village's Tea Order from the Quest Board (or any delivery) and finish it",
             why: "The village's tea order is on the Quest Board once Highbridge Harbor is charted." }
  };
  function flavoured(g){ const f = FLAVOUR[g.id]; return f ? Object.assign({}, g, { title: f.title, flavour: f }) : g; }
  function tradeGate(){
    if (!game.arc42Complete) return null;
    const list = chapterList(), side = sideIds();
    const next = list.find(function(c){ return side.indexOf(c.id) === -1 && !ch()[c.id]; });
    if (!next || next.arc < 2) return null;
    const mg = midGate(next);
    if (mg) return { kind: 'trade', g: flavoured(mg), chapter: next };
    const g = TRADE.find(function(t){ return t.arc === next.arc; });
    if (!g || done()[g.id]) return null;
    if (list.some(function(o){ return o.arc === next.arc && ch()[o.id]; })) { done()[g.id] = true; if (tc().contractsAtLastGate == null || tc().contractsAtLastGate < tc().contracts) tc().contractsAtLastGate = tc().contracts; return null; }   // arc already under way
    // A task at a port you cannot reach cannot be done: skip it.
    if (g.tasks.some(function(t){ return t.port && typeof isPortUnlocked === 'function' && !isPortUnlocked(t.port); })) return null;
    return { kind: 'trade', g: flavoured(g), chapter: next };
  }
  function activeGate(){
    const a = hostGate() || tradeGate();
    // One-time credit: until V614 a finished delivery contract was often not counted (see checkQuestProgress below). Whoever is held
    // at a delivery-contract gate on first load of the fix is credited one contract.
    try {
      if (!game.contractCountFix) {
        if (a && a.kind === 'trade' && a.g.tasks.some(function(t){ return t.k === 'contract'; })) { tc().contracts += 1; game.contractCountFix = true; }
        else if (typeof gameSessionActive !== 'undefined' && gameSessionActive && game.arc42Complete) game.contractCountFix = true;
      }
    } catch(e) {}
    return a;
  }

  // ---- progress ----
  function hostProgress(g){
    const base = starts()[g.id] = starts()[g.id] || Object.assign({}, tc().visitCheckins);
    const here = g.ids.filter(present);
    return here.map(function(id){ return { label: 'Check in with ' + personName(id), have: (tc().visitCheckins[id] || 0) > (base[id] || 0) ? 1 : 0, need: 1 }; });
  }
  function tradeProgress(g){
    const c = tc();
    const base = starts()[g.id] = starts()[g.id] || { soldAt: Object.assign({}, c.soldAt), contracts: c.contracts };
    // a gate that was met stays met
    if (told()[g.id + '_met']) return g.tasks.map(function(t){ return { label: t.k === 'contract' ? 'Finish a delivery contract from the Quest Board' : (t.k === 'sell' ? 'Sell ' + t.n + ' goods at ' + portName(t.port) : (t.k === 'level' ? 'Reach Level ' + t.n : 'Have prices from ' + t.n + ' ports in your Price Book')), have: t.n, need: t.n }; });
    // contracts count from when the previous gate was passed; fixed the first time this gate is looked at, so passing this one does not undo it
    if (base.contractsFrom == null) base.contractsFrom = c.contractsAtLastGate || 0;
    return g.tasks.map(function(t){
      if (t.k === 'sell') return { label: 'Sell ' + t.n + ' goods at ' + portName(t.port), have: Math.min(t.n, (c.soldAt[t.port] || 0) - ((base.soldAt || {})[t.port] || 0)), need: t.n };
      if (t.k === 'level') return { label: 'Reach Level ' + t.n, have: Math.min(t.n, typeof level === 'function' ? level() : 0), need: t.n };
      // Delivery contracts count from the last time a gate was passed (or from the start of the count), not from the moment this
      // gate opened: a contract finished while the previous arc was still being read is not lost.
      if (t.k === 'contract') return { label: 'Finish a delivery contract from the Quest Board', have: Math.min(t.n, c.contracts - base.contractsFrom), need: t.n };
      const ports = Object.keys(game.priceBook || {}).length;
      return { label: 'Have prices from ' + t.n + ' ports in your Price Book', have: Math.min(t.n, ports), need: t.n };
    });
  }
  function progress(a){ return a.kind === 'host' ? hostProgress(a.g) : tradeProgress(a.g); }
  function met(a){ return progress(a).every(function(p){ return p.have >= p.need; }); }
  window.storyTaskGate = function(){ try { if (/^crimson_horizon_renown_gate_/.test(String(window.crimsonHorizonObjectiveState()))) return null; } catch (e) {}   // the Renown gate is shown first
  const a = activeGate(); return a && !met(a) ? { gate: a.g, kind: a.kind, progress: progress(a), chapter: a.kind === 'host' ? a.g.before : (a.chapter && a.chapter.id) } : null; };

  // ---- hold the chapter back ----
  const oldArc42 = window.arc42ObjectiveState;
  if (typeof oldArc42 === 'function') {
    window.arc42ObjectiveState = function(){
      const s = oldArc42.apply(this, arguments);
      const m = /^complete_arc42_chapter_(\d+)$/.exec(s || '');
      if (m) { const a = hostGate(); if (a && a.g.before === +m[1] && !met(a)) return 'arc42_task_' + a.g.id; }
      return s;
    };
  }
  const oldCH = window.crimsonHorizonObjectiveState;
  if (typeof oldCH === 'function') {
    window.crimsonHorizonObjectiveState = function(){
      const s = oldCH.apply(this, arguments);
      if (/^complete_crimson_horizon_chapter_(\d+)$/.test(s || '')) { const a = tradeGate(); if (a && !met(a)) return 'crimson_horizon_task_' + a.g.id; }
      return s;
    };
  }

  // ---- counting ----
  function wrap(name, fn){ const old = window[name]; if (typeof old !== 'function') return; window[name] = function(){ return fn(old, this, arguments); }; }
  wrap('checkInOnResident', function(old, self, args){
    const id = args[0], can = typeof window.canCheckInOnResident === 'function' && window.canCheckInOnResident(id);
    const r = old.apply(self, args);
    if (can) tc().visitCheckins[id] = (tc().visitCheckins[id] || 0) + 1;
    after();
    return r;
  });
  wrap('checkInAllResidents', function(old, self, args){
    const ids = Object.keys(window.fairTideResidentsState ? window.fairTideResidentsState() : {}).filter(function(id){ return present(id) && window.canCheckInOnResident(id); });
    const r = old.apply(self, args);
    ids.forEach(function(id){ tc().visitCheckins[id] = (tc().visitCheckins[id] || 0) + 1; });
    after();
    return r;
  });
  wrap('sellGood', function(old, self, args){
    const id = args[0], loc = game.location, before = Number((game.cargo || {})[id] || 0);
    const r = old.apply(self, args);
    const sold = before - Number((game.cargo || {})[id] || 0);
    if (sold > 0 && id !== 'contraband') { tc().soldAt[loc] = (tc().soldAt[loc] || 0) + sold; after(); }
    return r;
  });
  wrap('checkQuestProgress', function(old, self, args){
    // Quest objects are kept, so a finished one is the object that now says done. (Comparing ids missed it whenever the board
    // refilled itself with the same contract straight away, which it often does.)
    const before = (game.activeQuests || []).filter(function(q){ return q && q.type === 'deliver' && !q.done; });
    const r = old.apply(self, args);
    if (args[0] === 'deliver') {
      const finished = before.filter(function(q){ return q.done === true; }).length;
      if (finished) { tc().contracts += finished; after(); }
    }
    return r;
  });

  // ---- telling the player ----
  function announce(){
    const a = activeGate(); if (!a) return;
    const key = a.g.id;
    if (met(a)) {
      if (!told()[key + '_met']) { told()[key + '_met'] = true; tc().contractsAtLastGate = tc().contracts; if (typeof window.notify === 'function') window.notify({ icon: '📖', title: 'The story can go on', text: 'The next chapter is open.', kind: 'info', duration: 5000 }); }
      return;
    }
    if (!told()[key]) {
      told()[key] = true;
      const why = a.g.flavour ? a.g.flavour.why : a.kind === 'host' ? 'Your guests are here for a few chapters. Spend a little time with them.' : (a.g.mid ? 'The next chapters are waiting on some trade and a few levels. See the Current Objective.' : 'The next arc is waiting on a bit of trade. See the Current Objective.');
      if (typeof window.notify === 'function') window.notify({ icon: a.kind === 'host' ? '🤝' : '⚖️', title: a.g.title, text: why, kind: 'info', duration: 6000 });
    }
  }
  function after(){
    try { announce(); if (typeof saveGameQuiet === 'function') saveGameQuiet(); if (typeof renderMainGoal === 'function') renderMainGoal(); if (typeof renderStory === 'function' && document.querySelector('#storyScreen.active')) renderStory(); } catch(e) {}
  }

  const oldGoal = window.renderMainGoal;
  if (typeof oldGoal === 'function') {
    window.renderMainGoal = function(){
      const r = oldGoal.apply(this, arguments);
      try {
        const t = window.storyTaskGate(), el = document.getElementById('mainGoalPanel');
        if (t && el) {
          const lines = t.progress.map(function(p){ return (p.have >= p.need ? '✓ ' : '○ ') + p.label + (p.need > 1 ? ' (' + p.have + '/' + p.need + ')' : ''); }).join(' · ');
          let text, button;
          if (t.kind === 'host') {
            text = lines + '. Your guests are here for a few chapters, so look in on them. Check-ins are once a day, so give it a little time.';
            button = game.location === 'fair_tide'
              ? '<button class="btn btn-small btn-magic" onclick="goScreen(\'fairtide\'); switchFairTideTab(\'allies\')">🤝 Open Allies &amp; Guests</button>'
              : '<button class="btn btn-small btn-magic" onclick="sailTo(\'fair_tide\')">⛵ Sail to Fair Tide</button>';
          } else {
            const sell = t.gate.tasks.find(function(x){ return x.k === 'sell'; });
            text = t.gate.flavour ? (lines + '. ' + t.gate.flavour.text + '.') : (lines + (t.gate.mid ? '. The next chapters of Arc ' + t.gate.arc + ' open once you have kept the voyage going: trade, and earn XP from the Reach, raids and bounties.' : '. Arc ' + t.gate.arc + ' of the voyage opens once you have done a little trading.'));
            if (sell && game.location !== sell.port) button = '<button class="btn btn-small btn-magic" onclick="sailTo(\'' + sell.port + '\')">⛵ Sail to ' + esc(portName(sell.port)) + '</button>';
            else if (t.gate.tasks.some(function(x){ return x.k === 'contract'; })) button = '<button class="btn btn-small btn-magic" onclick="goScreen(\'tavern\')">📜 Open the Quest Board</button>';
            else button = '<button class="btn btn-small btn-magic" onclick="goScreen(\'port\')">🏛️ Open the Market</button>';
          }
          el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ' + esc(t.gate.title) + '</div><div class="ct-goal-text">' + esc(text) + '</div>' +
            '<div style="margin-top:6px;">' + button + '</div><div class="ct-goal-optional">' + (t.kind === 'host' ? 'Chapter ' + t.chapter : 'The next chapter') + ' opens once this is done.</div>';
        }
      } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) announce(); } catch(e) {}
      return r;
    };
  }
  // The sequel Story panel asks for this notice (crimson-horizon-sequel.js).
  window.storyTaskNoticeHtml = function(){
    const t = window.storyTaskGate(); if (!t || t.kind !== 'trade') return '';
    return '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc ' + t.gate.arc + (t.gate.mid ? ' (next chapters)' : '') + ': ' + esc(t.gate.title) + '</div><div class="story-chapter-sub">' +
      esc(t.progress.map(function(p){ return (p.have >= p.need ? '✓ ' : '○ ') + p.label + (p.need > 1 ? ' (' + p.have + '/' + p.need + ')' : ''); }).join(' · ')) + '</div></div>';
  };
})();
