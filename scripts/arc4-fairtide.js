
(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE — renovation (one-time) then upkeep (ongoing). Both phases
  // reuse the same dispatch mechanic and the same wall-clock timestamp
  // pattern already powering offline/AFK rewards elsewhere in this game,
  // so a closed tab or app doesn't break the timer.
  // -------------------------------------------------------------------
  const FAIR_TIDE_TASKS = {
    timber:     {label:'Gather timber for dock repairs',        need:10, icon:'🪵', companion:'Zaki'},
    stone:      {label:'Collect stone for warehouse restoration', need:8,  icon:'🪨', companion:'Joel'},
    food:       {label:'Deliver food supplies to the town',      need:5,  icon:'🍚', companion:'Aisyah'},
    lighthouse: {label:"Assist clearing the old lighthouse",     need:1,  icon:'🗼', companion:'San'},
    nets:       {label:"Help local fishermen with their nets",   need:3,  icon:'🎣', companion:'Mezstorm'}
  };
  const DISPATCH_MS = 5*60*1000;
  const COOLDOWN_MS = 30*60*1000;
  const DECAY_INTERVAL_MS = 2*60*60*1000; // -1 Supply per 2 real hours

  function ftRenovation(){ game.fairTideRenovation = game.fairTideRenovation || {timber:0,stone:0,food:0,lighthouse:0,nets:0}; return game.fairTideRenovation; }
  window.fairTideRenovationDone = function(){
    const r = ftRenovation();
    return Object.keys(FAIR_TIDE_TASKS).every(k => r[k] >= FAIR_TIDE_TASKS[k].need);
  };
  window.fairTideThriving = function(){
    // Was gated on the old decaying Port Supply meter — now on Port HQ
    // being built at all (see the Buildings script block below). Kept as
    // its own function since a few other spots already call it by name.
    return window.fairTideRenovationDone() && !!(game.fairTideBuildings && game.fairTideBuildings.port_hq > 0);
  };
  function decayFairTideSupply(){
    if(!window.fairTideRenovationDone()) return;
    const now = Date.now();
    const last = game.fairTideSupplyLastTick || now;
    const steps = Math.floor((now-last)/DECAY_INTERVAL_MS);
    if(steps>0){
      game.fairTideSupply = Math.max(0, (game.fairTideSupply||0) - steps);
      game.fairTideSupplyLastTick = last + steps*DECAY_INTERVAL_MS;
    }
  }
  window.fairTideDispatchStatus = function(){
    const d = game.fairTideDispatch;
    const now = Date.now();
    if(d && d.startedAt){
      const elapsed = now - d.startedAt;
      if(elapsed < DISPATCH_MS) return {state:'out', secondsLeft: Math.ceil((DISPATCH_MS-elapsed)/1000), task:d.task};
      return {state:'ready', task:d.task};
    }
    const cd = game.fairTideCooldownEnd || 0;
    if(now < cd) return {state:'cooldown', secondsLeft: Math.ceil((cd-now)/1000)};
    return {state:'idle'};
  };
  window.dispatchGatheringParty = function(task){
    const status = window.fairTideDispatchStatus();
    if(status.state!=='idle'){ toast('⏳ Not ready yet.'); return; }
    if(!window.fairTideRenovationDone() && !FAIR_TIDE_TASKS[task]){ toast('Pick a task first.'); return; }
    game.fairTideDispatch = {task: task||'supply', startedAt: Date.now()};
    toast('⛵ A gathering party heads out...');
    saveGameQuiet();
    if(typeof renderExplore==='function') renderExplore();
  };
  window.claimGatheringParty = function(){
    const status = window.fairTideDispatchStatus();
    if(status.state!=='ready') return;
    const task = status.task;
    if(!window.fairTideRenovationDone()){
      const r = ftRenovation();
      r[task] = Math.min(FAIR_TIDE_TASKS[task].need, (r[task]||0) + 2);
      toast('📦 The party returns with supplies! +2 toward: '+FAIR_TIDE_TASKS[task].label);
      if(window.fairTideRenovationDone()){
        game.fairTideSupply = 100;
        game.fairTideSupplyLastTick = Date.now();
        logEvent('🏮 Fair Tide is fully renovated! Upkeep begins.', 'gold');
        toast('🏮 Fair Tide is fully renovated! The port is open for good.', 4200);
      }
    } else {
      // Post-renovation gathering now yields the typed resource economy
      // (see the Buildings script block below) instead of the old flat
      // Port Supply number. game.fairTideSupply/decayFairTideSupply are
      // kept as harmless legacy fields for old saves — nothing reads
      // fairTideSupply for Thriving anymore (see fairTideThriving below).
      const yields = (typeof window.fairTideDispatchYield === 'function')
        ? window.fairTideDispatchYield()
        : {timber:4, stone:3, food:3, trade:2};
      game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0};
      const cap = (typeof window.fairTideResourceCap === 'function') ? window.fairTideResourceCap() : 999999;
      const gained = [];
      Object.entries(yields).forEach(([k, v]) => {
        const before = game.fairTideResources[k] || 0;
        game.fairTideResources[k] = Math.min(cap, before + v);
        const actual = game.fairTideResources[k] - before;
        if (actual > 0) gained.push(actual + ' ' + k);
      });
      toast('📦 The gathering party returns with ' + (gained.join(', ') || 'nothing new — storage is full') + '.');
    }
    game.fairTideDispatch = null;
    game.fairTideCooldownEnd = Date.now() + COOLDOWN_MS;
    saveGameQuiet();
    if(typeof renderExplore==='function') renderExplore();
  };

  // Thriving bonus: Market buy discount at Fair Tide, now scaled by the
  // Trading Post building's level (see Buildings script block below)
  // instead of a flat rate. (Sell prices and Shipyard costs are untouched,
  // scoped narrowly on purpose.)
  const oldHaggleForFairTide = window.haggleMultiplier;
  window.haggleMultiplier = function(){
    let m = oldHaggleForFairTide ? oldHaggleForFairTide() : 1;
    if(game.location==='fair_tide' && window.fairTideThriving()){
      const tpLevel = (game.fairTideBuildings && game.fairTideBuildings.trading_post) || 0;
      m *= (1 - Math.min(0.25, 0.04 * tpLevel));
    }
    return m;
  };

  function fmtClock(sec){
    const m = Math.floor(sec/60), s = sec%60;
    return m+':'+String(s).padStart(2,'0');
  }

  // Inject the Dock (renovation/upkeep) and Clinic (Senedra) panels into
  // the existing Explore tab, only at Fair Tide — no new tab/screen needed,
  // Explore already serves as "activities at this port."
  const oldRenderExploreForFairTide = window.renderExplore;
  window.renderExplore = function(){
    if(oldRenderExploreForFairTide) oldRenderExploreForFairTide();
    const container = document.getElementById('exploreContent');
    if(!container) return;

    // Robin C. and Jeff — recurring rivals, challengeable at any port once
    // Chapter 19 ("The Rivals Return," confirming both are back and active)
    // has been read. Originally gated at Chapter 8 for Robin; moved to 19
    // per correction, since that's the actual narrative point both rivals
    // are confirmed to be active threats again, not just defeated-once.
    // Kept separate from the generic per-port harbor list so they read as
    // named, ongoing threats rather than blending into random mobs.
    // BUG FIX: this used to keep showing the "⚔️ Challenge" card forever
    // once Ch.19 was read, with no check for whether the rival had since
    // been captured — so after Arc VI's capture (see window.captureRival,
    // window.rivalCaptured), both this hostile card AND the correct
    // "Community Service" card (added later, same exploreContent
    // container) rendered side by side. A captured rival isn't a fight
    // anymore, so this now skips them entirely once rivalCaptured(key) is
    // true, leaving the community-service card as the only one shown.
    if(!!game.comicProgress4?.[19]){
      ['robin','jeff'].forEach(function(key){
        if(typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) return;
        const base = (typeof HARBOR_ENEMIES!=='undefined') ? HARBOR_ENEMIES[key] : null;
        if(!base) return;
        container.insertAdjacentHTML('beforeend',
          '<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">'+base.icon+' Rival: '+esc(base.name)+'</h3>'+
          '<article class="quest-item" style="border-left-color:var(--danger);"><div style="display:flex;gap:10px;align-items:center;">'+
          '<div style="font-size:1.8rem;">'+base.icon+'</div><div style="flex:1;"><strong>'+esc(base.name)+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+esc(base.desc)+'</span></div>'+
          '<button class="btn btn-small btn-danger" onclick="startHarborFight(\''+key+'\')">⚔️ Challenge</button></div></article>');
      });
    }

    if(game.location!=='fair_tide') return;
    decayFairTideSupply();
    const status = window.fairTideDispatchStatus();
    let dispatchHtml = '';
    if(status.state==='idle'){
      if(!window.fairTideRenovationDone()){
        dispatchHtml = '<select id="ftTaskPick" class="btn btn-small" style="margin-right:6px;">'+
          Object.entries(FAIR_TIDE_TASKS).filter(([k,t])=>ftRenovation()[k]<t.need).map(([k,t])=>'<option value="'+k+'">'+t.icon+' '+esc(t.label)+' ('+ftRenovation()[k]+'/'+t.need+')</option>').join('')+
          '</select><button class="btn btn-small btn-success" onclick="dispatchGatheringParty(document.getElementById(\'ftTaskPick\').value)">⛵ Send Gathering Party</button>';
      }
    } else if(status.state==='out'){
      dispatchHtml = '<div class="story-chip">⛵ Out gathering — back in '+fmtClock(status.secondsLeft)+'</div>';
    } else if(status.state==='ready'){
      dispatchHtml = '<button class="btn btn-small btn-magic" onclick="claimGatheringParty()">📦 Collect the Gathering Party</button>';
    } else if(status.state==='cooldown'){
      dispatchHtml = '<div class="story-chip">🌙 Crew resting — ready again in '+fmtClock(status.secondsLeft)+'</div>';
    }
    if(!window.fairTideRenovationDone()){
      const r = ftRenovation();
      const dockHtml = '<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">🔨 The Dock — Renovating Fair Tide</h3>'+
        '<article class="quest-item"><div style="font-size:.85rem;opacity:.85;margin-bottom:8px;">A weathered harbour, worth bringing back to life. Send a gathering party out for whichever task needs it most.</div>'+
        Object.entries(FAIR_TIDE_TASKS).map(([k,t])=>'<div style="font-size:.8rem;margin:3px 0;">'+t.icon+' '+esc(t.label)+' — <strong>'+r[k]+'/'+t.need+'</strong> <span style="opacity:.7;">('+t.companion+')</span></div>').join('')+
        '<div style="margin-top:10px;">'+dispatchHtml+'</div></article>';
      container.insertAdjacentHTML('beforeend', dockHtml);
    } else {
      // Renovation's done — the Dock, Buildings, Trade, and Clinic all
      // moved to their own Fair Tide Hub screen (see the Buildings script
      // block below) rather than staying crammed into the Explore tab.
      const hubHtml = '<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">🏮 Fair Tide</h3>'+
        '<article class="quest-item"><div style="font-size:.85rem;opacity:.85;margin-bottom:10px;">The port is open for good. Buildings, trade, gathering, and the Clinic are all run from the hub now.</div>'+
        '<button class="btn btn-success" onclick="goScreen(\'fairtide\')">🏮 Enter Fair Tide Hub</button></article>';
      container.insertAdjacentHTML('beforeend', hubHtml);
    }
  };
  window.__ctOpenFairTideClinic = function(){
    if(!game.fairTideClinicSeen){
      game.fairTideClinicSeen = true;
      toast('🩹 Senedra: "I don\'t know why I know this. I just... do."', 3600);
    }
    if(typeof freeRestAtPort==='function') freeRestAtPort();
    else toast('🩹 The crew rests and recovers.');
    saveGameQuiet();
  };

  // -------------------------------------------------------------------
  // ARC 4 — "The Gathering Tide." Same pattern as Arc II/III: full pages,
  // open in new tab + Mark Chapter Read. Chapter 1 only for now — more
  // chapters get appended to this list as they're written. Deliberately
  // gated higher than Fair Tide itself (level 80 vs. the port's level 60)
  // so the port interlude has room to breathe before Arc IV's story
  // content becomes available, rather than unlocking simultaneously.
  // -------------------------------------------------------------------
  const ARC4_CHAPTERS = [
    {id:1,  title:'A Port Between Horizons',   focus:'The crew reaches Fair Tide and begins to make it their own.',                    image:'assets/comics/arc4/ch01-a-port-between-horizons.png',   xp:150},
    {id:2,  title:'New Faces, Old Familiarity', focus:'Some people feel like a memory before the memory returns.',                      image:'assets/comics/arc4/ch02-new-faces-old-familiarity.png', xp:150},
    {id:3,  title:'The Scout and the Fox',      focus:'Iris and Ash join the crew.',                                                    image:'assets/comics/arc4/ch03-the-scout-and-the-fox.png',     xp:175},
    {id:4,  title:'The Rabbit at the Lookout',  focus:'KW Liang and Snowball join the crew.',                                           image:'assets/comics/arc4/ch04-the-rabbit-at-the-lookout.png', xp:175},
    {id:5,  title:'A Familiar Kind of Trouble', focus:'Fragments of recognition, without the memories to explain them.',                image:'assets/comics/arc4/ch05-a-familiar-kind-of-trouble.png',xp:150},
    {id:6,  title:'The Ship Worth Taking',      focus:'Robin C. of R&C notices Crimson Tide — and starts watching.',                    image:'assets/comics/arc4/ch06-the-ship-worth-taking.png',     xp:175},
    {id:7,  title:'Terms of Capture',           focus:"Robin's first move against the crew.",                                          image:'assets/comics/arc4/ch07-terms-of-capture.png',          xp:200},
    {id:8,  title:'The Contract',               focus:'Robin is defeated — but escapes.',                                              image:'assets/comics/arc4/ch08-the-contract.png',               xp:225},
    {id:9,  title:'The Doctor on Shore',        focus:'Dr AA joins the crew.',                                                          image:'assets/comics/arc4/ch09-the-doctor-on-shore.png',       xp:175},
    {id:10, title:"The Diviner's Path",         focus:'Mimi joins the crew.',                                                           image:'assets/comics/arc4/ch10-the-diviners-path.png',         xp:175},
    {id:11, title:'Two Who Choose Each Other',  focus:'Brada Shah joins the crew, alongside Mimi.',                                     image:'assets/comics/arc4/ch11-two-who-choose-each-other.png', xp:175},
    {id:12, title:'A Better Offer',             focus:'Jeff approaches Joel with an offer.',                                            image:'assets/comics/arc4/ch12-a-better-offer.png',             xp:150},
    {id:13, title:"The First Mate's Answer",    focus:'Joel refuses Jeff.',                                                             image:'assets/comics/arc4/ch13-the-first-mates-answer.png',    xp:175},
    {id:14, title:'The Night Raid',             focus:"Jeff attacks. A shore battle, not a sea battle.",                                image:'assets/comics/arc4/ch14-the-night-raid.png',             xp:225},
    {id:15, title:"Stand With Who's Right",     focus:'Another captain makes Joel an offer. He turns it down.',                         image:'assets/comics/arc4/ch15-stand-with-whos-right.png',     xp:175},
    {id:16, title:'The Tide Gathers',           focus:'More allies arrive at Fair Tide.',                                               image:'assets/comics/arc4/ch16-the-tide-gathers.png',           xp:150},
    {id:17, title:'What We Recognise',          focus:'The recurring sense of familiarity, confronted directly.',                       image:'assets/comics/arc4/ch17-what-we-recognise.png',          xp:150},
    {id:18, title:'The Port Becomes Ours',      focus:'Fair Tide, now a true home port.',                                               image:'assets/comics/arc4/ch18-the-port-becomes-ours.png',      xp:150},
    {id:19, title:'The Rivals Return',          focus:'Robin and Jeff are both rebuilding. Defeated, not gone.',                         image:'assets/comics/arc4/ch19-the-rivals-return.png',          xp:200},
    {id:20, title:'A Crew Worth Following',     focus:'Every ally confirms why they stay.',                                             image:'assets/comics/arc4/ch20-a-crew-worth-following.png',     xp:175},
    {id:21, title:'Beyond the Next Horizon',    focus:'Arc IV closes. Larger crew, wider world.',                                        image:'assets/comics/arc4/ch21-beyond-the-next-horizon.png',    xp:250}
  ];
  window.ARC4_CHAPTERS = ARC4_CHAPTERS;

  window.arc4ObjectiveState = function(){
    if(typeof window.arc3ObjectiveState!=='function' || window.arc3ObjectiveState()!=='arc3_chapters_complete_for_now') return null;
    if(level()<60) return null;
    game.comicProgress4 = game.comicProgress4||{};
    for(const ch of ARC4_CHAPTERS){
      if(!game.comicProgress4[ch.id]) return 'complete_arc4_chapter_'+ch.id;
    }
    return 'arc4_chapters_complete_for_now';
  };

  // Sea ambush: once Chapter 19 ("The Rivals Return") is read, every voyage
  // carries a chance of Robin or Jeff intercepting the ship at sea — never
  // both at once. Hooks doVoyage the same way Arc II's Fair Tide sail-flag
  // already does: check first, and either redirect into combat or hand off
  // to whatever doVoyage already was.
  // BUG FIX: same missing-capture-check gap as the Explore-tab Challenge
  // card above — this kept rolling ambushes for a rival already captured
  // and serving community service at Fair Tide, which doesn't make sense
  // (he's not roaming the seas if he's cleaning docks). Now excludes
  // whichever of the two is captured, and skips the whole ambush if both are.
  // Shared list of named rivals eligible for sea ambush + capture —
  // extend this one array when a future rival is added, rather than
  // updating multiple hardcoded lists in sync.
  const KNOWN_RIVAL_KEYS = ['robin', 'jeff'];
  window.KNOWN_RIVAL_KEYS = KNOWN_RIVAL_KEYS;

  const RIVAL_AMBUSH_CHANCE = 0.15;
  const oldDoVoyageForArc4 = window.doVoyage;
  window.doVoyage = function(portId, days, dangerLevel){
    const activeRivals = KNOWN_RIVAL_KEYS.filter(k => !(typeof window.rivalCaptured === 'function' && window.rivalCaptured(k)));
    if(!!game.comicProgress4?.[19] && activeRivals.length && Math.random() < RIVAL_AMBUSH_CHANCE){
      const rivalKey = activeRivals[Math.floor(Math.random() * activeRivals.length)];
      const base = (typeof HARBOR_ENEMIES!=='undefined') ? HARBOR_ENEMIES[rivalKey] : null;
      if(base){
        toast('⚔️ '+base.name+' intercepts the ship!');
        logEvent('⚔️ Ambushed at sea by '+base.name+'.', 'bad');
        // Same 'sea' kind the existing random voyage-event combat already
        // uses (see doVoyage's EVENTS loop) — matches its flee/defeat
        // handling exactly, and scaleCrimsonEnemy treats 'sea' identically
        // to 'harbor' for scaling purposes, so this auto-scales the same way.
        startCombat({kind:'sea', key:rivalKey, enemy: scaledEnemyForExplore(rivalKey, 'sea'), portId:null});
        return;
      }
    }
    return oldDoVoyageForArc4.apply(this, arguments);
  };
  // Chapter → companion recruitment. Fires once, the moment the chapter that
  // introduces each ally is marked read — reuses game.foundCompanions, the
  // exact same mechanism every earlier companion (Joel, Aisyah, etc.) is
  // recruited through, so memberUnlocked() needs no changes at all.
  const ARC4_RECRUITS = {3:'iris', 4:'kw_liang', 9:'dr_aa', 10:'mimi', 11:'brada_shah'};

  // Real fights for Ch.8/Ch.14's story beats (see the renderStory edit
  // above). Reuses HARBOR_ENEMIES.robin/jeff — the exact same stat block
  // the repeatable "Rival: Robin — Challenge" fight already uses — via
  // scaleCrimsonEnemy, same as every other fight in the game.
  function generateArc4StoryEnemy(key){
    const base = (typeof HARBOR_ENEMIES!=='undefined') ? HARBOR_ENEMIES[key] : null;
    if(!base) return null;
    return (typeof scaleCrimsonEnemy==='function') ? scaleCrimsonEnemy(base,'harbor') : base;
  }
  window.startArc4RobinFight = function(){
    if (window.arc4ObjectiveState() !== 'complete_arc4_chapter_8') { toast('🔒 Not available right now.'); return; }
    const enemy = generateArc4StoryEnemy('robin');
    if (!enemy) { toast('Something\'s missing — Robin isn\'t available to fight right now.'); return; }
    startCombat({kind:'arc4_robin_story', key:'robin', enemy});
  };
  window.startArc4JeffFight = function(){
    if (window.arc4ObjectiveState() !== 'complete_arc4_chapter_14') { toast('🔒 Not available right now.'); return; }
    const enemy = generateArc4StoryEnemy('jeff');
    if (!enemy) { toast('Something\'s missing — Jeff isn\'t available to fight right now.'); return; }
    startCombat({kind:'arc4_jeff_story', key:'jeff', enemy});
  };

  const oldHandleVictoryForArc4Story = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForArc4Story) oldHandleVictoryForArc4Story();
    const enemy = game.combatEnemy;
    if (!enemy) return;
    // Reuses markArc4ChapterRead entirely — same XP/reputation/
    // recruitment/save logic as every other Arc IV chapter, just
    // triggered by a fight win instead of a direct button click. That
    // function already re-checks the objective state and already-done
    // status itself, so this can't double-grant even if handleVictory
    // somehow fired twice for the same win.
    if (enemy.kind === 'arc4_robin_story') markArc4ChapterRead(8);
    else if (enemy.kind === 'arc4_jeff_story') markArc4ChapterRead(14);
  };

  window.markArc4ChapterRead = function(id){
    id = Number(id);
    const ch = ARC4_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc4] no chapter data for id', id); return; }
    game.comicProgress4 = game.comicProgress4||{};
    if(game.comicProgress4[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc4ObjectiveState() !== 'complete_arc4_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress4[id] = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0)+1;
    logEvent('📖 Arc 4 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    const recruitId = ARC4_RECRUITS[id];
    if(recruitId && !game.foundCompanions?.[recruitId]){
      game.foundCompanions = game.foundCompanions||{};
      game.foundCompanions[recruitId] = true;
      const member = (typeof ALL_PARTY!=='undefined') ? ALL_PARTY.find(m=>m.id===recruitId) : null;
      const label = member ? member.name : recruitId;
      logEvent('⚓ '+label+' has joined the crew!', 'gold');
      toast('⚓ '+label+' has joined the crew!', 3600);
    }
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };
  window.__ctShowArc4Splash = function(){
    const overlay = document.getElementById('arc4SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex'; overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc4SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc4Splash = function(){
    const overlay = document.getElementById('arc4SplashOverlay');
    if(overlay){ overlay.style.display='none'; overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }
    document.body.style.overflow='';
  };

  const oldRenderStoryForArc4 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc4) oldRenderStoryForArc4();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc4Ready = typeof window.arc4ObjectiveState==='function' && window.arc4ObjectiveState()!==null;
    if(arc4Ready && !game.arc4SplashSeen && typeof window.__ctShowArc4Splash==='function'){
      window.__ctShowArc4Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc4/arc4-cover-gathering-tide.png" alt="Arc IV — The Gathering Tide" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc IV</div><div class="story-act-title">The Gathering Tide</div>'+
      '<div class="story-act-tagline">1 chapter so far. New people, new horizons.</div></div>';
    if(!arc4Ready){
      const arc3Done = typeof window.arc3ObjectiveState==='function' && window.arc3ObjectiveState()==='arc3_chapters_complete_for_now';
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc IV Locked</div><div class="story-chapter-sub">'+
        (!arc3Done ? 'Finish all of Arc III first.' : 'Reach Level 80 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc4ObjectiveState();
    ARC4_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress4?.[ch.id];
      const ready = !done && so===('complete_arc4_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      // Ch.8 ("The Contract" — Robin defeated) and Ch.14 ("The Night
      // Raid" — Jeff attacks) both explicitly describe a fight in their
      // own chapter text, but were wired with the same generic "Mark
      // Chapter Read" button as every quiet chapter — no combat actually
      // happened. Fixed by requiring a real fight first, reusing the
      // same HARBOR_ENEMIES.robin/jeff stats the repeatable Challenge
      // fights already use, and reusing markArc4ChapterRead for the
      // actual completion (XP/reputation/recruitment/save all stay
      // exactly as they were — this only changes HOW the chapter
      // completes, not what completing it does).
      if (ready && ch.id === 8) {
        action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-danger" onclick="startArc4RobinFight()">⚔️ Fight Robin</button>';
      } else if (ready && ch.id === 14) {
        action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-danger" onclick="startArc4JeffFight()">⚔️ Fight Jeff</button>';
      } else if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc4ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc4_chapters_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc IV chapters read. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForArc4 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc4) oldRenderComicArchiveForArc4();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress4 = (typeof game!=='undefined' && game.comicProgress4) || {};
    const arc4Read = ARC4_CHAPTERS.filter(ch=>!!progress4[ch.id]);
    const section = !arc4Read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc IV chapters read yet.</div></div>'
      : arc4Read.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc IV — The Gathering Tide</div>' + section);
  };
})();
