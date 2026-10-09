(function(){
  // -------------------------------------------------------------------
  // SAN & JOEL'S ANNIVERSARY — San's own request, and apparently an
  // ongoing argument between the two of them: they met on Nov 10, 2024
  // (San's pick for "the" anniversary). Joel insists the real one is
  // Nov 11, 2024 -- what he calls the actual start of things. San
  // maintains that's a separate, unrelated occurrence that happened to
  // land the next day. Neither will budge, so both dates are tracked
  // independently rather than this code picking a winner.
  //
  // Same week-long celebration window as character-birthdays.js's own
  // BIRTHDAY_WINDOW_DAYS (a separate local copy here rather than a
  // shared export, since this is the only other file that needs it),
  // gated on San & Joel actually being a couple (comicProgress5 Ch.4 --
  // the same flag their own San & Joel Bond track unlocks on, see
  // arc9-and-systems.js) rather than guessable from day one.
  // -------------------------------------------------------------------

  const ANNIVERSARIES = {
    met:     { year:2024, month:11, day:10, whoClaims:'San',  label:'the day they met' },
    contact: { year:2024, month:11, day:11, whoClaims:'Joel', label:'what Joel insists was the real start of things' }
  };
  const WINDOW_DAYS = 7;

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function daysSince(past, now){
    const MS_PER_DAY = 86400000;
    const utcPast = Date.UTC(past.getFullYear(), past.getMonth(), past.getDate());
    const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((utcNow - utcPast) / MS_PER_DAY);
  }

  function coupleEstablished(){
    return !!(game.comicProgress5 && game.comicProgress5[4]);
  }

  // Returns {claimYear, yearsTogether} if this date's window is active
  // right now, else null. Checks this year's and last year's occurrence
  // so a window crossing a calendar-year boundary still works, same
  // shape as character-birthdays.js's activeBirthdaysInWindow().
  function activeAnniversary(key){
    if (!coupleEstablished()) return null;
    const def = ANNIVERSARIES[key];
    const now = currentRealDate();
    let found = null;
    [now.getFullYear(), now.getFullYear() - 1].forEach(function(y){
      if (y < def.year) return;
      const diff = daysSince(new Date(y, def.month - 1, def.day), now);
      if (diff >= 0 && diff < WINDOW_DAYS) found = { claimYear: y, yearsTogether: y - def.year };
    });
    return found;
  }

  function anniversaryState(){
    if (!game.sanJoelAnniversary) game.sanJoelAnniversary = { lastClaimedYear: {} };
    return game.sanJoelAnniversary;
  }
  window.sanJoelAnniversaryState = anniversaryState;

  window.claimSanJoelAnniversary = function(key){
    const def = ANNIVERSARIES[key];
    if (!def) return;
    const active = activeAnniversary(key);
    if (!active) return;
    if (anniversaryState().lastClaimedYear[key] === active.claimYear) return;
    anniversaryState().lastClaimedYear[key] = active.claimYear;
    game.gold = (game.gold || 0) + 20;
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(5);
    if (!game.festivalMemories) game.festivalMemories = [];
    game.festivalMemories.push({
      id: 'sanjoel_anniversary_' + key,
      year: active.claimYear,
      text: 'San and Joel celebrated ' + def.label + ' -- year ' + active.yearsTogether + '.',
      day: game.day || 0
    });
    toast('💕 Happy Anniversary — +20 gold, +5 Fair Tide Mood.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderSanJoelAnniversaryPanel(){
    const entries = [];
    Object.keys(ANNIVERSARIES).forEach(function(key){
      const active = activeAnniversary(key);
      if (active) entries.push({ key: key, def: ANNIVERSARIES[key], active: active });
    });
    if (!entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">💕 San &amp; Joel\'s Anniversary</div>';
    entries.forEach(function(e){
      const claimed = anniversaryState().lastClaimedYear[e.key] === e.active.claimYear;
      const years = e.active.yearsTogether;
      html += '<article class="quest-item"><strong>'+esc(e.def.whoClaims)+'\'s pick:</strong> '+esc(e.def.label)+
        ' <span style="opacity:.6;font-size:.76rem;">(year '+years+')</span>'+
        (claimed
          ? '<br><span style="font-size:.76rem;opacity:.65;">✓ Already celebrated this year.</span>'
          : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="claimSanJoelAnniversary(\''+e.key+'\')">💕 Celebrate</button></div>')+
        '</article>';
    });
    if (entries.length === 2) {
      html += '<p style="font-size:.72rem;opacity:.55;margin-top:4px;">Neither of them has ever agreed on which day actually counts. Both still insist they\'re right.</p>';
    }
    return html;
  }
  window.renderSanJoelAnniversaryPanel = renderSanJoelAnniversaryPanel;

  const oldRenderArchiveScreenForAnniversary = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForAnniversary) oldRenderArchiveScreenForAnniversary();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existing = document.getElementById('sanJoelAnniversaryPanelWrap');
    if (existing) existing.remove();
    const panel = renderSanJoelAnniversaryPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="sanJoelAnniversaryPanelWrap">'+panel+'</div>');
  };
})();
