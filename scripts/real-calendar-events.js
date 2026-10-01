(function(){
  // -------------------------------------------------------------------
  // REAL-CALENDAR EVENTS — Fair Tide temporarily dresses itself for the
  // player's actual real-world date, completely independent of which
  // Veyren story day the game is currently on (San's own framing: "the
  // game's real-world calendar can temporarily dress Fair Tide for the
  // player's actual date, regardless of which Veyren day the story is
  // currently on").
  //
  // Deliberately a narrowed set -- per San's own direction, NOT every
  // public holiday, just the ones that give genuinely different visual
  // moods: Christmas (with a gradual December lead-in rather than a
  // single Dec 25 pop-up -- Filipino parol-style decorations building
  // up, not a generic Western tree), New Year, Chinese New Year, Chap
  // Goh Mei (Lantern Festival), Hari Raya Aidilfitri, Dragon Boat
  // Festival, Mid-Autumn Festival, and All Saints'/All Souls' Day.
  // Qingming, Qixi, Double Ninth, and Hari Raya Haji were all
  // considered and deliberately left out of this first pass -- Hari
  // Raya Haji in particular San asked to be treated respectfully as a
  // community/food-sharing observance rather than gamified at all, so
  // it isn't represented here either way. Any of the four can be added
  // later following the exact same FESTIVAL_DEFS/FESTIVAL_YEAR_DATES
  // shape this file already uses.
  //
  // LUNAR / ISLAMIC DATES: Chinese New Year, Chap Goh Mei, Hari Raya
  // Aidilfitri, Dragon Boat, and Mid-Autumn all shift every year and
  // some (Hari Raya Aidilfitri especially) remain officially tentative
  // until a government/religious authority confirms them -- per San's
  // own instruction, this table is never guessed or extrapolated
  // automatically. FESTIVAL_YEAR_DATES is keyed by year and exposed on
  // window specifically so a date correction (e.g. once Brunei's
  // official Hari Raya announcement lands) is a one-line edit to this
  // table, never a change to the logic below it. A year with no entry
  // for a given lunar festival simply never triggers it -- safe by
  // default rather than guessing.
  //
  // CLAIM PROTECTION (San's own explicit requirement): the save stores
  // the last real-world YEAR each festival was claimed
  // (game.realCalendarFestivals.lastClaimedYear[festivalId]), so
  // changing the device clock back to a previously-claimed festival
  // year can never re-grant its reward -- "otherwise changing the
  // device clock could turn Chinese New Year into an infinite
  // red-packet factory."
  //
  // Rewards stay exactly as modest as San asked: a Fair Tide Mood
  // bump, a small gold amount, and a permanent Codex memory entry --
  // never combat XP, never a large economic swing. Actual cosmetic
  // decorations (a re-skinned Fair Tide screen) would need real art
  // assets this project doesn't have yet; the Codex memory entries are
  // this system's stand-in for that "cosmetics/decorations" reward
  // category until art exists to build a real one.
  // -------------------------------------------------------------------

  const FESTIVAL_DEFS = {
    christmas:    { icon:'🎄', label:'Christmas',                          theme:'Filipino / General' },
    new_year:     { icon:'🎆', label:'New Year',                           theme:'Shared' },
    all_saints:   { icon:'🕯️', label:"All Saints' Day",                    theme:'Filipino' },
    all_souls:    { icon:'🕯️', label:"All Souls' Day",                     theme:'Filipino' },
    cny:          { icon:'🧧', label:'Chinese New Year',                   theme:'Chinese' },
    chap_goh_mei: { icon:'🏮', label:'Lantern Festival (Chap Goh Mei)',    theme:'Chinese' },
    hari_raya_aidilfitri: { icon:'🌙', label:'Hari Raya Aidilfitri',        theme:'Malay', tentative:true },
    dragon_boat:  { icon:'🐉', label:'Dragon Boat Festival',               theme:'Chinese' },
    mid_autumn:   { icon:'🥮', label:'Mid-Autumn Festival',                theme:'Chinese' }
  };
  window.FESTIVAL_DEFS = FESTIVAL_DEFS;

  const FESTIVAL_MEMORY_TEXT = {
    christmas: 'Parol-style lanterns lit Fair Tide\'s port all December. The settlement gathered for a feast on Christmas Day.',
    new_year: 'Fair Tide counted down together on the harbor, magic lights standing in for fireworks.',
    all_saints: 'A quiet day. Fair Tide remembered family and friends left in the old world.',
    all_souls: 'San and the crew remembered those who are no longer with them -- some from Earth, some from here.',
    cny: 'Red lanterns and oranges filled the Market Quarter. Aisyah insisted the red packets were good for trade.',
    chap_goh_mei: 'Fair Tide lit lanterns and traded riddles long into the evening.',
    hari_raya_aidilfitri: "Fair Tide's doors stayed open all day -- festive food, visiting, and forgiveness, exactly as it should be.",
    dragon_boat: "The harbor hosted its own boat race. Nobody let San forget who won last time.",
    mid_autumn: 'Mooncakes went around the Commons as the moon rose over the harbor.'
  };
  window.FESTIVAL_MEMORY_TEXT = FESTIVAL_MEMORY_TEXT;

  // -------------------------------------------------------------------
  // Per-year lunar/tentative dates. ADD FUTURE YEARS HERE as official
  // dates are confirmed -- never guess or extrapolate a year that isn't
  // listed. {month, day} for a single-day festival, {month, day,
  // endDay} for a multi-day window (both within the same month).
  // -------------------------------------------------------------------
  const FESTIVAL_YEAR_DATES = {
    2027: {
      cny:                  { month:2, day:6, endDay:7 },
      chap_goh_mei:         { month:2, day:20 },
      hari_raya_aidilfitri: { month:3, day:10, endDay:12 },
      dragon_boat:          { month:6, day:9 },
      mid_autumn:           { month:9, day:15 }
    }
  };
  window.FESTIVAL_YEAR_DATES = FESTIVAL_YEAR_DATES;

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function lunarFestivalActiveToday(festivalId, now){
    const year = now.getFullYear();
    const yearTable = FESTIVAL_YEAR_DATES[year];
    if (!yearTable || !yearTable[festivalId]) return null;
    const def = yearTable[festivalId];
    const month = now.getMonth() + 1, day = now.getDate();
    if (month !== def.month) return null;
    const endDay = def.endDay || def.day;
    if (day < def.day || day > endDay) return null;
    return { id: festivalId, claimYear: year };
  }

  // Returns the list of festivals active for "today" (real date),
  // each tagged with the YEAR its claim should be filed under --
  // deliberately separate from the calendar year in New Year's case,
  // since Dec 31 of year Y and Jan 1 of year Y+1 are the SAME
  // occasion ("New Year Y+1").
  function activeFestivalsToday(){
    const now = currentRealDate();
    const month = now.getMonth() + 1, day = now.getDate(), year = now.getFullYear();
    const active = [];

    if (month === 12 && day >= 1 && day <= 25) {
      active.push({ id:'christmas', claimYear: year, peak: day === 25, leadInDay: day, leadInTotal: 25 });
    }
    if (month === 12 && day === 31) active.push({ id:'new_year', claimYear: year + 1, peak: false });
    if (month === 1 && day === 1) active.push({ id:'new_year', claimYear: year, peak: true });
    if (month === 11 && day === 1) active.push({ id:'all_saints', claimYear: year, peak: true });
    if (month === 11 && day === 2) active.push({ id:'all_souls', claimYear: year, peak: true });

    ['cny', 'chap_goh_mei', 'hari_raya_aidilfitri', 'dragon_boat', 'mid_autumn'].forEach(function(id){
      const hit = lunarFestivalActiveToday(id, now);
      if (hit) active.push({ id: hit.id, claimYear: hit.claimYear, peak: true });
    });

    return active;
  }
  window.activeFestivalsToday = activeFestivalsToday;

  function festivalState(){
    if (!game.realCalendarFestivals) game.realCalendarFestivals = { lastClaimedYear: {} };
    return game.realCalendarFestivals;
  }
  window.realCalendarFestivalState = festivalState;

  window.festivalAlreadyClaimedThisYear = function(festivalId, claimYear){
    return festivalState().lastClaimedYear[festivalId] === claimYear;
  };

  window.claimFestivalReward = function(festivalId){
    const active = activeFestivalsToday().find(function(f){ return f.id === festivalId; });
    if (!active) return; // not actually active today -- refuse silently, same as every other gated action in this codebase
    if (window.festivalAlreadyClaimedThisYear(festivalId, active.claimYear)) return;
    festivalState().lastClaimedYear[festivalId] = active.claimYear;
    game.gold = (game.gold || 0) + 30;
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(10);
    if (!game.festivalMemories) game.festivalMemories = [];
    const def = FESTIVAL_DEFS[festivalId];
    game.festivalMemories.push({ id: festivalId, year: active.claimYear, text: FESTIVAL_MEMORY_TEXT[festivalId] || '', day: game.day || 0 });
    toast((def ? def.icon + ' ' + def.label : festivalId) + ' — +30 gold, +10 Fair Tide Mood.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderRealCalendarEventsPanel(){
    const active = activeFestivalsToday();
    if (!active.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🗓️ Fair Tide Celebrates</div>';
    active.forEach(function(f){
      const def = FESTIVAL_DEFS[f.id];
      if (!def) return;
      const claimed = window.festivalAlreadyClaimedThisYear(f.id, f.claimYear);
      html += '<article class="quest-item"><strong>'+def.icon+' '+esc(def.label)+'</strong>'+
        (def.tentative ? ' <span style="font-size:.7rem;opacity:.6;">(date may still change)</span>' : '')+'<br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(def.theme)+'</span>';
      if (f.id === 'christmas') {
        html += '<br><span style="font-size:.74rem;opacity:.65;">Parol lanterns building up — day '+f.leadInDay+' of '+f.leadInTotal+(f.peak ? ' (Christmas Day!)' : '')+'</span>';
      }
      html += (claimed
        ? '<br><span style="font-size:.76rem;opacity:.65;">✓ Already celebrated this year.</span>'
        : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="claimFestivalReward(\''+f.id+'\')">🎉 Celebrate</button></div>')+
        '</article>';
    });
    return html;
  }
  window.renderRealCalendarEventsPanel = renderRealCalendarEventsPanel;

  const oldRenderArchiveScreenForFestivals = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFestivals) oldRenderArchiveScreenForFestivals();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('realCalendarEventsPanelWrap');
    if (existing) existing.remove();
    const panel = renderRealCalendarEventsPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="realCalendarEventsPanelWrap">'+panel+'</div>');
  };
})();
