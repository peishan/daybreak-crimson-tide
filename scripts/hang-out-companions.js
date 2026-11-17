(function(){
  // -------------------------------------------------------------------
  // HANG OUT — individual companions: San & Aisyah, San & Mezstorm,
  // San & Eliz, San & Senedra. Same underlying machinery as the three
  // existing Bond Tracks (arc9-and-systems.js: bondState(), bondTier(),
  // canSpendTimeOnBond(), spendTimeWithBond()) — extended, not
  // duplicated. Those functions all read window.BOND_TRACKS fresh on
  // every call rather than a private copy, so registering a new key on
  // it here (window.BOND_TRACKS is the exact same object reference
  // arc9-and-systems.js's own closures already hold) is enough to make
  // the whole existing system — points, once-a-day cap, the base Bonds
  // tab card — work for these four with no changes to that file at all.
  //
  // San's own call for individual companions: story-driven, not stat
  // grinding. Every tier below carries bonus:0 on purpose — these bonds
  // exist for named progression and the Shared Moments log, not another
  // stacking combat percentage on top of San & Joel/Crew/Trio's three.
  // That does surface one real base-renderer quirk: renderBondsTab()'s
  // generic per-track bonus-text branch only names two cases correctly
  // (San & Joel's own stats, and a literal 'crit chance' for every other
  // key, which was accurate back when San & Trio was the only "other"
  // track) — so a bonus:0 track would otherwise show the misleading
  // "+0% crit chance". Fixed below by replacing that one exact string,
  // which no genuine bonus-bearing track can ever produce (San & Trio's
  // own smallest real tier is 2%).
  //
  // Gating: each is tied to whichever chapter actually establishes that
  // specific relationship, using Arc I's own game.comicProgress (these
  // four all join in Arc I, long before Arc XX):
  //   - Aisyah   -> Ch.14 "Two Sisters, One Ship" (San's own question:
  //     yes — San & Aisyah are explicitly framed as sisters in-story).
  //   - Mezstorm -> Ch.19 "The Crew We Choose" — Mez finding her place
  //     through scenes with the crew already aboard.
  //   - Eliz     -> Ch.15 "The One Who Stayed" — her own join chapter;
  //     no later dedicated bonding chapter exists yet to anchor to
  //     instead.
  //   - Senedra  -> Ch.20 "Senedra — The Watchful Signal" — likewise
  //     her own introduction chapter.
  //   - Dre      -> recruited onto the Fair Tide Roster at all
  //     (game.fairTideRoster.dre) rather than a comicProgress chapter —
  //     she's a civilian roster member, not a combat party companion, so
  //     there's no "join the active party" chapter gating her the way
  //     there is for the other four. members:[] on her track for the
  //     same reason: bondSynergyActive()'s "must be fielded" check would
  //     otherwise always read false for someone who never joins combat.
  //     Her track caps at 100 points (not the usual 1000) on purpose —
  //     see scripts/dre-wedding.js, which fires a one-time wedding scene
  //     once this track reaches its max tier.
  //   - Jovie     -> same shape as Dre exactly (San's own call: "special
  //     bonding, like with Dre"): gated on game.fairTideRoster.jovie
  //     rather than a chapter, members:[], capped at 100. She's
  //     deliberately excluded from the lighter, generic Fair Tide
  //     resident happiness/bond sweep (scripts/fair-tide-wider-
  //     residents.js) -- this deeper track is her relationship system,
  //     not that one.
  //   - Sairen   -> joins the crew (game.foundCompanions.sairen, Arc XLI
  //     Ch.16). He is a fixed crew member in Crimson Horizon, so San and
  //     Joel get a coffee-table bond with him, same shape as the others:
  //     bonus:0, story and Shared Moments only. members:[] and
  //     hideUntilUnlocked (no card before he has joined). The points
  //     are seeded from how he was treated as a guest (see
  //     scripts/sairen-bond.js).
  //   - Sairen's own bonds -- the twins, Sally and Mirelle. These are
  //     centred on Sairen rather than San. The twins unlock as soon as
  //     all three have joined (Arc XLI Ch.16). Sally and Mirelle are in
  //     the sequel (Arc XLII complete): Sally once she has joined, Mirelle
  //     once she has visited Fair Tide (Arc XLII Ch.36). All three are
  //     information-network specialists with Sairen, so their activities
  //     are tradecraft and observation. Mirelle mostly stays at Altan, so
  //     hers lean on letters. bonus:0, Shared Moments only.
  //   - Levi and Devon -- the Arc XLII crossover foreshadowing (Ch.17/18/
  //     20/21/22): Levi with KW Liang, Senedra and Iris; Devon with Joel
  //     and Ser Aldric. Unlocked once Levi/Devon are aboard (Crimson
  //     Horizon prologue) and the other is a companion. Joel is always
  //     aboard so Devon's bond with him is the main one; Aldric (Fair
  //     Tide-based, Final Voyage cleared) is the lighter second.
  //   - Sera     -> Arc XLII Ch.23, the chapter that brings her to Fair
  //     Tide (same flag the Crossover tab's Wider Ally Network uses for
  //     her). She is a guest, not a fielded party member (she was an
  //     optional party member in Tribute), so like Joy's track she gets
  //     the Bonds card, a Hang Out panel and Shared Moments -- but with
  //     bonus:0 and members:[] for now, until a story chapter gives her
  //     an active role. hideUntilUnlocked keeps her card off the Bonds
  //     tab entirely until then (no spoiler card before she arrives).
  // -------------------------------------------------------------------

  window.BOND_TRACKS = window.BOND_TRACKS || {};

  const COMPANIONS = [
    {
      key: 'san_aisyah', label: 'San & Aisyah', icon: '👭', members: ['aisyah'],
      actionLabel: 'Spend sisterly time with Aisyah',
      flavor: 'Teasing, trust, and the things neither of them can fully explain.',
      tiers: [
        {threshold:0,    name:'Just Crew',             bonus:0},
        {threshold:50,   name:'Sisters at Sea',        bonus:0},
        {threshold:150,  name:'Two Sisters, One Ship', bonus:0},
        {threshold:300,  name:'Nothing Left Unsaid',   bonus:0},
        {threshold:600,  name:'Sisters, Full Stop',    bonus:0},
        {threshold:1000, name:'No Separating Them Now', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[14]); },
      handlerName: 'hangOutWithAisyah',
      panelTitle: '👭 Hang Out with Aisyah',
      panelBlurb: 'Spend some sisterly time with Aisyah. This still uses today\'s San &amp; Aisyah time, same as above.',
      activities: [
        {id: 'sister_time', icon: '👭', label: 'Sister Time',              flavor: 'No particular reason. Just the two of them, being sisters about it.'},
        {id: 'training',    icon: '⚔️', label: 'Train Together',          flavor: 'Aisyah pushes harder than she needs to. San lets her.'},
        {id: 'talk',        icon: '💬', label: 'Just Talk',               flavor: 'The kind of conversation that only happens between people who trust each other completely.'},
        {id: 'haggle',      icon: '🛍️', label: 'Haggle at the Market',    flavor: 'Watching Aisyah talk a merchant down is half the entertainment.'},
        {id: 'tease',       icon: '😄', label: 'Tease Each Other Mercilessly', flavor: 'Neither of them ever actually wins this one.'},
        {id: 'quiet_evening', icon: '🌙', label: 'Quiet Evening In',       flavor: 'Nothing said. Nothing needed to be.'}
      ]
    },
    {
      key: 'san_mez', label: 'San & Mezstorm', icon: '⛈️', members: ['mezstorm'],
      actionLabel: 'Spend time with Mez',
      flavor: 'Whatever it is, it\'s louder and more chaotic than San planned for.',
      tiers: [
        {threshold:0,    name:'Still Sizing Each Other Up', bonus:0},
        {threshold:50,   name:'Reluctantly Fond',           bonus:0},
        {threshold:150,  name:'The Crew We Choose',         bonus:0},
        {threshold:300,  name:'Partners in Chaos',          bonus:0},
        {threshold:600,  name:'Never a Dull Moment',        bonus:0},
        {threshold:1000, name:'Exactly as Loud as She Needs to Be', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[19]); },
      handlerName: 'hangOutWithMez',
      panelTitle: '⛈️ Hang Out with Mez',
      panelBlurb: 'Spend some time with Mez. This still uses today\'s San &amp; Mezstorm time, same as above.',
      activities: [
        {id: 'stormwatch',     icon: '⛈️', label: 'Stormwatch',           flavor: 'Watching a storm roll in from somewhere safe, for once.'},
        {id: 'magic_practice', icon: '✨', label: 'Magic Practice',       flavor: 'Mez insists this spell is completely under control. San stands further back anyway.'},
        {id: 'gossip',         icon: '🗯️', label: 'Catch Up on Gossip',   flavor: 'Mez knows something about everyone. San regrets asking about exactly one of these things.'},
        {id: 'dare',           icon: '😈', label: 'Take the Dare',        flavor: "Mez's dares always sound reasonable until they aren't."},
        {id: 'storm_stories',  icon: '📜', label: 'Trade Storm Stories',  flavor: 'Whoever survived the wilder one wins, allegedly.'},
        {id: 'do_nothing',     icon: '😌', label: 'Do Absolutely Nothing', flavor: 'Rare, and Mez complains about it the entire time anyway.'}
      ]
    },
    {
      key: 'san_eliz', label: 'San & Eliz', icon: '💚', members: ['eliz'],
      actionLabel: 'Spend a quiet moment with Eliz',
      flavor: 'Not much needs to be said. That\'s rather the point.',
      tiers: [
        {threshold:0,    name:'The One Who Stayed',   bonus:0},
        {threshold:50,   name:'Comfortable Quiet',    bonus:0},
        {threshold:150,  name:'Trusted With the Truth', bonus:0},
        {threshold:300,  name:'Steady Company',       bonus:0},
        {threshold:600,  name:'Never Really Alone',   bonus:0},
        {threshold:1000, name:'The Quiet She Chose',  bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[15]); },
      handlerName: 'hangOutWithEliz',
      panelTitle: '💚 Hang Out with Eliz',
      panelBlurb: 'Spend a quiet moment with Eliz. This still uses today\'s San &amp; Eliz time, same as above.',
      activities: [
        {id: 'quiet_afternoon', icon: '🍵', label: 'Quiet Afternoon',           flavor: 'Tea, and not much conversation. Neither of them minds.'},
        {id: 'walk',            icon: '🚶', label: 'Take a Walk',              flavor: 'No destination. Just moving, together.'},
        {id: 'read_together',   icon: '📗', label: 'Read Together',           flavor: 'Different books, same room, comfortable silence.'},
        {id: 'check_in',        icon: '💛', label: 'Check In',                flavor: 'San asks how she\'s really doing. Eliz actually answers.'},
        {id: 'help_out',        icon: '🤲', label: 'Help With Something Small', flavor: 'Nothing dramatic. Just useful, together.'},
        {id: 'sit_in_silence',  icon: '🌫️', label: 'Sit in Comfortable Silence', flavor: "Some company doesn't need words at all."}
      ]
    },
    {
      key: 'san_senedra', label: 'San & Senedra', icon: '🎯', members: ['senedra'],
      actionLabel: 'Spend time with Senedra',
      flavor: 'She notices things San never would have on her own.',
      tiers: [
        {threshold:0,    name:'The Watchful Signal', bonus:0},
        {threshold:50,   name:'Learning to See It Too', bonus:0},
        {threshold:150,  name:'Trusted Eyes',         bonus:0},
        {threshold:300,  name:'Nothing Gets Past Either of Them', bonus:0},
        {threshold:600,  name:'Watching the Same Horizon', bonus:0},
        {threshold:1000, name:'Nothing Left Unseen',  bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[20]); },
      handlerName: 'hangOutWithSenedra',
      panelTitle: '🎯 Hang Out with Senedra',
      panelBlurb: 'Spend some time with Senedra. This still uses today\'s San &amp; Senedra time, same as above.',
      activities: [
        {id: 'scout_walk',     icon: '🔭', label: 'Scout Walk',              flavor: 'Senedra points out things San would never have noticed on her own.'},
        {id: 'lighthouse',     icon: '🗼', label: 'Watch from the Lighthouse', flavor: 'The best view of Fair Tide, and neither of them says much.'},
        {id: 'signal_practice', icon: '🚩', label: 'Signal Practice',        flavor: 'San is objectively terrible at this. Senedra is patient about it.'},
        {id: 'night_watch',    icon: '🌌', label: 'Take the Night Watch Together', flavor: 'Quiet hours, good company, nothing to actually watch for.'},
        {id: 'maps',           icon: '🗺️', label: 'Go Over the Maps',        flavor: 'Senedra always finds one more route San hadn\'t considered.'},
        {id: 'tea_at_dawn',    icon: '🌅', label: 'Tea at Dawn',             flavor: 'Up before everyone else, for no reason except that they both already were.'}
      ]
    },
    {
      key: 'san_dre', label: 'San & Dre', icon: '☕', members: [],
      actionLabel: 'Catch up with Dre',
      flavor: "Coffee, paperwork, and whatever San's avoiding this time.",
      tiers: [
        {threshold:0,   name:'Just the Coffee Girl',    bonus:0},
        {threshold:15,  name:'A Familiar Face Again',   bonus:0},
        {threshold:35,  name:'Catching Up Properly',    bonus:0},
        {threshold:55,  name:'Old Friends, Picking Up Where They Left Off', bonus:0},
        {threshold:80,  name:'Family, More or Less',    bonus:0},
        {threshold:100, name:'Ready to Celebrate',      bonus:0}
      ],
      unlockedFn: function(){ return !!(game.fairTideRoster && game.fairTideRoster['dre']); },
      handlerName: 'hangOutWithDre',
      panelTitle: '☕ Catch Up with Dre',
      panelBlurb: 'Spend some time with Dre. This still uses today\'s San &amp; Dre time, same as above.',
      activities: [
        {id: 'coffee_break',  icon: '☕', label: 'Coffee Break',          flavor: 'Dre already knows the order. She\'s known it for years.'},
        {id: 'go_over_books', icon: '📒', label: 'Go Over the Books',     flavor: 'Dre catches three mistakes San didn\'t know she\'d made.'},
        {id: 'dock_gossip',   icon: '🗞️', label: 'Trade Dock Gossip',     flavor: 'Half of it is true. Neither of them cares which half.'},
        {id: 'draft_contract', icon: '✍️', label: 'Help Draft a Contract', flavor: 'Dre\'s legal head is still sharper than anyone else\'s in Fair Tide.'},
        {id: 'people_watch',  icon: '👀', label: 'People-Watch at the Docks', flavor: 'Dre has an opinion about absolutely everyone who walks past.'},
        {id: 'reminisce',     icon: '💭', label: 'Reminisce About C. Adv', flavor: 'Old war stories from a job neither of them misses, exactly.'}
      ]
    },
    {
      key: 'san_jovie', label: 'San & Jovie', icon: '🩹', members: [],
      actionLabel: 'Spend time with Jovie',
      flavor: "Whatever she's patching up today, she's already three steps ahead of it.",
      tiers: [
        {threshold:0,   name:'Steady Hands, Quiet Past',       bonus:0},
        {threshold:15,  name:'Trusted With the Small Things',  bonus:0},
        {threshold:35,  name:'Someone Worth Checking On',      bonus:0},
        {threshold:55,  name:'Fewer Walls Than Before',        bonus:0},
        {threshold:80,  name:'Family, However She Found It',   bonus:0},
        {threshold:100, name:'Enough to Matter',               bonus:0}
      ],
      unlockedFn: function(){ return !!(game.fairTideRoster && game.fairTideRoster['jovie']); },
      handlerName: 'hangOutWithJovie',
      panelTitle: '🩹 Spend Time with Jovie',
      panelBlurb: 'Spend some time with Jovie. This still uses today\'s San &amp; Jovie time, same as above.',
      activities: [
        {id: 'clinic_shift',   icon: '🩹', label: 'Help with a Clinic Shift',    flavor: "Jovie talks through every step out loud, like she's teaching San or reminding herself. Hard to tell which."},
        {id: 'herb_sorting',   icon: '🌿', label: 'Sort Medicinal Herbs',        flavor: 'Her hands know the sorting before her memory ever has to.'},
        {id: 'check_on_her',   icon: '💛', label: 'Check On Her',               flavor: 'San asks if anything\'s come back to her yet. Jovie shrugs it off the same way she always does.'},
        {id: 'quiet_tea',      icon: '🍵', label: 'Quiet Tea Between Patients', flavor: 'A rare five minutes where nobody needs stitching.'},
        {id: 'trade_remedies', icon: '📖', label: 'Trade Old Remedies',         flavor: "Jovie knows cures San's never heard of, from somewhere she can't place anymore."},
        {id: 'just_sit',       icon: '🌙', label: 'Just Sit With Her',          flavor: "Not every visit needs a reason. Jovie seems to need this one more than she'll say."}
      ]
    },
    {
      key: 'san_sairen', label: 'San, Joel & Sairen', icon: '☕', members: [], hideUntilUnlocked: true,
      actionLabel: 'Have coffee with Sairen',
      flavor: 'Three cups on the table. Sairen pretends he did not ask for the third.',
      tiers: [
        {threshold:0,    name:'A Guest at Their Table',         bonus:0},
        {threshold:50,   name:'A Third Cup',                    bonus:0},
        {threshold:150,  name:'His Usual Chair',                bonus:0},
        {threshold:300,  name:'Coffee, Whatever the Hour',      bonus:0},
        {threshold:600,  name:'Not Just Passing Through',       bonus:0},
        {threshold:1000, name:'Home, Without Having to Say So', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.sairen); },
      handlerName: 'hangOutWithSairen',
      panelTitle: '☕ Coffee with Sairen',
      panelBlurb: 'San and Joel make room at the table for Sairen. This still uses today\'s San, Joel &amp; Sairen time, same as above.',
      activities: [
        {id: 'morning_coffee', icon: '☕', label: 'Morning Coffee',        flavor: 'Joel makes it too strong. Sairen drinks it without comment, which from him is a compliment.'},
        {id: 'deck_rail',      icon: '🌅', label: 'Coffee on the Deck',    flavor: 'Three cups, one rail, and the harbour waking up. Nobody needs to explain anything.'},
        {id: 'joel_story',     icon: '🗣️', label: 'Let Joel Tell a Story', flavor: 'Joel tells it badly on purpose. Sairen corrects one detail, which is the closest he comes to joining in.'},
        {id: 'his_blend',      icon: '🫖', label: 'Try Sairen\'s Blend',   flavor: 'His coffee is terrible and he knows it. They finish the pot anyway.'},
        {id: 'late_cup',       icon: '🌙', label: 'A Late-Night Cup',      flavor: 'He does not sleep much. Neither, lately, do they. The galley light stays on.'},
        {id: 'ask_jovie',      icon: '🩹', label: 'Ask About Jovie',       flavor: 'San does not push. Joel pushes a little. Sairen goes quiet, then smiles at the table.'}
      ]
    },
    {
      key: 'levi_liang', label: 'Levi & KW Liang', icon: '🐇', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Liang',
      flavor: 'Neither says much. Their shots do the talking.',
      tiers: [
        {threshold:0,    name:'Two Quiet Shooters',          bonus:0},
        {threshold:50,   name:'Answering Each Other\'s Shots', bonus:0},
        {threshold:150,  name:'Same Range, Same Silence',    bonus:0},
        {threshold:300,  name:'Trusted Second Bow',          bonus:0},
        {threshold:600,  name:'No Need to Explain',          bonus:0},
        {threshold:1000, name:'The Archer and the Rabbit\'s Keeper', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.levi && game.foundCompanions.kw_liang); },
      handlerName: 'hangOutWithLeviLiang',
      panelTitle: '🐇 Levi & KW Liang',
      panelBlurb: 'Levi and Liang, two people who talk mostly with arrows. This still uses today\'s Levi &amp; Liang time, same as above.',
      activities: [
        {id: 'answer_shots',  icon: '🎯', label: 'Answer Each Other\'s Shots', flavor: 'Levi adjusts. Liang adjusts to the adjustment. Nobody keeps score and both of them know it.'},
        {id: 'trade_bows',    icon: '🏹', label: 'Trade Bows for an Hour',     flavor: 'Liang hands his over without a word. Levi is visibly reluctant to hand it back.'},
        {id: 'compare_routes', icon: '🗺️', label: 'Compare Routes',           flavor: 'Liang thinks in cargo and margins, Levi in sightlines. They land on the same road from opposite directions.'},
        {id: 'rabbit_range',  icon: '🐰', label: 'Share the Range with the Rabbit', flavor: 'The rabbit sits in the safest spot on the range, completely unbothered. Both of them aim around it.'},
        {id: 'long_wager',    icon: '🎲', label: 'A Very Quiet Wager',        flavor: 'Longest clean shot wins. They say nothing, the wager is settled, and no one will confirm the stakes.'},
        {id: 'silent_meal',   icon: '🍜', label: 'Share a Meal Without Talking', flavor: 'It is the best conversation either of them has had all week.'}
      ]
    },
    {
      key: 'levi_senedra', label: 'Levi & Senedra', icon: '🔭', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Senedra',
      flavor: 'She sets the targets a little further out every time. He never complains.',
      tiers: [
        {threshold:0,    name:'Lookout and Archer',            bonus:0},
        {threshold:50,   name:'Targets a Little Further Out',  bonus:0},
        {threshold:150,  name:'Same Horizon',                  bonus:0},
        {threshold:300,  name:'Trusted Eyes',                  bonus:0},
        {threshold:600,  name:'Nothing Crosses Unseen',        bonus:0},
        {threshold:1000, name:'The Two Who See First',         bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.levi && game.foundCompanions.senedra); },
      handlerName: 'hangOutWithLeviSenedra',
      panelTitle: '🔭 Levi & Senedra',
      panelBlurb: 'Levi and Senedra, comparing how each of them reads the horizon. This still uses today\'s Levi &amp; Senedra time, same as above.',
      activities: [
        {id: 'far_targets',   icon: '🎯', label: 'Targets at Distance',     flavor: 'Senedra moves the line back again. Levi says nothing and hits it. She moves it back again.'},
        {id: 'lookout_shift', icon: '🗼', label: 'Share a Lookout Shift',   flavor: 'Two people who read the ground before anyone else, saying very little about it.'},
        {id: 'read_ground',   icon: '👁️', label: 'Read the Ground',         flavor: 'They point out different things on the same hillside, then realise they were both right.'},
        {id: 'signal_arrows', icon: '🚩', label: 'Work Out Signals',        flavor: 'A flag, an arrow, one hand sign. By the end it is a language, and it is nearly all silence.'},
        {id: 'dusk_watch',    icon: '🌅', label: 'Dusk Watch',              flavor: 'The hour when everything changes shape. They both prefer it, and neither mentions why.'},
        {id: 'swap_maps',     icon: '📜', label: 'Swap Maps',               flavor: 'Senedra\'s are annotated in a tidy hand. Levi\'s are mostly arrows. Both are exactly right.'}
      ]
    },
    {
      key: 'levi_iris', label: 'Levi & Iris', icon: '🦊', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Iris',
      flavor: 'She turns everything into a game. He pretends not to enjoy it.',
      tiers: [
        {threshold:0,    name:'A Challenge Accepted',          bonus:0},
        {threshold:50,   name:'Terrain She Already Knows',     bonus:0},
        {threshold:150,  name:'Keeping Up, Mostly',            bonus:0},
        {threshold:300,  name:'Partners in a Dare',            bonus:0},
        {threshold:600,  name:'Never Boring, Never Quiet',     bonus:0},
        {threshold:1000, name:'Worth Every Detour',            bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.levi && game.foundCompanions.iris); },
      handlerName: 'hangOutWithLeviIris',
      panelTitle: '🦊 Levi & Iris',
      panelBlurb: 'Levi and Iris, a competition that never quite ends. This still uses today\'s Levi &amp; Iris time, same as above.',
      activities: [
        {id: 'terrain_dare',  icon: '⛰️', label: 'Take Her Terrain Dare',   flavor: 'She picks the ground and the rules. Levi loses the first round and wins the second, and says nothing about either.'},
        {id: 'ridge_race',    icon: '🏃', label: 'Race the Ridge',          flavor: 'Iris cuts a corner that does not look like a corner. Levi takes the long way and arrives three seconds behind, annoyed.'},
        {id: 'knife_arrow',   icon: '🗡️', label: 'Knife Against Arrow',     flavor: 'Close range is hers, distance is his, and the argument over which matters more is an old one by now.'},
        {id: 'tracking_game', icon: '🐾', label: 'Play the Tracking Game',  flavor: 'Whoever finds the other first wins. Iris cheats. Levi lets her, then wins anyway.'},
        {id: 'steal_snack',   icon: '🥟', label: 'Lose a Snack to Her',     flavor: 'She takes it so smoothly that he only notices when she is already eating it.'},
        {id: 'rooftop_rest',  icon: '🌤️', label: 'Rest on a Rooftop',      flavor: 'For once she sits still. Neither of them says it is nice.'}
      ]
    },
    {
      key: 'devon_joel', label: 'Devon & Joel', icon: '🛡️', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Devon',
      flavor: 'A knight and a paladin, comparing how it feels to stand next to someone who does not need protecting.',
      tiers: [
        {threshold:0,    name:'Two Protectors',                   bonus:0},
        {threshold:50,   name:'Common Ground',                    bonus:0},
        {threshold:150,  name:'Fellow Watchmen',                  bonus:0},
        {threshold:300,  name:'Understood Without Explaining',    bonus:0},
        {threshold:600,  name:'Two Men Who Stand Beside, Not In Front', bonus:0},
        {threshold:1000, name:'Brothers in Duty',                 bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.devon); },
      handlerName: 'hangOutWithDevonJoel',
      panelTitle: '🛡️ Devon & Joel',
      panelBlurb: 'Joel is aboard, and so is Devon, which makes this the easy one. This still uses today\'s Devon &amp; Joel time, same as above.',
      activities: [
        {id: 'deck_spar',     icon: '⚔️', label: 'Spar on the Deck',        flavor: 'Steady against precise. Neither is in a hurry, and both find the other harder to read than expected.'},
        {id: 'partners_talk', icon: '💬', label: 'Talk About Their Partners', flavor: 'Two men who spend their lives quietly watching over strong-willed women, and finally have someone to say it to.'},
        {id: 'night_watch_dj', icon: '🌙', label: 'Stand Watch Together',   flavor: 'The ship sleeps. They both pretend this is a duty and not a pleasure.'},
        {id: 'compare_duty',  icon: '📜', label: 'Compare Oaths',           flavor: 'Lunareth\'s version and Fair Tide\'s. More alike than either expected.'},
        {id: 'quiet_drink',   icon: '🍶', label: 'A Quiet Drink on Deck',   flavor: 'Joel talks about the early days. Devon listens like it is a report he plans to remember.'},
        {id: 'protect_tips',  icon: '🧭', label: 'Trade Notes on Being Overruled', flavor: 'They compare techniques for objecting to a captain and a princess. None of them work, and they agree on that too.'}
      ]
    },
    {
      key: 'devon_aldric', label: 'Devon & Ser Aldric', icon: '🌊', members: [], hideUntilUnlocked: true,
      actionLabel: 'Train with Ser Aldric',
      flavor: 'Three fighting philosophies in one practice yard, and one of them is a rule book.',
      tiers: [
        {threshold:0,    name:'Different Worlds, Same Yard',   bonus:0},
        {threshold:50,   name:'Mutual Respect',                bonus:0},
        {threshold:150,  name:'Sparring Partners',             bonus:0},
        {threshold:300,  name:'Disagreeing on Principle',      bonus:0},
        {threshold:600,  name:'Knights of Different Worlds',   bonus:0},
        {threshold:1000, name:'Two Oaths, One Yard',           bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.devon && game.finalCleared); },
      handlerName: 'hangOutWithDevonAldric',
      panelTitle: '🌊 Devon & Ser Aldric',
      panelBlurb: 'Ser Aldric is at Fair Tide more than aboard, so this is the lighter of Devon\'s two bonds. This still uses today\'s Devon &amp; Ser Aldric time, same as above.',
      activities: [
        {id: 'yard_drill',    icon: '🛡️', label: 'Drill in the Yard',        flavor: 'Aldric corrects Devon\'s footing. Devon, politely, does not agree. They drill the footing again.'},
        {id: 'discipline',    icon: '📏', label: 'Argue About Discipline',   flavor: 'A spirited exchange on duty, order and protecting others. Both of them enjoy it more than they admit.'},
        {id: 'waves_style',   icon: '🌊', label: 'Learn the Waves Style',    flavor: 'Aldric teaches him to stand like water. It takes Devon an afternoon to stop standing like a wall.'},
        {id: 'old_oaths',     icon: '📖', label: 'Swap Old Oaths',           flavor: 'Two knights, two worlds, and a surprising amount of overlap in the wording.'},
        {id: 'polish_armour', icon: '✨', label: 'Polish Armour Together',   flavor: 'The most peaceful part of any knight\'s day, and the one they talk about least.'},
        {id: 'three_way',     icon: '⚔️', label: 'A Three-Way Bout with Joel', flavor: 'Three philosophies, one practice yard, and nobody willing to concede the last point.'}
      ]
    },
    {
      key: 'sairen_twins', label: 'Sairen & the Twins', icon: '🌊', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Vaeren and Joelle',
      flavor: 'He would never call it looking after them. He is always, somehow, nearby.',
      tiers: [
        {threshold:0,    name:'The Quiet Man on the Ship',    bonus:0},
        {threshold:50,   name:'Allowed Into the Game',        bonus:0},
        {threshold:150,  name:'Someone to Ask',               bonus:0},
        {threshold:300,  name:'Their Favourite Silence',      bonus:0},
        {threshold:600,  name:'Uncle, Without the Word',      bonus:0},
        {threshold:1000, name:'Someone They Never Have to Look For', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.foundCompanions && game.foundCompanions.sairen && game.foundCompanions.vaeren && game.foundCompanions.joelle); },
      handlerName: 'hangOutWithSairenTwins',
      panelTitle: '🌊 Sairen & the Twins',
      panelBlurb: 'Sairen spends time with Vaeren and Joelle. This still uses today\'s Sairen &amp; the Twins time, same as above.',
      activities: [
        {id: 'hide_seek',   icon: '🫥', label: 'Hide and Seek',            flavor: 'Sairen never loses. Vaeren has decided this is cheating. Joelle has decided it is a skill worth learning.'},
        {id: 'quiet_steps', icon: '👣', label: 'Learn to Walk Quietly',    flavor: 'Joelle manages three steps. Vaeren, who is built like a wall, manages one and is very proud of it.'},
        {id: 'star_names',  icon: '✨', label: 'Name the Stars',           flavor: 'Joelle knows them all. Sairen only knows which ones to navigate by, and she corrects him gently.'},
        {id: 'shield_drill', icon: '🛡️', label: 'Watch Vaeren Drill',      flavor: 'He says nothing about the stance. Then, at the end, one small adjustment, and it is exactly right.'},
        {id: 'night_watch_kids', icon: '🌙', label: 'Sit Up With Them',    flavor: 'They could not sleep. Neither, apparently, could he. Nobody mentions it.'},
        {id: 'one_story',   icon: '📖', label: 'Tell One True Story',      flavor: 'A mild one, chosen carefully. They ask for another. He says maybe tomorrow, and means it.'}
      ]
    },
    {
      key: 'sairen_sally', label: 'Sairen & Sally', icon: '🌹', members: [], hideUntilUnlocked: true,
      actionLabel: 'Compare notes with Sally',
      flavor: 'Two people who notice everything, politely pretending not to.',
      tiers: [
        {threshold:0,    name:'Same Trade, Different Manners', bonus:0},
        {threshold:50,   name:'Comparing Notes',               bonus:0},
        {threshold:150,  name:'Trusted Second Pair of Eyes',   bonus:0},
        {threshold:300,  name:'The Network Behind the Network', bonus:0},
        {threshold:600,  name:'Finishing Each Other\'s Reports', bonus:0},
        {threshold:1000, name:'Nothing Gets Past Either of Them', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.arc42Complete && game.foundCompanions && game.foundCompanions.sairen && game.foundCompanions.sally); },
      handlerName: 'hangOutWithSairenSally',
      panelTitle: '🌹 Sairen & Sally',
      panelBlurb: 'Sairen and Sally work the information side of the voyage together. This still uses today\'s Sairen &amp; Sally time, same as above.',
      activities: [
        {id: 'compare_reports', icon: '🗒️', label: 'Compare Reports',       flavor: 'Same port, same day. Two completely different accounts, and the truth turns out to sit between them.'},
        {id: 'tail_drill',      icon: '👀', label: 'Tail a Stranger',       flavor: 'A drill, nothing more. Sally gets spotted by a child. Sairen gets spotted by nobody and is quietly annoyed that she noticed him anyway.'},
        {id: 'dockside_chat',   icon: '🍵', label: 'Tea on the Dockside',   flavor: 'Sally charms the stall-keeper into three pieces of gossip. Sairen only needed one of them, and says so.'},
        {id: 'teach_charm',     icon: '😊', label: 'Let Her Teach Him to Smile', flavor: 'Sally calls it a cover skill. Sairen calls it unnecessary. He practises it on the way back.'},
        {id: 'cipher_swap',     icon: '🔐', label: 'Swap Ciphers',          flavor: 'His are older and plainer. Hers are prettier. Both of them are privately impressed.'},
        {id: 'debrief',         icon: '🌙', label: 'A Quiet Debrief',       flavor: 'No orders, no audience. They talk about the work, then, for a moment, about what it cost.'}
      ]
    },
    {
      key: 'sairen_mirelle', label: 'Sairen & Mirelle', icon: '🌷', members: [], hideUntilUnlocked: true,
      actionLabel: 'Trade observations with Mirelle',
      flavor: 'She watches people. He watches rooms. Together they miss very little.',
      tiers: [
        {threshold:0,    name:'A Queen Who Listens',            bonus:0},
        {threshold:50,   name:'Observations Exchanged',         bonus:0},
        {threshold:150,  name:'The Things Left Unsaid',         bonus:0},
        {threshold:300,  name:'Reading the Room Together',      bonus:0},
        {threshold:600,  name:'Trusted Across Two Courts',      bonus:0},
        {threshold:1000, name:'The Quiet Between the Reports',  bonus:0}
      ],
      unlockedFn: function(){ return !!(game.arc42Complete && game.comicProgress42 && game.comicProgress42[36] && game.foundCompanions && game.foundCompanions.sairen); },
      handlerName: 'hangOutWithSairenMirelle',
      panelTitle: '🌷 Sairen & Mirelle',
      panelBlurb: 'Mirelle is a guest of Fair Tide, not a resident. She handles missions from Altan and comes over only when the story brings her, so most of this is remote. The in-person options open while she is visiting. This still uses today\'s Sairen &amp; Mirelle time, same as above.',
      activities: [
        {id: 'remote_mission', icon: '🛰️', label: 'Run a Mission Remotely',  flavor: 'She plans it from Altan and he does the legwork. Neither sees the other\'s half of the map until it is done.'},
        {id: 'coded_letter',   icon: '✉️', label: 'Send a Coded Letter',      flavor: 'Mirelle answers in the margin of a harmless-looking recipe. He reads it twice and smiles at the second pass.'},
        {id: 'who_sat_where',  icon: '🪑', label: 'Debrief a Council Meeting', flavor: 'She remembers the seating, the tone, and who avoided whose eye. He remembers the exits. Between them it is a full picture.'},
        {id: 'listen_first',   icon: '👂', label: 'Learn to Listen First',    flavor: 'She tells him people reveal more in casual talk than in formal reports. He tries it on a dockhand and is a little unsettled by how well it works.'},
        {id: 'check_on_sera',  icon: '🍵', label: 'Report on Sera for Her',   flavor: 'Mirelle cannot pop by whenever she likes, so Sairen does. Sera is well, the tea is strong, and she is pretending not to be as happy as she is.'},
        {id: 'visit_chat',    icon: '👑', label: 'Slip Away During Her Visit', flavor: 'A rare visit in person. Whoever she travelled with makes small talk with the whole harbour; Mirelle slips away to compare notes with Sairen in peace.', needsPresent: 'mirelle'},
        {id: 'visit_sera',    icon: '🌷', label: 'Look in on Sera Together',   flavor: 'Mirelle checks on her sister-in-law herself this time. Sairen carries the tea and pretends not to listen to a word of it.', needsPresent: 'mirelle'}
      ]
    },
    {
      key: 'san_sera', label: 'San & Sera', icon: '🍵', members: [], hideUntilUnlocked: true,
      actionLabel: 'Spend time with Sera',
      flavor: 'Lighter here than she lets herself be anywhere else.',
      tiers: [
        {threshold:0,    name:'A Guest From Lunareth',   bonus:0},
        {threshold:50,   name:'Tea and Small Talk',      bonus:0},
        {threshold:150,  name:'Lighter Here',            bonus:0},
        {threshold:300,  name:'Someone to Tell',         bonus:0},
        {threshold:600,  name:'Easy Company',            bonus:0},
        {threshold:1000, name:'Always a Place at the Table', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress42 && game.comicProgress42[23]); },
      handlerName: 'hangOutWithSera',
      panelTitle: '🍵 Hang Out with Sera',
      panelBlurb: 'Spend some time with Sera. This still uses today\'s San &amp; Sera time, same as above.',
      activities: [
        {id: 'tea',          icon: '🍵', label: 'Tea by the Harbour',      flavor: 'Sera brings the tea. San brings nothing but time, which turns out to be the right thing.'},
        {id: 'quay_walk',    icon: '🚶', label: 'Walk the Quay',           flavor: 'Sera looks at everything like she is memorizing it to take home.'},
        {id: 'souvenirs',    icon: '🛍️', label: 'Pick Out Souvenirs',      flavor: 'Sera is very serious about it. San carries the bags.'},
        {id: 'home_stories', icon: '💭', label: 'Swap Stories About Home', flavor: 'Lunareth and Veyren, side by side. Sera keeps finding things they have in common.'},
        {id: 'sunny_bench',  icon: '☀️', label: 'Sit in the Sun',          flavor: 'No agenda. Sera tips her face up to the light and does not pretend otherwise.'},
        {id: 'harbour_lights', icon: '🏮', label: 'Watch the Harbour Lights', flavor: 'Dusk, and a quiet that nobody feels the need to fill.'}
      ]
    }
  ];
  window.HANG_OUT_COMPANIONS = COMPANIONS;

  // An activity with needsPresent:<id> only opens while that guest is
  // actually at Fair Tide (their resident record is 'resident', which
  // scripts/arc42-visitors.js sets for every visit window, Arc XLII and
  // the sequel's SEQUEL_VISITS alike -- so any future chapter that
  // brings the guest over unlocks it with no change here).
  function guestPresent(id){
    try {
      const r = window.fairTideResidentsState && window.fairTideResidentsState()[id];
      return !!(r && r.status === 'resident');
    } catch(e) { return false; }
  }
  window.guestPresentAtFairTide = guestPresent;

  COMPANIONS.forEach(function(c){
    window.BOND_TRACKS[c.key] = {
      label: c.label, icon: c.icon, tiers: c.tiers, members: c.members,
      actionLabel: c.actionLabel, flavor: c.flavor
    };
    window[c.handlerName] = function(activityId){
      if (!c.unlockedFn()) return;
      const activity = c.activities.find(function(a){ return a.id === activityId; });
      if (!activity) return;
      if (activity.needsPresent && !guestPresent(activity.needsPresent)) { toast('She is not at Fair Tide right now.'); return; }
      if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond(c.key)) {
        toast('Already spent time on this today.');
        return;
      }
      const before = (window.bondState ? window.bondState()[c.key].lastSpentDay : null);
      window.spendTimeWithBond(c.key, activity.icon + ' ' + activity.flavor);
      const after = (window.bondState ? window.bondState()[c.key].lastSpentDay : null);
      if (after !== before && typeof window.recordSharedMoment === 'function') {
        window.recordSharedMoment(c.key, activityId);
      }
    };
  });

  function hangOutPanelHtml(c){
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond(c.key) : true;
    let html = '<div class="panel-title" style="margin-top:14px;">'+c.panelTitle+'</div>'+
      '<article class="quest-item">'+
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">'+c.panelBlurb+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    c.activities.forEach(function(a){
      const away = a.needsPresent && !guestPresent(a.needsPresent);
      html += '<button class="btn btn-small btn-success" '+((canSpend && !away)?'':'disabled')+(away?' title="Only while she is visiting Fair Tide"':'')+' onclick="'+c.handlerName+'(\''+a.id+'\')">'+a.icon+' '+esc(a.label)+(away?' 🔒':'')+'</button>';
    });
    html += '</div>';
    const moments = (typeof window.sharedMomentsFor === 'function') ? window.sharedMomentsFor(c.key) : [];
    if (moments.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">🌊 Shared Moments</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      moments.slice(-8).reverse().forEach(function(m){
        const a = c.activities.find(function(x){ return x.id === m.id; });
        html += (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day '+m.day+')</span><br>';
      });
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  const oldRenderBondsTabForCompanions = window.renderBondsTab;
  window.renderBondsTab = function(){
    // Tracks flagged hideUntilUnlocked stay off the tab entirely until
    // their unlock condition is met: hidden from BOND_TRACKS for the
    // duration of the (synchronous) base render only, then restored --
    // same trick hang-out-san-joy.js uses.
    const hidden = {};
    COMPANIONS.forEach(function(c){
      if (c.hideUntilUnlocked && !c.unlockedFn() && window.BOND_TRACKS[c.key]) {
        hidden[c.key] = window.BOND_TRACKS[c.key];
        delete window.BOND_TRACKS[c.key];
      }
    });
    try {
      if (oldRenderBondsTabForCompanions) oldRenderBondsTabForCompanions();
    } finally {
      Object.keys(hidden).forEach(function(k){ window.BOND_TRACKS[k] = hidden[k]; });
    }
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    // See the file-header note: every zero-bonus companion card the base
    // renderer just auto-generated for these four (via the BOND_TRACKS
    // entries registered above) shows this exact misleading string once
    // its tier reaches 1 — fixed once, globally, for all of them.
    el.innerHTML = el.innerHTML.split('+0% crit chance').join('💭 Story &amp; memories — no combat bonus.');
    COMPANIONS.forEach(function(c){
      if (c.unlockedFn()) el.innerHTML += hangOutPanelHtml(c);
    });
  };
})();
