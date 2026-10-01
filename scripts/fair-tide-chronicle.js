(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE CHRONICLE — a passive journal, per San's own framing:
  // "story milestones sit beside tiny everyday memories... because the
  // dates are based on the player's real calendar rather than Veyren
  // chronology, it becomes a record of when the player was there, not
  // an attempt to force real-world dates into canon."
  //
  // Two sources feed it, both additive:
  //   1. window.recordChronicleEntry(text, icon) -- a small public API
  //      any system can call directly the moment something permanent
  //      happens. settlement-memories.js (loaded just after this file)
  //      calls it the instant a Settlement Memory is first revealed.
  //   2. A generic mirror of game.festivalMemories -- the shared
  //      Codex-memory store real-calendar-events.js, character-
  //      birthdays.js, and fair-tide-port-visitors.js already push
  //      into on every successful claim. Rather than wrapping all
  //      three of those claim functions by name, this just watches
  //      that array's own length once per sync and mirrors anything
  //      new into the Chronicle with TODAY's real date -- which also
  //      means any future system that reuses festivalMemories gets
  //      picked up automatically, with no edit here ever needed.
  //
  // Entries are permanent and never pruned below a generous cap (200)
  // -- this is meant to be a long-running journal, not a rotating log
  // like the ambient flavour/hobby/conversation systems.
  // -------------------------------------------------------------------

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function formatChronicleDate(date){
    return date.getDate() + ' ' + MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear();
  }
  window.formatChronicleDate = formatChronicleDate;

  const MAX_ENTRIES = 200;

  function chronicleState(){
    if (!game.fairTideChronicle) game.fairTideChronicle = { entries: [], mirroredCount: 0 };
    return game.fairTideChronicle;
  }
  window.fairTideChronicleState = chronicleState;

  window.recordChronicleEntry = function(text, icon){
    if (!text) return;
    const state = chronicleState();
    state.entries.push({ text: text, icon: icon || '📖', realDateLabel: formatChronicleDate(currentRealDate()), day: game.day || 0 });
    if (state.entries.length > MAX_ENTRIES) state.entries.splice(0, state.entries.length - MAX_ENTRIES);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  function mirrorFestivalMemoriesIntoChronicle(){
    const state = chronicleState();
    if (!game.festivalMemories) return;
    const already = state.mirroredCount || 0;
    if (game.festivalMemories.length <= already) { state.mirroredCount = game.festivalMemories.length; return; }
    for (let i = already; i < game.festivalMemories.length; i++) {
      const mem = game.festivalMemories[i];
      if (mem && mem.text) window.recordChronicleEntry(mem.text, '📜');
    }
    state.mirroredCount = game.festivalMemories.length;
  }

  const oldSyncArc1ForChronicle = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForChronicle) oldSyncArc1ForChronicle();
    mirrorFestivalMemoriesIntoChronicle();
  };

  function renderFairTideChroniclePanel(){
    const state = chronicleState();
    if (!state.entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📖 Fair Tide Chronicle</div>';
    state.entries.slice(-15).reverse().forEach(function(e){
      html += '<article class="quest-item"><span style="font-size:.74rem;opacity:.6;">'+esc(e.realDateLabel)+'</span><br>'+
        esc(e.icon)+' '+esc(e.text)+'</article>';
    });
    if (state.entries.length > 15) {
      html += '<div style="font-size:.72rem;opacity:.6;margin-top:6px;">'+(state.entries.length - 15)+' earlier entries not shown.</div>';
    }
    return html;
  }
  window.renderFairTideChroniclePanel = renderFairTideChroniclePanel;

  const oldRenderArchiveScreenForChronicle = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForChronicle) oldRenderArchiveScreenForChronicle();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideChroniclePanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideChroniclePanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="fairTideChroniclePanelWrap">'+panel+'</div>');
  };
})();
