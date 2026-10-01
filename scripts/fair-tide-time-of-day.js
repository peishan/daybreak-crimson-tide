(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE TIME OF DAY — the "Sunrise/Day/Sunset/Night UI responses"
  // item from San's Fair Tide Living World list. A pure read, same
  // shape as veyren-weather.js: no claim, no reward, no state to
  // protect against clock manipulation, just ambiance text that changes
  // with the player's own real local clock hour (NOT the real calendar
  // DATE the festival/weather/birthday systems key off -- this one
  // moves within a single day, so it re-reads the clock on every
  // render rather than rolling once per day).
  //
  // Four phases, each carrying a short flavour line. Which line plays
  // is chosen deterministically from the real calendar date (same
  // dateSeed trick veyren-weather.js uses for its own flavour lines),
  // so it stays stable across repeated renders within the same day
  // instead of flickering on every refresh.
  // -------------------------------------------------------------------

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function dateSeed(date){
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  const PHASES = [
    {
      id: 'sunrise', icon: '🌅', label: 'Sunrise over Fair Tide', color: '#e8c547',
      startHour: 5, endHour: 8,
      lines: [
        "The first light catches the masts before it reaches the street.",
        "Fair Tide wakes slow -- nets mended, kettles on, before anyone's fully awake."
      ]
    },
    {
      id: 'day', icon: '☀️', label: 'Fair Tide by Day', color: '#87ceeb',
      startHour: 8, endHour: 17,
      lines: [
        "The port's at its loudest now -- traders, hammers, somebody arguing about fish prices.",
        "Full daylight. Easiest hours to get anything done."
      ]
    },
    {
      id: 'sunset', icon: '🌇', label: 'Sunset over Fair Tide', color: '#c0392b',
      startHour: 17, endHour: 19,
      lines: [
        "The sky over the harbour goes a deep, warm red. Lanterns go up along the pier one at a time.",
        "The day's trade winds down. Everyone finds a reason to be near the water for this part."
      ]
    },
    {
      id: 'night', icon: '🌙', label: 'Fair Tide at Night', color: '#1a3a52',
      startHour: 19, endHour: 5,
      lines: [
        "Quiet now, but not empty -- somebody's always still awake on the lower deck.",
        "The water's black and still. Easy to forget, this late, which world it belongs to."
      ]
    }
  ];
  window.FAIR_TIDE_TIME_OF_DAY_PHASES = PHASES;

  function hourInPhase(hour, phase){
    if (phase.startHour <= phase.endHour) return hour >= phase.startHour && hour < phase.endHour;
    return hour >= phase.startHour || hour < phase.endHour; // night wraps past midnight
  }

  function phaseForHour(hour){
    for (let i = 0; i < PHASES.length; i++) {
      if (hourInPhase(hour, PHASES[i])) return PHASES[i];
    }
    return PHASES[1]; // 'day' fallback, should never be reached -- the four ranges above already cover all 24 hours
  }

  window.currentTimeOfDay = function(){
    const now = currentRealDate();
    const phase = phaseForHour(now.getHours());
    const seed = dateSeed(now);
    const line = phase.lines[seed % phase.lines.length];
    return { id: phase.id, icon: phase.icon, label: phase.label, color: phase.color, line: line };
  };

  function renderTimeOfDayPanel(){
    const phase = window.currentTimeOfDay();
    return '<div class="panel-title" style="margin-top:16px;color:'+esc(phase.color)+';">'+phase.icon+' '+esc(phase.label)+'</div>'+
      '<article class="quest-item"><span style="font-size:.82rem;opacity:.85;">'+esc(phase.line)+'</span></article>';
  }
  window.renderTimeOfDayPanel = renderTimeOfDayPanel;

  const oldRenderArchiveScreenForTimeOfDay = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForTimeOfDay) oldRenderArchiveScreenForTimeOfDay();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('timeOfDayPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="timeOfDayPanelWrap">'+renderTimeOfDayPanel()+'</div>');
  };
})();
