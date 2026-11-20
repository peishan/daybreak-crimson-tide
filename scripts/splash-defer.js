(function(){
  // -------------------------------------------------------------------
  // ARC SPLASH SCREENS WAIT THEIR TURN.
  //
  // Each arc's cover splash (Arc II "Begin Arc II", Arc III, ...) is opened from the Story screen's
  // render, so finishing the last chapter of an arc opened it straight on top of the "chapter
  // complete" screen (and of the milestone splash and any cinematic), stacked three deep. Tapping
  // anywhere then did nothing visible and the screen looked frozen.
  //
  // Every window.__ctShow<Something>Splash is wrapped here: if another overlay is up, it waits and
  // opens once the way is clear. One pending call per splash; it gives up quietly after about a
  // minute rather than ever blocking the game.
  // -------------------------------------------------------------------
  function shown(id){ const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none'; }
  function busy(){
    try {
      if (shown('storyModeOverlay') || document.getElementById('ctSplash') || document.getElementById('ctCinema')) return true;
      if (shown('modalOverlay')) return true;
      const ov = document.querySelectorAll('.story-mode-overlay');
      for (let i = 0; i < ov.length; i++) { if (ov[i].id !== 'storyModeOverlay' && getComputedStyle(ov[i]).display !== 'none') return true; }
    } catch(e) {}
    return false;
  }
  Object.keys(window).filter(function(k){ return /^__ctShow.*Splash$/.test(k) && typeof window[k] === 'function'; }).forEach(function(name){
    const orig = window[name]; let pending = false;
    window[name] = function(){
      const self = this, args = arguments;
      if (!busy()) return orig.apply(self, args);
      if (pending) return;
      pending = true; let tries = 0;
      const t = setInterval(function(){
        tries++;
        if (!busy()) { clearInterval(t); pending = false; try { orig.apply(self, args); } catch(e) {} }
        else if (tries > 100) { clearInterval(t); pending = false; }
      }, 600);
    };
  });
})();
