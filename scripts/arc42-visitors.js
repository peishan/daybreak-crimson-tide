(function(){
  // -------------------------------------------------------------------
  // ARC XLII VISITORS ARE FAIR TIDE RESIDENTS DURING THEIR STAY.
  //
  // San's correction: the Lunareth/Dragonvale visitors who stay at Fair
  // Tide in Arc XLII (and were taken to the cooling spring, the Fountain
  // of Youth) were residents for the length of their visit. They use the
  // same temporary-resident framework as N (arc28-mechanics.js): they
  // appear in Fair Tide Residents (Allies & Guests tab) with a happiness
  // and bond line and Check In, get an arrival entry in the Arrivals &
  // Departures log when their visit chapter is read, and move to "Away
  // from Fair Tide" with the matching departure entry when it ends.
  //
  // State is derived from game.comicProgress42, so saves that already read
  // these chapters are brought up to date on load. Nothing here touches
  // the Fountain: arc42.js's own note stands that its restorative effects
  // are not activated (they stay narrative).
  //
  // Fountain: everyone who stayed goes to the Cold Spring except Jenika
  // (by choice) -- shown as a line on their resident card. Narrative only.
  //
  // Not work-assignable (the default in residentWorkUnlocked), and no
  // wages: they are guests, not workers.
  //
  // In the sequel only Sera lives in Fair Tide: she is a resident again
  // from the Crimson Horizon Prologue and does not leave. Jade, Devon,
  // Sky, Levi and Sally sail with the Crimson Tide from the Prologue
  // (canon-five.js), so they are hidden from this list once they are crew.
  // -------------------------------------------------------------------

  // [chapter the visit starts at Fair Tide, chapter it ends]
  const VISITS = [
    {key:'g1a', ids:['jade','devon'],                  arrive:11, depart:16, away:'Lunareth'},
    {key:'g1b', ids:['jade','devon','sally','levi'],   arrive:20, depart:23, away:'Lunareth'},
    {key:'g2',  ids:['hugh','sera'],                   arrive:24, depart:30, away:'Lunareth'},
    {key:'g3',  ids:['adrian','eve'],                  arrive:32, depart:33, away:'Lunareth'},
    {key:'g4',  ids:['sky','jenika'],                  arrive:34, depart:36, away:'Lunareth'},
    {key:'g5',  ids:['rheon','mirelle'],               arrive:36, depart:38, away:'Lunareth'},
    {key:'g6a', ids:['aster','fen'],                   arrive:39, depart:41, away:'Dragonvale'},
    {key:'g6b', ids:['roc','delilah'],                 arrive:40, depart:41, away:'Dragonvale'}
  ];
  window.ARC42_VISITS = VISITS;

  function cast(id){
    return (window.TRIBUTE_CROSSOVER_CAST || []).find(function(c){ return c.id === id; }) || {id:id, name:id.charAt(0).toUpperCase() + id.slice(1), icon:'👤'};
  }
  function cp42(){ return game.comicProgress42 || {}; }
  function seen(){ if (!game.arc42VisitLog) game.arc42VisitLog = {}; return game.arc42VisitLog; }
  function logOnce(key, rec, type, note){
    const s = seen();
    if (s[key]) return;
    s[key] = true;
    if (typeof window.logResidentArrivalDeparture === 'function') window.logResidentArrivalDeparture(rec, type, note);
  }

  function ensure(id){
    const residents = window.fairTideResidentsState();
    if (residents[id]) return residents[id];
    const c = cast(id);
    return window.registerTemporaryResident(id, {
      name: c.name, icon: c.icon, room: 'Guest Quarters',
      relationship: 'Visiting Friend', trust: 'Established', traits: []
    });
  }

  window.syncArc42Visitors = function(){
    if (typeof game === 'undefined' || !game || typeof window.fairTideResidentsState !== 'function' || typeof window.registerTemporaryResident !== 'function') return;
    const cp = cp42();
    let changed = false;
    VISITS.forEach(function(v){
      if (!cp[v.arrive]) return;
      const over = !!cp[v.depart];
      v.ids.forEach(function(id){
        const wasNew = !window.fairTideResidentsState()[id];
        const rec = ensure(id);
        if (wasNew) changed = true;
        const names = v.ids.filter(function(o){ return o !== id; }).map(function(o){ return cast(o).name; });
        logOnce(v.key + ':' + id + ':in', rec, 'join', 'Visits Fair Tide' + (names.length ? ' with ' + names.join(', ') : '') + '.');
        if (over) {
          if (rec.status !== 'departed') changed = true;
          rec.status = 'departed'; rec.awayLocation = v.away; rec.awayCompanion = names.length ? names.join(', ') : 'Family';
          // Everyone who stayed took the waters at the Cold Spring (the Fountain of
          // Youth) except Jenika, who skipped it by choice. Jade and Devon's first,
          // short visit (g1a) ended before the spring was visited.
          if (v.key !== 'g1a') rec.note = (id === 'jenika') ? 'Skipped the Cold Spring by choice.' : '♨️ Took the waters at the Cold Spring, the Fountain of Youth.';
          logOnce(v.key + ':' + id + ':out', rec, 'leave', 'Returns to ' + v.away + '.');
        } else {
          if (rec.status !== 'resident') changed = true;
          rec.status = 'resident'; rec.awayLocation = null; rec.awayCompanion = null;
        }
      });
    });
    // The sequel: only Sera lives at Fair Tide.
    const ch = game.comicProgressCrimsonHorizon;
    if (ch && ch[1] && cp[24]) {
      const rec = ensure('sera');
      logOnce('sera:sequel:in', rec, 'join', 'Settles in at Fair Tide.');
      if (rec.status !== 'resident') changed = true;
      rec.status = 'resident'; rec.awayLocation = null; rec.awayCompanion = null; rec.room = 'Guest Quarters';
    }
    if (changed && typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // Once the canon five sail with the Crimson Tide they are crew, not guests.
  const oldHidden = window.residentHiddenFromRosterPanel;
  window.residentHiddenFromRosterPanel = function(id){
    if (['jade','devon','sky','levi','sally'].indexOf(id) !== -1 && game.foundCompanions && game.foundCompanions[id]) return true;
    return oldHidden ? oldHidden.apply(this, arguments) : false;
  };

  ['markArc42ChapterRead', 'markCrimsonHorizonChapterRead'].forEach(function(name){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){
      const r = old.apply(this, arguments);
      try { window.syncArc42Visitors(); } catch(e) {}
      return r;
    };
  });
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) window.syncArc42Visitors(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
