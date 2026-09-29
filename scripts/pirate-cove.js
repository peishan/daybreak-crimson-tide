(function(){
  // -------------------------------------------------------------------
  // PIRATE COVE — a new special location, gated purely at Level 270 (no
  // story flag), matching the Kota Batu/Fair Tide precedent of a
  // pure-level-gated destination rather than one tied to a chapter.
  // Built as a "special location" (the new navSpecialLocationsGrid
  // panel) rather than a regular PORTS entry, per San's own call —
  // fits better as a discovery-flavored destination than a plain
  // trading port.
  //
  // Given real thematic purpose rather than being a generic reskinned
  // Explore tab: this is where the endless-captain-pool system (see
  // arc9-and-systems.js's "ENDLESS CAPTAIN POOL") already sends escaped
  // rivals to keep operating from — so the Cove surfaces the exact same
  // "still at large" hunt list already tracked there (read-only reuse
  // of window.KNOWN_RIVAL_KEYS/rivalCaptured/rivalEscapeCounts/
  // getRivalCaptureChance/huntDownRival — nothing new invented, nothing
  // in that system touched), giving players an actual reason to come
  // here beyond one more harbor fight list.
  //
  // Its own small themed enemy pool (4 entries, matching the scale of
  // similar 'harbor'-kind enemies used elsewhere — e.g. lantern_
  // smugglers at hp:320/dmg:19/xp:280/gold:100) uses the same
  // 'piratecove_explore' kind + exitPirateCoveBattleToDestination()
  // pattern already established for every other special location
  // (Harbour/Tide Network/Clan Settlement/etc.) in core-engine.js, so
  // winning a Cove fight correctly returns to the Cove, not the last
  // port of embarkation.
  // -------------------------------------------------------------------

  Object.assign(HARBOR_ENEMIES, {
    cove_lookout:     { name: 'Cove Lookout',        icon: '👁️', hp: 340, dmg: 20, xp: 230, gold: 140, desc: 'Watches every boat that comes in past the reef — and every one that does not come back out.' },
    powder_smuggler:  { name: 'Powder Smuggler',     icon: '💣', hp: 380, dmg: 24, xp: 260, gold: 160, desc: 'Moving black powder nobody is supposed to be moving.' },
    cove_enforcer:    { name: 'Cove Enforcer',       icon: '🗡️', hp: 420, dmg: 26, xp: 280, gold: 170, desc: 'Keeps order here the only way the Cove ever has.' },
    the_quartermaster:{ name: 'The Quartermaster',   icon: '🏴‍☠️', hp: 520, dmg: 30, xp: 340, gold: 220, desc: "Keeps the Cove's books straighter than any legitimate port ever has." }
  });

  const PIRATE_COVE_ENEMY_KEYS = ['cove_lookout', 'powder_smuggler', 'cove_enforcer', 'the_quartermaster'];

  // Voyage events for the crossing itself, run through the shared
  // runDestinationVoyage() (tide-network.js) — same real-time-costs-real-
  // game-days crossing already used for the Unknown Harbour, Tide
  // Settlement, Clan Settlement, and the Forest/Dragon/Mountain/Crystal
  // coast destinations, rather than a bespoke one-off. Two of the Cove's
  // own enemies (already registered in HARBOR_ENEMIES above) double as
  // ambush encounters en route — fitting for a smugglers' den that
  // doesn't take kindly to being found.
  const PIRATE_COVE_VOYAGE_EVENTS = [
    { type: 'combat', text: 'A boat runs dark across your bow — whoever they are, they didn\'t want to be seen either.', combat: 'cove_lookout' },
    { type: 'combat', text: 'Someone\'s moving cargo out here who\'d rather not be asked about it.', combat: 'powder_smuggler' },
    { type: 'flavor', text: 'The charts thin out the closer you get — the Cove was never meant to be easy to find.' },
    { type: 'flavor', text: 'A light blinks once on a far shoal, then goes dark. Nobody says anything about it.' },
    { type: 'flavor', text: 'The crew keeps the lanterns low without needing to be told.' },
    { type: 'calm', text: 'Quiet water the whole way in. Almost unsettling, for these waters.' }
  ];

  window.sailToPirateCove = function(){
    if (!pirateCoveUnlocked()) { toast('🔒 Opens at Level 270.'); return; }
    if (typeof window.runDestinationVoyage !== 'function') { goScreen('piratecove'); return; }
    window.runDestinationVoyage({
      destLabel: 'the Pirate Cove',
      events: PIRATE_COVE_VOYAGE_EVENTS,
      combatKind: 'piratecove_voyage',
      screenName: 'piratecove',
      totalDays: 10
    });
  };

  function pirateCoveUnlocked(){
    return typeof level === 'function' && level() >= 270;
  }
  window.pirateCoveUnlocked = pirateCoveUnlocked;

  // -------------------------------------------------------------------
  // SEARCH THE WATERS (San's report: "I still can't capture pirates...
  // the pirate cove has no rival pirates"). Turns out the capture roll
  // itself was never broken — it just had almost no reachable entry
  // point. The ONLY way to fight a capturable named rival was a random
  // "Pirates off the port bow!" voyage event, one flavor out of ten,
  // itself only rolled on a fraction of voyage days — so getting even
  // ONE shot at capturing anyone could take a long time of ordinary
  // sailing. And the Cove's own "Still At Large" list only ever shows
  // rivals who've ALREADY escaped you once elsewhere, so with no prior
  // encounters to show, it looked — correctly — completely empty.
  //
  // This gives the Cove an actual, reliable way to trigger that same
  // encounter on demand: reuses the exact same scaledEnemyForExplore
  // ('rival_frigate','sea') call the random voyage event already makes,
  // which auto-assigns whichever not-yet-captured rival is up next
  // (fixed-pool captains first, falling back to the endless generated
  // pool once those run out — see arc9-and-systems.js) — so this is
  // just making the EXISTING mechanism reachable on demand, not a new
  // one. Combat kind stays 'sea', exactly like the voyage version, since
  // that's what handleVictory's capture-roll wrap checks for.
  // -------------------------------------------------------------------
  window.searchWatersAtPirateCove = function(){
    if (!pirateCoveUnlocked()) { toast('🔒 Opens at Level 270.'); return; }
    const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore('rival_frigate', 'sea') : null;
    if (!enemy || !enemy.captainKey) { toast('The waters are quiet — nobody worth chasing right now.'); return; }
    toast('🌊 A frigate breaks from the fog, flying colors you recognize...', 2600);
    startCombat({kind:'sea', key:'rival_frigate', enemy: enemy, portId:null});
  };

  function renderPirateCoveAtLargeSection(){
    const rivalKeys = (typeof window.KNOWN_RIVAL_KEYS !== 'undefined') ? window.KNOWN_RIVAL_KEYS : [];
    const escapes = (typeof window.rivalEscapeCounts === 'function') ? window.rivalEscapeCounts() : {};
    const atLarge = rivalKeys.filter(function(key){
      if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) return false;
      return !!escapes[key];
    });
    let html = '<div class="panel-title" style="margin-top:14px;">🏴‍☠️ Still At Large</div>';
    if (!atLarge.length) {
      html += '<p style="font-size:.8rem;opacity:.6;">Nobody the crew is actively hunting has been traced here — yet.</p>';
      return html;
    }
    atLarge.forEach(function(key){
      const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
      const chancePct = Math.round((typeof window.getRivalCaptureChance === 'function' ? window.getRivalCaptureChance(key) : 0.5) * 100);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">🏴</div><div style="flex:1;">'+
        '<strong>'+esc(name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.8;">Escaped '+escapes[key]+' time'+(escapes[key]>1?'s':'')+' so far. '+chancePct+'% chance to capture this time.</span>'+
        '</div>'+
        '<button class="btn btn-small btn-danger" onclick="huntDownRival(\''+key+'\')">🗡️ Hunt Him Down</button>'+
        '</div></article>';
    });
    return html;
  }

  function renderPirateCoveScreen(){
    const container = document.getElementById('pirateCoveContent');
    if (!container) return;
    if (!pirateCoveUnlocked()) {
      container.innerHTML = '<div class="panel"><div class="panel-title">🏴‍☠️ Pirate Cove</div>'+
        '<div class="story-chip">🔒 Opens at Level 270.</div></div>';
      return;
    }
    let html = '<div class="panel"><div class="panel-title">🏴‍☠️ Pirate Cove</div>'+
      '<p style="font-size:.85rem;opacity:.85;">Where the ones still running go to ground. No flag flies here that anyone would recognize, and nobody asks a name twice.</p>'+
      '</div>';
    html += '<div class="panel"><div class="panel-title">🌊 Search the Waters</div>'+
      '<p style="font-size:.82rem;opacity:.85;margin-bottom:8px;">Word travels through the Cove faster than anywhere honest. Push off and see who\'s still out there.</p>'+
      '<button class="btn btn-danger" onclick="searchWatersAtPirateCove()">🌊 Search for a Rival Captain</button>'+
      '</div>';
    html += '<div class="panel">'+renderPirateCoveAtLargeSection()+'</div>';
    html += '<div class="panel"><div class="panel-title">🧭 Explore the Cove</div>';
    PIRATE_COVE_ENEMY_KEYS.forEach(function(key){
      const e = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(key, 'harbor') : HARBOR_ENEMIES[key];
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(e.name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.8;">'+esc(e.desc)+'</span><br>'+
        '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g'+(e.scaledFromLevel?' · Lv.'+e.scaledFromLevel:'')+'</span></div>'+
        '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \'piratecove_explore\')">Fight</button>'+
        '</div></article>';
    });
    html += '</div>';
    container.innerHTML = html;
  }
  window.renderPirateCoveScreen = renderPirateCoveScreen;

  const oldRenderNavigationForPirateCove = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForPirateCove) oldRenderNavigationForPirateCove();
    const grid = document.getElementById('navSpecialLocationsGrid');
    if (!grid || !pirateCoveUnlocked()) return;
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(180,50,50,.5);border-style:dashed;" onclick="sailToPirateCove()">'+
      '<div style="font-size:1.6rem;">🏴‍☠️</div><div style="font-weight:600;">Pirate Cove</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Where the ones still running go to ground. Only reachable from Fair Tide.</div></div>');
  };

  const oldGoScreenForPirateCove = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForPirateCove) oldGoScreenForPirateCove(name);
    if (name === 'piratecove') renderPirateCoveScreen();
  };
})();
