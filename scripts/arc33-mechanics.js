(function(){
  // -------------------------------------------------------------------
  // ARC XXXIII MECHANICS — FAMILY & LEGACY, the gameplay Ch.2, 7, 10,
  // 13, and 19's own notes call for. Kept OUT of arc33.js itself, same
  // split used since Arc XXIII.
  //
  //   1. PERSONAL ARCHIVE — a People & Family Records section, listing
  //      story-defined relationships (Parent/Sibling/Partner/Aunt-
  //      Uncle/Extended Family/Chosen Family/Caregiver) as each one
  //      becomes true in the story. These are NOT a player-selected
  //      romance/friendship meter — there is no setter exposed for
  //      them, deliberately, per the outline's own explicit note.
  //
  //   2. FAMILY INFRASTRUCTURE — Caelan's small Family Settlement
  //      upgrade branch (Safe Walkways, Protected Residential Areas,
  //      Family Housing, Child-Safe Community Spaces), benefiting all
  //      Fair Tide families rather than giving San's children special
  //      privileges. Ch.10 begins consideration; Ch.19 is San's actual
  //      approval, completing the whole branch at once.
  //
  //   3. LEGACY RECORDS — permanent Archive entries unlocked by their
  //      own story chapters (Ch.3, 14, 17, 18), giving Earth memories
  //      (Mama's stories included) a place in the game as archive
  //      entries rather than stat bonuses.
  //
  //   4. THE TWINS' RECORD — deliberately incomplete. No birth
  //      countdown, no premature names or portraits. Status always
  //      reads the literal string 'Awaiting Arrival'.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. PERSONAL ARCHIVE — story-defined relationships, never player-set.
  // ===========================================================================
  const FAMILY_RELATIONSHIPS = [
    { key:'joel_joy',  a:'Joel', b:'Joy',    relation:'Siblings',                     unlockChapter:2 },
    { key:'san_joy',   a:'San',  b:'Joy',    relation:'Ate / Sister-in-law / Family',  unlockChapter:2 },
    { key:'joy_twins', a:'Joy',  b:'Twins',  relation:'Aunt / Ate Joy',                unlockChapter:7 },
    { key:'joy_caelan',a:'Joy',  b:'Caelan', relation:'Partners',                     unlockChapter:13 }
  ];
  window.ARC33_FAMILY_RELATIONSHIPS = FAMILY_RELATIONSHIPS;

  function familyRecordsUnlocked(){
    return !!(game.comicProgress33 && game.comicProgress33[2]);
  }
  window.familyRecordsUnlocked = familyRecordsUnlocked;

  window.unlockedFamilyRelationships = function(){
    const cp = game.comicProgress33 || {};
    return FAMILY_RELATIONSHIPS.filter(function(r){ return !!cp[r.unlockChapter]; });
  };

  function renderFamilyRecordsPanel(){
    if (!familyRecordsUnlocked()) return '';
    const unlocked = window.unlockedFamilyRelationships();
    let html = '<div class="panel-title" style="margin-top:16px;">📖 People &amp; Family Records</div>';
    unlocked.forEach(function(r){
      html += '<article class="quest-item"><strong>'+esc(r.a)+' ↔ '+esc(r.b)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(r.relation)+'</span></article>';
    });
    return html;
  }
  window.renderFamilyRecordsPanel = renderFamilyRecordsPanel;

  // ===========================================================================
  // 2. FAMILY INFRASTRUCTURE — Caelan's Family Settlement branch.
  // ===========================================================================
  const FAMILY_INFRASTRUCTURE_ITEMS = [
    { key:'safe_walkways',          label:'Safe Walkways' },
    { key:'protected_residential',  label:'Protected Residential Areas' },
    { key:'family_housing',         label:'Family Housing' },
    { key:'child_safe_spaces',      label:'Child-Safe Community Spaces' }
  ];
  window.ARC33_FAMILY_INFRASTRUCTURE_ITEMS = FAMILY_INFRASTRUCTURE_ITEMS;

  function familyInfrastructureState(){
    if (!game.familyInfrastructure) {
      game.familyInfrastructure = {
        underConsideration: false,
        approved: false,
        items: { safe_walkways:false, protected_residential:false, family_housing:false, child_safe_spaces:false }
      };
    }
    return game.familyInfrastructure;
  }
  window.familyInfrastructureState = familyInfrastructureState;

  function familyInfrastructureUnlocked(){
    return !!(game.comicProgress33 && game.comicProgress33[10]);
  }
  window.familyInfrastructureUnlocked = familyInfrastructureUnlocked;

  function renderFamilyInfrastructurePanel(){
    if (!familyInfrastructureUnlocked()) return '';
    const state = familyInfrastructureState();
    let html = '<div class="panel-title" style="margin-top:16px;">🏡 Family Infrastructure</div>';
    if (!state.approved) {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">Under consideration — Caelan is still working out what Fair Tide actually needs.</span></article>';
    }
    FAMILY_INFRASTRUCTURE_ITEMS.forEach(function(item){
      const done = state.items[item.key];
      html += '<article class="quest-item"><strong>'+esc(item.label)+'</strong> — '+(done ? '✓ Complete' : 'Planned')+'</article>';
    });
    return html;
  }
  window.renderFamilyInfrastructurePanel = renderFamilyInfrastructurePanel;

  // ===========================================================================
  // 3. LEGACY RECORDS — permanent Archive entries, never stat bonuses.
  // ===========================================================================
  const LEGACY_RECORD_CHAPTERS = {
    3:  { title:'What Mama Said', text:'Mama noticed how San treated her, long before Fair Tide — like a real mother, not merely her son\'s partner.' },
    14: { title:'Stories From Before', text:'Earth memories the twins will grow up hearing about, never living themselves.' },
    17: { title:'Mama', text:'San learns more of Mama\'s own side of their relationship — small, ordinary things, never a grand prophecy.' },
    18: { title:'What Remains', text:'One family doesn\'t erase another. Families grow around what remains.' }
  };
  window.ARC33_LEGACY_RECORD_CHAPTERS = LEGACY_RECORD_CHAPTERS;

  function legacyRecordsState(){
    if (!game.legacyRecords) game.legacyRecords = [];
    return game.legacyRecords;
  }
  window.legacyRecordsState = legacyRecordsState;

  function legacyRecordsUnlocked(){
    return !!(game.comicProgress33 && game.comicProgress33[3]);
  }
  window.legacyRecordsUnlocked = legacyRecordsUnlocked;

  function renderLegacyRecordsPanel(){
    if (!legacyRecordsUnlocked()) return '';
    const records = legacyRecordsState();
    if (!records.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📜 Legacy Records</div>';
    records.forEach(function(rec){
      html += '<article class="quest-item"><strong>'+esc(rec.title)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(rec.text)+'</span></article>';
    });
    return html;
  }
  window.renderLegacyRecordsPanel = renderLegacyRecordsPanel;

  // ===========================================================================
  // 4. THE TWINS' RECORD — deliberately incomplete, forever, this arc.
  // ===========================================================================
  function twinsRecordUnlocked(){
    return !!(game.comicProgress33 && game.comicProgress33[1]);
  }
  window.twinsRecordUnlocked = twinsRecordUnlocked;

  function renderTwinsRecordPanel(){
    if (!twinsRecordUnlocked()) return '';
    return '<div class="panel-title" style="margin-top:16px;">👶 Children of San &amp; Joel</div>'+
      '<article class="quest-item">'+
        'Parents: San &amp; Joel<br>'+
        'Aunt: Joy<br>'+
        'Home: Fair Tide<br>'+
        'Status: Awaiting Arrival'+
      '</article>';
  }
  window.renderTwinsRecordPanel = renderTwinsRecordPanel;

  // ===========================================================================
  // Sync hook — progresses Family Infrastructure and appends Legacy
  // Records as their own chapters are read. Chains on top of every
  // earlier arc's own wrap, same pattern used since Arc XXIII.
  // ===========================================================================
  const oldSyncArc1ForFamilyLegacy = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForFamilyLegacy) oldSyncArc1ForFamilyLegacy();
    const cp = game.comicProgress33;
    if (!cp) return;

    const infra = familyInfrastructureState();
    if (cp[10] && !infra.underConsideration) {
      infra.underConsideration = true;
      toast('🔨 Caelan starts considering Fair Tide\'s Family Infrastructure.', 3200);
    }
    if (cp[19] && !infra.approved) {
      infra.approved = true;
      FAMILY_INFRASTRUCTURE_ITEMS.forEach(function(item){ infra.items[item.key] = true; });
      toast('🏡 Family Infrastructure approved for all of Fair Tide.', 3600);
    }

    const records = legacyRecordsState();
    Object.keys(LEGACY_RECORD_CHAPTERS).forEach(function(chId){
      const already = records.some(function(r){ return r.chapterId === Number(chId); });
      if (cp[chId] && !already) {
        const entry = LEGACY_RECORD_CHAPTERS[chId];
        records.push({ chapterId: Number(chId), title: entry.title, text: entry.text, day: game.day || 0 });
      }
    });

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // Archive screen wiring — four panels under their own wrappers, same
  // insert-and-replace pattern used since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForFamilyLegacy = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFamilyLegacy) oldRenderArchiveScreenForFamilyLegacy();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existingTwins = document.getElementById('twinsRecordPanelWrap');
    if (existingTwins) existingTwins.remove();
    const twinsPanel = renderTwinsRecordPanel();
    if (twinsPanel) container.insertAdjacentHTML('beforeend', '<div id="twinsRecordPanelWrap">'+twinsPanel+'</div>');

    const existingRecords = document.getElementById('familyRecordsPanelWrap');
    if (existingRecords) existingRecords.remove();
    const recordsPanel = renderFamilyRecordsPanel();
    if (recordsPanel) container.insertAdjacentHTML('beforeend', '<div id="familyRecordsPanelWrap">'+recordsPanel+'</div>');

    const existingInfra = document.getElementById('familyInfrastructurePanelWrap');
    if (existingInfra) existingInfra.remove();
    const infraPanel = renderFamilyInfrastructurePanel();
    if (infraPanel) container.insertAdjacentHTML('beforeend', '<div id="familyInfrastructurePanelWrap">'+infraPanel+'</div>');

    const existingLegacy = document.getElementById('legacyRecordsPanelWrap');
    if (existingLegacy) existingLegacy.remove();
    const legacyPanel = renderLegacyRecordsPanel();
    if (legacyPanel) container.insertAdjacentHTML('beforeend', '<div id="legacyRecordsPanelWrap">'+legacyPanel+'</div>');
  };
})();
