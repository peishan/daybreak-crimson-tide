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
  // (the chapters keep her with the medical team) -- shown as a line on their resident card. Narrative only.
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

  // Crimson Horizon Arc XI: Hugh comes to Fair Tide to see Sera (Ch.101 id 103 -> back to Lunareth after Ch.108 id 109).
  const SEQUEL_VISITS = [
    {key:'s11_hugh', ids:['hugh'], arrive:103, depart:109, away:'Lunareth', awayCompanion:'Family', inNote:'Visits Fair Tide to see Sera.'},
    // Arc XII: Eve visits with her daughters (Ch.120, id 121) between her usual palace and manor stays. She
    // stays until Ch.122 (id 123) AND the archive copies scene (Ch.121, id 122: the Pearl team asked for her
    // eye) are both read, so the optional scene is never lost. Her daughters are playroom guests meanwhile.
    {key:'s12_eve', ids:['eve'], arrive:121, depart:123, also:[122], away:'Tribute Palace', awayCompanion:'Her daughters', kid:'adrian_eve_daughters',
     inNote:'Visits Fair Tide with her daughters.', holdNote:"Staying on a little longer at the Pearl team's request, to look over two copies of the Core Keeper parchment."},
    // Arc XIII: Hugh comes for breakfast on the day he and Sera agreed (Ch.130, id 131) and stays for the first
    // appointment together (Ch.131, id 132); he leaves once Ch.132 (id 133) is read.
    {key:'s13_hugh', ids:['hugh'], arrive:131, depart:133, away:'Lunareth', awayCompanion:'Family', inNote:'Comes to Fair Tide for breakfast with Sera, as promised.'},
    // Arc XV: Jenika brings Sky's son for a short family visit (Ch.153, id 154) and leaves after Ch.155 (id 156).
    {key:'s15_jenika', ids:['jenika'], arrive:154, depart:156, away:'Lunareth', awayCompanion:'Their son', kid:'sky_jenika_son', inNote:'Visits Fair Tide with their son, to see Sky.'},
    // Arc XVI: Eve is at Fair Tide for the length of the voyage to Dragonvale (from Ch.157, id 158), and Adrian joins her
    // when the family letters arrive (Ch.169, id 170). Both go home once Ch.170 (id 171) is read.
    {key:'s16_eve', ids:['eve'], arrive:158, depart:171, away:'Tribute Palace', awayCompanion:'Her daughters', inNote:'Stays at Fair Tide while the crew is away in Dragonvale.'},
    {key:'s16_adrian', ids:['adrian'], arrive:170, depart:171, away:'Tribute Palace', awayCompanion:'Eve', inNote:'Joins Eve at Fair Tide to read the girls’ letters.'}
  ];
  window.SEQUEL_VISITS = SEQUEL_VISITS;

  // Cold Spring (the Fountain of Youth) lines for the resident card. Only the
  // Canon Five (Tribute ch.960-964) and Hugh and Sera (Arc XLII Ch.27, "The
  // Cooling Spring") are shown at the spring in the chapters. For everyone else
  // it happened off the page, at San's invitation, so their card says they MAY have taken
  // the waters, and once the sequel has begun the women who are expecting there (Fen, Eve,
  // Mirelle) get a line about the pregnancy after it. Jenika's follows the chapters:
  // her visit is with the medical team (Ch.34-35, Tribute 955/975).
  const SPRING_ON_PAGE = ['jade','devon','sky','levi','sally','hugh','sera'];
  const EXPECTING_NOTE = { fen: 'She is expecting Aster\'s child.', eve: 'She is expecting Adrian\'s child.', mirelle: 'She is expecting Rheon\'s child.' };
  // Who they are to each other (shown on the Residents card instead of the generic "Visiting Friend").
  const RELATION = {
    adrian:  'Eve\'s husband · Jade\'s brother',
    eve:     'Adrian\'s wife · Hugh\'s sister',
    rheon:   'King of Altan · Mirelle\'s husband · Sera\'s older brother',
    mirelle: 'Queen of Altan · Rheon\'s wife · Devon\'s trusted ally',
    aster:   'King of Dragonvale · Fen\'s husband',
    fen:     'Queen of Dragonvale · Aster\'s wife',
    roc:     'Delilah\'s husband · Devon\'s twin brother',
    delilah: 'Roc\'s wife · Devon\'s sister-in-law',
    hugh:    'Sera\'s partner · Eve\'s brother',
    sera:    'Hugh\'s partner · Rheon\'s younger sister'
  };
  function sequelBegun(){ return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]); }
  function springNote(id){
    if (id === 'jenika') return (game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[155])
      ? '♨️ Drank from the Fountain on an earlier visit, and told Sky only years later, on this one.'
      : 'Spent her visit with Fair Tide\'s medical team, comparing notes.';
    if (SPRING_ON_PAGE.indexOf(id) !== -1) return '♨️ Took the waters at the Cold Spring, the Fountain of Youth.';
    // Mirelle was rejuvenated in Lunareth; the spring has now given her a second rejuvenation
    if (id === 'mirelle') return '♨️ Rejuvenated in Lunareth, and the Fountain of Youth has now given her a second rejuvenation.' + (sequelBegun() ? ' ' + EXPECTING_NOTE.mirelle : '');
    // off the page: it may have happened, at San's invitation
    return '♨️ May have taken the waters at the Cold Spring, the Fountain of Youth.' +
      ((EXPECTING_NOTE[id] && sequelBegun()) ? ' ' + EXPECTING_NOTE[id] : '');
  }

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
      relationship: RELATION[id] || 'Visiting Friend', trust: 'Established', traits: []
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
        if (RELATION[id] && (!rec.relationship || rec.relationship === 'Visiting Friend')) rec.relationship = RELATION[id];
        if (wasNew) changed = true;
        const names = v.ids.filter(function(o){ return o !== id; }).map(function(o){ return cast(o).name; });
        logOnce(v.key + ':' + id + ':in', rec, 'join', 'Visits Fair Tide' + (names.length ? ' with ' + names.join(', ') : '') + '.');
        if (over) {
          if (rec.status !== 'departed') changed = true;
          rec.status = 'departed'; rec.awayLocation = v.away; rec.awayCompanion = names.length ? names.join(', ') : 'Family';
          // Cold Spring note (see springNote). Jade and Devon's first, short visit (g1a)
          // ended before the spring came up.
          if (v.key !== 'g1a') { const n = springNote(id); if (n) rec.note = n; else delete rec.note; }
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
      rec.status = 'resident'; rec.awayLocation = null; rec.awayCompanion = null; rec.room = 'Tribute House';
    }
    // Sequel visits (Crimson Horizon progress): [chapter id the visit starts, chapter id it ends].
    SEQUEL_VISITS.forEach(function(v){
      if (!(ch && ch[v.arrive])) return;
      const over = !!ch[v.depart] && (v.also || []).every(function(c){ return !!ch[c]; });
      v.ids.forEach(function(id){
        const wasNew = !window.fairTideResidentsState()[id];
        const rec = ensure(id);
        if (wasNew) changed = true;
        logOnce(v.key + ':' + id + ':in', rec, 'join', v.inNote);
        if (over) {
          if (rec.status !== 'departed') changed = true;
          rec.status = 'departed'; rec.awayLocation = v.away; rec.awayCompanion = v.awayCompanion || rec.awayCompanion;
          logOnce(v.key + ':' + id + ':out', rec, 'leave', 'Returns to ' + v.away + '.');
          if (v.holdNote) { const sn = springNote(id); if (sn) rec.note = sn; else delete rec.note; }
        } else {
          if (rec.status !== 'resident') changed = true;
          rec.status = 'resident'; rec.awayLocation = null; rec.awayCompanion = null;
          if (v.holdNote) { if (ch[v.depart]) rec.note = v.holdNote; else delete rec.note; }
        }
      });
      // Children who come with a visitor stay in the Tribute House playroom while the visit lasts.
      if (v.kid && typeof window.setTributeNurseryGuest === 'function' && typeof window.tributeNurseryGuestPresent === 'function') {
        if (window.tributeNurseryGuestPresent(v.kid) === over) window.setTributeNurseryGuest(v.kid, !over);
      }
    });
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
