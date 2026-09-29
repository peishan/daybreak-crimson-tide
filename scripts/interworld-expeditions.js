
(function(){
  // -------------------------------------------------------------------
  // INTER-WORLD EXPEDITIONS. Gated behind game.arc12Complete — matching
  // the exact naming convention every other arc uses (arc6Complete,
  // arc9Complete, arc10Complete, etc.). This file doesn't yet have Arc
  // XII's actual content wired in (that happened in a different session
  // and hasn't landed here as an uploadable file yet), so this is built
  // against San's own stated gameplay-unlock outline rather than the
  // arc's exact chapter text. Flagged clearly: "Beyond the Horizon" as
  // the first world's name is the one piece of real, confirmed Arc XII
  // content (its actual Ch.1 title, verified earlier); everything else
  // about this destination's specific flavor is my own reasonable
  // placeholder pending the real file, not verified story content.
  //
  // Built genuinely data-driven from the start, per "future worlds can
  // be added as discoveries" — INTERWORLD_DESTINATIONS is an array, not
  // a single hardcoded destination, so adding a second world later is
  // just a new entry, not new plumbing.
  // -------------------------------------------------------------------
  const INTERWORLD_DESTINATIONS = [
    {
      id: 'beyond_the_horizon',
      name: 'Beyond the Horizon',
      tagline: 'The first world the Horizon Engine ever found. The settlement was empty when the crew arrived — but stocked, as if someone meant to come back.',
      supplyCost: {gold: 80, food: 15},
      enemies: [
        // BUG FIX: these two were missing `gold`, unlike every other
        // enemy in the game. handleVictory always does
        // `game.gold += enemy.gold` — with no gold field that's
        // `game.gold += undefined`, which silently turns game.gold into
        // NaN on every Beyond the Horizon combat win. NaN then propagates
        // through all future gold math, and the landing screen's readout
        // (`Number(display.gold || 0)`) renders NaN as "0g" — which is
        // what made it look like a full gold wipe rather than corruption.
        {name: 'Something in the Empty Settlement', icon: '🏚️', hp: 260, dmg: 18, xp: 240, gold: 100},
        {name: 'A Shape That Moved Wrong', icon: '👁️', hp: 300, dmg: 20, xp: 260, gold: 110}
      ],
      discoveries: [
        {name: 'A Marking Nobody Recognizes', icon: '🗿', flavor: 'Not Farseer. Not anything Erynn\'s ever catalogued. It means something to somebody, just not to anyone here yet.'},
        {name: 'Preserved Rations', icon: '🫙', flavor: 'Whoever stocked this settlement expected to be gone a while. They never came back for it.'},
        {name: 'A Child\'s Toy', icon: '🧸', flavor: 'Small, worn soft at the edges. Someone loved this enough to leave it behind reluctantly, not carelessly.'}
      ]
    }
  ];
  window.INTERWORLD_DESTINATIONS = INTERWORLD_DESTINATIONS;

  window.interWorldTravelUnlocked = function(){
    return !!game.arc12Complete;
  };

  function interworldState(){ game.interworldDiscoveries = game.interworldDiscoveries || {}; return game.interworldDiscoveries; }
  window.interworldDiscoveryState = interworldState;

  window.canAffordInterworldTrip = function(destId){
    const dest = INTERWORLD_DESTINATIONS.find(d => d.id === destId);
    if (!dest) return false;
    if ((game.gold||0) < (dest.supplyCost.gold||0)) return false;
    const res = game.fairTideResources || {};
    return Object.entries(dest.supplyCost).every(([k,v]) => k === 'gold' || (res[k]||0) >= v);
  };

  // Crossing-only flavor events — no combat entries here on purpose. The
  // real encounter-or-discovery roll already happens on arrival (see
  // resolveInterworldExpedition below); giving the crossing itself its
  // own separate combat chance would just double up that risk rather
  // than adding anything new.
  const INTERWORLD_VOYAGE_EVENTS = [
    { type: 'flavor', text: 'The Horizon Engine\'s door holds steady behind you. Ahead, there\'s nothing to steer by at all.' },
    { type: 'flavor', text: 'The crew stops trying to describe what\'s outside the hull. Words weren\'t built for it.' },
    { type: 'flavor', text: 'For a moment the ship isn\'t moving through water anymore. Then it is again, and nobody mentions it.' },
    { type: 'flavor', text: 'Erynn keeps a running count of things she can\'t explain. She stopped reading it aloud after the third one.' },
    { type: 'calm', text: 'The crossing settles into something almost ordinary. Almost.' }
  ];

  // An expedition is a genuinely different undertaking from a normal
  // voyage, not just a reskinned one — so it plays by its own rules:
  //
  // 1. Only launches from Fair Tide. The Horizon Engine itself lives
  //    there; every other port, harbour, or settlement is somewhere the
  //    crew merely visits. San can't open a door to another world from
  //    Manila's dock any more than she could from open water.
  // 2. Takes longer than any regular voyage. Real port-to-port routes
  //    top out around 7 days (the longest trade distances in PORTS), and
  //    every OTHER special-location crossing (Unknown Harbour, Tide
  //    Network, Clan Settlement, Forest Coast, Dragon Mountain) is a flat
  //    10 days. An inter-world crossing is categorically further than any
  //    of those — EXPEDITION_TOTAL_DAYS is deliberately longer than that
  //    10-day ceiling, not just matching it.
  //
  // Deducts supplies immediately (so a player who bails out mid-crossing
  // hasn't gotten a free look), then spends real game days on the
  // crossing itself via the shared runDestinationVoyage() — same
  // mechanism as every other special-location destination — before the
  // existing combat-or-discovery roll fires on arrival.
  const EXPEDITION_TOTAL_DAYS = 18;

  window.canLaunchInterworldExpeditionHere = function(){
    return game.location === 'fair_tide';
  };

  window.launchInterworldExpedition = function(destId){
    if (!window.interWorldTravelUnlocked()) { toast('🔒 Not yet — the way isn\'t open.'); return; }
    if (!window.canLaunchInterworldExpeditionHere()) { toast('🔒 The Horizon Engine only opens at Fair Tide.', 3200); return; }
    const dest = INTERWORLD_DESTINATIONS.find(d => d.id === destId);
    if (!dest) return;
    if (!window.canAffordInterworldTrip(destId)) { toast('Not enough supplies for the crossing.'); return; }
    game.gold -= (dest.supplyCost.gold||0);
    game.fairTideResources = game.fairTideResources || {};
    Object.entries(dest.supplyCost).forEach(([k,v]) => { if (k !== 'gold') game.fairTideResources[k] = Math.max(0, (game.fairTideResources[k]||0) - v); });

    game.pendingInterworldExpedition = destId;
    if (typeof window.runDestinationVoyage === 'function') {
      window.runDestinationVoyage({
        destLabel: dest.name,
        events: INTERWORLD_VOYAGE_EVENTS,
        combatKind: 'interworld_crossing_voyage',
        screenName: 'interworld',
        totalDays: EXPEDITION_TOTAL_DAYS
      });
    } else {
      resolveInterworldExpedition(dest);
    }
  };

  function resolveInterworldExpedition(dest){
    game.interworldExpeditionsCompleted = (game.interworldExpeditionsCompleted||0) + 1;
    if (Math.random() < 0.5) {
      const enemyBase = dest.enemies[Math.floor(Math.random() * dest.enemies.length)];
      const enemy = (typeof scaleCrimsonEnemy === 'function') ? scaleCrimsonEnemy(enemyBase, 'harbor') : Object.assign({}, enemyBase);
      toast('🌌 Something\'s waiting on the other side.', 2600);
      startCombat({kind:'interworld', key: dest.id, enemy: enemy, portId:null});
    } else {
      const disc = dest.discoveries[Math.floor(Math.random() * dest.discoveries.length)];
      const state = interworldState();
      const firstEver = state[disc.name] === undefined;
      state[disc.name] = (state[disc.name]||0) + 1;
      logEvent('🌌 ' + dest.name + ': the crew brings back ' + disc.icon + ' ' + disc.name + '.', 'gold');
      if (firstEver) {
        setTimeout(function(){
          if (typeof showStoryModal === 'function') showStoryModal({title: disc.icon + ' ' + disc.name, blurb: disc.flavor});
        }, 500);
      } else {
        toast('🌌 The crew brings back another ' + disc.icon + ' ' + disc.name + '.', 3600);
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderInterworldScreen === 'function') renderInterworldScreen();
  }

  window.renderInterworldScreen = function(){
    const container = document.getElementById('interworldContent');
    if (!container) return;
    if (!window.interWorldTravelUnlocked()) {
      container.innerHTML = '<div class="panel"><div class="panel-title">🌌 Inter-World Expeditions</div>'+
        '<div class="story-chip">🔒 Opens once the first crossing is complete.</div></div>';
      return;
    }
    const atFairTide = window.canLaunchInterworldExpeditionHere();
    let html = '<div class="panel"><div class="panel-title">🌌 Known Worlds</div>'+
      '<p style="font-size:.82rem;opacity:.8;margin-bottom:10px;">Limited travel, each trip its own preparation. Every crossing still has to be earned.</p>'+
      (atFairTide ? '' : '<div class="story-chip">🔒 The Horizon Engine only opens here at Fair Tide — return home to launch a new expedition.</div>')+
      '</div>';
    INTERWORLD_DESTINATIONS.forEach(function(dest){
      const afford = window.canAffordInterworldTrip(dest.id);
      const canLaunch = afford && atFairTide;
      const btnLabel = atFairTide ? '🌌 Prepare Expedition' : '🔒 Return to Fair Tide';
      html += '<div class="panel"><div class="panel-title">'+dest.name+'</div>'+
        '<p style="font-size:.82rem;opacity:.85;">'+dest.tagline+'</p>'+
        '<div style="font-size:.78rem;opacity:.7;margin:6px 0;">Supplies needed: '+
        Object.entries(dest.supplyCost).map(([k,v]) => v+' '+k).join(', ')+'</div>'+
        '<button class="btn btn-small '+(canLaunch?'btn-success':'')+'" '+(canLaunch?'':'disabled')+' onclick="launchInterworldExpedition(\''+dest.id+'\')">'+btnLabel+'</button>'+
        '</div>';
    });
    const state = interworldState();
    const found = Object.keys(state).length;
    html += '<div class="panel"><div class="panel-title">📦 Discoveries — '+found+'</div>';
    if (!found) html += '<p style="font-size:.8rem;opacity:.6;">Nothing brought back yet.</p>';
    Object.entries(state).forEach(function([name, count]){
      html += '<div style="font-size:.8rem;padding:3px 0;">'+name+(count>1?' ×'+count:'')+'</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForInterworld = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForInterworld) oldRenderNavigationForInterworld();
    const grid = document.getElementById('navSpecialLocationsGrid');
    if (!grid || !window.interWorldTravelUnlocked()) return;
    // Still clickable from anywhere (so a player away from Fair Tide can
    // open the screen, check discoveries, and see why the button's
    // disabled) — only the subtitle changes to say Fair Tide is required.
    const atFairTide = window.canLaunchInterworldExpeditionHere();
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(255,180,80,.5);" onclick="goScreen(\'interworld\')">'+
      '<div style="font-size:1.6rem;">🌌</div><div style="font-weight:600;">Inter-World Expeditions</div>'+
      '<div style="font-size:.72rem;opacity:.7;">'+(atFairTide ? 'Beyond the Horizon Engine\'s door.' : '🔒 Only opens from Fair Tide.')+'</div></div>');
  };

  const oldGoScreenForInterworld = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForInterworld) oldGoScreenForInterworld(name);
    if (name !== 'interworld') return;
    if (game.pendingInterworldExpedition) {
      const destId = game.pendingInterworldExpedition;
      game.pendingInterworldExpedition = null;
      const dest = INTERWORLD_DESTINATIONS.find(d => d.id === destId);
      if (dest) { resolveInterworldExpedition(dest); return; }
    }
    if (typeof window.renderInterworldScreen === 'function') window.renderInterworldScreen();
  };
})();
