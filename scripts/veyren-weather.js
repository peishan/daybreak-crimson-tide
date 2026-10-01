(function(){
  // -------------------------------------------------------------------
  // VEYREN WEATHER — a rotating atmosphere system, independent of story
  // chapters, generated from the REAL calendar date rather than
  // claiming to reproduce the player's actual weather (San's own
  // framing: "Veyren weather, generated from the real calendar/day").
  // It changes once per real calendar day — not per Veyren story day,
  // and not on every render — so every player who opens the game on
  // the same real date sees the same weather, deterministically, with
  // no randomness to desync between sessions or devices.
  //
  // Deliberately light on numeric hooks: several of the outline's own
  // effect descriptions (port activity, indoor crafting speed,
  // expedition travel speed, fishing/sailing yield) don't correspond to
  // any existing adjustable rate in this codebase, and inventing one
  // for each would be a far larger, unrequested change. Rather than
  // guess at systems to rewire, those stay descriptive flavor text in
  // the panel. The one effect that DOES map cleanly onto something
  // that already exists -- "After the Rain" granting a Fair Tide Mood
  // bonus -- is wired through window.addFairTideMood
  // (scripts/fair-tide-mood.js), loaded just before this file.
  //
  // Three weather types carry a one-line flavor dialogue from an
  // established character (Mez/Senedra/Mimi), chosen deterministically
  // from the same date seed so it doesn't change on every render either.
  // -------------------------------------------------------------------

  const WEATHER_TYPES = [
    { id:'monsoon_rain',          icon:'🌧️', label:'Monsoon Rain',          desc:"Fair Tide's roofs drum with heavy rain. Port activity slows; indoor crafting picks up." },
    { id:'high_tide',             icon:'🌊', label:'High Tide',             desc:'Fishing and sailing rewards run a little richer today.' },
    { id:'clear_trade_winds',     icon:'☀️', label:'Clear Trade Winds',     desc:'Expedition travel moves slightly faster today.' },
    { id:'veyren_thunderstorm',   icon:'⛈️', label:'Veyren Thunderstorm',   desc:'Storm magic feels unusually active today.', flavorCharacter:'mezstorm' },
    { id:'sea_mist',              icon:'🌫️', label:'Sea Mist',              desc:'Scouting feels more important than usual today.', flavorCharacter:'senedra' },
    { id:'after_the_rain',        icon:'🌈', label:'After the Rain',        desc:'A quiet, clear calm settles over Fair Tide.', moodBonus:5 },
    { id:'bright_veyren_moon',    icon:'🌕', label:'Bright Veyren Moon',    desc:'A good night for quiet observation.', flavorCharacter:'mimi' },
    { id:'perfect_sailing_wind',  icon:'🍃', label:'Perfect Sailing Wind',  desc:'Shipping and trade move a little easier today.' }
  ];
  window.VEYREN_WEATHER_TYPES = WEATHER_TYPES;

  const FLAVOR_LINES = {
    mezstorm: [
      "Mez: \"Feel that? The sky's practically asking to be used.\"",
      'Mez watches the horizon with open delight. Nobody else finds the thunder that charming.'
    ],
    senedra: [
      'Senedra: "Can\'t see past the mast in this. Good thing I don\'t need to."',
      'Senedra keeps watch anyway, mist or not. Old habit.'
    ],
    mimi: [
      'Mimi: "The moon\'s practically shouting tonight. Someone should be listening."',
      'Mimi stays up later than usual, reading something only she can see.'
    ]
  };
  window.VEYREN_WEATHER_FLAVOR_LINES = FLAVOR_LINES;

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }
  window.__ctRealCalendarNow = currentRealDate; // shared seam other calendar-based files can reuse/override the same way in tests

  function dateSeed(date){
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  window.todaysVeyrenWeather = function(){
    const seed = dateSeed(currentRealDate());
    return WEATHER_TYPES[seed % WEATHER_TYPES.length];
  };

  function todaysFlavorLine(characterKey){
    const lines = FLAVOR_LINES[characterKey];
    if (!lines || !lines.length) return '';
    const seed = dateSeed(currentRealDate());
    return lines[seed % lines.length];
  }
  window.todaysVeyrenWeatherFlavorLine = todaysFlavorLine;

  // Once-per-real-day Mood grant for "After the Rain" -- tracked
  // separately from weather generation itself (which is always a pure
  // read, never stateful) so re-rendering the panel never re-grants it.
  function checkWeatherMoodGrant(){
    const weather = window.todaysVeyrenWeather();
    if (!weather.moodBonus) return;
    if (!game.veyrenWeatherMoodGrantedDate) game.veyrenWeatherMoodGrantedDate = {};
    const seed = dateSeed(currentRealDate());
    if (game.veyrenWeatherMoodGrantedDate[weather.id] === seed) return;
    game.veyrenWeatherMoodGrantedDate[weather.id] = seed;
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(weather.moodBonus);
  }

  const oldSyncArc1ForVeyrenWeather = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForVeyrenWeather) oldSyncArc1ForVeyrenWeather();
    checkWeatherMoodGrant();
  };

  function renderVeyrenWeatherPanel(){
    const weather = window.todaysVeyrenWeather();
    let html = '<div class="panel-title" style="margin-top:16px;">'+weather.icon+' '+esc(weather.label)+'</div>'+
      '<article class="quest-item"><span style="font-size:.82rem;opacity:.85;">'+esc(weather.desc)+'</span>';
    if (weather.flavorCharacter) {
      const line = todaysFlavorLine(weather.flavorCharacter);
      if (line) html += '<br><span style="font-size:.78rem;opacity:.75;margin-top:4px;display:inline-block;">'+esc(line)+'</span>';
    }
    html += '</article>';
    return html;
  }
  window.renderVeyrenWeatherPanel = renderVeyrenWeatherPanel;

  const oldRenderArchiveScreenForWeather = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForWeather) oldRenderArchiveScreenForWeather();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('veyrenWeatherPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="veyrenWeatherPanelWrap">'+renderVeyrenWeatherPanel()+'</div>');
  };
})();
