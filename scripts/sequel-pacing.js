(function(){
  // -------------------------------------------------------------------
  // SEQUEL PACING: A DAILY CHAPTER ALLOWANCE.
  //
  // A save that came through the main story is far past every level gate, so on top of Renown (scripts/sequel-renown.js, spread across each arc) the
  // sequel only lets you read CHAPTERS_PER_DAY story chapters per game day. Game days pass when you sail, so the allowance renews on the next voyage.
  // Counting starts with this build, so nothing already read is affected. Side chapters do not use the allowance. State: game.chPace = { day, n }.
  // Tune: CHAPTERS_PER_DAY.
  // -------------------------------------------------------------------
  const CHAPTERS_PER_DAY = 3;
  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function pace(){
    const p = game.chPace = game.chPace || { day: game.day, n: 0 };
    if (p.day !== game.day) { p.day = game.day; p.n = 0; }
    return p;
  }
  window.chaptersLeftToday = function(){ return sequel() ? Math.max(0, CHAPTERS_PER_DAY - pace().n) : CHAPTERS_PER_DAY; };
  window.pacingHold = function(){ return sequel() && pace().n >= CHAPTERS_PER_DAY; };
  window.pacingLine = function(){ return 'You have read ' + pace().n + ' of ' + CHAPTERS_PER_DAY + ' chapters for game day ' + game.day + '.'; };
  window.pacingNoticeHtml = function(){
    return '<div class="story-chapter locked"><div class="story-chapter-title">🌙 That is enough story for today</div><div class="story-chapter-sub">' + window.pacingLine() +
      ' The crew needs a day before the next chapter. A new game day begins when you set sail, so the voyage to your next port is the break.<br>' +
      '<button class="btn btn-small btn-magic" style="margin-top:6px;" onclick="goScreen(\'navigate\')">⛵ Set Sail</button></div></div>';
  };

  // count a story chapter the moment it is read
  const oldRead = window.markCrimsonHorizonChapterRead;
  if (typeof oldRead === 'function') {
    window.markCrimsonHorizonChapterRead = function(id){
      const prog = function(){ return (game.comicProgressCrimsonHorizon || {})[id]; };
      const wasOpen = sequel() && !prog() && !(window.CH_SIDE && window.CH_SIDE[id]) && window.crimsonHorizonObjectiveState() === ('complete_crimson_horizon_chapter_' + id);
      const r = oldRead.apply(this, arguments);
      try {
        if (wasOpen && prog()) {
          const p = pace(); p.n += 1;
          if (p.n >= CHAPTERS_PER_DAY && typeof window.notify === 'function') {
            window.notify({ icon: '🌙', title: 'That is enough story for today', text: 'The next chapter opens on a new game day. Set sail to pass the time.', kind: 'info', duration: 6000 });
          }
          if (typeof saveGameQuiet === 'function') saveGameQuiet();
          if (typeof window.renderMainGoal === 'function') window.renderMainGoal();
        }
      } catch (e) {}
      return r;
    };
  }

  // say why, instead of "follow the current objective", when the chapter is only waiting for tomorrow
  const oldOpen = window.__ctReadCrimsonHorizonChapter;
  if (typeof oldOpen === 'function') {
    window.__ctReadCrimsonHorizonChapter = function(id){
      try {
        if (sequel() && window.crimsonHorizonObjectiveState() === 'crimson_horizon_pacing_hold' && !(game.comicProgressCrimsonHorizon || {})[id] && !(window.CH_SIDE && window.CH_SIDE[id])) {
          if (typeof window.notify === 'function') window.notify({ icon: '🌙', title: 'That is enough story for today', text: 'The next chapter opens on a new game day. Set sail to pass the time.', kind: 'info', duration: 5000 });
          else if (typeof toast === 'function') toast('🌙 That is enough story for today. Set sail to start a new game day.', 4200);
          return;
        }
      } catch (e) {}
      return oldOpen.apply(this, arguments);
    };
  }
})();
