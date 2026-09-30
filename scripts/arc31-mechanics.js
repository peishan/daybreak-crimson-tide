(function(){
  // -------------------------------------------------------------------
  // ARC XXXI MECHANICS — FAIR TIDE DEFENSE & READINESS, the gameplay
  // Ch.3-5, 7-8, 12, and 18-21's own notes call for. Kept OUT of
  // arc31.js itself, same split used since Arc XXIII.
  //
  // Deliberately NOT another combat minigame. Fair Tide gains an
  // overall Readiness rating across four areas, each tied to a
  // character already established in this arc's own story beats:
  //
  //   Warden Readiness      — Joy   (Ch.3, formalized Ch.19)
  //   Infrastructure        — Caelan (Ch.4, formalized Ch.12)
  //   Harbor Defense        — Brada (Ch.5, formalized Ch.16/20)
  //   Command Readiness     — Joel  (Ch.8's drill, formalized Ch.20)
  //
  // Emergency Events (the story's own Ch.9, 13, 16, 17, 18) are logged
  // automatically as they're read, with an outcome computed from
  // whatever the Readiness score already was at that moment — the
  // player never manually commands a response. EMERGENCY_EVENT_TYPES
  // lists the full reusable event vocabulary (Harbor intrusion, Fire,
  // Sabotage attempt, Missing resident, Suspicious vessel, Horizon
  // disturbance, Storm damage) per the outline, even though only the
  // subset this arc's own chapters actually cause get logged here —
  // future arcs can log further instances of any of these types
  // without rebuilding the system, the same way Arc XXX's Nameless
  // Allegiances registry was built to be reused.
  //
  // Defense Assignments is a READOUT, not a lever — reusing existing
  // characters exactly as the outline specifies (Joy/Warden,
  // Caelan/Infrastructure, Brada/Harbor Artillery, Joel/Command,
  // Senedra/Reconnaissance, Zaki/Ground Defense, Renn & Erynn/Horizon
  // Security, Aisyah/Emergency Logistics). San deliberately gets no
  // assignment slot here — per the outline, "Captain is the system
  // above them," not one more role inside it.
  //
  // Ch.21 ("Captain") is where the outline says the system's own
  // unlock lands, matching that chapter's centerpiece XP (400) and its
  // own thesis: Fair Tide survives because Fair Tide works, not
  // because San personally wins every fight. The unlock banner reads
  // "🏡 FAIR TIDE READINESS UNLOCKED" — deliberately not "Fortress
  // unlocked," matching the outline's explicit framing that this is
  // resilience, not a settlement turning into a stronghold.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. SETTLEMENT READINESS
  // ===========================================================================
  const READINESS_AREAS = [
    { key:'warden',         icon:'🛡️', label:'Warden Readiness',   character:'Joy' },
    { key:'infrastructure', icon:'🔨', label:'Infrastructure',      character:'Caelan' },
    { key:'harbor',         icon:'🎯', label:'Harbor Defense',      character:'Brada' },
    { key:'command',        icon:'⚓', label:'Command Readiness',   character:'Joel' }
  ];
  window.ARC31_READINESS_AREAS = READINESS_AREAS;

  function fairTideReadinessState(){
    if (!game.fairTideReadiness) {
      game.fairTideReadiness = {
        areas: { warden:0, infrastructure:0, harbor:0, command:0 },
        unlocked: false,
        drillPassed: false,
        eventLog: []
      };
    }
    return game.fairTideReadiness;
  }
  window.fairTideReadinessState = fairTideReadinessState;

  function setReadinessArea(key, value){
    const state = fairTideReadinessState();
    if (!(key in state.areas)) return;
    state.areas[key] = Math.max(state.areas[key], value); // never regresses
  }

  window.fairTideReadinessScore = function(){
    const state = fairTideReadinessState();
    const vals = READINESS_AREAS.map(function(a){ return state.areas[a.key] || 0; });
    return Math.round(vals.reduce(function(sum, v){ return sum + v; }, 0) / vals.length);
  };

  // ===========================================================================
  // 2. EMERGENCY EVENTS — logged automatically, resolved by whatever
  // Readiness already was, never by player micromanagement.
  // ===========================================================================
  const EMERGENCY_EVENT_TYPES = [
    'Harbor intrusion', 'Fire', 'Sabotage attempt', 'Missing resident',
    'Suspicious vessel', 'Horizon disturbance', 'Storm damage'
  ];
  window.ARC31_EMERGENCY_EVENT_TYPES = EMERGENCY_EVENT_TYPES;

  function resolutionForScore(score){
    if (score >= 70) return 'Contained cleanly — Fair Tide barely noticed.';
    if (score >= 40) return 'Contained, with some damage.';
    return 'Serious damage taken — Fair Tide was not ready enough yet.';
  }

  function logEmergencyEvent(type, chapterId){
    const state = fairTideReadinessState();
    const score = window.fairTideReadinessScore();
    state.eventLog.push({
      type: type,
      chapterId: chapterId,
      day: game.day || 0,
      readinessAtTime: score,
      outcome: resolutionForScore(score)
    });
  }
  window.logEmergencyEvent = logEmergencyEvent;

  // Chapter -> (readiness bump first, event logged second — the event's
  // own outcome reflects readiness AS OF that chapter, not a bump this
  // same chapter grants) mapping, per the story beats each chapter is.
  const CHAPTER_READINESS_BUMPS = {
    3:  { warden: 40 },           // The Warden — Joy proposes the system
    4:  { infrastructure: 30 },   // Walls Aren't Enough — Caelan begins
    5:  { harbor: 40 },           // Brada's Range — positions identified
    8:  { command: 30 },         // Again — the second drill actually works
    12: { infrastructure: 90 },   // Caelan's Fair Tide — phase one complete
    16: { harbor: 80 },           // Warning Shot — Brada proves the positions work
    19: { warden: 100 },         // Warden of Fair Tide — Joy formalized
    20: { command: 100, harbor: 100 } // First Mate of Fair Tide — assignments named
  };

  const CHAPTER_EMERGENCY_EVENTS = {
    9:  'Horizon disturbance',    // Soel Knows First
    10: 'Suspicious vessel',      // Watching the Watchers
    13: 'Suspicious vessel',      // Ships at the Edge
    16: 'Harbor intrusion',       // Warning Shot
    17: 'Horizon disturbance',    // Someone Tests the Horizon
    18: 'Sabotage attempt'        // The Real Attack
  };

  const oldSyncArc1ForReadiness = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForReadiness) oldSyncArc1ForReadiness();
    const cp = game.comicProgress31;
    if (!cp) return;
    const state = fairTideReadinessState();

    Object.keys(CHAPTER_READINESS_BUMPS).forEach(function(chId){
      if (!cp[chId]) return;
      const bumps = CHAPTER_READINESS_BUMPS[chId];
      Object.keys(bumps).forEach(function(areaKey){ setReadinessArea(areaKey, bumps[areaKey]); });
    });

    if (cp[8] && !state.drillPassed) {
      state.drillPassed = true;
      toast('📋 Fair Tide\'s emergency drill actually works this time.', 3600);
    }

    Object.keys(CHAPTER_EMERGENCY_EVENTS).forEach(function(chId){
      const alreadyLogged = state.eventLog.some(function(e){ return e.chapterId === Number(chId); });
      if (cp[chId] && !alreadyLogged) {
        logEmergencyEvent(CHAPTER_EMERGENCY_EVENTS[chId], Number(chId));
      }
    });

    if (cp[21] && !state.unlocked) {
      state.unlocked = true;
      toast('🏡 FAIR TIDE READINESS UNLOCKED', 4200);
      if (typeof logEvent === 'function') logEvent('🏡 Fair Tide Readiness unlocked — Fair Tide survives because Fair Tide works, not because San wins every fight alone.', 'good');
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // 3. DEFENSE ASSIGNMENTS — a readout, not a lever. San holds no slot
  // here: per the outline, she's the system above them, not inside it.
  // ===========================================================================
  const DEFENSE_ASSIGNMENTS = [
    { key:'warden',              icon:'🛡️', label:'Warden — Civilian Protection', character:'Joy' },
    { key:'infrastructure',      icon:'🔨', label:'Infrastructure',               character:'Caelan' },
    { key:'harbor_artillery',    icon:'🎯', label:'Harbor Artillery',             character:'Brada' },
    { key:'command',             icon:'⚓', label:'Command',                      character:'Joel' },
    { key:'reconnaissance',      icon:'👁️', label:'Reconnaissance',               character:'Senedra' },
    { key:'ground_defense',      icon:'💥', label:'Ground Defense',               character:'Zaki' },
    { key:'horizon_security',    icon:'🌌', label:'Horizon Security',             character:'Renn & Erynn' },
    { key:'emergency_logistics', icon:'📦', label:'Emergency Logistics',          character:'Aisyah' }
  ];
  window.ARC31_DEFENSE_ASSIGNMENTS = DEFENSE_ASSIGNMENTS;

  function defenseAssignmentsUnlocked(){
    return !!(game.comicProgress31 && game.comicProgress31[20]);
  }
  window.defenseAssignmentsUnlocked = defenseAssignmentsUnlocked;

  // ===========================================================================
  // 4. RENDERING
  // ===========================================================================
  function readinessUnlocked(){
    return !!(game.comicProgress31 && game.comicProgress31[3]);
  }
  window.readinessUnlocked = readinessUnlocked;

  function renderFairTideReadinessPanel(){
    if (!readinessUnlocked()) return '';
    const state = fairTideReadinessState();
    const score = window.fairTideReadinessScore();
    let html = '<div class="panel-title" style="margin-top:16px;">🏡 Fair Tide Readiness</div>';
    if (state.unlocked) {
      html += '<article class="quest-item" style="border-color:#e8c96a;"><strong>🏡 FAIR TIDE READINESS UNLOCKED</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">Fair Tide survives because Fair Tide works.</span></article>';
    }
    html += '<article class="quest-item"><strong>Overall Readiness: '+score+'/100</strong></article>';
    READINESS_AREAS.forEach(function(area){
      const value = state.areas[area.key] || 0;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.3rem;">'+area.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(area.label)+'</strong> — '+esc(area.character)+'<br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+value+'/100</span>'+
        '</div></div></article>';
    });
    if (defenseAssignmentsUnlocked()) {
      html += '<div class="panel-title" style="margin-top:12px;font-size:.9rem;">Defense Assignments</div>';
      DEFENSE_ASSIGNMENTS.forEach(function(a){
        html += '<article class="quest-item"><span style="font-size:1.1rem;">'+a.icon+'</span> <strong>'+esc(a.label)+'</strong> — '+esc(a.character)+'</article>';
      });
    }
    if (state.eventLog.length) {
      html += '<div class="panel-title" style="margin-top:12px;font-size:.9rem;">Emergency Event Log</div>';
      state.eventLog.forEach(function(e){
        html += '<article class="quest-item"><strong>'+esc(e.type)+'</strong><br>'+
          '<span style="font-size:.78rem;opacity:.75;">'+esc(e.outcome)+'</span></article>';
      });
    }
    return html;
  }
  window.renderFairTideReadinessPanel = renderFairTideReadinessPanel;

  // ===========================================================================
  // Archive screen wiring — same insert-and-replace pattern used since
  // Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForReadiness = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForReadiness) oldRenderArchiveScreenForReadiness();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('readinessPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideReadinessPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="readinessPanelWrap">'+panel+'</div>');
  };
})();
