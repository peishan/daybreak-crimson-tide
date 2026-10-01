(function(){
  // -------------------------------------------------------------------
  // SETTLEMENT MEMORIES — major story events permanently adding little
  // details to Fair Tide, per San's own framing: "the port screen
  // itself [becomes] a visual record of the story." This codebase has
  // no actual port-screen art to re-skin, so each memory is a short,
  // permanent description rather than a graphic -- the same text-first
  // adaptation this whole "Living World" effort has used throughout
  // (Codex memory entries standing in for real cosmetics/decorations,
  // same reasoning as real-calendar-events.js's own header comment).
  //
  // Every memory below is tied to real, already-existing game state --
  // nothing here invents a story beat that was never actually written.
  // Checked once per sync (cheap boolean reads), each reveals exactly
  // once and never un-reveals. The moment one is revealed, it's logged
  // into the Fair Tide Chronicle (scripts/fair-tide-chronicle.js,
  // loaded just before this file) via window.recordChronicleEntry --
  // the "story milestone" half of the Chronicle's own two-source
  // design, alongside the "tiny everyday memory" half that file mirrors
  // from game.festivalMemories on its own.
  // -------------------------------------------------------------------

  const SETTLEMENT_MEMORIES = [
    { id:'real_port', icon:'⚓',
      condition: function(){ return !!game.arc23Complete; },
      text: "Fair Tide started attracting visitors who'd never heard of it a few arcs ago." },
    { id:'maera_culture', icon:'🌿',
      condition: function(){ return !!(game.fairTideRoster && game.fairTideRoster.maera); },
      text: "A small arrangement near the Medical House reflects something of Maera's own culture, quietly placed rather than announced." },
    { id:'san_joy_bond', icon:'🌸',
      condition: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_joy') >= 4; },
      text: 'A small, unremarkable space has become where San and Ate Joy always end up sitting.' },
    { id:'readiness_defenses', icon:'🛡️',
      condition: function(){ return !!(game.fairTideReadiness && game.fairTideReadiness.unlocked); },
      text: "Fair Tide's defenses are no longer hidden away; Caelan's work is visible to anyone who looks." },
    { id:'family_infrastructure', icon:'🏘️',
      condition: function(){ return !!(game.familyInfrastructure && game.familyInfrastructure.approved); },
      text: 'Walkways and residential corners look a little different now, built with children in mind.' },
    { id:'twins_toys', icon:'👶',
      condition: function(){ return !!(game.comicProgress36 && game.comicProgress36[14]); },
      text: "Small toys have started appearing around San and Joel's home, usually right where someone just tripped over one." },
    { id:'soel_guardian', icon:'🐈',
      condition: function(){ return !!game.soelGuardianUnlocked; },
      text: "A particular corner of Fair Tide has quietly become understood as Soel's, and nobody really remembers deciding that." },
    { id:'first_birthday', icon:'🎂',
      condition: function(){ return !!(game.characterBirthdays && Object.keys(game.characterBirthdays.lastClaimedYear || {}).length > 0); },
      text: "Fair Tide marked its first real birthday together. It probably won't be the last." },
    { id:'festival_decoration', icon:'🏮',
      condition: function(){ return !!(game.realCalendarFestivals && Object.keys(game.realCalendarFestivals.lastClaimedYear || {}).length > 0); },
      text: "One decoration from Fair Tide's first real-calendar celebration never quite got taken down." },
    { id:'recurring_trader', icon:'🧺',
      condition: function(){
        if (!game.portVisitors || !game.portVisitors.log) return false;
        const counts = {};
        game.portVisitors.log.forEach(function(e){ counts[e.id] = (counts[e.id] || 0) + 1; });
        return Object.keys(counts).some(function(id){ return counts[id] >= 3; });
      },
      text: "What started as a traveling trader's temporary setup has quietly become part of the market's permanent layout." },
    { id:'time_passed', icon:'🌳',
      condition: function(){ return (game.day || 0) >= 100; },
      text: 'Something planted long ago has grown considerably since San first arrived.' }
  ];
  window.SETTLEMENT_MEMORIES = SETTLEMENT_MEMORIES;

  function settlementMemoriesState(){
    if (!game.settlementMemories) game.settlementMemories = { revealed: [] };
    return game.settlementMemories;
  }
  window.settlementMemoriesState = settlementMemoriesState;

  function checkSettlementMemories(){
    const state = settlementMemoriesState();
    SETTLEMENT_MEMORIES.forEach(function(mem){
      if (state.revealed.indexOf(mem.id) !== -1) return;
      let ok = false;
      try { ok = !!mem.condition(); } catch (e) { ok = false; }
      if (!ok) return;
      state.revealed.push(mem.id);
      if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(mem.text, mem.icon);
      toast(mem.icon + ' Fair Tide has changed: ' + mem.text, 4200);
    });
  }

  const oldSyncArc1ForSettlementMemories = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForSettlementMemories) oldSyncArc1ForSettlementMemories();
    checkSettlementMemories();
  };

  function renderSettlementMemoriesPanel(){
    const state = settlementMemoriesState();
    if (!state.revealed.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🏡 Settlement Memories</div>';
    state.revealed.forEach(function(id){
      const mem = SETTLEMENT_MEMORIES.find(function(m){ return m.id === id; });
      if (!mem) return;
      html += '<article class="quest-item">'+esc(mem.icon)+' '+esc(mem.text)+'</article>';
    });
    return html;
  }
  window.renderSettlementMemoriesPanel = renderSettlementMemoriesPanel;

  const oldRenderArchiveScreenForSettlementMemories = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForSettlementMemories) oldRenderArchiveScreenForSettlementMemories();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('settlementMemoriesPanelWrap');
    if (existing) existing.remove();
    const panel = renderSettlementMemoriesPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="settlementMemoriesPanelWrap">'+panel+'</div>');
  };
})();
