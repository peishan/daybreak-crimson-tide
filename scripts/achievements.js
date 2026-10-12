
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
    // tier of all three tracks, not the first). Checks read
    // window.BOND_TRACKS[key].tiers.length dynamically rather than a
    // hardcoded index, so a future tier addition (like the one that added
    // tier 5 here) never leaves these firing one tier too early again. ---
    {id:'bond_san_joel_max', name:'Two Hearts, One Ship', icon:'💞', desc:"San and Joel's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_joel') >= window.BOND_TRACKS.san_joel.tiers.length - 1; }},
    {id:'bond_san_crew_max', name:'This Is Home', icon:'👥', desc:'The crew stopped feeling like people San works with, and started feeling like people San lives with.',
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_crew') >= window.BOND_TRACKS.san_crew.tiers.length - 1; }},
    {id:'bond_san_trio_max', name:'Kindred Curiosity', icon:'🔮', desc:"Mimi, Renn, and Erynn's endless research finally has San genuinely along for the ride.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_trio') >= window.BOND_TRACKS.san_trio.tiers.length - 1; }},

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
      check: function(){ return !!game.arc37Complete; }},

    // --- Bond tracks -- started and max, for the 5 companion tracks not already covered above ---
    {id:'bond_san_joy_started', name:'Getting to Know Joy', icon:'🌸', desc:'San and Joy started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_joy') >= 1; }},
    {id:'bond_san_joy_max', name:'Ate Joy', icon:'🌸', desc:"San and Joy's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_joy') >= window.BOND_TRACKS.san_joy.tiers.length - 1; }},
    {id:'bond_san_aisyah_started', name:'Getting to Know Aisyah', icon:'👭', desc:'San and Aisyah started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_aisyah') >= 1; }},
    {id:'bond_san_aisyah_max', name:'Two Sisters, One Ship', icon:'👭', desc:"San and Aisyah's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_aisyah') >= window.BOND_TRACKS.san_aisyah.tiers.length - 1; }},
    {id:'bond_san_mez_started', name:'Getting to Know Mezstorm', icon:'⛈️', desc:'San and Mezstorm started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_mez') >= 1; }},
    {id:'bond_san_mez_max', name:'Pure Chaos Underfoot', icon:'⛈️', desc:"San and Mezstorm's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_mez') >= window.BOND_TRACKS.san_mez.tiers.length - 1; }},
    {id:'bond_san_eliz_started', name:'Getting to Know Eliz', icon:'💚', desc:'San and Eliz started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_eliz') >= 1; }},
    {id:'bond_san_eliz_max', name:'No Complications', icon:'💚', desc:"San and Eliz's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_eliz') >= window.BOND_TRACKS.san_eliz.tiers.length - 1; }},
    {id:'bond_san_senedra_started', name:'Getting to Know Senedra', icon:'🎯', desc:'San and Senedra started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_senedra') >= 1; }},
    {id:'bond_san_senedra_max', name:'Practiced Patience', icon:'🎯', desc:"San and Senedra's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_senedra') >= window.BOND_TRACKS.san_senedra.tiers.length - 1; }},

    // --- Vessel tiers -- every hull between the Sloop and the Aethon's Pride ---
    {id:'vessel_brigantine', name:'Real Cannon Ports', icon:'🚤', desc:'Two masts and real cannon ports. The crew stops flinching at storms.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'brigantine'; }},
    {id:'vessel_galleon', name:'Room to Fight', icon:'🚢', desc:'Broad in the beam, heavy in a fight. Room to bring more of the crew into a fight than ever before.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'galleon'; }},
    {id:'vessel_flagship', name:"San's Flagship", icon:'🏴‍☠️', desc:"The Crimson Tide, once the crew's whole again. Nothing outsails it.",
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'flagship'; }},
    {id:'vessel_war_galleon', name:'Built to Answer Fire', icon:'⚔️', desc:'A true line-of-battle ship. Built to survive cannon fire and answer it.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'war_galleon'; }},
    {id:'vessel_merchantman', name:'A Floating Warehouse', icon:'🏛️', desc:'A floating warehouse with enough sail to keep the trade route moving.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'merchantman'; }},
    {id:'vessel_manowar', name:'Few Command One Well', icon:'💥', desc:'A massive warship. Few captains ever command one, and fewer still command it well.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'manowar'; }},
    {id:'vessel_grand_flagship', name:'Speed, Guns, Cargo, Prestige', icon:'👑', desc:'The Crimson Sovereign: speed, guns, cargo and prestige in one hull.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'grand_flagship'; }},
    {id:'vessel_storm_leviathan', name:'The Sea Makes Way', icon:'🌊', desc:'Built for storms that would sink anything smaller. The sea itself seems to make way.',
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'storm_leviathan'; }},
    {id:'vessel_krakens_reach', name:'Named For What It Survives', icon:'🐙', desc:"Named for what it's built to survive, not what it hunts.",
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'krakens_reach'; }},
    {id:'vessel_horizon_dreadnought', name:'As Much Instrument As Warship', icon:'🌅', desc:"Built alongside the Horizon Engine's own research — as much instrument as warship.",
      check: function(){ return typeof currentVessel === 'function' && currentVessel().id === 'horizon_dreadnought'; }},

    // --- Level milestones (level 400 is already "Past Every Gate" above) ---
    {id:'level_25', name:'Level 25', icon:'⭐', desc:'San reached level 25.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 25; }},
    {id:'level_50', name:'Level 50', icon:'⭐', desc:'San reached level 50.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 50; }},
    {id:'level_75', name:'Level 75', icon:'⭐', desc:'San reached level 75.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 75; }},
    {id:'level_100', name:'Level 100', icon:'⭐', desc:'San reached level 100.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 100; }},
    {id:'level_125', name:'Level 125', icon:'⭐', desc:'San reached level 125.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 125; }},
    {id:'level_150', name:'Level 150', icon:'⭐', desc:'San reached level 150.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 150; }},
    {id:'level_175', name:'Level 175', icon:'⭐', desc:'San reached level 175.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 175; }},
    {id:'level_200', name:'Level 200', icon:'⭐', desc:'San reached level 200.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 200; }},
    {id:'level_225', name:'Level 225', icon:'⭐', desc:'San reached level 225.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 225; }},
    {id:'level_250', name:'Level 250', icon:'⭐', desc:'San reached level 250.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 250; }},
    {id:'level_275', name:'Level 275', icon:'⭐', desc:'San reached level 275.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 275; }},
    {id:'level_300', name:'Level 300', icon:'⭐', desc:'San reached level 300.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 300; }},
    {id:'level_325', name:'Level 325', icon:'⭐', desc:'San reached level 325.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 325; }},
    {id:'level_350', name:'Level 350', icon:'⭐', desc:'San reached level 350.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 350; }},
    {id:'level_375', name:'Level 375', icon:'⭐', desc:'San reached level 375.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 375; }},
    {id:'level_425', name:'Level 425', icon:'⭐', desc:'San reached level 425.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 425; }},
    {id:'level_450', name:'Level 450', icon:'⭐', desc:'San reached level 450.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 450; }},
    {id:'level_475', name:'Level 475', icon:'⭐', desc:'San reached level 475.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 475; }},
    {id:'level_500', name:'Level 500', icon:'⭐', desc:'San reached level 500.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 500; }},
    {id:'level_525', name:'Level 525', icon:'⭐', desc:'San reached level 525.',
      check: function(){ return (typeof level === 'function' ? level() : 0) >= 525; }},

    // --- Reputation Ranks -- every named rank on the ladder ---
    {id:'reputation_respected', name:'Respected', icon:'🏮', desc:'Reputation rank reached: Respected.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Respected'; }},
    {id:'reputation_renowned', name:'Renowned', icon:'🏮', desc:'Reputation rank reached: Renowned.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Renowned'; }},
    {id:'reputation_legendary', name:'Legendary', icon:'⭐', desc:'Reputation rank reached: Legendary.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Legendary'; }},
    {id:'reputation_storied', name:'Storied', icon:'📖', desc:'Reputation rank reached: Storied.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Storied'; }},
    {id:'reputation_a_name_every_port_knows', name:'A Name Every Port Knows', icon:'🌐', desc:'Reputation rank reached: A Name Every Port Knows.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'A Name Every Port Knows'; }},
    {id:'reputation_the_captain_of_fair_tide', name:'The Captain of Fair Tide', icon:'👑', desc:'Reputation rank reached: The Captain of Fair Tide.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'The Captain of Fair Tide'; }},
    {id:'reputation_known_beyond_the_tide', name:'Known Beyond the Tide', icon:'🌊', desc:'Reputation rank reached: Known Beyond the Tide.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Known Beyond the Tide'; }},
    {id:'reputation_a_name_across_worlds', name:'A Name Across Worlds', icon:'🌌', desc:'Reputation rank reached: A Name Across Worlds.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'A Name Across Worlds'; }},
    {id:'reputation_the_compass_points_here', name:'The Compass Points Here', icon:'🧭', desc:'Reputation rank reached: The Compass Points Here.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'The Compass Points Here'; }},
    {id:'reputation_legend_of_the_horizon', name:'Legend of the Horizon', icon:'🌅', desc:'Reputation rank reached: Legend of the Horizon.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'Legend of the Horizon'; }},
    {id:'reputation_the_tide_remembers_her_name', name:'The Tide Remembers Her Name', icon:'🏆', desc:'Reputation rank reached: The Tide Remembers Her Name.',
      check: function(){ return typeof window.getReputationRankDef === 'function' && window.getReputationRankDef().name === 'The Tide Remembers Her Name'; }},

    // --- Bestiary completion milestones ---
    {id:'bestiary_25pct', name:'25% Catalogued', icon:'📖', desc:'At least 25% of every creature the crew has ever fought, catalogued.',
      check: function(){ return typeof window.bestiaryTotals === 'function' && (function(){ const t = window.bestiaryTotals(); return t.total > 0 && (t.discovered / t.total) >= 0.25; })(); }},
    {id:'bestiary_50pct', name:'50% Catalogued', icon:'📖', desc:'At least 50% of every creature the crew has ever fought, catalogued.',
      check: function(){ return typeof window.bestiaryTotals === 'function' && (function(){ const t = window.bestiaryTotals(); return t.total > 0 && (t.discovered / t.total) >= 0.5; })(); }},
    {id:'bestiary_75pct', name:'75% Catalogued', icon:'📖', desc:'At least 75% of every creature the crew has ever fought, catalogued.',
      check: function(){ return typeof window.bestiaryTotals === 'function' && (function(){ const t = window.bestiaryTotals(); return t.total > 0 && (t.discovered / t.total) >= 0.75; })(); }},

    // --- Named Fair Tide roster recruits ---
    {id:'roster_jovie', name:'Jovie Joins Fair Tide', icon:'🩹', desc:"Doesn't remember her whole past — but remembers enough medicine to matter.",
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['jovie']); }},
    {id:'roster_imah', name:'Imah Joins Fair Tide', icon:'📋', desc:'San taught her the job from the ground up, once. Now she runs the paperwork that keeps Fair Tide moving.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['imah']); }},
    {id:'roster_nurul', name:'Nurul Joins Fair Tide', icon:'🗂️', desc:'Remembers more than most — including the hard parts. Chose to stay anyway.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['nurul']); }},
    {id:'roster_gino', name:'Gino Joins Fair Tide', icon:'🍲', desc:'Good food, good people — Fair Tide runs better on both.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['gino']); }},
    {id:'roster_wahyu', name:'Wahyu Joins Fair Tide', icon:'🧵', desc:'Simple goods, real support. A small trader with a growing stall.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['wahyu']); }},
    {id:'roster_dudin', name:'Dudin Joins Fair Tide', icon:'🎒', desc:'Army-style gear and supplies — practical, reliable, always there when it counts.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['dudin']); }},
    {id:'roster_dre', name:'Dre Joins Fair Tide', icon:'☕', desc:'Remembers San through the most ordinary thing — coffee. Brings a legal head for contracts too.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['dre']); }},
    {id:'roster_jorvin', name:'Jorvin Joins Fair Tide', icon:'🔧', desc:'Barely remembers anything clearly — except San. That was enough to stay.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['jorvin']); }},
    {id:'roster_nala', name:'Nala Joins Fair Tide', icon:'🐈', desc:"Senedra's tower cat. Stays at her tower, but Fair Tide counts her as one of its own now.",
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['nala']); }},
    {id:'roster_maera', name:'Maera Joins Fair Tide', icon:'🌙', desc:'Joined Fair Tide, bringing knowledge of Veyren the crew never had on their own.',
      check: function(){ return !!(game.fairTideRoster && game.fairTideRoster['maera']); }},

    // --- Festivals celebrated at least once ---
    {id:'festival_christmas', name:'Christmas at Fair Tide', icon:'🎄', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['christmas']); }},
    {id:'festival_new_year', name:'A New Year at Fair Tide', icon:'🎆', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['new_year']); }},
    {id:'festival_all_saints', name:"All Saints' Day Remembered", icon:'🕯️', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['all_saints']); }},
    {id:'festival_all_souls', name:"All Souls' Day Remembered", icon:'🕯️', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['all_souls']); }},
    {id:'festival_cny', name:'Chinese New Year at Fair Tide', icon:'🧧', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['cny']); }},
    {id:'festival_chap_goh_mei', name:'Chap Goh Mei at Fair Tide', icon:'🏮', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['chap_goh_mei']); }},
    {id:'festival_hari_raya_aidilfitri', name:'Hari Raya Aidilfitri at Fair Tide', icon:'🌙', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['hari_raya_aidilfitri']); }},
    {id:'festival_dragon_boat', name:'Dragon Boat Festival at Fair Tide', icon:'🐉', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['dragon_boat']); }},
    {id:'festival_mid_autumn', name:'Mid-Autumn Festival at Fair Tide', icon:'🥮', desc:'Celebrated at Fair Tide for the first time.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && game.realCalendarFestivals.lastClaimedYear['mid_autumn']); }},
    {id:'festival_every_one', name:'Every Festival, At Least Once', icon:'🎉', desc:'Fair Tide has celebrated every one of its festivals at least once.',
      check: function(){ return !!(game.realCalendarFestivals && game.realCalendarFestivals.lastClaimedYear && ['christmas','new_year','all_saints','all_souls','cny','chap_goh_mei','hari_raya_aidilfitri','dragon_boat','mid_autumn'].every(function(id){ return !!game.realCalendarFestivals.lastClaimedYear[id]; })); }},

    // --- Birthdays celebrated at least once (Joy's own birthdate isn't tracked, so she's not part of this system) ---
    {id:'birthday_san', name:"San's Birthday", icon:'🎂', desc:"San's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['san']); }},
    {id:'birthday_joel', name:"Joel's Birthday", icon:'🎂', desc:"Joel's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['joel']); }},
    {id:'birthday_aisyah', name:"Aisyah's Birthday", icon:'🎂', desc:"Aisyah's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['aisyah']); }},
    {id:'birthday_mezstorm', name:"Mez's Birthday", icon:'🎂', desc:"Mez's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['mezstorm']); }},
    {id:'birthday_eliz', name:"Eliz's Birthday", icon:'🎂', desc:"Eliz's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['eliz']); }},
    {id:'birthday_senedra', name:"Senedra's Birthday", icon:'🎂', desc:"Senedra's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['senedra']); }},
    {id:'birthday_zaki', name:"Zaki's Birthday", icon:'🎂', desc:"Zaki's birthday was celebrated at Fair Tide.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && game.characterBirthdays.lastClaimedYear['zaki']); }},
    {id:'birthday_every_one', name:'Every Birthday, At Least Once', icon:'🎂', desc:"Every tracked crew member's birthday has been celebrated at least once.",
      check: function(){ return !!(game.characterBirthdays && game.characterBirthdays.lastClaimedYear && ['san','joel','aisyah','mezstorm','eliz','senedra','zaki'].every(function(id){ return !!game.characterBirthdays.lastClaimedYear[id]; })); }},

    // --- Food Culture ---
    {id:'food_first_recipe', name:'Fair Tide Adapts', icon:'🍲', desc:'The first festival dish adapted into a permanent Fair Tide recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && game.foodCulture.recipes.length >= 1); }},
    {id:'food_christmas_complete', name:'Fair Tide Christmas Cuisine', icon:'🍲', desc:'Every Christmas dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['bibingka','puto_bumbong','pancit'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_cny_complete', name:'Fair Tide CNY Cuisine', icon:'🍲', desc:'Every CNY dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['dumplings','longevity_noodles','nian_gao'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_chap_goh_mei_complete', name:'Fair Tide Chap Goh Mei Cuisine', icon:'🍲', desc:'Every Chap Goh Mei dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['tangyuan'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_hari_raya_aidilfitri_complete', name:'Fair Tide Hari Raya Cuisine', icon:'🍲', desc:'Every Hari Raya dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['ketupat','rendang','satay'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_dragon_boat_complete', name:'Fair Tide Dragon Boat Cuisine', icon:'🍲', desc:'Every Dragon Boat dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['zongzi'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_mid_autumn_complete', name:'Fair Tide Mid-Autumn Cuisine', icon:'🍲', desc:'Every Mid-Autumn dish has its own Fair Tide-adapted recipe.',
      check: function(){ return !!(game.foodCulture && game.foodCulture.recipes && ['mooncake_recipe'].every(function(id){ return game.foodCulture.recipes.some(function(r){ return r.id === id; }); })); }},
    {id:'food_every_recipe', name:'A Cuisine of Its Own', icon:'🍲', desc:'Every traditional dish Fair Tide has ever tried now has its own Veyren-adapted recipe.',
      check: function(){ return !!(window.FESTIVAL_FOODS && game.foodCulture && game.foodCulture.recipes && Object.keys(window.FESTIVAL_FOODS).every(function(fid){ return window.FESTIVAL_FOODS[fid].every(function(dish){ return game.foodCulture.recipes.some(function(r){ return r.id === dish.id; }); }); })); }},

    // --- Soel Sightings ---
    {id:'sighting_pet_soel', name:'Say Hello to Soel', icon:'🐾', desc:'Soel allowed it, which from him counts as enthusiasm.',
      check: function(){ return !!(game.creatureSightings && game.creatureSightings.pets && game.creatureSightings.pets.soel >= 1); }},
    {id:'sighting_pet_nala', name:'Say Hello to Nala', icon:'🐈', desc:'Nala tolerated it for exactly as long as she decided to.',
      check: function(){ return !!(game.creatureSightings && game.creatureSightings.pets && game.creatureSightings.pets.nala >= 1); }},
    {id:'sighting_10_pets', name:'A Familiar Face', icon:'🐾', desc:'Ten sightings, ten hellos said.',
      check: function(){ return !!(game.creatureSightings && game.creatureSightings.pets) && ((game.creatureSightings.pets.soel||0) + (game.creatureSightings.pets.nala||0)) >= 10; }},
    {id:'sighting_50_pets', name:'Everyone Knows Them By Now', icon:'🐾', desc:'Fifty sightings, fifty hellos said.',
      check: function(){ return !!(game.creatureSightings && game.creatureSightings.pets) && ((game.creatureSightings.pets.soel||0) + (game.creatureSightings.pets.nala||0)) >= 50; }},

    // --- Settlement Memories ---
    {id:'settlement_first_memory', name:'A Memory Worth Keeping', icon:'📜', desc:'The first Settlement Memory was unlocked.',
      check: function(){ return !!(game.settlementMemories && game.settlementMemories.revealed && game.settlementMemories.revealed.length >= 1); }},
    {id:'settlement_every_memory', name:'Everything Fair Tide Remembers', icon:'📜', desc:'Every Settlement Memory has been unlocked.',
      check: function(){ return !!(window.SETTLEMENT_MEMORIES && game.settlementMemories && game.settlementMemories.revealed && game.settlementMemories.revealed.length >= window.SETTLEMENT_MEMORIES.length); }},

    // --- Tide Stories ---
    {id:'tide_stories_first', name:"Today's Fair Tide", icon:'🌊', desc:'The first Tide Story was logged.',
      check: function(){ return !!(game.tideStories && game.tideStories.log && game.tideStories.log.length >= 1); }},
    {id:'tide_stories_30', name:'A Settlement Full of Stories', icon:'🌊', desc:'Thirty Tide Stories, logged and kept.',
      check: function(){ return !!(game.tideStories && game.tideStories.log && game.tideStories.log.length >= 30); }},

    // --- Ship Personality ---
    {id:'ship_trait_sails', name:"The Wind's Favorite", icon:'💨', desc:"The ship's own trait: The Wind's Favorite.",
      check: function(){ return typeof window.shipPersonalityTrait === 'function' && window.shipPersonalityTrait().stat === 'sails'; }},
    {id:'ship_trait_cannons', name:'Bristling', icon:'💥', desc:"The ship's own trait: Bristling.",
      check: function(){ return typeof window.shipPersonalityTrait === 'function' && window.shipPersonalityTrait().stat === 'cannons'; }},
    {id:'ship_trait_hull', name:'Unsinkable, Probably', icon:'🛡️', desc:"The ship's own trait: Unsinkable, Probably.",
      check: function(){ return typeof window.shipPersonalityTrait === 'function' && window.shipPersonalityTrait().stat === 'hull'; }},
    {id:'ship_trait_cargo', name:'Packed to the Gunwales', icon:'📦', desc:"The ship's own trait: Packed to the Gunwales.",
      check: function(){ return typeof window.shipPersonalityTrait === 'function' && window.shipPersonalityTrait().stat === 'cargo'; }},
    {id:'ship_50_upgrades', name:'A Well-Worked Ship', icon:'🔧', desc:'Fifty upgrades made to San’s own ship over the whole voyage.',
      check: function(){ return !!(game.shipHistory && (game.shipHistory.totalUpgrades||0) >= 50); }},

    // --- Fair Tide buildings, fully built up. Checks read
    // window.fairTideBuildingCap(key) dynamically rather than a hardcoded
    // 5 -- that cap already grows to 8 once Arc VI Ch.17 fires (see
    // fairtide-buildings-and-arc6.js), so a hardcoded number here would
    // fire these achievements three levels before a building was actually
    // at ITS real ceiling. ---
    {id:'building_port_hq_max', name:'The Heart of Fair Tide', icon:'🏮', desc:"Fair Tide's Port HQ reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['port_hq']||0) >= window.fairTideBuildingCap('port_hq')); }},
    {id:'building_warehouse_max', name:"Dudin's Domain", icon:'📦', desc:"Fair Tide's warehouse reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['warehouse']||0) >= window.fairTideBuildingCap('warehouse')); }},
    {id:'building_trading_post_max', name:"Wahyu's Trading Post", icon:'🏪', desc:"Fair Tide's trading post reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['trading_post']||0) >= window.fairTideBuildingCap('trading_post')); }},
    {id:'building_galley_max', name:"Gino's Galley", icon:'🍲', desc:"Fair Tide's galley reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['galley']||0) >= window.fairTideBuildingCap('galley')); }},
    {id:'building_workshop_max', name:"Jorvin's Workshop", icon:'🔧', desc:"Fair Tide's workshop reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['workshop']||0) >= window.fairTideBuildingCap('workshop')); }},
    {id:'building_watchtower_max', name:"Imah's Watch", icon:'🔭', desc:"Fair Tide's watchtower reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['watchtower']||0) >= window.fairTideBuildingCap('watchtower')); }},
    {id:'building_archive_max', name:'Archive Institute', icon:'🏛️', desc:"Fair Tide's archive reached its highest level.",
      check: function(){ return !!(game.fairTideBuildings && typeof window.fairTideBuildingCap === 'function' && (game.fairTideBuildings['archive']||0) >= window.fairTideBuildingCap('archive')); }},

    // --- Horizon Engine development ---
    {id:'horizon_engine_25pct', name:'Horizon Engine: 25%', icon:'🌌', desc:"The Horizon Engine's own development reached 25%.",
      check: function(){ return typeof window.getHorizonEngineDevelopmentPct === 'function' && window.getHorizonEngineDevelopmentPct() >= 25; }},
    {id:'horizon_engine_50pct', name:'Horizon Engine: 50%', icon:'🌌', desc:"The Horizon Engine's own development reached 50%.",
      check: function(){ return typeof window.getHorizonEngineDevelopmentPct === 'function' && window.getHorizonEngineDevelopmentPct() >= 50; }},
    {id:'horizon_engine_75pct', name:'Horizon Engine: 75%', icon:'🌌', desc:"The Horizon Engine's own development reached 75%.",
      check: function(){ return typeof window.getHorizonEngineDevelopmentPct === 'function' && window.getHorizonEngineDevelopmentPct() >= 75; }},
    {id:'horizon_engine_99pct', name:'Horizon Engine: 99%', icon:'🌌', desc:"The Horizon Engine's own development reached 99%.",
      check: function(){ return typeof window.getHorizonEngineDevelopmentPct === 'function' && window.getHorizonEngineDevelopmentPct() >= 99; }},

    // --- Crafting and expeditions, further milestones ---
    {id:'crafted_10', name:'A Growing Workshop', icon:'🔨', desc:'Ten trophies, turned into gear worth carrying.',
      check: function(){ return (game.equipmentInventory||[]).filter(function(i){ return i && i.crafted; }).length >= 10; }},
    {id:'expeditions_10', name:'A Seasoned Expedition Team', icon:'🌌', desc:'Ten crossings beyond the Horizon Engine’s door, there and back again.',
      check: function(){ return (game.interworldExpeditionsCompleted||0) >= 10; }},

    // --- Day milestones ---
    {id:'day_50', name:'Day 50', icon:'📅', desc:'Day 50 of the voyage.',
      check: function(){ return (game.day||0) >= 50; }},
    {id:'day_100', name:'Day 100', icon:'📅', desc:'Day 100 of the voyage.',
      check: function(){ return (game.day||0) >= 100; }},
    {id:'day_250', name:'Day 250', icon:'📅', desc:'Day 250 of the voyage.',
      check: function(){ return (game.day||0) >= 250; }},
    {id:'day_500', name:'Day 500', icon:'📅', desc:'Day 500 of the voyage.',
      check: function(){ return (game.day||0) >= 500; }},
    {id:'day_1000', name:'Day 1000', icon:'📅', desc:'Day 1000 of the voyage.',
      check: function(){ return (game.day||0) >= 1000; }},
    {id:'day_2000', name:'Day 2000', icon:'📅', desc:'Day 2000 of the voyage.',
      check: function(){ return (game.day||0) >= 2000; }},

    // --- Gold milestones ---
    {id:'gold_5000', name:'5,000 Gold', icon:'💰', desc:'Held at least 5,000 gold at once.',
      check: function(){ return (game.gold||0) >= 5000; }},
    {id:'gold_10000', name:'10,000 Gold', icon:'💰', desc:'Held at least 10,000 gold at once.',
      check: function(){ return (game.gold||0) >= 10000; }},
    {id:'gold_25000', name:'25,000 Gold', icon:'💰', desc:'Held at least 25,000 gold at once.',
      check: function(){ return (game.gold||0) >= 25000; }},
    {id:'gold_50000', name:'50,000 Gold', icon:'💰', desc:'Held at least 50,000 gold at once.',
      check: function(){ return (game.gold||0) >= 50000; }},
    {id:'gold_100000', name:'100,000 Gold', icon:'💰', desc:'Held at least 100,000 gold at once.',
      check: function(){ return (game.gold||0) >= 100000; }},
    {id:'gold_250000', name:'250,000 Gold', icon:'💰', desc:'Held at least 250,000 gold at once.',
      check: function(){ return (game.gold||0) >= 250000; }},

    // --- Civilian roles assigned ---
    {id:'civilian_role_sailor', name:'Sailors, At Work', icon:'⚓', desc:'At least one Fair Tide civilian is now working as one of the Sailors.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'sailor'; })); }},
    {id:'civilian_role_dock_worker', name:'Dock Workers, At Work', icon:'📦', desc:'At least one Fair Tide civilian is now working as one of the Dock Workers.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'dock_worker'; })); }},
    {id:'civilian_role_trader', name:'Traders, At Work', icon:'💰', desc:'At least one Fair Tide civilian is now working as one of the Traders.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'trader'; })); }},
    {id:'civilian_role_craftsperson', name:'Craftspeople, At Work', icon:'🔨', desc:'At least one Fair Tide civilian is now working as one of the Craftspeople.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'craftsperson'; })); }},
    {id:'civilian_role_cook', name:'Cooks, At Work', icon:'🍲', desc:'At least one Fair Tide civilian is now working as one of the Cooks.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'cook'; })); }},
    {id:'civilian_role_administrator', name:'Administrators, At Work', icon:'📋', desc:'At least one Fair Tide civilian is now working as one of the Administrators.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'administrator'; })); }},
    {id:'civilian_role_specialist', name:'Specialists, At Work', icon:'⭐', desc:'At least one Fair Tide civilian is now working as one of the Specialists.',
      check: function(){ return !!(game.fairTideRoster && Object.keys(game.fairTideRoster).some(function(id){ return game.fairTideRoster[id] && game.fairTideRoster[id].civilianRole === 'specialist'; })); }},

    // --- Mood and rival disposition ---
    {id:'mood_max', name:'Whole Settlement Celebrating', icon:'🌊', desc:'Fair Tide Mood reached its highest tier.',
      check: function(){ return !!(game.fairTideMood && (game.fairTideMood.points||0) >= 100); }},
    {id:'rival_fined', name:'Pay and Go', icon:'💰', desc:'A captured rival paid their fine and left Fair Tide for good.',
      check: function(){ return typeof window.rivalDispositionState === 'function' && Object.values(window.rivalDispositionState()).indexOf('fined') !== -1; }},

    // --- Hobbies, Crew Conversations, and Port Visitors ---
    {id:'hobby_first', name:'A Quiet Moment', icon:'🎨', desc:'The first Fair Tide hobby moment was logged.',
      check: function(){ return !!(game.fairTideHobbies && game.fairTideHobbies.log && game.fairTideHobbies.log.length >= 1); }},
    {id:'hobby_15', name:'Downtime, Well Spent', icon:'🎨', desc:'Fifteen hobby moments logged around Fair Tide.',
      check: function(){ return !!(game.fairTideHobbies && game.fairTideHobbies.log && game.fairTideHobbies.log.length >= 15); }},
    {id:'conversation_first', name:'Around the Table', icon:'💬', desc:'The first Crew Conversation was logged.',
      check: function(){ return !!(game.fairTideConversations && game.fairTideConversations.log && game.fairTideConversations.log.length >= 1); }},
    {id:'conversation_15', name:'Everyone Has Opinions', icon:'💬', desc:'Fifteen Crew Conversations logged around Fair Tide.',
      check: function(){ return !!(game.fairTideConversations && game.fairTideConversations.log && game.fairTideConversations.log.length >= 15); }},
    {id:'port_visitor_first', name:'A Face Fair Tide Hasn’t Seen', icon:'⛵', desc:'The first Port Visitor was logged.',
      check: function(){ return !!(game.portVisitors && game.portVisitors.log && game.portVisitors.log.length >= 1); }},
    {id:'port_visitor_15', name:'Fair Tide Gets Around', icon:'⛵', desc:'Fifteen Port Visitors logged at Fair Tide.',
      check: function(){ return !!(game.portVisitors && game.portVisitors.log && game.portVisitors.log.length >= 15); }},

    // --- Mid-arc beats, Arc XXIV through Arc XXXVII ---
    {id:'arc24_ch22', name:'A Conversation Between Strangers', icon:'🗣️', desc:"Fair Tide isn't the only place the Nameless watch. Their network reaches further than San assumed.",
      check: function(){ return !!(game.comicProgress24 && game.comicProgress24[22]); }},
    {id:'arc24_ch23', name:'Someone Higher Up', icon:'🧭', desc:'Reports moving somewhere, instructions coming back from somewhere. Fair Tide still can’t say who, or how many.',
      check: function(){ return !!(game.comicProgress24 && game.comicProgress24[23]); }},
    {id:'arc26_ch22', name:'Terms of Our Own', icon:'📝', desc:'San returns to negotiations with Fair Tide’s own counterproposal in hand.',
      check: function(){ return !!(game.comicProgress26 && game.comicProgress26[22]); }},
    {id:'arc26_ch23', name:'The Independent Port', icon:'🏙️', desc:'A compromise finally emerges. Nobody really wins. That’s the important part.',
      check: function(){ return !!(game.comicProgress26 && game.comicProgress26[23]); }},
    {id:'arc27_ch22', name:"San's Boundary", icon:'🛑', desc:'Fair Tide will cooperate when interests align, but won’t become dependent on a network it can’t properly understand.',
      check: function(){ return !!(game.comicProgress27 && game.comicProgress27[22]); }},
    {id:'arc27_ch23', name:"Someone We Haven't Met", icon:'❓', desc:'An unresolved thread, left exactly that way.',
      check: function(){ return !!(game.comicProgress27 && game.comicProgress27[23]); }},
    {id:'arc28_ch22', name:'Still Here', icon:'☀️', desc:'N tells him pieces of her story. Sairen listens rather than correcting her.',
      check: function(){ return !!(game.comicProgress28 && game.comicProgress28[22]); }},
    {id:'arc28_ch23', name:'Come With Me', icon:'🚪', desc:'One night becomes several. Several become something resembling a shared life.',
      check: function(){ return !!(game.comicProgress28 && game.comicProgress28[23]); }},
    {id:'arc29_ch22', name:"What He Won't Give Them", icon:'🚫', desc:'Whatever else he is, he has lines — San just doesn’t know if they align with hers.',
      check: function(){ return !!(game.comicProgress29 && game.comicProgress29[22]); }},
    {id:'arc29_ch23', name:'No Place at Fair Tide', icon:'📏', desc:'San draws Fair Tide’s own boundary plainly. Sairen accepts the terms. For now.',
      check: function(){ return !!(game.comicProgress29 && game.comicProgress29[23]); }},
    {id:'arc30_ch22', name:'Fair Tide Holds', icon:'⚔️', desc:'The operation fails. The route stays protected. N’s recruiter is exposed as something smaller than he seemed.',
      check: function(){ return !!(game.comicProgress30 && game.comicProgress30[22]); }},
    {id:'arc30_ch23', name:'The Door Closes', icon:'🚪', desc:'"You can’t come back into Fair Tide." That’s the end of N’s place in it.',
      check: function(){ return !!(game.comicProgress30 && game.comicProgress30[23]); }},
    {id:'arc31_ch22', name:'Still Standing', icon:'🌅', desc:'Morning comes. There’s damage. People begin rebuilding. Nobody is leaving.',
      check: function(){ return !!(game.comicProgress31 && game.comicProgress31[22]); }},
    {id:'arc31_ch23', name:'Open Gates', icon:'🤝', desc:'Hospitality and caution are no longer treated as opposites.',
      check: function(){ return !!(game.comicProgress31 && game.comicProgress31[23]); }},
    {id:'arc32_ch22', name:'Ready Enough', icon:'🛠️', desc:'It isn’t an enormous nursery — it’s still their home, with room now for two more people.',
      check: function(){ return !!(game.comicProgress32 && game.comicProgress32[22]); }},
    {id:'arc32_ch23', name:'The Tide Keeps Moving', icon:'🌊', desc:'The future isn’t something they’re preparing to start — they’re already living it.',
      check: function(){ return !!(game.comicProgress32 && game.comicProgress32[23]); }},
    {id:'arc33_ch22', name:'Their Generation', icon:'🌌', desc:'There will be a next generation. They’re building something they expect to outlive the present.',
      check: function(){ return !!(game.comicProgress33 && game.comicProgress33[22]); }},
    {id:'arc33_ch23', name:'Before They Know Us', icon:'🌙', desc:'"We’ll learn." "Together?" "Team."',
      check: function(){ return !!(game.comicProgress33 && game.comicProgress33[23]); }},
    {id:'arc34_ch22', name:'No Prophecy', icon:'🌌', desc:'The twins may have inherited extraordinary things. They get to become themselves.',
      check: function(){ return !!(game.comicProgress34 && game.comicProgress34[22]); }},
    {id:'arc34_ch23', name:'Not Yet', icon:'🌙', desc:'"How long?" "I don’t know," Erynn says. "Neither do I," Renn adds.',
      check: function(){ return !!(game.comicProgress34 && game.comicProgress34[23]); }},
    {id:'arc35_ch22', name:'Our Turn', icon:'⚓', desc:'San and Joel are the everyday parents. They’re learning hands-on parenthood together.',
      check: function(){ return !!(game.comicProgress35 && game.comicProgress35[22]); }},
    {id:'arc35_ch23', name:'Meet Fair Tide', icon:'🏘️', desc:'Vaeren and Joelle gradually meet their enormous family.',
      check: function(){ return !!(game.comicProgress35 && game.comicProgress35[23]); }},
    {id:'arc36_ch22', name:'Different Parents', icon:'❤️', desc:'They’re not replacing their previous families. They’re building this one together.',
      check: function(){ return !!(game.comicProgress36 && game.comicProgress36[22]); }},
    {id:'arc36_ch23', name:'Faster Than Expected', icon:'🌱', desc:'"They’re not going to stay babies very long." Ate Joy smiles. "They never do."',
      check: function(){ return !!(game.comicProgress36 && game.comicProgress36[23]); }},
    {id:'arc37_ch22', name:'No Expedition Yet', icon:'🧭', desc:'Caution isn’t fear. It’s responsibility.',
      check: function(){ return !!(game.comicProgress37 && game.comicProgress37[22]); }},
    {id:'arc37_ch23', name:'Something Familiar', icon:'❤️', desc:'For an instant, the Bond responds — not words, not thoughts, just the unmistakable recognition that they felt the same thing.',
      check: function(){ return !!(game.comicProgress37 && game.comicProgress37[23]); }},

    // --- Arc I's own finale ---
    {id:'arc1_complete', name:'The Drowned Passage', icon:'🌊', desc:'Aldric and Wren join the reunited crew as the Drowned Admiral guards the way beyond the charts.',
      check: function(){ return !!(game.comicProgress && game.comicProgress[23] && game.finalCleared); }},

    // --- TM Crew / C. Adv Crew -- the two newest Bond tracks
    // (arc9-and-systems.js), same started/max convention as every other
    // companion track above. ---
    {id:'bond_tm_crew_started', name:'Welcome Aboard', icon:'🚢', desc:'San and the TM Crew started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('tm_crew') >= 1; }},
    {id:'bond_tm_crew_max', name:'The Steady Reach, and Fair Tide Too', icon:'🚢', desc:"San and the TM Crew's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('tm_crew') >= window.BOND_TRACKS.tm_crew.tiers.length - 1; }},
    {id:'bond_c_adv_crew_started', name:'Catching Up', icon:'📇', desc:'San and the C. Adv Crew started building something real.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('c_adv_crew') >= 1; }},
    {id:'bond_c_adv_crew_max', name:'Family, Reassigned', icon:'📇', desc:"San and the C. Adv Crew's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('c_adv_crew') >= window.BOND_TRACKS.c_adv_crew.tiers.length - 1; }},

    // --- San & Dre's own bond track (hang-out-companions.js) never had
    // started/max achievements like Aisyah/Mez/Eliz/Senedra's did,
    // despite being registered the same way -- closing that gap. Caps
    // at 100 points, not the usual 1000 (that file's own comment), but
    // the "max" check below doesn't care what the ceiling actually is. ---
    {id:'bond_san_dre_started', name:'A Familiar Face Again', icon:'☕', desc:'San and Dre started catching up properly.',
      check: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_dre') >= 1; }},
    {id:'bond_san_dre_max', name:'Ready to Celebrate', icon:'☕', desc:"San and Dre's bond reached its deepest point.",
      check: function(){ return typeof window.bondTier === 'function' && window.BOND_TRACKS && window.bondTier('san_dre') >= window.BOND_TRACKS.san_dre.tiers.length - 1; }},

    // --- San & Joel's disputed anniversary (scripts/san-joel-
    // anniversary.js) -- two competing dates, tracked independently. ---
    {id:'anniversary_mets_side', name:"San's Anniversary", icon:'💕', desc:'The day they met, celebrated San\'s way.',
      check: function(){ return !!(game.sanJoelAnniversary && game.sanJoelAnniversary.lastClaimedYear && game.sanJoelAnniversary.lastClaimedYear['met'] !== undefined); }},
    {id:'anniversary_contacts_side', name:"Joel's Anniversary", icon:'💕', desc:"What Joel insists was the real start of things, celebrated his way.",
      check: function(){ return !!(game.sanJoelAnniversary && game.sanJoelAnniversary.lastClaimedYear && game.sanJoelAnniversary.lastClaimedYear['contact'] !== undefined); }},
    {id:'anniversary_both_sides', name:'Neither of Them Wins', icon:'💕', desc:'Both anniversary dates celebrated in the same year — still no agreement on which one actually counts.',
      check: function(){ const y = game.sanJoelAnniversary && game.sanJoelAnniversary.lastClaimedYear; return !!(y && y['met'] !== undefined && y['met'] === y['contact']); }},

    // --- Voyage interception streak (scripts/core-engine.js: doVoyage) ---
    {id:'interception_streak_15', name:'A Quiet Stretch', icon:'🏴‍☠️', desc:'15 days at sea without a single interception.',
      check: function(){ return (game.daysSinceInterception||0) >= 15; }},
    {id:'interception_streak_30', name:'Untouchable', icon:'🏴‍☠️', desc:'30 days at sea without a single interception.',
      check: function(){ return (game.daysSinceInterception||0) >= 30; }},

    // --- Voyage group encounters (scripts/voyage-group-encounters.js) ---
    {id:'sea_group_first_clear', name:'Divide and Conquer', icon:'⚔️', desc:'A full group of pirates or sirens, fought down to the very last one.',
      check: function(){ return (game.seaGroupClears||0) >= 1; }},
    {id:'sea_group_10', name:'The Crew Knows the Drill', icon:'⚔️', desc:'Ten full pirate or siren groups, cleared.',
      check: function(){ return (game.seaGroupClears||0) >= 10; }}
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
