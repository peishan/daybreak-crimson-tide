(function(){
  // -------------------------------------------------------------------
  // UI THEME. assets/ui-theme.css holds the colours; this picks which one
  // is on, by setting <html data-theme="deep|horizon"> (no attribute = Classic).
  //
  //   auto     (default) Deep Tide, switching to Crimson Horizon once the sequel begins
  //   deep     Deep Tide always
  //   horizon  Crimson Horizon always
  //   classic  the original colours
  //
  // The choice is a per-device display preference (localStorage), picked in Settings.
  // -------------------------------------------------------------------
  const KEY = 'ct_theme';
  const CHOICES = [
    ['auto', 'Auto (Deep Tide, Crimson Horizon in the sequel)'],
    ['deep', 'Deep Tide'],
    ['horizon', 'Crimson Horizon'],
    ['classic', 'Classic']
  ];
  function pref(){
    let v = null;
    try { v = localStorage.getItem(KEY); } catch(e) {}
    return CHOICES.some(function(c){ return c[0] === v; }) ? v : 'auto';
  }
  function sequelOn(){
    return typeof game !== 'undefined' && !!(game && game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]);
  }
  function effective(){
    const p = pref();
    if (p === 'auto') return sequelOn() ? 'horizon' : 'deep';
    return p;
  }
  function apply(){
    const t = effective(), el = document.documentElement;
    if (t === 'classic') el.removeAttribute('data-theme');
    else if (el.getAttribute('data-theme') !== t) el.setAttribute('data-theme', t);
    return t;
  }
  window.ctApplyTheme = apply;
  window.ctSetTheme = function(v){
    try { localStorage.setItem(KEY, v); } catch(e) {}
    return apply();
  };
  window.ctThemeChoices = CHOICES;
  window.ctEffectiveTheme = effective;
  apply();

  // The sequel can begin (or a different save can load) at any refresh.
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { apply(); } catch(e) {}
      return r;
    };
  }

  // Settings: a Theme picker above Difficulty.
  const oldSettings = window.showSettings;
  if (typeof oldSettings === 'function') {
    window.showSettings = function(){
      const r = oldSettings.apply(this, arguments);
      try {
        const diff = document.getElementById('landingDifficultyEdit');
        if (diff && !document.getElementById('ctThemeSelect')) {
          const label = document.createElement('label');
          label.style.cssText = 'font-size:.8rem;color:var(--gold);';
          label.textContent = 'Colour theme';
          const sel = document.createElement('select');
          sel.id = 'ctThemeSelect';
          sel.style.cssText = diff.style.cssText;
          const cur = pref();
          CHOICES.forEach(function(c){
            const o = document.createElement('option'); o.value = c[0]; o.textContent = c[1]; if (c[0] === cur) o.selected = true; sel.appendChild(o);
          });
          sel.onchange = function(){ window.ctSetTheme(sel.value); };
          const diffLabel = diff.previousElementSibling;
          diff.parentNode.insertBefore(label, diffLabel || diff);
          diff.parentNode.insertBefore(sel, diffLabel || diff);
        }
      } catch(e) {}
      return r;
    };
  }
})();
