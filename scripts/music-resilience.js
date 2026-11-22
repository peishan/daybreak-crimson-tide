(function(){
  // -------------------------------------------------------------------
  // MUSIC THAT COMES BACK. The soundtrack (core-engine.js, ctPlayMusic) plays through one audio element and swallowed every
  // failure, so any of these left the game silent until the next screen change:
  //   * the browser blocked the first play (no tap yet), or paused the tab's audio when the phone was locked or the app was in the
  //     background, and nothing resumed it afterwards;
  //   * a track stalled or errored (a dropped connection on a big file) and never reloaded;
  //   * switching Music off and on again always restarted the title theme, whatever screen you were on.
  // This file puts the right track back on the first tap, when the app comes back to the front, after an error, and from a slow
  // check every few seconds. It never overrides the Music button: with music off it does nothing.
  // -------------------------------------------------------------------
  function enabled(){ try { return typeof ctMusicEnabled !== 'undefined' && !!ctMusicEnabled; } catch(e) { return false; } }
  function haveAudio(){ try { return typeof ctAudio !== 'undefined' && !!ctAudio; } catch(e) { return false; } }
  function inSession(){ return typeof gameSessionActive !== 'undefined' && !!gameSessionActive; }
  function videoPlaying(){ return !!document.getElementById('ctCinema'); }
  function screenKey(){
    const el = document.querySelector('.screen.active'), id = el ? el.id : '';
    if (id === 'introScreen' || id === '') return 'landing';
    if (id === 'combatScreen') return 'combat';
    if (id === 'tavernScreen') return 'tavern';
    if (id === 'navigateScreen' || id === 'voyageScreen') return 'explore';
    return 'port';
  }
  function resume(){
    try {
      if (!enabled() || document.hidden || videoPlaying()) return;
      if (haveAudio() && ctAudioKey && ctAudio.paused && !ctAudio.ended) {
        const p = ctAudio.play(); if (p && p.catch) p.catch(function(){});
        return;
      }
      if ((!haveAudio() || !ctAudioKey) && typeof ctPlayMusic === 'function') ctPlayMusic(screenKey());
    } catch(e) {}
  }

  // the first tap or key press: browsers only allow sound after one
  let unlocked = false;
  function onGesture(){
    if (unlocked) { return; }
    try { if (enabled() && (!haveAudio() || ctAudio.paused)) { unlocked = true; ctPlayMusic(haveAudio() && ctAudioKey ? ctAudioKey : screenKey()); } } catch(e) {}
    if (haveAudio() && !ctAudio.paused) unlocked = true;
  }
  ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function(ev){ document.addEventListener(ev, onGesture, { capture: true, passive: true }); });

  // coming back to the app
  document.addEventListener('visibilitychange', function(){ if (!document.hidden) setTimeout(resume, 250); });
  window.addEventListener('pageshow', function(){ setTimeout(resume, 250); });
  window.addEventListener('focus', function(){ setTimeout(resume, 250); });

  // a track that stalls or errors is loaded again once
  let retried = {};
  function watchAudio(){
    if (!haveAudio() || ctAudio.__ctWatched) return;
    ctAudio.__ctWatched = true;
    ctAudio.addEventListener('error', function(){
      const key = ctAudioKey; if (!key || !enabled()) return;
      if ((retried[key] || 0) >= 3) return;
      retried[key] = (retried[key] || 0) + 1;
      setTimeout(function(){ try { if (ctAudioKey === key && enabled()) { ctAudio.load(); const p = ctAudio.play(); if (p && p.catch) p.catch(function(){}); } } catch(e) {} }, 1500);
    });
    ctAudio.addEventListener('playing', function(){ retried = {}; });
    ctAudio.addEventListener('stalled', function(){ setTimeout(resume, 4000); });
  }

  // switching Music back on returns to the track that fits the screen, not always the title theme
  const oldSet = window.ctSetMusicEnabled;
  if (typeof oldSet === 'function') {
    window.ctSetMusicEnabled = function(on){
      if (on && !enabled()) {
        try {
          localStorage.setItem('ct_music_enabled', '1');
          ctMusicEnabled = true;
          if (typeof ctPlayMusic === 'function') ctPlayMusic(screenKey());
          return;
        } catch(e) {}
      }
      return oldSet.apply(this, arguments);
    };
  }

  // a slow check: someone is in the game, music is on, and it has gone quiet
  setInterval(function(){
    try { watchAudio(); if (inSession()) resume(); } catch(e) {}
  }, 5000);
})();
