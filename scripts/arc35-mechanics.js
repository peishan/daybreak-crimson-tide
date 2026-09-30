(function(){
  // -------------------------------------------------------------------
  // ARC XXXV MECHANICS — THE CHILDREN OF FAIR TIDE, the passive Family
  // Life gameplay Ch.9-10, 13, and 19-20's own notes call for. Kept OUT
  // of arc35.js itself, same split used since Arc XXIII.
  //
  // NOT a childcare minigame, per the outline's own explicit framing.
  // Vaeren and Joelle are NOT playable characters -- neither is ever
  // pushed onto ALL_PARTY or game.foundCompanions, and this file never
  // exposes anything resembling a "play as the twins" hook. Their
  // development progresses through story milestones (birth at Ch.9/10,
  // naming at Ch.12, first sparks at Ch.19, the sleep/growth link at
  // Ch.20) rather than repetitive player maintenance -- there is no
  // feed/soothe/play button anywhere in this file.
  //
  //   1. THE CHILDREN OF FAIR TIDE — Vaeren and Joelle each get a
  //      lightweight record (name, icon, born flag) set the moment
  //      their own birth chapter is read, plus a developmental state
  //      that cycles passively (Sleeping/Feeding/Awake/Growing/
  //      Playing/With Family/Resonating) once per new game day, never
  //      by a player action. Development stage stays 'Infancy' and
  //      Expedition Access stays locked for the entire arc, matching
  //      the outline's own closing summary panel exactly.
  //
  //   2. SOEL WATCH — Soel's own ability to detect unusual spiritual
  //      changes in the twins, unlocked at Ch.13 ("He Knew First").
  //      Flavor/status only, same restraint as Arc XXXIV's Family
  //      Resonance system.
  // -------------------------------------------------------------------

  const CHILD_STATES = ['Sleeping', 'Feeding', 'Awake', 'Growing', 'Playing', 'With Family', 'Resonating'];
  window.ARC35_CHILD_STATES = CHILD_STATES;

  function fairTideChildrenState(){
    if (!game.fairTideChildren) {
      game.fairTideChildren = {
        vaeren: null,
        joelle: null,
        lastStateAdvanceDay: null
      };
    }
    return game.fairTideChildren;
  }
  window.fairTideChildrenState = fairTideChildrenState;

  function registerChild(key, name, icon){
    const state = fairTideChildrenState();
    if (state[key]) return; // idempotent, same as every earlier arc's own registration pattern
    state[key] = {
      name: name,
      icon: icon,
      developmentStage: 'Infancy',
      expeditionAccess: false,
      stateIndex: 0,
      powerObservations: []
    };
  }

  window.childRecord = function(key){
    return fairTideChildrenState()[key] || null;
  };

  window.childCurrentState = function(key){
    const child = window.childRecord(key);
    if (!child) return null;
    return CHILD_STATES[child.stateIndex % CHILD_STATES.length];
  };

  function advanceChildrenStates(){
    const state = fairTideChildrenState();
    const today = game.day || 0;
    if (state.lastStateAdvanceDay === today) return; // once per new day, never per render/click
    state.lastStateAdvanceDay = today;
    ['vaeren', 'joelle'].forEach(function(key){
      const child = state[key];
      if (child) child.stateIndex = (child.stateIndex + 1) % CHILD_STATES.length;
    });
  }

  // ===========================================================================
  // Power observations (Ch.19) — same accumulating-entry pattern as
  // Arc XXXIV's own Family Resonance Observations. Never a stat bonus,
  // never a defined power set.
  // ===========================================================================
  function addPowerObservation(key, text){
    const child = window.childRecord(key);
    if (!child) return;
    if (child.powerObservations.indexOf(text) !== -1) return;
    child.powerObservations.push(text);
  }

  function fairTideChildrenUnlocked(){
    return !!(game.comicProgress35 && (game.comicProgress35[9] || game.comicProgress35[10]));
  }
  window.fairTideChildrenUnlocked = fairTideChildrenUnlocked;

  function soelWatchUnlocked(){
    return !!(game.comicProgress35 && game.comicProgress35[13]);
  }
  window.soelWatchUnlocked = soelWatchUnlocked;

  function renderFairTideChildrenPanel(){
    if (!fairTideChildrenUnlocked()) return '';
    const state = fairTideChildrenState();
    let html = '<div class="panel-title" style="margin-top:16px;">💞 Vaeren &amp; Joelle</div>';
    ['vaeren', 'joelle'].forEach(function(key){
      const child = state[key];
      if (!child) return;
      const currentState = window.childCurrentState(key);
      html += '<article class="quest-item"><strong>'+esc(child.icon)+' '+esc(child.name)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">Current: '+esc(currentState)+' &middot; Development: '+esc(child.developmentStage)+' &middot; Expedition Access: '+(child.expeditionAccess ? 'Unlocked' : 'Locked')+'</span>';
      if (child.powerObservations.length) {
        html += '<br><span style="font-size:.76rem;opacity:.7;">Powers: Emerging / Unknown — '+child.powerObservations.map(esc).join('; ')+'</span>';
      } else {
        html += '<br><span style="font-size:.76rem;opacity:.7;">Powers: Emerging / Unknown</span>';
      }
      html += '</article>';
    });
    html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.75;">Soel Affinity: Exceptional &middot; Generation: First Veyren-born children of San &amp; Joel</span></article>';
    if (soelWatchUnlocked()) {
      html += '<article class="quest-item"><strong>🐈 Soel Watch</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">Soel detects unusual spiritual changes in the twins and helps stabilize their emerging abilities.</span><br>'+
        '<span style="font-size:.76rem;opacity:.7;">Knew First: YES.</span></article>';
    }
    return html;
  }
  window.renderFairTideChildrenPanel = renderFairTideChildrenPanel;

  // ===========================================================================
  // Sync hook — registers each twin at their own birth chapter, names
  // them at Ch.12, advances their passive developmental state once per
  // new day, and records Ch.19's own power observations. Chains on top
  // of every earlier arc's own wrap, same pattern used since Arc XXIII.
  // ===========================================================================
  const oldSyncArc1ForFairTideChildren = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForFairTideChildren) oldSyncArc1ForFairTideChildren();
    const cp = game.comicProgress35;
    if (!cp) return;

    if (cp[9]) registerChild('vaeren', 'Vaeren', '👦');
    if (cp[10]) registerChild('joelle', 'Joelle', '👧');

    if (cp[9] || cp[10]) advanceChildrenStates();

    if (cp[19]) {
      addPowerObservation('vaeren', 'A tiny magical effect, distinctly his own.');
      addPowerObservation('joelle', 'A tiny magical effect, distinctly her own.');
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // Archive screen wiring — one panel under its own wrapper, same
  // insert-and-replace pattern used since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForFairTideChildren = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFairTideChildren) oldRenderArchiveScreenForFairTideChildren();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideChildrenPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideChildrenPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="fairTideChildrenPanelWrap">'+panel+'</div>');
  };
})();
