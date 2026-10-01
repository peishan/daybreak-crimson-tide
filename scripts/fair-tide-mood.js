(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE MOOD — a small shared counter the new real-calendar
  // festival, Veyren weather, and flavour-event systems all feed into
  // (scripts/real-calendar-events.js, scripts/veyren-weather.js,
  // scripts/fair-tide-flavour-events.js), per San's own direction that
  // festival/weather rewards stay "mostly Mood, small resources,
  // cosmetics/decorations and Codex memories, not huge gameplay
  // advantages."
  //
  // Deliberately simple: accumulates, never decays (same no-decay
  // philosophy as every Bond Track's own points), capped at 100. Its
  // only mechanical footprint is a small, capped xpBonus contribution
  // through the existing getReputationBonus() aggregator — the same
  // proven technique San & Crew/San & Trio/San & Joy's own bond bonuses
  // already use — kept deliberately modest (0–4%) so Mood stays
  // genuinely a flavor meter, not a lever worth grinding.
  //
  // Loaded BEFORE veyren-weather.js / real-calendar-events.js /
  // fair-tide-flavour-events.js (see index.html), which all call
  // window.addFairTideMood defensively (typeof-checked), same calling
  // convention used throughout this codebase for cross-file calls.
  // -------------------------------------------------------------------

  const MOOD_TIERS = [
    {threshold:0,   name:'Ordinary Day',     bonus:0},
    {threshold:25,  name:'Good Spirits',     bonus:0.01},
    {threshold:50,  name:'Festive Air',      bonus:0.02},
    {threshold:75,  name:'Fair Tide Glows',  bonus:0.03},
    {threshold:100, name:'Whole Settlement Celebrating', bonus:0.04}
  ];
  window.FAIR_TIDE_MOOD_TIERS = MOOD_TIERS;

  const MAX_MOOD = 100;

  function fairTideMoodState(){
    if (!game.fairTideMood) game.fairTideMood = { points: 0 };
    return game.fairTideMood;
  }
  window.fairTideMoodState = fairTideMoodState;

  function moodTierIndex(points){
    let idx = 0;
    for (let i = 0; i < MOOD_TIERS.length; i++) { if (points >= MOOD_TIERS[i].threshold) idx = i; }
    return idx;
  }

  window.fairTideMoodTier = function(){
    return MOOD_TIERS[moodTierIndex(fairTideMoodState().points)];
  };

  window.addFairTideMood = function(amount){
    const state = fairTideMoodState();
    state.points = Math.max(0, Math.min(MAX_MOOD, state.points + amount));
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldGetReputationBonusForMood = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    let total = oldGetReputationBonusForMood ? oldGetReputationBonusForMood(statKey) : 0;
    if (statKey === 'xpBonus') total += window.fairTideMoodTier().bonus;
    return total;
  };

  function renderFairTideMoodPanel(){
    const state = fairTideMoodState();
    const tier = window.fairTideMoodTier();
    return '<div class="panel-title" style="margin-top:16px;">🌊 Fair Tide Mood</div>'+
      '<article class="quest-item"><strong>'+esc(tier.name)+'</strong> — '+state.points+'/'+MAX_MOOD+'<br>'+
      '<span style="font-size:.76rem;opacity:.7;">'+(tier.bonus ? ('+' + Math.round(tier.bonus*100) + '% XP') : 'No bonus yet.')+'</span></article>';
  }
  window.renderFairTideMoodPanel = renderFairTideMoodPanel;

  const oldRenderArchiveScreenForMood = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForMood) oldRenderArchiveScreenForMood();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideMoodPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="fairTideMoodPanelWrap">'+renderFairTideMoodPanel()+'</div>');
  };
})();
