(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE FLAVOUR EVENTS — ambient scenery pulling established
  // characters into everyday life without needing a chapter to do it,
  // per San's own framing. Purely atmospheric: no gold, no XP, no
  // Mood -- that reward shape already belongs to Arc XXXVI's own Twin
  // Trouble pool and the real-calendar festivals above; adding a
  // second small-reward faucet here would just dilute both. These are
  // text only, logged as Codex-style flavor for the day.
  //
  // Generated per Veyren STORY day (game.day), not the real calendar --
  // unlike weather/festivals, this is meant to feel like Fair Tide
  // quietly living its own life between chapters, which is tied to how
  // much the player has actually played, not what real date it is.
  // 2-4 events roll once per new game day (never per render/click),
  // drawn only from whichever entries are currently eligible -- each
  // one gated on the referenced character actually being unlocked yet,
  // so a player on, say, Arc X never sees a flavour line about Vaeren
  // and Joelle before they exist.
  // -------------------------------------------------------------------

  const FLAVOUR_EVENTS = [
    { id:'soel_crate',          icon:'🐈', text:'Soel has occupied a cargo crate. Nobody is allowed to move it.',
      eligible: function(){ return typeof level === 'function' && level() >= 10; } },
    { id:'twins_follow_soel',   icon:'😇', text:"Vaeren and Joelle have followed Soel somewhere they shouldn't.",
      eligible: function(){ return typeof window.fairTideChildrenUnlocked === 'function' && window.fairTideChildrenUnlocked(); } },
    { id:'maera_custom',        icon:'🌿', text:'Maera is teaching someone a Veyren custom.',
      eligible: function(){ return !!(game.fairTideRoster && game.fairTideRoster.maera); } },
    { id:'renn_erynn_time',     icon:'📚', text:'Renn and Erynn have forgotten what time it is again.',
      eligible: function(){ return !!(game.foundCompanions && game.foundCompanions.renn && game.foundCompanions.erynn); } },
    { id:'joel_harbor',         icon:'🎣', text:'Joel brought something back from the harbor.',
      eligible: function(){ return true; } },
    { id:'mimi_flowers',        icon:'🌸', text:'Mimi has decorated part of Fair Tide with flowers.',
      eligible: function(){ return !!(game.foundCompanions && game.foundCompanions.mimi); } },
    { id:'san_interrupted',     icon:'⚓', text:'San tried to finish one Captain task. Three people interrupted her.',
      eligible: function(){ return true; } }
  ];
  window.FAIR_TIDE_FLAVOUR_EVENTS = FLAVOUR_EVENTS;

  const MIN_PER_DAY = 2, MAX_PER_DAY = 4;
  const MAX_LOG = 40;

  function flavourState(){
    if (!game.fairTideFlavour) game.fairTideFlavour = { log: [], lastRollDay: null };
    return game.fairTideFlavour;
  }
  window.fairTideFlavourState = flavourState;

  function eligibleFlavourEvents(){
    return FLAVOUR_EVENTS.filter(function(e){
      try { return e.eligible(); } catch (err) { return false; }
    });
  }
  window.eligibleFairTideFlavourEvents = eligibleFlavourEvents;

  function rollTodaysFlavourEvents(){
    const state = flavourState();
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click
    state.lastRollDay = today;
    const pool = eligibleFlavourEvents();
    if (!pool.length) return;
    const count = Math.min(pool.length, MIN_PER_DAY + Math.floor(Math.random() * (MAX_PER_DAY - MIN_PER_DAY + 1)));
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
    }
    shuffled.slice(0, count).forEach(function(event){
      state.log.push({ id: event.id, icon: event.icon, text: event.text, day: today });
    });
    if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
  }

  const oldSyncArc1ForFlavourEvents = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForFlavourEvents) oldSyncArc1ForFlavourEvents();
    rollTodaysFlavourEvents();
  };

  function renderFairTideFlavourPanel(){
    const state = flavourState();
    const today = game.day || 0;
    const todays = state.log.filter(function(e){ return e.day === today; });
    if (!state.log.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌊 Around Fair Tide Today</div>';
    if (todays.length) {
      todays.forEach(function(e){
        html += '<article class="quest-item">'+esc(e.icon)+' '+esc(e.text)+'</article>';
      });
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Quiet so far today.</span></article>';
    }
    const earlier = state.log.filter(function(e){ return e.day !== today; });
    if (earlier.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Earlier</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      earlier.slice(-8).reverse().forEach(function(e){
        html += esc(e.icon) + ' ' + esc(e.text) + ' <span style="opacity:.6;">(Day '+e.day+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderFairTideFlavourPanel = renderFairTideFlavourPanel;

  const oldRenderArchiveScreenForFlavour = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFlavour) oldRenderArchiveScreenForFlavour();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideFlavourPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideFlavourPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="fairTideFlavourPanelWrap">'+panel+'</div>');
  };
})();
