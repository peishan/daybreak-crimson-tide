(function(){
  // -------------------------------------------------------------------
  // BESTIARY: THE NEW AREAS (release 1, the monsters; release 2, the first three bosses). Eight optional creature fights for the ports from Arc XXIII on, each at its own port once that
  // arc is done. They use mechanics the game already has: waves with the mender and frenzy twists, and the tide, jam and cold round rules.
  // Drafted in the "Crimson Horizon Bestiary: New Areas Draft" doc. Names and numbers are placeholders to tune.
  // -------------------------------------------------------------------
  const OPT = window.CH_OPTIONAL_FIGHTS, done = window.chArcDone;
  if (!OPT || typeof done !== 'function') return;
  function amulet(id, name, icon, desc, stats, tier){ return Object.assign({ id: id, name: name, icon: icon, slot: 'amulet', family: 'any', tier: tier || 3, desc: desc }, stats); }

  OPT.opt_silverfish = {
    port: 'paper_harbor', unlock: function(){ return done(23); },
    title: '🐟 The Silverfish Swarm', btn: '⚔️ Open the stacks',
    text: 'A paper-eating swarm has found the restorer\'s stacks. Pages are going to dust a shelf at a time, and the restorer would like the room back before the next box of records arrives.',
    waves: [
      { name: 'The Scout Swarm', icon: '🐟', hp: 1700, dmg: 62, xp: 380, gold: 190, desc: 'The first of them, thin as pencil lines.' },
      { name: 'The Stack Swarm', icon: '🐟', hp: 2000, dmg: 68, xp: 420, gold: 210, desc: 'The main swarm, pouring off the shelves.' },
      { name: 'The Queen Silverfish', icon: '🐟', hp: 2300, dmg: 74, xp: 520, gold: 260, twist: 'mender', twistText: 'She mends herself in the pages', desc: 'A pale, hand-long queen that mends faster the more paper there is around her.' }
    ],
    enemy: { name: 'The Queen Silverfish', icon: '🐟', hp: 2300, dmg: 74, xp: 520, gold: 260, twist: 'mender', twistText: 'She mends herself in the pages', desc: 'The queen of the swarm.' },
    reward: { standing: 30, gear: amulet('binders_thread', 'Binder’s Thread', '🧵', 'A length of waxed thread from the restorer\'s bench. It holds whatever is wrapped in it.', { hp: 24, magic: 6 }), text: 'The stacks are quiet again, and the restorer ties a length of her own binding thread around your wrist.' }
  };
  OPT.opt_low_tide_hermits = {
    port: 'black_sand_harbor', unlock: function(){ return done(24); },
    title: '🐚 The Low-Tide Hermits', btn: '⚔️ Walk the flats',
    text: 'At low tide the flats are full of shells the size of barrels, and each one has a crab in it. They only come out when the water is far out, and they will not let anyone cross the sand until it comes back.',
    enemy: { name: 'The Low-Tide Hermits', icon: '🐚', hp: 3800, dmg: 78, xp: 1200, gold: 600, rule: 'tide', twistText: 'The tide: every third round a third of your damage comes back to them', desc: 'Giant hermit crabs in shells of black sand and bone. They draw the tide back in around them every third round.' },
    reward: { standing: 40, gear: amulet('hermit_shell', 'Hermit Shell', '🐚', 'A palm-sized shell that is always faintly damp. It makes the next tide easier to read.', { hp: 28, magic: 6 }), text: 'The last shell turns and shuffles back to the water, and the flats are open again.' }
  };
  OPT.opt_black_sand_skitters = {
    port: 'black_sand_harbor', unlock: function(){ return done(24); },
    title: '🦀 The Black-Sand Skitters', btn: '⚔️ Meet the rush',
    text: 'The reef crabs come up the beach in one quick rush when the light changes, and they do not stop for anything in the way, including the nets drying on the sand.',
    enemy: { name: 'The Black-Sand Skitters', icon: '🦀', hp: 2800, dmg: 80, xp: 1000, gold: 500, twist: 'frenzy', twistText: 'They hit harder every round', desc: 'A wave of quick black crabs. Each one is small, and the longer the rush lasts the harder it hits.' },
    reward: { standing: 30, gear: amulet('skitter_claw', 'Skitter Claw', '🦀', 'A small, hard claw on a cord. It twitches when something moves behind you.', { hp: 24, spd: 3 }), text: 'The rush breaks against the rocks, and the beach is quiet. One small claw is left on the sand.' }
  };
  OPT.opt_net_snarl_eels = {
    port: 'northern_landing', unlock: function(){ return done(24); },
    title: '🪢 The Net-Snarl Eels', btn: '⚔️ Cut them out',
    text: 'A whole shoal of eels has got itself wound into an old drift net at the end of the landing, and it is thrashing the pilings loose. The harbor keeper would like it cut free before the next tide.',
    enemy: { name: 'The Net-Snarl Eels', icon: '🪢', hp: 3400, dmg: 76, xp: 1100, gold: 550, rule: 'jam', twistText: 'Static: on odd rounds skills and spells are jammed', desc: 'A knot of angry eels in a drowned net. On odd rounds the tangle snags every spell, so keep the heavy hits for the even ones.' },
    reward: { standing: 30, gear: amulet('mended_net_charm', 'Mended Net Charm', '🪢', 'A palm of net knotted into a charm. It never quite unravels.', { hp: 26, spd: 3 }), text: 'The net comes free in one piece, and the keeper hangs a mended square of it over your door.' }
  };
  OPT.opt_heartrot_beetles = {
    port: 'cedar_reach', unlock: function(){ return done(25); },
    title: '🪲 The Heartrot Beetles', btn: '⚔️ Open the beams',
    text: 'The new hulls at Cedar Reach are sound from outside. Inside, something has been eating the heartwood. The shipwright wants the stacked beams opened and the whole brood cleared before one more keel is laid.',
    waves: [
      { name: 'The Borers', icon: '🪲', hp: 2000, dmg: 70, xp: 460, gold: 230, desc: 'The first beetles out of the cut ends.' },
      { name: 'The Brood', icon: '🪲', hp: 2400, dmg: 80, xp: 540, gold: 270, desc: 'The main brood, harder than the first.' },
      { name: 'The Heart-Eaters', icon: '🪲', hp: 2800, dmg: 90, xp: 640, gold: 320, twist: 'frenzy', twistText: 'They hit harder every round', desc: 'The largest of them, fat on good cedar, and angrier the longer they are held.' }
    ],
    enemy: { name: 'The Heart-Eaters', icon: '🪲', hp: 2800, dmg: 90, xp: 640, gold: 320, twist: 'frenzy', twistText: 'They hit harder every round', desc: 'The largest beetles.' },
    reward: { standing: 40, gear: amulet('cedar_heart_charm', 'Cedar-Heart Charm', '🌲', 'A knot of sound cedar from the cleared stack. It smells of the yard in the rain.', { hp: 30, spd: 4 }), text: 'The beams come out clean, and the shipwright hands you a cedar heart-knot from the first one she trusts.' }
  };
  OPT.opt_ridge_rams = {
    port: 'windward_valley', unlock: function(){ return done(26); },
    title: '🐏 The Ridge Rams', btn: '⚔️ Climb the ridge road',
    text: 'A pair of rams has taken the ridge road above the Valley for the autumn and will not share it. The wagon folk have been going the long way round for a week.',
    enemy: { name: 'The Ridge Rams', icon: '🐏', hp: 3600, dmg: 84, xp: 1200, gold: 600, twist: 'frenzy', twistText: 'They hit harder every round', desc: 'Two great curled rams who have settled the matter of the road between them. They hit harder the longer they are crossed.' },
    reward: { standing: 40, gear: amulet('rams_horn', 'Ram’s Horn', '🐏', 'A small, polished curl of horn. It warms the hand on a cold ridge.', { hp: 30, magic: 5 }), text: 'The rams give the road up with some dignity, and the wagons go over the ridge again.' }
  };
  OPT.opt_amber_drifters = {
    port: 'ochre_harbor', unlock: function(){ return done(28); },
    title: '🪼 The Amber Drifters', btn: '⚔️ Wade out',
    text: 'In the shallows beyond the market, slow jellyfish of the Amber Sea trail light behind them like lamps. The pilot-boats will not go out through them. The harbor would like a clear lane.',
    enemy: { name: 'The Amber Drifters', icon: '🪼', hp: 4000, dmg: 82, xp: 1300, gold: 650, rule: 'cold', twistText: 'The sting: each round it stings a crew member, who loses their next action unless a crewmate Defends', desc: 'A drift of amber jellyfish, each trailing a long soft light. Their sting stops one of the crew every round, and only a crewmate bracing beside them frees them.' },
    reward: { standing: 40, gear: amulet('amber_bead', 'Amber Bead', '🟠', 'A warm amber bead that holds a small light of its own.', { hp: 30, magic: 7 }), text: 'The lane clears, and the pilot-boats go out through it. A single amber bead drifts in on the next wave.' }
  };
  OPT.opt_roc_fledglings = {
    port: 'pillar_isles', unlock: function(){ return done(28); },
    title: '🪶 The Roc Fledglings', btn: '⚔️ Climb the nesting rock',
    text: 'The nesting rock is empty of its parents, and the half-grown fledglings left on it have decided that everyone is a threat. They are hungry, and they are very large.',
    waves: [
      { name: 'The First Fledgling', icon: '🪶', hp: 2400, dmg: 78, xp: 560, gold: 280, desc: 'A half-grown roc with its wings not yet its own.' },
      { name: 'The Eldest Fledgling', icon: '🪶', hp: 3000, dmg: 88, xp: 700, gold: 350, twist: 'mender', twistText: 'It mends under its own feathers', desc: 'The eldest of the brood, and the best fed. It mends itself under its feathers as fast as you can strike.' }
    ],
    enemy: { name: 'The Eldest Fledgling', icon: '🪶', hp: 3000, dmg: 88, xp: 700, gold: 350, twist: 'mender', twistText: 'It mends under its own feathers', desc: 'The eldest of the brood.' },
    reward: { standing: 40, gear: amulet('fledgling_feather', 'Fledgling Feather', '🪶', 'A long feather, soft at the edge and sharp at the quill. It is light in a gale.', { hp: 28, spd: 4 }), text: 'The brood settles on the rock again, and you take one long feather from the nest\'s edge.' }
  };

  // ---- Release 2: the first three bosses (the netmaster's cold, the heart-rot's drain, the bell's echo; rules in bestiary-round-rules.js) ----
  OPT.opt_old_netmaster = {
    port: 'northern_landing', unlock: function(){ return done(24); },
    title: '🪢 The Old Netmaster', btn: '⚔️ Face the Netmaster',
    text: 'A drowned fisher is still mending his net at the end of the landing, long after the boats stopped coming. He means no harm. He has simply never been told that the nets are done, and anything that comes near gets caught.',
    enemy: { name: 'The Old Netmaster', icon: '🪢', hp: 6200, dmg: 90, xp: 2000, gold: 1000, rule: 'cold',
      twistText: 'The net: each round it holds one crew member, who loses their next action unless a crewmate Defends. Rages below half health',
      desc: 'A grey, patient figure of wet rope and old tar, with a net that is never quite empty. Each round the net closes over one of the crew, and only a crewmate bracing beside them frees them. When he is hurt he hauls hard.',
      phases: [{ at: 0.5, text: '🪢 The Netmaster hauls hard on the net. He is angry now, and he hits much harder.', dmgMult: 1.3 }] },
    prepare: function(enemy){ enemy.chillText = 'The Netmaster’s net closes over'; },
    reward: { standing: 50, chronicle: 'The Old Netmaster finally puts down his needle, and Northern Landing has one less thing to mend.', chronicleIcon: '🪢',
      gear: amulet('netmasters_knot', 'Netmaster’s Knot', '🪢', 'A single perfect knot, tied by someone who never got the chance to stop. It does not slip.', { hp: 36, magic: 8, spd: 3 }, 4),
      text: 'He sets down the needle, and the net finally goes slack. A single perfect knot is left on the pilings. (+50 standing.)' }
  };
  OPT.opt_heart_rot = {
    port: 'cedar_reach', unlock: function(){ return done(25); },
    title: '🍄 The Heart-Rot', btn: '⚔️ Cut it out',
    text: 'The rot took one launching beam last spring and has been growing since, quietly, through the stacked cedar. The shipwright says it is feeding. She would like it cut out before it reaches the new hull.',
    enemy: { name: 'The Heart-Rot', icon: '🍄', hp: 7000, dmg: 88, xp: 2200, gold: 1100, rule: 'drain',
      twistText: 'Drain: it heals by half of the damage it deals to the crew. Defend and shields beat it',
      desc: 'A swollen, pale growth in the shape of a beam, pulsing slowly. Every blow it lands feeds it, so a long fight loses. Defend, raise a shield, and finish it quickly.' },
    reward: { standing: 50, chronicle: 'The shipwright burns the last of the Heart-Rot at the end of the yard, and the new hull is laid on sound wood.', chronicleIcon: '🪵',
      gear: amulet('heartwood_splinter', 'Heartwood Splinter', '🪵', 'A sliver of clean, dark heartwood from the cut. It is warm and does not rot.', { hp: 38, spd: 4, magic: 6 }, 4),
      text: 'The last of it shrivels, and the stack beneath it is sound. The shipwright hands you a splinter of clean heartwood. (+50 standing.)' }
  };
  OPT.opt_hollow_bell = {
    port: 'black_sand_harbor', unlock: function(){ return done(24); },
    title: '🔔 The Hollow Bell', btn: '⚔️ Ring it down',
    text: 'In the shell of a wreck on the black sand a bell still rings, long after its ship went down. It is the reef’s last echo, and it will give back to anyone who strikes at it exactly what they gave.',
    enemy: { name: 'The Hollow Bell', icon: '🔔', hp: 6000, dmg: 86, xp: 2000, gold: 1000, rule: 'echo',
      twistText: 'Echo: every second round it throws the strongest blow you dealt last round back at the crew',
      desc: 'A tarnished ship’s bell hung in a ribcage of black timber, ringing without a hand on it. Every other round it throws your strongest blow back at you, so a huge hit has a price, and an even spread is safer.' },
    reward: { standing: 50, chronicle: 'The Hollow Bell on the black sand rings once more, clean and quiet, and then is still.', chronicleIcon: '🔔',
      gear: amulet('reef_song_pearl', 'Reef-Song Pearl', '🫧', 'A grey pearl that hums the first note of a song and then holds it.', { hp: 34, magic: 10 }, 4),
      text: 'The bell rings once more, clean and quiet, and is still. A grey pearl rolls out of the wreck. (+50 standing.)' }
  };
})();
