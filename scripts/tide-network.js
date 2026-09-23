
(function(){
  // -------------------------------------------------------------------
  // THE TIDE NETWORK — Arc XIV's environmental/aquatic parallel to Arc
  // XIII's Harbour, per San's own design doc. Same overall shape (an
  // "Unknown X" header that becomes a real name, sections that unlock
  // progressively) but the core new piece is Current Mapping instead of
  // cultural discovery: a pool of current nodes, gradually charted,
  // rather than streets and districts.
  //
  // Soel gets his own, genuinely separate mechanic here — the Spiritual
  // Current — pulling from a distinct node pool only he can reach,
  // matching San's own examples (an old memory, a forgotten route, an
  // unusual current, a spiritually significant place, evidence of an
  // older civilization). Deliberately not treasure, and deliberately
  // not an auto-solve button — same cooldown-gated rhythm as mapping the
  // physical currents, just a separate, rarer pool.
  //
  // No grindy resource layer, per San's explicit direction — nodes are
  // discoveries with flavor text, not currency to grind.
  //
  // Unlocked by Arc XIV Ch.1 (tideNetworkDiscovered, added alongside
  // this build). Section list and initial unlock state match San's
  // spec exactly: Enter the Settlement / Map Currents / Observe open
  // from the start; Underwater Market / Community / Fishing Grounds /
  // Tide Routes / Requests all locked.
  // -------------------------------------------------------------------
  const TIDE_NETWORK_SECTIONS = [
    {key:'enter_settlement', name:'Enter the Settlement', icon:'🌊', lockedText: null},
    {key:'map_currents', name:'Map Currents', icon:'🧭', lockedText: null},
    {key:'observe', name:'Observe', icon:'👁️', lockedText: null},
    {key:'underwater_market', name:'Underwater Market', icon:'🐚', lockedText: '🔒 Not yet established'},
    {key:'community', name:'Community', icon:'🏘️', lockedText: '🔒 No relationship yet'},
    {key:'fishing_grounds', name:'Fishing Grounds', icon:'🐟', lockedText: '🔒 Not yet shared'},
    {key:'tide_routes', name:'Tide Routes', icon:'🌊', lockedText: '🔒 No safe passage known'},
    {key:'requests', name:'Requests', icon:'💬', lockedText: '🔒 No local requests available'}
  ];
  window.TIDE_NETWORK_SECTIONS = TIDE_NETWORK_SECTIONS;

  const CURRENT_NODES = [
    {id:'fishing_grounds_node', name:'Fishing Grounds', icon:'🐟', flavor:'Where the settlement actually feeds itself — carefully worked, not overfished. Whoever manages this knows exactly what the water can give.'},
    {id:'reef_passage', name:'Reef Passage', icon:'🪸', flavor:'A narrow way through coral old enough to have its own name among the locals, even if the crew doesn\'t know it yet.'},
    {id:'trade_current', name:'Trade Current', icon:'💱', flavor:'A route that moves goods, not just water — the underwater equivalent of a trade road, worn smooth by regular use.'},
    {id:'deep_trench', name:'Deep Trench', icon:'🕳️', flavor:'Colder than everything around it, and the current here runs differently than it should. Nobody\'s explained why yet.'},
    {id:'coral_maze', name:'Coral Maze', icon:'🌀', flavor:'Looks the same in every direction unless you already know the way through — which the settlement clearly does, and the crew clearly doesn\'t, yet.'},
    {id:'settlement_approach', name:'Settlement Approach', icon:'⚓', flavor:'The designated route in — not the fastest way, but the one that doesn\'t alarm anyone watching from below.'}
  ];
  window.CURRENT_NODES = CURRENT_NODES;

  const SPIRITUAL_NODES = [
    {id:'old_memory', name:'An Old Memory', icon:'💭', flavor:'Not Soel\'s own. Something that happened here once, still caught in the current the way a scent lingers in a closed room.'},
    {id:'forgotten_route', name:'A Forgotten Route', icon:'🗺️', flavor:'A path nobody living uses anymore, but the water still remembers the shape of it.'},
    {id:'unusual_current', name:'An Unusual Current', icon:'🌊', flavor:'Moving against everything around it, deliberately, like it\'s still doing a job somebody assigned it a very long time ago.'},
    {id:'significant_place', name:'A Place of Spiritual Significance', icon:'✨', flavor:'Soel won\'t go any closer than this. Not fear, exactly. Something more like respect.'},
    {id:'older_civilization', name:'Evidence of an Older Civilization', icon:'🏺', flavor:'Older than the settlement above it, and not built by the same people at all. Erynn is going to want a very long time with this.'}
  ];
  window.SPIRITUAL_NODES = SPIRITUAL_NODES;

  function tideNetworkState(){
    game.tideNetworkState = game.tideNetworkState || {
      nameKnown: false, name: null, relationship: 'New Visitors',
      sections: {enter_settlement:true, map_currents:true, observe:true, underwater_market:false, community:false, fishing_grounds:false, tide_routes:false, requests:false},
      mappedNodes: {}, spiritualNodes: {}
    };
    const ts = game.tideNetworkState;
    if (ts.relationship === undefined) ts.relationship = 'New Visitors';
    if (ts.mappedNodes === undefined) ts.mappedNodes = {};
    if (ts.spiritualNodes === undefined) ts.spiritualNodes = {};
    return ts;
  }
  window.tideNetworkState = tideNetworkState;

  window.tideNetworkUnlocked = function(){
    return !!game.tideNetworkDiscovered;
  };

  window.unlockTideNetworkSection = function(key){
    const ts = tideNetworkState();
    if (ts.sections[key] !== undefined) ts.sections[key] = true;
  };
  window.setTideNetworkName = function(name){
    const ts = tideNetworkState();
    ts.name = name;
    ts.nameKnown = true;
  };

  const MAP_COOLDOWN_MS = 4 * 3600 * 1000; // 4 hours between mapping attempts
  const SPIRITUAL_COOLDOWN_MS = 10 * 3600 * 1000; // rarer — Soel's own rhythm, not on-demand

  window.mapCurrentsStatus = function(){
    const ts = tideNetworkState();
    const nextAt = ts.nextMapAt || 0;
    if (Date.now() < nextAt) return {state:'cooldown', msLeft: nextAt - Date.now()};
    return {state:'ready'};
  };
  window.spiritualCurrentStatus = function(){
    const ts = tideNetworkState();
    const nextAt = ts.nextSpiritualAt || 0;
    if (Date.now() < nextAt) return {state:'cooldown', msLeft: nextAt - Date.now()};
    return {state:'ready'};
  };

  window.mapCurrents = function(){
    if (!window.tideNetworkUnlocked()) return;
    const status = window.mapCurrentsStatus();
    if (status.state !== 'ready') { toast('⏳ Not ready yet.'); return; }
    const ts = tideNetworkState();
    const unmapped = CURRENT_NODES.filter(n => !ts.mappedNodes[n.id]);
    ts.nextMapAt = Date.now() + MAP_COOLDOWN_MS;
    if (!unmapped.length) { toast('🧭 The known currents are all charted for now.'); if (typeof saveGameQuiet === 'function') saveGameQuiet(); return; }
    const node = unmapped[Math.floor(Math.random() * unmapped.length)];
    ts.mappedNodes[node.id] = true;
    logEvent('🧭 Current mapped: ' + node.icon + ' ' + node.name + '.', 'gold');
    toast('🧭 New current mapped: ' + node.icon + ' ' + node.name, 3600);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){ showStoryModal({ title: node.icon + ' ' + node.name, blurb: node.flavor }); }, 400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderTideNetworkScreen === 'function') renderTideNetworkScreen();
  };

  window.checkSpiritualCurrent = function(){
    if (!window.tideNetworkUnlocked()) return;
    const status = window.spiritualCurrentStatus();
    if (status.state !== 'ready') { toast('⏳ Soel isn\'t sensing anything new yet.'); return; }
    const ts = tideNetworkState();
    const unmapped = SPIRITUAL_NODES.filter(n => !ts.spiritualNodes[n.id]);
    ts.nextSpiritualAt = Date.now() + SPIRITUAL_COOLDOWN_MS;
    if (!unmapped.length) { toast('🐾 Soel watches the water, but nothing new stirs.'); if (typeof saveGameQuiet === 'function') saveGameQuiet(); return; }
    const node = unmapped[Math.floor(Math.random() * unmapped.length)];
    ts.spiritualNodes[node.id] = true;
    logEvent('🐾 Soel senses something beneath the current: ' + node.icon + ' ' + node.name + '.', 'gold');
    toast('🐾 Soel senses something beneath the current.', 3600);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){ showStoryModal({ title: '🐾 ' + node.icon + ' ' + node.name, blurb: node.flavor }); }, 400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderTideNetworkScreen === 'function') renderTideNetworkScreen();
  };

  let tideNetworkActiveSection = 'enter_settlement';
  window.switchTideNetworkSection = function(key){
    const ts = tideNetworkState();
    if (!ts.sections[key]) { toast('Not open to them yet.'); return; }
    tideNetworkActiveSection = key;
    window.renderTideNetworkScreen();
  };

  window.renderTideNetworkScreen = function(){
    const titleEl = document.getElementById('tideNetworkHeaderTitle');
    const subEl = document.getElementById('tideNetworkHeaderSubtitle');
    const container = document.getElementById('tideNetworkContent');
    if (!container) return;
    const ts = tideNetworkState();
    if (titleEl) titleEl.textContent = ts.nameKnown ? ('🌊 ' + ts.name) : '🌊 UNKNOWN TIDE SETTLEMENT';
    if (subEl) subEl.textContent = ts.nameKnown ? 'A place the crew is starting to know' : 'Location not yet identified';

    let html = '<div class="tabs" style="flex-wrap:wrap;">';
    TIDE_NETWORK_SECTIONS.forEach(function(sec){
      const unlocked = ts.sections[sec.key];
      html += '<button class="tab-btn'+(tideNetworkActiveSection===sec.key?' active':'')+'" '+
        (unlocked ? 'onclick="switchTideNetworkSection(\''+sec.key+'\')"' : 'disabled style="opacity:.45;cursor:not-allowed;"') +
        '>'+sec.icon+' '+sec.name+'</button>';
    });
    html += '</div><div class="panel" style="margin-top:10px;">';

    const activeDef = TIDE_NETWORK_SECTIONS.find(s => s.key === tideNetworkActiveSection);
    if (!ts.sections[tideNetworkActiveSection]) {
      html += '<div class="story-chip">'+(activeDef?activeDef.lockedText:'🔒 Not available yet')+'</div>';
    } else if (tideNetworkActiveSection === 'enter_settlement') {
      html += '<div class="panel-title">🌊 Enter the Settlement</div>'+
        '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Homes, docks, gathering places — all of it built around how the water actually moves, not fought against.</p>';
      ['confused_shoal','territorial_pufferkin','deepwater_opportunist','tidewrecked_scavenger','unmoored_current_spirit'].forEach(function(key){
        const e = scaledEnemyForExplore(key, 'harbor');
        html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;"><strong>'+e.name+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+e.desc+'</span><br>'+
          '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g · Lv.'+e.scaledFromLevel+'</span></div>'+
          '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \'tidenetwork_explore\')">Fight</button></div></article>';
      });
    } else if (tideNetworkActiveSection === 'observe') {
      const relCount = Object.keys(ts.mappedNodes).length;
      html += '<div class="panel-title">👁️ Observe</div>'+
        '<div style="font-size:.85rem;line-height:1.8;">'+
        'World: <strong>Unknown</strong><br>'+
        'Settlement: <strong>'+(ts.nameKnown ? ts.name : 'Unknown')+'</strong><br>'+
        'Current: <strong>'+(relCount ? 'Partially Mapped ('+relCount+'/'+CURRENT_NODES.length+')' : 'Unmapped')+'</strong><br>'+
        'Relationship: <strong>'+ts.relationship+'</strong>'+
        '</div>';
    } else if (tideNetworkActiveSection === 'map_currents') {
      const status = window.mapCurrentsStatus();
      const mappedCount = Object.keys(ts.mappedNodes).length;
      html += '<div class="panel-title">🧭 Map Currents</div>'+
        '<p style="font-size:.82rem;opacity:.8;margin-bottom:8px;">Renn maps, Erynn interprets, Mimi reads the patterns. Charted so far: '+mappedCount+'/'+CURRENT_NODES.length+'.</p>';
      if (status.state === 'ready') {
        html += '<button class="btn btn-small btn-success" onclick="mapCurrents()">🧭 Chart the Current</button>';
      } else {
        const hrs = Math.max(0, Math.ceil(status.msLeft / 3600000));
        html += '<p style="font-size:.78rem;opacity:.6;">Ready again in about '+hrs+' hour'+(hrs===1?'':'s')+'.</p>';
      }
      Object.keys(ts.mappedNodes).forEach(function(nodeId){
        const node = CURRENT_NODES.find(n => n.id === nodeId);
        if (node) html += '<div style="font-size:.8rem;padding:4px 0;">'+node.icon+' '+node.name+'</div>';
      });
      html += '<div style="margin-top:14px;border-top:1px solid rgba(232,197,71,.2);padding-top:10px;">'+
        '<div class="panel-title" style="font-size:.85rem;">🐾 Spiritual Current</div>'+
        '<p style="font-size:.78rem;opacity:.75;margin-bottom:8px;">Occasionally, Soel senses something beneath the current — not treasure, just something worth knowing.</p>';
      const sStatus = window.spiritualCurrentStatus();
      if (sStatus.state === 'ready') {
        html += '<button class="btn btn-small btn-success" onclick="checkSpiritualCurrent()">🐾 Let Soel Look</button>';
      } else {
        const shrs = Math.max(0, Math.ceil(sStatus.msLeft / 3600000));
        html += '<p style="font-size:.76rem;opacity:.55;">Nothing new to sense for about '+shrs+' hour'+(shrs===1?'':'s')+'.</p>';
      }
      Object.keys(ts.spiritualNodes).forEach(function(nodeId){
        const node = SPIRITUAL_NODES.find(n => n.id === nodeId);
        if (node) html += '<div style="font-size:.8rem;padding:4px 0;opacity:.9;">'+node.icon+' '+node.name+'</div>';
      });
      html += '</div>';
    } else {
      html += '<div class="panel-title">'+(activeDef?activeDef.icon+' '+activeDef.name:'')+'</div>'+
        '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';
    }
    html += '</div>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForTideNetwork = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForTideNetwork) oldRenderNavigationForTideNetwork();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.tideNetworkUnlocked()) return;
    const ts = tideNetworkState();
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(100,220,220,.5);border-style:dashed;" onclick="goScreen(\'tidenetwork\')">'+
      '<div style="font-size:1.6rem;">🌊</div><div style="font-weight:600;">'+(ts.nameKnown?ts.name:'Unknown Tide Settlement')+'</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Something beneath the water.</div></div>');
  };

  const oldGoScreenForTideNetwork = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForTideNetwork) oldGoScreenForTideNetwork(name);
    if (name === 'tidenetwork' && typeof window.renderTideNetworkScreen === 'function') window.renderTideNetworkScreen();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // VOYAGE TRANSITIONS for the Harbour (Arc XIII) and Tide Network (Arc
  // XIV) — makes reaching either feel like an actual voyage instead of
  // an instant teleport, reusing the existing #voyageScreen UI. "Full
  // version" per San's own choice: real risk, themed events, not just a
  // visual pause. Neither pool touches Veyren's own pirates/monsters —
  // these are meant to feel like someone else's danger, not more of
  // Veyren's, per San's own framing when we discussed this.
  // -------------------------------------------------------------------
  const HARBOUR_VOYAGE_EVENTS = [
    { type: 'combat', text: 'Something large surfaces nearby, watching the ship without approaching — yet.', combat: 'territorial_sea_guardian' },
    { type: 'combat', text: 'An unmarked local vessel signals, then closes distance fast. They want answers, now.', combat: 'suspicious_patrol_boat' },
    { type: 'flavor', text: 'A local fishing boat gives you a wide, wary berth as you pass.' },
    { type: 'flavor', text: 'The water shifts color crossing into unfamiliar currents — subtle, but the crew all notice at once.' },
    { type: 'flavor', text: 'The boundary between worlds feels thinner here than it should. Nobody quite says so out loud.' },
    { type: 'flavor', text: 'The wind changes direction twice in an hour, neither time in a way that makes sense.' },
    { type: 'flavor', text: 'A shape breaks the surface far off the bow — gone before anyone can say what it was.' },
    { type: 'flavor', text: 'The charts stop being useful somewhere around here. The crew navigates by feel instead.' },
    { type: 'calm', text: 'The crossing is quiet. Almost too quiet.' }
  ];
  const TIDENETWORK_VOYAGE_EVENTS = [
    { type: 'combat', text: 'Something large moves beneath the hull — big enough that everyone feels it, not just hears it.', combat: 'unknown_deep_dweller' },
    { type: 'combat', text: 'The current turns without warning, hostile and deliberate.', combat: 'disturbed_current_entity' },
    { type: 'flavor', text: 'The current pulls at the hull like it\'s trying to lead you somewhere specific.' },
    { type: 'flavor', text: 'Soel goes very still, staring at the water. He doesn\'t explain why.' },
    { type: 'flavor', text: 'A school of fish scatters ahead of the ship with unusual, deliberate purpose.' },
    { type: 'flavor', text: 'The water goes glassy-calm for a stretch, no wind to explain it.' },
    { type: 'flavor', text: 'Something down in the deep answers back — not words, just a pressure the crew all feel at once.' },
    { type: 'flavor', text: 'Bioluminescence traces the hull\'s wake for a while, then fades as suddenly as it started.' },
    { type: 'calm', text: 'The water holds steady the whole way through.' }
  ];

  // BUG FIX / REBUILD (San's request): these voyages were only 2 ticks —
  // functionally instant compared to a real port-to-port voyage — and had
  // no voyageInProgress lock at all (Clan Settlement's own, separately
  // duplicated version did have the lock, which was itself an
  // inconsistency). Inter-world crossings now run 10 ticks, matching
  // San's own suggested figure, since these are meant to read as a
  // genuinely different, longer kind of crossing than a familiar port
  // route. The flat 45%-per-tick chance from the old 2-tick version
  // would have meant a near-guaranteed encounter on almost every single
  // tick across 10 (1-in-1000 chance of a fully quiet crossing) — rescaled
  // down so the crossing still feels more dangerous than a normal voyage
  // overall, without being combat on every tick. Now exposed on window so
  // Clan Settlement's own sail function can share this exact logic
  // instead of maintaining a second, drifting copy of it.
  function runDestinationVoyage(config){
    if (game.voyageInProgress) { toast('⛵ Already underway — finish this crossing first.'); return; }
    const overlay = document.getElementById('voyageScreen');
    if (!overlay) { goScreen(config.screenName); return; }
    game.voyageInProgress = true;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('voyageScreen').classList.add('active');
    document.getElementById('voyageDest').textContent = 'Toward ' + config.destLabel;
    document.getElementById('voyageProgress').style.width = '0%';
    document.getElementById('voyageEvent').innerHTML = '';
    const totalDays = config.totalDays || 10;
    const perTickChance = config.perTickChance || 0.16;
    let currentDay = 0;
    const interval = setInterval(function(){
      currentDay++;
      document.getElementById('voyageProgress').style.width = (currentDay / totalDays * 100) + '%';
      if (Math.random() < perTickChance) {
        const pool = config.events;
        const event = pool[Math.floor(Math.random() * pool.length)];
        document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--danger);">' + event.text + '</span>';
        if (event.type === 'combat') {
          clearInterval(interval);
          game.voyageInProgress = false;
          setTimeout(function(){
            const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(event.combat, 'sea') : null;
            startCombat({ kind: config.combatKind, key: event.combat, enemy: enemy, portId: null });
          }, 1000);
          return;
        }
      } else {
        document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--success);">The crossing continues.</span>';
      }
      if (currentDay >= totalDays) {
        clearInterval(interval);
        game.voyageInProgress = false;
        setTimeout(function(){ goScreen(config.screenName); }, 800);
      }
    }, 900);
  }
  window.runDestinationVoyage = runDestinationVoyage;

  window.sailToHarbour = function(){
    runDestinationVoyage({
      destLabel: 'the Unknown Harbour',
      events: HARBOUR_VOYAGE_EVENTS,
      combatKind: 'harbour_voyage',
      screenName: 'harbour',
      totalDays: 10
    });
  };
  window.sailToTideNetwork = function(){
    runDestinationVoyage({
      destLabel: 'the Unknown Tide Settlement',
      events: TIDENETWORK_VOYAGE_EVENTS,
      combatKind: 'tidenetwork_voyage',
      screenName: 'tidenetwork',
      totalDays: 10
    });
  };

  // Redirect the existing Sail-screen cards to go through the voyage
  // transition instead of jumping straight to the destination screen.
  const oldRenderNavigationForVoyageTransitions = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForVoyageTransitions) oldRenderNavigationForVoyageTransitions();
    const grid = document.getElementById('navPortGrid');
    if (!grid) return;
    grid.innerHTML = grid.innerHTML
      .replace(/onclick="goScreen\('harbour'\)"/g, 'onclick="sailToHarbour()"')
      .replace(/onclick="goScreen\('tidenetwork'\)"/g, 'onclick="sailToTideNetwork()"');
  };
})();
