(function(){
  // -------------------------------------------------------------------
  // ARC XXXII MECHANICS — FAIR TIDE LIFE, the gameplay Ch.2, 7, 9, and
  // 21-22's own notes call for. Kept OUT of arc32.js itself, same split
  // used since Arc XXIII.
  //
  // Deliberately NOT another major management system, per the outline:
  //
  //   1. SETTLEMENT ROUTINES — a light readout over systems every prior
  //      arc already built (Trade Network/Arc XXVI, Fair Tide
  //      Readiness/Arc XXXI, Warden Assignments/Arc XXIII, Intelligence
  //      Leads/Arc XXIV), reading each one where it's reachable rather
  //      than duplicating any of them. The player can emphasize one or
  //      two of five Priorities at a time; everything else keeps
  //      running at its own normal (AFK) rate regardless. This is
  //      flavor plus a small framing choice, never a numeric simulation
  //      layered on top of what already exists.
  //
  //   2. HOME PREPARATION — a small, three-flag progression for San and
  //      Joel's own home (Home Expansion / Family Supplies / Community
  //      Support), each flipped permanently true by its own story
  //      chapter and never regressing. Birth stays the literal string
  //      'Unknown' always — there is no countdown to unlock, matching
  //      the outline's explicit instruction that Veyren pregnancy is
  //      never forced into an ordinary Earth timetable, and that the
  //      twins are not born in this arc.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. SETTLEMENT ROUTINES
  // ===========================================================================
  const FAIR_TIDE_PRIORITIES = [
    { key:'port_operations',   icon:'⚓', label:'Port Operations',  desc:'Increased trade.' },
    { key:'development',       icon:'🔨', label:'Development',      desc:'Faster construction and repairs.' },
    { key:'readiness',         icon:'🛡️', label:'Readiness',        desc:'Stronger emergency response.' },
    { key:'community',         icon:'🌾', label:'Community',        desc:'Resident happiness and recovery.' },
    { key:'horizon_research',  icon:'🌌', label:'Horizon Research', desc:'Improved route and research progress.' }
  ];
  window.ARC32_FAIR_TIDE_PRIORITIES = FAIR_TIDE_PRIORITIES;

  const MAX_ACTIVE_PRIORITIES = 2;

  function fairTideLifeState(){
    if (!game.fairTideLife) {
      game.fairTideLife = { activePriorities: [] };
    }
    return game.fairTideLife;
  }
  window.fairTideLifeState = fairTideLifeState;

  window.fairTideActivePriorities = function(){
    return fairTideLifeState().activePriorities;
  };

  window.setFairTidePriority = function(key){
    const valid = FAIR_TIDE_PRIORITIES.some(function(p){ return p.key === key; });
    if (!valid) return;
    const state = fairTideLifeState();
    const idx = state.activePriorities.indexOf(key);
    if (idx !== -1) {
      // Already emphasized -- toggling it again turns it back off.
      state.activePriorities.splice(idx, 1);
    } else {
      state.activePriorities.push(key);
      // Cap at two active priorities -- everything else runs at its
      // normal (AFK) rate regardless, per the outline. Oldest emphasis
      // drops off first, same "make room for the new one" behavior a
      // simple focus system should have.
      while (state.activePriorities.length > MAX_ACTIVE_PRIORITIES) {
        state.activePriorities.shift();
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // Reads whatever underlying system is reachable for a light status
  // string -- never invents a number, and degrades gracefully when the
  // arc that owns a given system hasn't loaded (e.g. under test).
  function priorityReadout(key){
    if (key === 'port_operations' && typeof window.tradeNetworkRegenForCategory === 'function') {
      return 'Trade Network regen (food): ' + window.tradeNetworkRegenForCategory('food') + '/tick';
    }
    if (key === 'readiness' && typeof window.fairTideReadinessScore === 'function') {
      return 'Fair Tide Readiness: ' + window.fairTideReadinessScore() + '/100';
    }
    if (key === 'development' && typeof window.harborReadinessScore === 'function') {
      return 'Harbor Readiness: ' + window.harborReadinessScore() + '/100';
    }
    return 'Running at its normal, steady rate.';
  }

  function fairTideLifeUnlocked(){
    return !!(game.comicProgress32 && game.comicProgress32[2]);
  }
  window.fairTideLifeUnlocked = fairTideLifeUnlocked;

  function renderFairTideLifePanel(){
    if (!fairTideLifeUnlocked()) return '';
    const active = window.fairTideActivePriorities();
    let html = '<div class="panel-title" style="margin-top:16px;">🌊 Fair Tide Life</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Emphasize up to two priorities at a time. Everything else keeps running at its normal rate.</p>';
    FAIR_TIDE_PRIORITIES.forEach(function(p){
      const emphasized = active.indexOf(p.key) !== -1;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.3rem;">'+p.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(p.label)+'</strong>'+(emphasized ? ' <span class="story-chip">✓ Emphasized</span>' : '')+'<br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(p.desc)+' '+esc(priorityReadout(p.key))+'</span>'+
        '</div>'+
        '<button class="btn btn-small" onclick="setFairTidePriority(\''+p.key+'\')">'+(emphasized ? 'Stop' : 'Emphasize')+'</button>'+
        '</div></article>';
    });
    return html;
  }
  window.renderFairTideLifePanel = renderFairTideLifePanel;

  // ===========================================================================
  // 2. HOME PREPARATION
  // ===========================================================================
  function homePreparationState(){
    if (!game.homePreparation) {
      game.homePreparation = { homeExpansion:false, familySupplies:false, communitySupport:false };
    }
    return game.homePreparation;
  }
  window.homePreparationState = homePreparationState;

  function homePreparationUnlocked(){
    return !!(game.comicProgress32 && game.comicProgress32[6]);
  }
  window.homePreparationUnlocked = homePreparationUnlocked;

  const oldSyncArc1ForHomePreparation = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForHomePreparation) oldSyncArc1ForHomePreparation();
    const cp = game.comicProgress32;
    if (!cp) return;
    const state = homePreparationState();

    if (cp[9] && !state.familySupplies) {
      state.familySupplies = true;
      toast('🧸 Family Supplies prepared — Caelan\'s furniture is finished.', 3200);
    }
    if (cp[21] && !state.communitySupport) {
      state.communitySupport = true;
      toast('🌸 Community Support strong — Joy\'s promise means they won\'t do this alone.', 3200);
    }
    if (cp[22] && !state.homeExpansion) {
      state.homeExpansion = true;
      toast('🏡 Home Expansion complete — ready enough.', 3200);
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  function renderHomePreparationPanel(){
    if (!homePreparationUnlocked()) return '';
    const state = homePreparationState();
    return '<div class="panel-title" style="margin-top:16px;">🏡 San &amp; Joel\'s Home</div>'+
      '<article class="quest-item">'+
        'Home Expansion: '+(state.homeExpansion ? 'Complete ✓' : 'In Progress')+'<br>'+
        'Family Supplies: '+(state.familySupplies ? 'Prepared ✓' : 'In Progress')+'<br>'+
        'Community Support: '+(state.communitySupport ? 'Strong ✓' : 'Growing')+'<br>'+
        'Birth: Unknown'+
      '</article>';
  }
  window.renderHomePreparationPanel = renderHomePreparationPanel;

  // ===========================================================================
  // Archive screen wiring — same insert-and-replace pattern used since
  // Arc XXIII, two panels under their own wrappers.
  // ===========================================================================
  const oldRenderArchiveScreenForFairTideLife = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFairTideLife) oldRenderArchiveScreenForFairTideLife();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existingLife = document.getElementById('fairTideLifePanelWrap');
    if (existingLife) existingLife.remove();
    const lifePanel = renderFairTideLifePanel();
    if (lifePanel) container.insertAdjacentHTML('beforeend', '<div id="fairTideLifePanelWrap">'+lifePanel+'</div>');

    const existingHome = document.getElementById('homePreparationPanelWrap');
    if (existingHome) existingHome.remove();
    const homePanel = renderHomePreparationPanel();
    if (homePanel) container.insertAdjacentHTML('beforeend', '<div id="homePreparationPanelWrap">'+homePanel+'</div>');
  };
})();
