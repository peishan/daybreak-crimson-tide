(function(){
  // -------------------------------------------------------------------
  // ARC XXVIII MECHANICS — TEMPORARY RESIDENTS. Deliberately kept OUT of
  // arc28.js itself, same split used since Arc XXIII: arc files only
  // wire story.
  //
  // Per San's own spec: N is a Fair Tide RESIDENT, not a recruited crew
  // member. She never enters ALL_PARTY, never becomes fieldable, never
  // touches the combat party filter. This file builds a small, GENERIC
  // temporary-resident framework (registerTemporaryResident et al.) that
  // N is simply the first user of — per San's own note, Fair Tide can
  // receive refugees, researchers, apprentices, and other temporary
  // guests from Arc XXVIII onward, all through this same system.
  //
  // Three explicit design rules from San's own spec, followed exactly:
  //
  //   1. The player never decides whether N gets charged for something.
  //      Every deduction (Ch.9, Ch.17) and the final account (Ch.18) are
  //      applied automatically the moment their chapter is read — the
  //      same "story decides, player manages consequences" rule already
  //      used for Arc XXVI's Reserves and Arc XXVII's Intelligence.
  //
  //   2. Trust is narrative state, never a grindable meter. There is no
  //      numeric trust stat and no action anywhere in this file that
  //      increases it. "San's Trust: Broken" -> "Unresolved" are two
  //      fixed labels that change exactly once, tied to specific
  //      chapters, never to anything the player repeatedly does.
  //
  //   3. Nothing permanent is investable in a temporary resident. Work
  //      roles pay a flat, fixed wage with no upgrade path and no
  //      resource cost to assign — there is nothing here a player could
  //      sink rare resources into only to lose it at Ch.18.
  //
  // N's own wages are tracked entirely on her OWN ledger and never touch
  // game.gold — per San's spec, that money is hers, not Fair Tide's, so
  // it was never the player's currency to begin with and doesn't vanish
  // from the player's own economy when she leaves with it.
  //
  // HAPPINESS / BOND / ARRIVAL LOG (added per later direction, Whiteout
  // Survival's survivor-mood + join/leave log as the explicit model):
  //   - r.happiness (0-100, visible on the card, Whiteout-style mood
  //     icon) moves only from specific events below (story beats, a work
  //     assignment, a wage collection) — never a free-standing grind.
  //   - r.bond (0-100) started as a hidden numeric feeding N's Ch.23 fate
  //     calculation alone. Per later direction (San wanted "Bond with
  //     San" visible, not just Happiness), it's now ALSO rendered —
  //     tiered (Estranged/Distant/Familiar/Trusted/Close), same as
  //     Happiness, never a raw number. Rule #2 above still holds for the
  //     separate narrative "trust" STRING field ("Broken" -> "Unresolved"
  //     stays fixed, chapter-driven prose); this is the newer, numeric,
  //     now-visible companion to it, not a replacement.
  //   - window.checkInOnResident(id) (below) is the one generic, once-a-
  //     day player action that nudges both Happiness and Bond for ANY
  //     tracked resident — the actual lever that makes a reformed rival's
  //     betrayal risk (rival-disposition.js) something the player can act
  //     on, not just watch happen.
  //   - Every arrival and departure (any resident, not just N) is
  //     recorded to a small dedicated log (fairTideResidentLogState),
  //     rendered as its own "Arrivals & Departures" panel.
  // -------------------------------------------------------------------

  // ===========================================================================
  // GENERIC TEMPORARY RESIDENT FRAMEWORK — reusable for any future guest
  // (refugees, researchers, apprentices, etc.), per San's own note.
  // ===========================================================================
  const RESIDENT_STATUS_LABELS = {
    resident:         'Resident',
    working_resident: 'Working Resident',
    departing:        'Departing Resident',
    departed:         'Departed'
  };
  window.RESIDENT_STATUS_LABELS = RESIDENT_STATUS_LABELS;

  const RESIDENT_TRAITS = {
    charming:  { icon:'✨', label:'Charming',  desc:'Improves visitor and customer interaction — earns a bonus on social work.' },
    delegator: { icon:'😇', label:'Delegator', desc:'Sometimes someone else quietly finishes part of the assigned task.' }
  };
  window.RESIDENT_TRAITS = RESIDENT_TRAITS;

  // HAPPINESS — visible mood meter, Whiteout Survival's survivor mood as
  // the explicit model. Moves only from specific events (see below), not
  // a repeatable grind.
  const RESIDENT_HAPPINESS_TIERS = [
    { threshold:0,  icon:'😢', label:'Miserable'  },
    { threshold:20, icon:'😟', label:'Struggling' },
    { threshold:40, icon:'😕', label:'Uneasy'      },
    { threshold:60, icon:'🙂', label:'Content'     },
    { threshold:80, icon:'🌟', label:'Thriving'    }
  ];
  window.RESIDENT_HAPPINESS_TIERS = RESIDENT_HAPPINESS_TIERS;

  function residentHappinessTier(r){
    const h = (typeof r.happiness === 'number') ? r.happiness : 60;
    let tier = RESIDENT_HAPPINESS_TIERS[0];
    for (let i = 0; i < RESIDENT_HAPPINESS_TIERS.length; i++) {
      if (h >= RESIDENT_HAPPINESS_TIERS[i].threshold) tier = RESIDENT_HAPPINESS_TIERS[i];
    }
    return tier;
  }
  window.residentHappinessTier = residentHappinessTier;

  window.adjustResidentHappiness = function(id, delta){
    const r = residentsState()[id];
    if (!r) return;
    if (typeof r.happiness !== 'number') r.happiness = 60;
    r.happiness = Math.max(0, Math.min(100, r.happiness + delta));
  };

  // BOND — "Bond with San," now visible (tiered, never a raw number —
  // see the header comment above). Still what Ch.23's fate calculation
  // and the reformed-rival betrayal check (rival-disposition.js) read
  // underneath, alongside happiness.
  const RESIDENT_BOND_TIERS = [
    { threshold:0,  icon:'💔', label:'Estranged' },
    { threshold:20, icon:'🙁', label:'Distant'    },
    { threshold:40, icon:'🤝', label:'Familiar'   },
    { threshold:60, icon:'💛', label:'Trusted'    },
    { threshold:80, icon:'💗', label:'Close'      }
  ];
  window.RESIDENT_BOND_TIERS = RESIDENT_BOND_TIERS;

  function residentBondTier(r){
    const b = (typeof r.bond === 'number') ? r.bond : 50;
    let tier = RESIDENT_BOND_TIERS[0];
    for (let i = 0; i < RESIDENT_BOND_TIERS.length; i++) {
      if (b >= RESIDENT_BOND_TIERS[i].threshold) tier = RESIDENT_BOND_TIERS[i];
    }
    return tier;
  }
  window.residentBondTier = residentBondTier;

  window.adjustResidentBond = function(id, delta){
    const r = residentsState()[id];
    if (!r) return;
    if (typeof r.bond !== 'number') r.bond = 50;
    r.bond = Math.max(0, Math.min(100, r.bond + delta));
  };

  // CHECK IN — the one generic, once-a-day player action on this whole
  // framework. Small and deliberately unglamorous (a few rotating flavor
  // lines, no bespoke per-character writing) so it scales to every
  // tracked resident — temporary guest, crew, ally, or reformed rival —
  // without demanding new prose for each one. This is also the direct
  // lever against a reformed rival's betrayal risk: check in enough and
  // nobody ever rolls against them in the first place.
  const CHECK_IN_HAPPINESS_GAIN = 3;
  const CHECK_IN_BOND_GAIN = 2;
  const CHECK_IN_FLAVOR = [
    'A few minutes, nothing more — but it\'s the kind of small thing that adds up.',
    'San makes a point of actually asking how things are going, and means it.',
    'Nothing urgent. Just checking in, the way San tries to with everyone here.',
    'A short conversation, easy and unhurried.'
  ];

  window.canCheckInOnResident = function(id){
    const r = residentsState()[id];
    if (!r) return false;
    if (r.status === 'departed' || r.status === 'departing' || r.status === 'expelled') return false;
    return r.lastCheckInDay !== (game.day || 0);
  };

  window.checkInOnResident = function(id){
    const r = residentsState()[id];
    if (!r || !window.canCheckInOnResident(id)) return;
    r.lastCheckInDay = game.day || 0;
    window.adjustResidentHappiness(id, CHECK_IN_HAPPINESS_GAIN);
    window.adjustResidentBond(id, CHECK_IN_BOND_GAIN);
    const flavor = CHECK_IN_FLAVOR[Math.floor(Math.random() * CHECK_IN_FLAVOR.length)];
    toast('💬 San checks in with ' + (r.name || id) + '. ' + flavor, 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // ARRIVAL / DEPARTURE LOG — Whiteout Survival's join/leave log as the
  // explicit model. Generic: any resident's arrival or departure can be
  // recorded here, not just N's.
  function residentLogState(){
    game.fairTideResidentLog = game.fairTideResidentLog || [];
    return game.fairTideResidentLog;
  }
  window.fairTideResidentLogState = residentLogState;

  window.logResidentArrivalDeparture = function(r, type, note){
    const log = residentLogState();
    log.push({
      icon: r.icon || '👤',
      name: residentDisplayName(r),
      type: type,
      note: note || '',
      day: game.day || 0
    });
    if (log.length > 50) log.shift();
  };

  function residentsState(){
    game.fairTideResidents = game.fairTideResidents || {};
    return game.fairTideResidents;
  }
  window.fairTideResidentsState = residentsState;

  window.temporaryResident = function(id){
    return residentsState()[id] || null;
  };

  // Generic registration -- idempotent, so a chapter-read hook can call
  // this every time its gate is true without double-registering anyone.
  window.registerTemporaryResident = function(id, opts){
    const residents = residentsState();
    if (residents[id]) return residents[id];
    residents[id] = Object.assign({
      id: id,
      status: 'resident',
      role: null,
      earnings: 0,
      personalPurchases: 0,
      fairTideCharge: 0,
      lastWageDay: -1,
      traits: [],
      awayLocation: null,
      awayCompanion: null,
      happiness: 60,
      bond: 50
    }, opts || {});
    return residents[id];
  };

  window.residentAvailableWages = function(id){
    const r = residentsState()[id];
    if (!r) return 0;
    return Math.max(0, r.earnings - r.personalPurchases - r.fairTideCharge);
  };

  // ===========================================================================
  // WORK ASSIGNMENT (Ch.6) — flat, fixed-wage roles with no upgrade path
  // and no resource cost, per San's own "nothing permanent is investable
  // in a temporary resident" rule.
  // ===========================================================================
  const RESIDENT_WORK_ROLES = [
    { key:'market', name:'Market Assistance', icon:'🛍️', social:true,  wagePerDay:14 },
    { key:'supply', name:'Supply Sorting',     icon:'📦', social:false, wagePerDay:12 },
    { key:'tavern', name:'Tavern Helper',      icon:'🍺', social:true,  wagePerDay:14 },
    { key:'port',   name:'Port Work',          icon:'⚓', social:false, wagePerDay:12 }
  ];
  window.RESIDENT_WORK_ROLES = RESIDENT_WORK_ROLES;

  function residentWorkUnlocked(id){
    // N-specific gate for now (Ch.6); a future resident would gate on
    // its own arc's own chapter the same way.
    if (id === 'n') return !!(game.comicProgress28 && game.comicProgress28[6]);
    // The masked guest is never work-assignable -- he's passing through
    // incognito for a handful of chapters, not settling in as a worker.
    if (id === 'sairen') return false;
    // Default FALSE (not true -- see fair-tide-wider-residents.js, which
    // registers every established Fair Tide Roster member and ally
    // through this same framework for their Happiness meter alone).
    // Those already have a real, established role elsewhere; they were
    // never meant to pick up N's flat-wage work-assignment buttons too.
    return false;
  }
  window.residentWorkUnlocked = residentWorkUnlocked;

  window.assignResidentWork = function(id, roleKey){
    const r = residentsState()[id];
    if (!r) return;
    if (!residentWorkUnlocked(id)) return;
    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === roleKey; });
    if (!role) return;
    r.role = roleKey;
    if (r.status === 'resident') r.status = 'working_resident';
    window.adjustResidentHappiness(id, 4);
    toast('🔨 ' + (r.name || id) + ' takes on ' + role.name + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  window.canCollectResidentWages = function(id){
    const r = residentsState()[id];
    if (!r || !r.role) return false;
    if (r.status === 'departed' || r.status === 'departing') return false;
    return r.lastWageDay !== (game.day || 0);
  };

  window.collectResidentWages = function(id){
    const r = residentsState()[id];
    if (!r || !window.canCollectResidentWages(id)) return;
    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === r.role; });
    if (!role) return;
    let wage = role.wagePerDay;
    const charming = r.traits.indexOf('charming') !== -1;
    if (charming && role.social) wage = Math.round(wage * 1.3);
    r.earnings += wage;
    r.lastWageDay = game.day || 0;
    window.adjustResidentHappiness(id, 2);
    // Social roles (tavern/market) put her in front of people, actually
    // talking instead of just working -- that's what nudges bond, not
    // the wage itself.
    if (role.social) window.adjustResidentBond(id, 2);
    let msg = '💰 ' + (r.name || id) + ' earns ' + wage + 'g from ' + role.name + '.';
    const delegator = r.traits.indexOf('delegator') !== -1;
    if (delegator && Math.random() < 0.25) {
      msg = '😇 Someone else quietly finished part of ' + (r.name || id) + '\'s work again — she still collects ' + wage + 'g from ' + role.name + '.';
    }
    toast(msg, 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // ===========================================================================
  // N — the arc's own resident, registered and evolved automatically as
  // her chapters are read. Every state change here is a direct
  // consequence of a story beat, never a player action.
  // ===========================================================================
  function checkNResidentEvents(){
    const cp = game.comicProgress28;
    if (!cp) return;

    // Ch.4 ("Guest of Fair Tide") -- N is registered as a Resident.
    if (cp[4] && !residentsState().n) {
      window.registerTemporaryResident('n', {
        name: 'N',
        icon: '💫',
        room: 'Guest Quarters',
        memory: 'Fragmented',
        relationship: 'Old Friend',
        trust: 'Broken',
        traits: ['charming', 'delegator']
      });
      window.logResidentArrivalDeparture(residentsState().n, 'join', 'Arrives as a guest, an old friend of San\'s.');
      if (typeof logEvent === 'function') logEvent('🏠 N arrives at Fair Tide as a guest.', 'neutral');
    }
    const n = residentsState().n;
    if (!n) return;

    // Ch.9 ("Old Habits") -- the first small, automatic personal-charge
    // event. Applied once, exactly when the chapter itself narrates it.
    // Happiness/bond both take a small hit here -- not punitive, just
    // the first real friction in how she's settling in and in how San
    // reads it.
    if (cp[9] && !game.arc28Ch9ChargeApplied) {
      game.arc28Ch9ChargeApplied = true;
      n.personalPurchases += 8;
      window.adjustResidentHappiness('n', -5);
      window.adjustResidentBond('n', -5);
      if (typeof logEvent === 'function') logEvent('📉 N takes a little more from Fair Tide\'s stores than she\'s earned so far — small, but it adds up.', 'bad');
    }

    // Ch.17 ("This Isn't Brunei") -- a second, larger charge event, and a
    // real break, not a habit anymore. This is the single biggest hit
    // either stat takes in the whole arc -- by design, so that total
    // neglect of her between here and Ch.23 is what actually drives her
    // toward the worst fate, not this one moment alone.
    if (cp[17] && !game.arc28Ch17ChargeApplied) {
      game.arc28Ch17ChargeApplied = true;
      n.fairTideCharge += 15;
      window.adjustResidentHappiness('n', -25);
      window.adjustResidentBond('n', -25);
      if (typeof logEvent === 'function') logEvent('📉 N spends beyond what she\'s earned again, expecting it to be smoothed over. This time it isn\'t.', 'bad');
    }

    // Ch.18 ("Exactly What You Earned") -- Aisyah's final account,
    // computed automatically and exactly once. The Brunei debt is
    // explicitly NOT deducted here -- per San's own spec, that debt was
    // never Fair Tide's to collect.
    //
    // BUG FIX / DESIGN UPDATE (San's own direction): this used to also
    // flip n.status straight to 'departed' right here, but Ch.19-23 now
    // narrate her staying a few days longer -- newly freed of her work
    // assignment, still physically at Fair Tide, which is where she
    // meets the masked guest below. Settling accounts is her decision to
    // eventually go, not the goodbye itself; the actual departure (and
    // status flip) now happens at Ch.23, alongside his own.
    if (cp[18] && !n.finalAccount) {
      const finalWages = window.residentAvailableWages('n');
      n.finalAccount = {
        earned: n.earnings,
        personalPurchases: n.personalPurchases,
        fairTideCharge: n.fairTideCharge,
        finalWages: finalWages,
        bruneiDebt: 'NOT APPLICABLE'
      };
      n.role = null;
      n.relationship = 'Complicated';
      n.trust = 'Unresolved';
      // Settled fairly, nothing invented or withheld -- a real gesture
      // of good faith, so it moves bond more than the small day-to-day
      // nudges from work and wages do.
      window.adjustResidentBond('n', 8);
      toast('📋 Final Fair Tide Account — N: earned ' + n.earnings + 'g, paid out ' + finalWages + 'g. Old Brunei debt: not applicable.', 4800);
      if (typeof logEvent === 'function') logEvent('📋 N\'s account is settled in full — nothing invented, nothing withheld, and her old Brunei debt left off the ledger entirely, exactly where it belongs.', 'gold');
    }

    // Ch.23 ("Come With Me") -- N actually leaves Fair Tide now, with
    // the masked guest (see checkSairenResidentEvents below). FUTURE
    // HOOK: whichever later arc properly identifies him updates
    // n.awayCompanion from 'Unknown Man' to his real name -- no other
    // change needed here when that happens (see arc29-mechanics.js's
    // Ch.12 classification, which already does exactly this).
    //
    // HIDDEN FATE CALCULATION: her accumulated happiness and bond (see
    // header comment) decide what actually happened to her -- from safe
    // passage down to the worst circumstance, mirroring the exploitation
    // she already survived once at 14. Deliberately NOT surfaced to the
    // player here or anywhere else in this file: n.trueFateKey/Label are
    // only written, for whichever future arc decides to reveal them.
    if (cp[23] && n.status !== 'departed') {
      const happiness = (typeof n.happiness === 'number') ? n.happiness : 60;
      const bond = (typeof n.bond === 'number') ? n.bond : 50;
      const fateScore = Math.round((happiness + bond) / 2);
      let fateKey, fateLabel;
      if (fateScore >= 70)      { fateKey = 'safe_passage';          fateLabel = 'Safe Passage'; }
      else if (fateScore >= 50) { fateKey = 'precarious_but_free';   fateLabel = 'Precarious, But Free'; }
      else if (fateScore >= 30) { fateKey = 'imprisoned_or_bonded';  fateLabel = 'Imprisoned or Indentured'; }
      else                      { fateKey = 'sold_into_servitude';   fateLabel = 'Sold Into Servitude'; }
      n.trueFateScore = fateScore;
      n.trueFateKey = fateKey;
      n.trueFateLabel = fateLabel;
      n.status = 'departed';
      n.awayLocation = 'Unknown';
      n.awayCompanion = 'Unknown Man';
      window.logResidentArrivalDeparture(n, 'leave', 'Leaves Fair Tide with the masked guest.');
      if (typeof logEvent === 'function') logEvent('🚪 N leaves Fair Tide. Her name moves from the active roster to \"Away.\"', 'neutral');
    }
  }

  // ===========================================================================
  // THE MASKED GUEST (Ch.19-23) — San's own direction: the man N meets
  // and spends one night with was always meant to be physically at Fair
  // Tide first, not someone she only meets after she's already gone.
  // Registered through the exact same generic resident framework N
  // herself uses, with one addition: nameKnown:false. His identity is
  // withheld from the PLAYER too, not just narratively from San -- Arc
  // XXVIII's own chapter text (see arc28.js Ch.19-24) never names him
  // either, matching the masked display here exactly. Arc XXIX Ch.12
  // ("The Spy") is where Fair Tide Intelligence -- and the player --
  // finally learns the working name Sairen (see arc29-mechanics.js).
  //
  // Like N, he's a RESIDENT, never a recruited crew member: no role is
  // ever assignable to him (residentWorkUnlocked special-cases him to
  // false, below) -- he's a guest passing through, not someone settling
  // in to work.
  // ===========================================================================
  function checkSairenResidentEvents(){
    const cp = game.comicProgress28;
    if (!cp) return;

    // Ch.19 ("Beautiful and Free") -- he's already a quiet guest by the
    // time N's own days open up; this is simply where the story first
    // gives them a reason to actually cross paths.
    if (cp[19] && !residentsState().sairen) {
      window.registerTemporaryResident('sairen', {
        name: null,
        nameKnown: false,
        icon: '🎭',
        room: 'Guest Quarters',
        memory: '—',
        relationship: 'Stranger',
        trust: 'Unknown',
        traits: ['charming']
      });
      window.logResidentArrivalDeparture(residentsState().sairen, 'join', 'A quiet, unnamed guest.');
    }
    const sairen = residentsState().sairen;
    if (!sairen) return;

    // Ch.23 ("Come With Me") -- he leaves Fair Tide, same moment N does,
    // same masked identity carried into the "Away" record as hers.
    if (cp[23] && sairen.status !== 'departed') {
      sairen.status = 'departed';
      sairen.awayLocation = 'Unknown';
      sairen.awayCompanion = 'N';
      window.logResidentArrivalDeparture(sairen, 'leave', 'Leaves Fair Tide. N goes with him.');
      if (typeof logEvent === 'function') logEvent('🎭 The masked guest leaves Fair Tide. N goes with him.', 'neutral');
    }
  }

  const oldSyncArc1ForArc28Residents = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc28Residents) oldSyncArc1ForArc28Residents();
    checkNResidentEvents();
    checkSairenResidentEvents();
  };

  // ===========================================================================
  // RENDERING — its own panel on the Fair Tide Roster tab (the existing
  // civilian-roster screen), listing active Residents first and any
  // Departed ones afterward in a lighter "Away from Fair Tide" card, per
  // San's own "her portrait doesn't disappear, it just moves" note. Kept
  // in the same screen rather than a separate Codex view to stay within
  // this arc's own scope.
  // ===========================================================================
  // nameKnown defaults to true for any resident that doesn't set it
  // explicitly (every existing one before the masked guest) -- only an
  // explicit nameKnown:false masks the display, same "???" idiom used
  // for unknown locations (clan-settlement-and-sw.js etc.) and
  // undiscovered bestiary/achievement entries elsewhere in this
  // codebase. Without this guard, esc(null) would literally print the
  // text "null" to the player instead of staying hidden.
  function residentDisplayName(r){
    return r.nameKnown === false ? '???' : esc(r.name);
  }

  function renderResidentCard(r){
    const traitBadges = r.traits.map(function(k){
      const t = RESIDENT_TRAITS[k];
      return t ? '<span class="story-chip" title="'+esc(t.desc)+'">'+t.icon+' '+esc(t.label)+'</span>' : '';
    }).join(' ');

    if (r.status === 'departed') {
      return '<article class="quest-item"><strong>'+r.icon+' '+residentDisplayName(r)+'</strong> — <span style="opacity:.75;">Away from Fair Tide</span><br>'+
        '<span style="font-size:.8rem;opacity:.8;">Location: '+esc(r.awayLocation || 'Unknown')+' · Companion: '+esc(r.awayCompanion || 'Unknown')+' · Status: Safe (last known)</span><br>'+
        '<span style="font-size:.78rem;opacity:.7;">Relationship: '+esc(r.relationship)+' · San\'s Trust: '+esc(r.trust)+'</span>'+
        (r.finalAccount ? '<div style="font-size:.76rem;opacity:.65;margin-top:4px;">Final account: earned '+r.finalAccount.earned+'g, paid '+r.finalAccount.finalWages+'g · Old debt: '+esc(r.finalAccount.bruneiDebt)+'</div>' : '')+
        '</article>';
    }

    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === r.role; });
    const wages = window.residentAvailableWages(r.id);
    const happinessTier = residentHappinessTier(r);
    const bondTier = residentBondTier(r);
    let html = '<article class="quest-item"><strong>'+r.icon+' '+residentDisplayName(r)+'</strong> — <span class="story-chip">'+esc(RESIDENT_STATUS_LABELS[r.status] || r.status)+'</span> '+traitBadges+'<br>'+
      '<span style="font-size:.8rem;opacity:.8;">Role: '+(role ? esc(role.name) : 'Unassigned')+' · Room: '+esc(r.room || '—')+' · Memory: '+esc(r.memory || '—')+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.7;">Relationship: '+esc(r.relationship)+' · San\'s Trust: '+esc(r.trust)+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.75;">Happiness: '+happinessTier.icon+' '+esc(happinessTier.label)+' · Bond with San: '+bondTier.icon+' '+esc(bondTier.label)+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.75;">Earnings: '+r.earnings+'g · Available wages: '+wages+'g</span>';

    if (residentWorkUnlocked(r.id)) {
      if (!role) {
        html += '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">'+
          RESIDENT_WORK_ROLES.map(function(w){ return '<button class="btn btn-small" onclick="assignResidentWork(\''+r.id+'\',\''+w.key+'\')">'+w.icon+' '+esc(w.name)+'</button>'; }).join('')+
          '</div>';
      } else {
        const canCollect = window.canCollectResidentWages(r.id);
        html += '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="collectResidentWages(\''+r.id+'\')" '+(canCollect?'':'disabled')+'>💰 '+(canCollect ? 'Collect Wages' : 'Collected Today')+'</button></div>';
      }
    }
    const canCheckIn = window.canCheckInOnResident(r.id);
    html += '<div style="margin-top:6px;"><button class="btn btn-small" onclick="checkInOnResident(\''+r.id+'\')" '+(canCheckIn?'':'disabled')+'>💬 '+(canCheckIn ? 'Check In' : 'Checked In Today')+'</button></div>';
    html += '</article>';
    return html;
  }

  // BUG FIX (San's report — N kept showing up here as "Away from Fair
  // Tide... Status: Safe (last known)" even after Arc XXX resolves her as
  // Missing/Access Revoked, flatly contradicting the separate "N — Case
  // Closed" panel that arc30-mechanics.js renders elsewhere in this same
  // Archive screen): a resident whose own later story has moved them out
  // of "just away for now" doesn't belong in a list whose entire premise
  // is "guests who might still come back." Rather than hardcoding
  // Arc XXX's own logic into this file, this reads an optional, generic
  // hook any later arc can register (residentHiddenFromRosterPanel) — so
  // whichever arc actually knows a resident's story has concluded is the
  // one deciding to hide them, not this one guessing at arc numbers.
  // ARRIVAL / DEPARTURE LOG PANEL — Whiteout Survival's join/leave log as
  // the explicit model. Shown even once every resident has departed or
  // been hidden, same as the log itself persisting regardless of who's
  // currently on the roster.
  function renderResidentArrivalLog(){
    const log = residentLogState();
    if (!log.length) return '';
    const rows = log.slice(-8).reverse().map(function(entry){
      const verb = entry.type === 'join' ? 'arrives at' : 'leaves';
      return '<div style="font-size:.76rem;opacity:.75;padding:2px 0;">Day '+entry.day+' — '+entry.icon+' '+esc(entry.name)+' '+verb+' Fair Tide'+(entry.note ? ' — '+esc(entry.note) : '')+'</div>';
    }).join('');
    return '<div class="panel-title" style="margin-top:16px;">📜 Fair Tide Arrivals & Departures</div>'+
      '<article class="quest-item">'+rows+'</article>';
  }
  window.renderResidentArrivalLog = renderResidentArrivalLog;

  // Scoped to the temporary-guest ladder only (resident/working_resident/
  // departing/departed) -- 'crew' and 'ally' (fair-tide-wider-
  // residents.js) are established Fair Tide people with their own
  // existing displays (the Fair Tide Roster tab, the Wider Ally Network
  // panel) and showing them here too would flatly contradict this
  // panel's own "haven't joined the crew" premise below.
  const TEMPORARY_RESIDENT_STATUSES = ['resident', 'working_resident', 'departing', 'departed'];

  function renderFairTideResidentsPanel(){
    const residents = residentsState();
    const ids = Object.keys(residents).filter(function(id){
      if (TEMPORARY_RESIDENT_STATUSES.indexOf(residents[id].status) === -1) return false;
      return !(typeof window.residentHiddenFromRosterPanel === 'function' && window.residentHiddenFromRosterPanel(id));
    });
    let html = '';
    if (ids.length) {
      html += '<div class="panel-title" style="margin-top:16px;">🏘️ Fair Tide Residents</div>'+
        '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Guests of Fair Tide who haven\'t joined the crew — not everyone who stays here becomes part of San\'s expedition.</p>';
      ids.forEach(function(id){
        html += renderResidentCard(residents[id]);
      });
    }
    html += renderResidentArrivalLog();
    return html;
  }
  window.renderFairTideResidentsPanel = renderFairTideResidentsPanel;

  const oldRenderFairTideHubForResidents = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForResidents) oldRenderFairTideHubForResidents();
    const tab = game.fairTideActiveTab || 'buildings';
    if (tab !== 'roster') return;
    const container = document.getElementById('ft-tab-roster');
    if (!container) return;
    const existing = document.getElementById('fairTideResidentsPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideResidentsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="fairTideResidentsPanelWrap">'+panel+'</div>');
  };
})();
