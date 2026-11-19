(function(){
  // -------------------------------------------------------------------
  // ARC XXI AND ARC XXVI: put the buildings and Reserves to use.
  //
  // Both arcs give the player real systems (Arc XXI's Fair Tide buildings, Arc XXVI's
  // Reserves, Trade Network and Self-Sufficiency tree), but the chapters read the same whether
  // or not the player ever touched them. Now the next chapter waits at set points until the
  // player has used the system that just opened, and the Current Objective says what to do
  // and why. Same idea as the N and Sairen gates.
  //
  // The check is "has this ever been done", read from the system's own state, so a save that
  // is already part-way through (or that used a building early) is never held back for
  // something it has already done, and gates already passed are never re-applied.
  // -------------------------------------------------------------------
  const GATES = [
    // Arc XXI: The Life We Build (each building opens when its chapter is read)
    {id:'c1', arc:21, before:5,  title:'Settle a question at the Council Hall', label:'Resolve a Council decision', need:1, k:'council',
     why:'The first proper Council is about to meet. Fair Tide\'s questions have somewhere to go now, so settle one first.'},
    {id:'c2', arc:21, before:7,  title:'Open the Harbour Office\'s books', label:'Collect the Harbour Office\'s docking fees', need:1, k:'harbour',
     why:'Ships are arriving faster than anyone can log them. Collect the docking fees to see what the Office brings in.'},
    {id:'c3', arc:21, before:9,  title:'See what the Market Quarter earns', label:'Collect the Market Quarter\'s stall fees', need:1, k:'market',
     why:'Trade has a proper place now. See what it brings in before Fair Tide starts organising its supplies.'},
    {id:'c4', arc:21, before:10, title:'Stock the Supply House', label:'Add supplies to the Supply House', need:1, k:'supply',
     why:'The Supply House only helps if something is on its shelves. Put something in before the Workshop opens.'},
    {id:'c5', arc:21, before:13, title:'Put the Workshop to work', label:'Collect the Workshop\'s repair fees', need:1, k:'workshop',
     why:'Caelan has a place and a job now. Collect the repair fees and see what he does with it.'},
    {id:'c6', arc:21, before:14, title:'Read Joy\'s watch report', label:'File the Warden\'s watch report', need:1, k:'wardens',
     why:'Joy keeps Fair Tide safe while everyone is away. Read her report before the routes start to change.'},
    {id:'c7', arc:21, before:17, title:'Prepare a route properly', label:'Confirm an item on the Route Preparation checklist', need:1, k:'routeprep',
     why:'The next time the crew leaves, Fair Tide has to keep running without them. Start the preparation checklist.'},
    // Arc XXVI: The Price of Independence (Reserves open at Ch.6, the Trade Network at Ch.18, Self-Sufficiency at Ch.21)
    {id:'r1', arc:26, before:8,  title:'Top up a Reserve', label:'Requisition supplies for a Reserve', need:1, k:'requisition',
     why:'The ships that stopped coming are starting to be missed. Reserves drain a little every day, so put some back while you can (once a day, 40g).'},
    {id:'r2', arc:26, before:17, title:'Keep the Reserves up', label:'Requisition supplies on 2 different days', need:2, k:'requisition',
     why:'The closed harbour is cutting imports and the Reserves drain twice as fast for a while. Requisitions are once a day, so let a day pass between them.'},
    {id:'r3', arc:26, before:19, title:'Widen the Trade Network', label:'Establish trade partners', need:2, k:'partners',
     why:'Fair Tide cannot lean on a few big partners any more. Aisyah\'s network only helps once the partners are set up (costs gold).'},
    {id:'r4', arc:26, before:22, title:'Start building self-sufficiency', label:'Fund a Self-Sufficiency tier', need:1, k:'selfsuff',
     why:'Caelan is ready to start. Fund the first tier before San goes back to the table.'}
  ];

  function arcCp(arc){ return game['comicProgress' + arc] || {}; }
  function sum(o){ return Object.keys(o || {}).reduce(function(a, k){ return a + (+o[k] || 0); }, 0); }

  // How much of each thing the player has done, read from the systems themselves.
  function have(k){
    try {
      if (k === 'council') return Object.keys(game.councilDecisions || {}).length;
      if (k === 'harbour') return (game.harbourOffice && game.harbourOffice.lastClaimDay >= 0) ? 1 : 0;
      if (k === 'market') return (game.marketQuarter && game.marketQuarter.lastClaimDay >= 0) ? 1 : 0;
      if (k === 'supply') return sum(game.supplyHouseStock) > 0 ? 1 : 0;
      if (k === 'workshop') return (game.workshop && game.workshop.lastClaimDay >= 0) ? 1 : 0;
      if (k === 'wardens') return (game.wardensHall && game.wardensHall.lastClaimDay >= 0) ? 1 : 0;
      if (k === 'routeprep') return Object.keys(game.routePrepChecklist || {}).filter(function(x){ return game.routePrepChecklist[x] === true; }).length;
      if (k === 'requisition') {
        const days = (game.arcPrep && game.arcPrep.requisitions) || 0;
        const ever = (game.fairTideReserves && game.fairTideReserves.lastRequisitionDay >= 0) ? 1 : 0;
        return Math.max(days, ever);
      }
      if (k === 'partners') return Object.keys(game.tradeNetworkPartners || {}).filter(function(x){ return game.tradeNetworkPartners[x]; }).length;
      if (k === 'selfsuff') return Number(game.selfSufficiencyTier || 0);
    } catch(e) {}
    return 0;
  }
  function progress(g){ return {label: g.label, have: Math.min(g.need, have(g.k)), need: g.need}; }
  function met(g){ return have(g.k) >= g.need; }
  function done(){ game.arcPrepDone = game.arcPrepDone || {}; return game.arcPrepDone; }

  // A gate is active while the chapter it holds back is the next unread one.
  function activeGate(){
    for (let i = 0; i < GATES.length; i++) {
      const g = GATES[i], c = arcCp(g.arc);
      if (done()[g.id]) continue;
      if (game['arc' + g.arc + 'Complete']) continue;               // that arc is finished
      if (c[g.before]) { done()[g.id] = true; continue; }
      if (!c[g.before - 1]) continue;
      return g;
    }
    return null;
  }
  function blockingGate(arc, chId){
    const g = activeGate();
    return (g && g.arc === arc && g.before === chId && !met(g)) ? g : null;
  }
  window.arcPrepGate = function(){ const g = activeGate(); return g && !met(g) ? {gate: g, progress: progress(g)} : null; };

  // Hold the next chapter back while a gate is unmet.
  [21, 26].forEach(function(arc){
    const name = 'arc' + arc + 'ObjectiveState', old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){
      const s = old.apply(this, arguments);
      const m = new RegExp('^complete_arc' + arc + '_chapter_(\\d+)$').exec(s || '');
      if (m) { const g = blockingGate(arc, +m[1]); if (g) return 'arc' + arc + '_task_' + g.id; }
      return s;
    };
  });

  // ---- telling the player ----
  function told(){ game.arcPrepTold = game.arcPrepTold || {}; return game.arcPrepTold; }
  function announce(){
    const g = activeGate(); if (!g) return;
    if (met(g)) {
      if (!told()[g.id + '_met']) { told()[g.id + '_met'] = true; if (typeof window.notify === 'function') window.notify({icon:'📖', title:'Chapter ' + g.before + ' can go on', text:'That is done. Open Story to continue.', kind:'info', duration:4500}); }
      return;
    }
    if (!told()[g.id]) {
      told()[g.id] = true;
      if (typeof window.notify === 'function') window.notify({icon: g.arc === 21 ? '🏗️' : '📦', title: g.title, text: g.why, kind:'info', duration:6500});
    }
  }
  function after(){
    try { announce(); if (typeof saveGameQuiet === 'function') saveGameQuiet(); if (typeof renderMainGoal === 'function') renderMainGoal(); if (typeof renderStory === 'function' && document.getElementById('storyScreen') && document.getElementById('storyScreen').classList.contains('active')) renderStory(); } catch(e) {}
  }

  // ---- watching the actions ----
  function wrap(name, counter){
    const old = window[name]; if (typeof old !== 'function') return;
    window[name] = function(){
      const before = counter ? counter.before() : null;
      const r = old.apply(this, arguments);
      try { if (counter && counter.changed(before)) counter.hit(); } catch(e) {}
      after();
      return r;
    };
  }
  ['resolveCouncilDecision', 'claimHarbourFees', 'claimMarketRevenue', 'contributeSupplies', 'claimWorkshopRevenue',
   'claimWardensWatch', 'confirmRoutePrepItem', 'establishTradePartner', 'fundSelfSufficiencyTier'].forEach(function(n){ wrap(n); });
  wrap('requisitionReserve', {
    before: function(){ return game.fairTideReserves ? game.fairTideReserves.lastRequisitionDay : -1; },
    changed: function(b){ return game.fairTideReserves && game.fairTideReserves.lastRequisitionDay !== b && game.fairTideReserves.lastRequisitionDay >= 0; },
    hit: function(){ game.arcPrep = game.arcPrep || {}; game.arcPrep.requisitions = (game.arcPrep.requisitions || 0) + 1; }
  });

  // ---- the Current Objective card ----
  const oldGoal = window.renderMainGoal;
  if (typeof oldGoal === 'function') {
    window.renderMainGoal = function(){
      const r = oldGoal.apply(this, arguments);
      try {
        const t = window.arcPrepGate(), el = document.getElementById('mainGoalPanel');
        if (t && el) {
          const p = t.progress;
          el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ' + esc(t.gate.title) + '</div>' +
            '<div class="ct-goal-text">' + (p.have >= p.need ? '✓ ' : '○ ') + esc(p.label) + (p.need > 1 ? ' (' + p.have + '/' + p.need + ')' : '') + '<br>' + esc(t.gate.why) + '</div>' +
            '<div style="margin-top:6px;"><button class="btn btn-small btn-magic" onclick="goScreen(\'archive\')">📚 Open the Archive</button></div>' +
            '<div class="ct-goal-optional">Chapter ' + t.gate.before + ' opens once this is done.</div>';
        }
      } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive && (game.comicProgress21 || game.comicProgress26)) announce(); } catch(e) {}
      return r;
    };
  }

  // The held-back chapter row says what to do instead of just "follow the Objective".
  const oldStory = window.renderStory;
  if (typeof oldStory === 'function') {
    window.renderStory = function(){
      const r = oldStory.apply(this, arguments);
      try {
        const g = activeGate();
        if (g && !met(g)) {
          const word = g.arc === 21 ? 'Arc XXI' : 'Arc XXVI';
          document.querySelectorAll('#storyContent section').forEach(function(sec){
            const k = sec.querySelector('.story-act-kicker'); if (!k || k.textContent.trim() !== word) return;
            const art = sec.querySelectorAll('article.quest-item')[g.before - 1];
            const chip = art && art.querySelector('.story-chip');
            if (chip) chip.textContent = 'First: ' + g.label.toLowerCase() + (g.need > 1 ? ' (' + Math.min(g.need, have(g.k)) + '/' + g.need + ')' : '') + '.';
          });
        }
      } catch(e) {}
      return r;
    };
  }
})();
