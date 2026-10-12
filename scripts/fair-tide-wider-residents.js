(function(){
  // -------------------------------------------------------------------
  // WIDER FAIR TIDE HAPPINESS — extends the Arc XXVIII Temporary Resident
  // framework (arc28-mechanics.js: registerTemporaryResident,
  // adjustResidentHappiness/Bond, the shared arrival/departure log) to
  // everyone else San actually has around her, per her own direction
  // that N's happiness/bond system shouldn't be hers alone.
  //
  // Two new status values, added to the same RESIDENT_STATUS_LABELS
  // object arc28-mechanics.js itself exposes:
  //   - 'crew'  — Fair Tide Roster civilians settled in for good (Erma,
  //     Erna, Imah, Nurul, Jeh, SA, Mike, Gino, Wahyu, Dudin, Jorvin, and
  //     any future roster recruit, picked up automatically). This is the
  //     literal "Permanent Resident / Crew" rung of the ladder Arc
  //     XXVIII's own framework never actually reached for anyone (see
  //     this session's Arc XXVIII audit) — these are it.
  //   - 'ally'  — people explicitly established as NOT living at Fair
  //     Tide (Ju, WH, Rahmah, Syafiqah, Lewis and his crew). Kept
  //     mechanically distinct from 'crew' so this never contradicts
  //     fair-tide-ally-network.js's own "never live there" framing.
  //
  // Deliberately excluded from this sweep: Dre and Jovie, who each get
  // San's own dedicated Dre/Joy-style Bond Track instead (hang-out-
  // companions.js) — a deeper relationship system, not this lighter
  // happiness meter. Registering them here too would just be a second,
  // redundant stat nobody asked for.
  //
  // Neither 'crew' nor 'ally' is ever auto-departed here — nothing in
  // this file ever changes someone's status once set, matching their
  // own established stories (nobody's shown signs of leaving).
  //
  // Rendering is deliberately NOT added to arc28-mechanics.js's own
  // "Fair Tide Residents" panel (that panel now explicitly filters to
  // the temporary guest ladder only, for exactly this reason). Instead:
  //   - crew happiness surfaces on the existing Fair Tide Roster cards
  //     (fairtide-buildings-and-arc6.js)
  //   - ally happiness surfaces on the existing Wider Ally Network cards
  //     (fair-tide-ally-network.js)
  // Each group keeps its own established display; this file only backs
  // the data, loaded after arc28-mechanics.js, fairtide-office-
  // network.js, arc5-and-objective-chain.js, and fair-tide-ally-
  // network.js so everything it reads already exists.
  // -------------------------------------------------------------------

  if (window.RESIDENT_STATUS_LABELS) {
    window.RESIDENT_STATUS_LABELS.crew = 'Crew';
    window.RESIDENT_STATUS_LABELS.ally = 'Close Ally';
  }

  // Roster ids that already have their own dedicated Bond Track and
  // should never get a second, redundant happiness/bond record here.
  const WIDER_RESIDENT_EXCLUDE = ['dre', 'jovie'];

  function registerIfNew(id, opts, joinNote){
    if (!id) return;
    if (typeof window.registerTemporaryResident !== 'function') return;
    if (typeof window.fairTideResidentsState !== 'function') return;
    const residents = window.fairTideResidentsState();
    if (residents[id]) return;
    const r = window.registerTemporaryResident(id, opts);
    if (typeof window.logResidentArrivalDeparture === 'function') {
      window.logResidentArrivalDeparture(r, 'join', joinNote || '');
    }
  }

  function syncCrewFromRoster(){
    const roster = game.fairTideRoster || {};
    Object.keys(roster).forEach(function(id){
      if (WIDER_RESIDENT_EXCLUDE.indexOf(id) !== -1) return;
      const m = roster[id];
      registerIfNew(id,
        { name: m.name, icon: m.icon || '👤', status: 'crew', relationship: 'Fair Tide Crew', trust: 'Earned' },
        'Joins Fair Tide\'s crew for good, as ' + (m.role || 'Fair Tide Crew') + '.'
      );
    });
  }

  function syncAllies(){
    if (typeof window.FAIR_TIDE_ALLY_NETWORK === 'undefined') return;
    window.FAIR_TIDE_ALLY_NETWORK.forEach(function(a){
      if (a.eligible && !a.eligible()) return;
      registerIfNew(a.id,
        { name: a.name, icon: a.icon || '🤝', status: 'ally', relationship: 'Ally', trust: 'Trusted' },
        'Becomes one of Fair Tide\'s trusted allies.'
      );
    });
  }

  const oldSyncArc1ForWiderResidents = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForWiderResidents) oldSyncArc1ForWiderResidents();
    syncCrewFromRoster();
    syncAllies();
  };
})();
