
(function(){
  // -------------------------------------------------------------------
  // ACHIEVEMENTS. Pure recognition, no mechanical reward — matching
  // standard genre convention. Each check function reads existing,
  // already-verified game state rather than introducing new tracking:
  // rival capture (V131/132), companion recruitment (game.foundCompanions,
  // the same flag memberUnlocked() itself reads), and the Bond system's
  // own San/Joel unlock beat (Arc V Ch.4, "Bonded by the Tide").
  //
  // "The Crew Assembles" is scoped to the core canonical cast per San's
  // own earlier reference sheet — San, Joel, Aisyah, Mez, Eliz, Senedra,
  // Zaki, Renn, Erynn, Mimi, Soel — not the additional side-recruits
  // (Iris, KW Liang, Dr. AA, Brada Shah, Ser Aldric, Sister Wren).
  // Flagged as an assumption, easy to widen if San meant everyone.
  //
  // "Romance path unlocked" uses the story beat itself (Arc V Ch.4
  // complete) rather than window.bondTier('san_joel') >= 1 — the latter
  // also requires having actually spent bond points at least once,
  // which felt like an unnecessary extra gate for what's fundamentally
  // a story-milestone achievement, not a mechanical one.
  // -------------------------------------------------------------------
  const CORE_CREW_IDS = ['joel','aisyah','mezstorm','eliz','senedra','zaki','renn','erynn','mimi','soel'];

  function crewAssembled(){
    return CORE_CREW_IDS.every(function(id){
      if (id === 'soel') return (typeof level === 'function' ? level() : 0) >= 10;
      return !!(game.foundCompanions && game.foundCompanions[id]);
    });
  }

  const ACHIEVEMENTS = [
    {id:'old_scores_settled', name:'Old Scores Settled', icon:'🏴‍☠️', desc:"Robin's community service finally started.",
      check: function(){ return !!(game.rivalsCaptured && game.rivalsCaptured.robin); }},
    {id:'no_more_excuses', name:'No More Excuses', icon:'🏴‍☠️', desc:'Jeff ran out of ways to avoid it.',
      check: function(){ return !!(game.rivalsCaptured && game.rivalsCaptured.jeff); }},
    {id:'first_mate', name:'First Mate', icon:'⚔️', desc:'Joel joined the crew.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.joel); }},
    {id:'crew_assembled', name:'The Crew Assembles', icon:'⚓', desc:'The core crew is complete.',
      check: crewAssembled},
    {id:'bonded_by_the_tide', name:'Bonded by the Tide', icon:'💞', desc:"San and Joel's bond became something real.",
      check: function(){ return !!(game.comicProgress5 && game.comicProgress5[4]); }},
    {id:'a_debt_repaid', name:'A Debt Repaid', icon:'🧭', desc:'Lewis joined the fleet as an ally captain.',
      check: function(){ return !!game.lewisAllyCaptain; }},
    {id:'a_world_of_its_own', name:'A World of Its Own', icon:'⚓', desc:'The Unknown Harbour was found — the first place that runs by its own rules, not Veyren\'s.',
      check: function(){ return !!game.harbourDiscovered; }},
    {id:'people_beneath_the_tide', name:'People Beneath the Tide', icon:'🌊', desc:'The sea was not empty after all.',
      check: function(){ return !!game.tideNetworkDiscovered; }},
    {id:'a_different_shape', name:'A Different Shape', icon:'🐾', desc:'A different shape doesn\'t mean a different person.',
      check: function(){ return !!game.clanSettlementDiscovered; }},
    {id:'the_archive_remembers', name:'The Archive Remembers', icon:'🏛️', desc:'A structure suspended beyond the boundary, still transmitting after everything else fell silent.',
      check: function(){ return !!game.archiveDiscovered; }},
    {id:'at_least_you_learned_now', name:'At Least You Learned Now', icon:'❤️', desc:'A disagreement, worked all the way through — and the bond held, stronger for it.',
      check: function(){ return !!(game.sanJoelDisagreement && game.sanJoelDisagreement.learnedFlags && game.sanJoelDisagreement.learnedFlags.indexOf('joel_can_challenge_san') !== -1); }},
    {id:'a_trusted_name', name:'A Trusted Name', icon:'🤝', desc:'The Harbour stopped treating the crew like strangers.',
      check: function(){ return !!(typeof window.harbourState === 'function' && window.harbourState().sections && window.harbourState().sections.trade); }},
    {id:'borrowed_time', name:'Borrowed Time', icon:'⏳', desc:"The Guardian's Trial was cleared, and the Fountain of Youth gave something back.",
      check: function(){ return !!(game.raidsCleared && game.raidsCleared.guardian_trial); }},
    {id:'the_last_ship_shell_need', name:"The Last Ship She'll Ever Need", icon:'⭐', desc:'The Aethon\'s Pride. By the time San sails this one, her name is already legend.',
      check: function(){ return !!(typeof currentVessel === 'function' && currentVessel().id === 'aethons_pride'); }},
    {id:'someone_belonging', name:'Someone Belonging', icon:'👤', desc:'Not a chosen hero — just someone the Archive finally recognized as its own.',
      check: function(){ return !!(game.comicProgress17 && game.comicProgress17[23]); }},

    // -------------------------------------------------------------------
    // EXPANSION PASS — arc completions, individual companion recruits,
    // world discoveries, bond ladders, and the systems built since the
    // original 15 (rival disposition, crafting, bestiary, inter-world
    // expeditions). Every check below reads state that's already
    // maintained elsewhere for its own reason (arcNComplete flags,
    // discovery flags, bondTier, etc.) — nothing new is tracked purely
    // for achievement purposes except game.interworldExpeditionsCompleted
    // (added alongside this, in interworld-expeditions.js), since there
    // was no existing signal at all for "completed at least one crossing"
    // that survives either possible 50/50 arrival outcome.
    // -------------------------------------------------------------------

    // --- Individual companion recruits (crew_assembled above is the
    // all-nine aggregate; these are the same foundCompanions flags, one
    // at a time, matching first_mate's own treatment of Joel) ---
    {id:'recruit_aisyah', name:'The Quartermaster', icon:'🗡️', desc:'Aisyah joined the crew — she knows every port, and every bad deal in it.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.aisyah); }},
    {id:'recruit_eliz', name:'The Ship Healer', icon:'💚', desc:'Eliz joined the crew — mends wounds with light and stubbornness.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.eliz); }},
    {id:'recruit_mezstorm', name:'The Storm Caller', icon:'🌀', desc:'Mezstorm joined the crew, storm-bound bargain broken at last.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.mezstorm); }},
    {id:'recruit_senedra', name:'The Lookout', icon:'🎯', desc:"Senedra joined the crew — her eye spots trouble before it spots you.",
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.senedra); }},
    {id:'recruit_zaki', name:'The Boarding Fighter', icon:'💥', desc:'Zaki joined the crew, out of the prison hulk and fearless as ever.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.zaki); }},
    {id:'recruit_renn', name:'The Arcane Trickster', icon:'🔮', desc:'Renn joined the crew, treating sailing as one enormous magical experiment.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.renn); }},
    {id:'recruit_erynn', name:'The Farseer Descendant', icon:'🧭', desc:'Erynn joined the crew — generations of documented weaknesses mean he rarely has to guess.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.erynn); }},
    {id:'recruit_mimi', name:'The Diviner', icon:'🔮', desc:'Mimi joined the crew, reading the tide for what it remembers and what it hides.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.mimi); }},
    {id:'recruit_soel', name:'The Spirit Cat', icon:'🐾', desc:"Soel chose San, and can't be unchosen.",
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 10; }},

    // --- World discoveries not yet covered above (Arc XVI's four
    // harbours plus the Forest Coast world they all branch from) ---
    {id:'forest_coast_found', name:'A World Worth Exploring', icon:'🌲', desc:'The Forest Coast — the world the Horizon Engine\'s next material came from.',
      check: function(){ return !!game.forestCoastDiscovered; }},
    {id:'dragon_coast_found', name:'What the Dragons Guard', icon:'🐉', desc:'The Dragon Coast — the dragons here are not what the stories say.',
      check: function(){ return !!game.dragonCoastDiscovered; }},
    {id:'mountain_port_found', name:'A Different Kind of Guardian', icon:'🏔️', desc:'The Mountain Port — where the mountain and the sea do business.',
      check: function(){ return !!game.mountainPortDiscovered; }},
    {id:'crystal_coast_found', name:'Another Way', icon:'💎', desc:'The Crystal Coast — where the resource finally surfaces.',
      check: function(){ return !!game.crystalCoastDiscovered; }},
    {id:'old_harbour_found', name:'The Engine Changes', icon:'⚓', desc:'The Old Harbour — the oldest settlement in the region.',
      check: function(){ return !!game.oldHarbourDiscovered; }},

    // --- Bond ladders at their highest tier (san_joel's own first-tier
    // unlock is already "Bonded by the Tide" above — this is the deepest
    // tier of all three tracks, not the first) ---
    {id:'bond_san_joel_max', name:'Two Hearts, One Ship', icon:'💞', desc:"San and Joel's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_joel') >= 4; }},
    {id:'bond_san_crew_max', name:'This Is Home', icon:'👥', desc:'The crew stopped feeling like people San works with, and started feeling like people San lives with.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_crew') >= 4; }},
    {id:'bond_san_trio_max', name:'Kindred Curiosity', icon:'🔮', desc:"Mimi, Renn, and Erynn's endless research finally has San genuinely along for the ride.",
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_trio') >= 4; }},

    // --- Rivals & pirates ---
    {id:'every_captain_named', name:'Every Captain, Named', icon:'🏴‍☠️', desc:'Every fixed rival captain, captured. The waters keep producing more — but these ones are done.',
      check: function(){ return !!(window.ALL_CAPTAIN_KEYS && window.ALL_CAPTAIN_KEYS.length && game.rivalsCaptured && window.ALL_CAPTAIN_KEYS.every(function(k){ return !!game.rivalsCaptured[k]; })); }},
    {id:'a_chance_given', name:'A Chance Given', icon:'🤝', desc:'A captured rival, once served, was given a place at Fair Tide instead of just a fine.',
      check: function(){ return typeof window.rivalDispositionState === 'function' && Object.values(window.rivalDispositionState()).indexOf('retained') !== -1; }},

    // --- Crafting & the bestiary ---
    {id:'first_craft', name:'Trophies Into Gear', icon:'🔨', desc:"A trophy that used to just sit in the hold became something worth carrying.",
      check: function(){ return (game.equipmentInventory||[]).some(function(i){ return i && i.crafted; }); }},
    {id:'bestiary_complete', name:'Every Creature, Recorded', icon:'📖', desc:'Every creature the crew has ever fought, catalogued — no more "???" left in the Bestiary.',
      check: function(){ return typeof window.bestiaryTotals === 'function' && (function(){ const t = window.bestiaryTotals(); return t.total > 0 && t.discovered >= t.total; })(); }},

    // --- Inter-world expeditions ---
    {id:'first_crossing', name:'The Door Opens', icon:'🌌', desc:'The first crossing beyond the Horizon Engine\'s door, there and back again.',
      check: function(){ return (game.interworldExpeditionsCompleted||0) >= 1; }},
    {id:'cataloguing_the_unknown', name:'Cataloguing the Unknown', icon:'🗿', desc:'Every discovery known to exist beyond the Horizon Engine, brought home at least once.',
      check: function(){ return !!(window.INTERWORLD_DESTINATIONS && window.interworldDiscoveryState && (function(){ const state = window.interworldDiscoveryState(); return window.INTERWORLD_DESTINATIONS.every(function(dest){ return dest.discoveries.every(function(d){ return state[d.name] !== undefined; }); }); })()); }},

    // --- The Fountain of Youth, beyond just San and Joel's own trip ---
    {id:'a_gift_shared', name:'A Gift Shared', icon:'⏳', desc:"Five of the crew, rejuvenated — the Fountain wasn't just for the two who found it first.",
      check: function(){ return !!(game.rejuvenated && Object.keys(game.rejuvenated).filter(function(id){ return game.rejuvenated[id]; }).length >= 5); }},

    // --- A level milestone past every arc's own gate (Arc XXIII, the
    // highest current gate, only asks for 345) ---
    {id:'past_every_gate', name:'Past Every Gate', icon:'⭐', desc:'Level 400 — further than any story gate has asked San to go.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 400; }},

    // --- Arc completions, VI through XXIII (Arcs I-V predate the
    // arcNComplete flag convention and don't have a single clean "done"
    // signal to check, so they're not included here). ---
    {id:'arc6_complete', name:'The Price of Freedom', icon:'🕊️', desc:'Power gave San the choice to do better, and she took it.',
      check: function(){ return !!game.arc6Complete; }},
    {id:'arc7_complete', name:'The Farseer', icon:'🔭', desc:'Some knowledge survives generations.',
      check: function(){ return !!game.arc7Complete; }},
    {id:'arc8_complete', name:'Beyond the Known Sea', icon:'🌊', desc:'The world is larger than the map.',
      check: function(){ return !!game.arc8Complete; }},
    {id:'arc9_complete', name:'The Cat Who Was Always There', icon:'🐾', desc:'Some mysteries were beside us all along.',
      check: function(){ return !!game.arc9Complete; }},
    {id:'arc10_complete', name:'The First Horizon', icon:'🌅', desc:'Some horizons must be built before they can be crossed.',
      check: function(){ return !!game.arc10Complete; }},
    {id:'arc11_complete', name:'The World Beyond the Window', icon:'🪟', desc:'Seeing another world is not the same as reaching it.',
      check: function(){ return !!game.arc11Complete; }},
    {id:'arc12_complete', name:'The First Crossing', icon:'🌉', desc:'Every new world begins with someone taking the first step.',
      check: function(){ return !!game.arc12Complete; }},
    {id:'arc13_complete', name:"A World With Its Own Rules", icon:'🏝️', desc:"A world is not a backdrop. It is someone's home.",
      check: function(){ return !!game.arc13Complete; }},
    {id:'arc14_complete', name:'People Beneath the Tide', icon:'🫧', desc:'The sea is not empty. It is home to someone.',
      check: function(){ return !!game.arc14Complete; }},
    {id:'arc15_complete', name:'Shape of a People', icon:'🌗', desc:'A people are more than the shape they take.',
      check: function(){ return !!game.arc15Complete; }},
    {id:'arc16_complete', name:'The Price of Rare Things', icon:'💎', desc:'Just because we can take something, does that mean we should?',
      check: function(){ return !!game.arc16Complete; }},
    {id:'arc17_complete', name:'The Archive Between Worlds', icon:'📜', desc:'Some histories are older than the people who remember them.',
      check: function(){ return !!game.arc17Complete; }},
    {id:'arc18_complete', name:'The Routes Others Want', icon:'🧭', desc:'If we discover a way between worlds, who has the right to decide where it leads?',
      check: function(){ return !!game.arc18Complete; }},
    {id:'arc19_complete', name:'The Worlds We Know', icon:'🌍', desc:'Before anything new — everything they never finished.',
      check: function(){ return !!game.arc19Complete; }},
    {id:'arc20_complete', name:'Forever and Ever', icon:'🏡', desc:'After everything — the people behind the adventures.',
      check: function(){ return !!game.arc20Complete; }},
    {id:'arc20_interlude_complete', name:'In Between', icon:'⏳', desc:'Not every chapter needs a horizon to cross.',
      check: function(){ return !!game.arc20InterludeComplete; }},
    {id:'arc21_complete', name:'The Life We Build', icon:'🏗️', desc:"A home isn't just a place you return to. It's a place that can keep going when you leave.",
      check: function(){ return !!game.arc21Complete; }},
    {id:'arc22_complete', name:'The Child of Fair Tide', icon:'👶', desc:'Something new is growing.',
      check: function(){ return !!game.arc22Complete; }},
    {id:'arc23_complete', name:'The Wider Tide', icon:'🌐', desc:"A home becomes important when people beyond its walls begin to depend on it.",
      check: function(){ return !!game.arc23Complete; }},

    // --- Arc completions, XXIV through XXXVII ---
    {id:'arc24_complete', name:'The People Without Names', icon:'🎭', desc:'A network wider than Fair Tide ever assumed — and San is just "CAPTAIN" to the hands shaping it from a distance.',
      check: function(){ return !!game.arc24Complete; }},
    {id:'arc25_complete', name:"A Friend's Request", icon:'🤝', desc:'Caelan and Joy, a little more willing now to ask each other — and their friends — for help.',
      check: function(){ return !!game.arc25Complete; }},
    {id:'arc26_complete', name:'The Price of Independence', icon:'⚖️', desc:'Nobody really won. Fair Tide is still standing, and it belongs to no one else.',
      check: function(){ return !!game.arc26Complete; }},
    {id:'arc27_complete', name:'The Nameless', icon:'🌑', desc:'Not quite friends. Not yet enemies. The classification was never meant to be reassuring.',
      check: function(){ return !!game.arc27Complete; }},
    {id:'arc28_complete', name:'N', icon:'🔁', desc:'Nobody recognizes the pattern yet. Someone already laid it.',
      check: function(){ return !!game.arc28Complete; }},
    {id:'arc29_complete', name:'The Spy', icon:'🕵️', desc:'"Trust him?" "No." "Her?" "...Not yet."',
      check: function(){ return !!game.arc29Complete; }},
    {id:'arc30_complete', name:'The Betrayal', icon:'🌑', desc:"No trial, no confirmation, no closure. N's story ends. Fair Tide's doesn't.",
      check: function(){ return !!game.arc30Complete; }},
    {id:'arc31_complete', name:'What We Protect', icon:'🏡', desc:'Fair Tide is safe not because nothing can hurt it, but because its people protect each other when something does.',
      check: function(){ return !!game.arc31Complete; }},
    {id:'arc32_complete', name:'The Long Tide', icon:'🌊', desc:'"Feels like we\'re waiting." "We\'re living."',
      check: function(){ return !!game.arc32Complete; }},
    {id:'arc33_complete', name:'The Family We Become', icon:'👪', desc:"Blood, partnership, and the people life kept placing beside one another. The twins aren't here yet. Their family already is.",
      check: function(){ return !!game.arc33Complete; }},
    {id:'arc34_complete', name:'Two Hearts', icon:'💞', desc:"Two children, two distinct signatures, and absolutely no idea when they're coming. Already part of the family.",
      check: function(){ return !!game.arc34Complete; }},
    {id:'arc35_complete', name:'The Children of Fair Tide', icon:'🐾', desc:'"You really knew first." Soel purrs. Vaeren and Joelle are home.',
      check: function(){ return !!game.arc35Complete; }},
    {id:'arc36_complete', name:'Growing Tides', icon:'🌱', desc:'Not through war, not through politics. Two children are simply growing, and the community grows with them.',
      check: function(){ return !!game.arc36Complete; }},
    {id:'arc37_complete', name:'Children of Two Worlds', icon:'🌌', desc:'"Not today." The door stays closed. For now.',
      check: function(){ return !!game.arc37Complete; }}
  ];
  window.ACHIEVEMENTS = ACHIEVEMENTS;

  function achievementRegistry(){ game.achievementsUnlocked = game.achievementsUnlocked || {}; return game.achievementsUnlocked; }
  window.achievementRegistry = achievementRegistry;

  window.checkAchievements = function(){
    const reg = achievementRegistry();
    ACHIEVEMENTS.forEach(function(a){
      if (reg[a.id]) return; // already earned, nothing to do
      if (!a.check()) return;
      reg[a.id] = { day: game.day || 0 };
      toast('🏆 Achievement unlocked: ' + a.name, 4200);
      logEvent('🏆 Achievement unlocked: ' + a.icon + ' ' + a.name + ' — ' + a.desc, 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({ title: '🏆 ' + a.name, blurb: a.desc });
        }, 400);
      }
    });
  };

  const oldRenderMainGoalForAchievements = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForAchievements) oldRenderMainGoalForAchievements();
    window.checkAchievements();
  };

  window.renderAchievementsScreen = function(){
    const container = document.getElementById('achievementsContent');
    if (!container) return;
    const reg = achievementRegistry();
    const earnedCount = ACHIEVEMENTS.filter(a => reg[a.id]).length;
    let html = '<div class="panel"><div class="panel-title">🏆 '+earnedCount+' / '+ACHIEVEMENTS.length+' Earned</div></div>';
    ACHIEVEMENTS.forEach(function(a){
      const earned = !!reg[a.id];
      html += '<article class="quest-item'+(earned?' completed':'')+'" style="'+(earned?'':'opacity:.5;')+'">'+
        '<strong>'+(earned?a.icon:'❔')+' '+(earned?a.name:'???')+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+(earned?a.desc:'Not yet earned.')+'</span>'+
        (earned && reg[a.id].day ? '<br><span style="font-size:.72rem;opacity:.6;">Day '+reg[a.id].day+'</span>' : '')+
        '</article>';
    });
    container.innerHTML = html;
  };

  const oldGoScreenForAchievements = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForAchievements) oldGoScreenForAchievements(name);
    if (name === 'achievements' && typeof window.renderAchievementsScreen === 'function') window.renderAchievementsScreen();
  };
})();
