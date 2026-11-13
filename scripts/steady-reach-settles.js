(function(){
  // -------------------------------------------------------------------
  // THE STEADY REACH SETTLES AT FAIR TIDE.
  //
  // arc39.js originally kept Lewis's crew aboard their own ship and in the
  // Wider Ally Network, never relocated. San's later direction: once Arc
  // XXXIX is completed they live at Fair Tide, on the Roster, since the
  // Steady Reach already has its own building there (the Steady Reach tab,
  // fair-tide-steady-reach-building.js).
  //
  // When game.arc39Complete is set (Ch.12, as before; also applied to
  // existing saves that already finished it) all eight join
  // game.fairTideRoster once, flagged by game.steadyReachSettled:
  //   Lewis, Aisy, Elva, Selina, Zul, Jonathan, Wei Liang, Theo.
  // Roles come from the arc's own text (Lewis's first mate, the navigator,
  // supplies and provisions, transport and cargo, correspondence and trade,
  // the ledger, arcane engineering). Their existing resident happiness/
  // bond record (registered as 'ally') is kept and its status becomes
  // 'crew', so nothing resets. They leave the Wider Ally Network panel and
  // show on the Roster tab with the usual happiness line and Check In.
  //
  // Unchanged: Lewis is still the ally captain who posts requests on the
  // board; Chiu May, Suzie and Intan remain in the Wider Ally Network
  // (they are former TM colleagues, not Steady Reach crew).
  // -------------------------------------------------------------------

  const CREW = [
    {id:'lewis',     name:'Lewis',     icon:'⚓',  role:'Captain, The Steady Reach'},
    {id:'aisy',      name:'Aisy',      icon:'🗝️', role:"First Mate, The Steady Reach"},
    {id:'elva',      name:'Elva',      icon:'⚔️', role:'Navigator, The Steady Reach'},
    {id:'selina',    name:'Selina',    icon:'🪢',  role:'Quartermaster, The Steady Reach'},
    {id:'zul',       name:'Zul',       icon:'📦',  role:'Transport & Cargo, The Steady Reach'},
    {id:'jonathan',  name:'Jonathan',  icon:'🌅',  role:'Correspondence & Trade, The Steady Reach'},
    {id:'wei_liang', name:'Wei Liang', icon:'📒',  role:'Purser, The Steady Reach'},
    {id:'theo',      name:'Theo',      icon:'🛠️', role:"Ship's Engineer, The Steady Reach"}
  ];
  window.STEADY_REACH_CREW = CREW;

  function inRoster(id){ return !!(game.fairTideRoster && game.fairTideRoster[id]); }

  // Once on the roster they no longer appear as "Wider Ally Network".
  (window.FAIR_TIDE_ALLY_NETWORK || []).forEach(function(a){
    if (!CREW.some(function(c){ return c.id === a.id; })) return;
    const base = a.eligible;
    a.eligible = function(){ return (!base || base()) && !inRoster(a.id); };
  });

  function allyDesc(id){
    const a = (window.FAIR_TIDE_ALLY_NETWORK || []).find(function(x){ return x.id === id; });
    return a ? a.desc : '';
  }

  window.settleSteadyReachCrewIfDue = function(){
    if (typeof game === 'undefined' || !game || !game.arc39Complete || game.steadyReachSettled) return false;
    game.fairTideRoster = game.fairTideRoster || {};
    const residents = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState() : null;
    CREW.forEach(function(c){
      if (!game.fairTideRoster[c.id]) {
        game.fairTideRoster[c.id] = {
          name: c.name, role: c.role, icon: c.icon,
          desc: allyDesc(c.id) || (c.name + ' sails with The Steady Reach, now berthed at Fair Tide.')
        };
      }
      if (!residents) return;
      const rec = residents[c.id];
      if (rec) {
        // Keep the existing happiness and bond; only the standing changes.
        rec.status = 'crew'; rec.relationship = 'Fair Tide Crew'; rec.trust = 'Earned';
      } else if (typeof window.registerTemporaryResident === 'function') {
        const r = window.registerTemporaryResident(c.id, { name: c.name, icon: c.icon, status: 'crew', relationship: 'Fair Tide Crew', trust: 'Earned' });
        if (typeof window.logResidentArrivalDeparture === 'function') window.logResidentArrivalDeparture(r, 'join', 'Settles at Fair Tide with The Steady Reach.');
      }
      if (rec && typeof window.logResidentArrivalDeparture === 'function') window.logResidentArrivalDeparture(rec, 'join', 'Settles at Fair Tide with The Steady Reach.');
    });
    game.steadyReachSettled = true;
    if (typeof logEvent === 'function') logEvent('⚓ The Steady Reach has made Fair Tide its home port. Lewis and his crew of eight now live here, and are on the Roster.', 'gold');
    if (typeof toast === 'function') toast('⚓ Lewis and the Steady Reach crew have joined Fair Tide\'s roster.', 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return true;
  };

  // The finale chapter, and any refresh/load of a save that already finished Arc XXXIX.
  const oldMark = window.markArc39ChapterRead;
  if (typeof oldMark === 'function') {
    window.markArc39ChapterRead = function(){
      const r = oldMark.apply(this, arguments);
      try { window.settleSteadyReachCrewIfDue(); } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) window.settleSteadyReachCrewIfDue(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
