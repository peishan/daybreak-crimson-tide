(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE COMMONS. Eleventh of the Arc XXI buildings, grounded
  // directly in Ch.18's own text — and deliberately the one building in
  // this arc that does NOT get a gameplay system.
  //
  // Ch.18 is explicit and insistent about this, twice over: "Every
  // building so far has had a function — trade, safety, repair,
  // decisions. The Commons doesn't, not really, and that's precisely
  // the point... Nobody's managing anything. Nobody needs to be." The
  // design doc's own list of Arc XXI's nine real gameplay systems (see
  // arc21.js's scope note) never names a Commons system either — every
  // other building on the list maps to one of those nine; this one
  // doesn't, and that's not an oversight to fix later.
  //
  // So this reuses the rotating-flavor-line texture already proven for
  // the Market Quarter/Workshop/Warden's Hall (todaysVendor/
  // todaysMaintenanceJob/todaysWatchRound) for the same reason those
  // exist — to give the place some life across visits — but stops
  // there on purpose: no claim button, no gold, no XP, no resource, no
  // one-time checklist. Vignettes are drawn from Ch.20's own named cast
  // of people who stayed (Jorvin, Jovie, Imah, Nurul, Dre, Gino, Wahyu,
  // Dudin, Caelan, Joy), just existing, not doing anything that needs
  // tracking.
  // -------------------------------------------------------------------

  const COMMONS_VIGNETTES = [
    "Jorvin is telling the same story he always tells. It's funnier every time, somehow.",
    "Jovie is off duty for once — just eating with everyone else instead of tending to them.",
    'Imah and Nurul are arguing cheerfully about nothing in particular.',
    'Dre has brought coffee for everyone whether they asked for it or not.',
    'Gino and Wahyu are teaching Dudin a card game he keeps losing on purpose.',
    "Caelan showed up still smelling faintly of the Workshop and nobody minds at all.",
    "Joy is sitting closest to the door, out of habit more than duty tonight.",
    'Nobody in particular is doing anything in particular. That seems to be the whole point.'
  ];
  window.ARC21_COMMONS_VIGNETTES = COMMONS_VIGNETTES;

  function commonsUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[18]);
  }
  window.commonsUnlocked = commonsUnlocked;

  function todaysCommonsVignette(){
    const idx = (game.day || 0) % COMMONS_VIGNETTES.length;
    return COMMONS_VIGNETTES[idx];
  }
  window.todaysCommonsVignette = todaysCommonsVignette;

  function renderCommonsPanel(){
    if (!commonsUnlocked()) return '';
    return '<div class="panel-title" style="margin-top:16px;">🏠 The Commons</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not trade, not safety, not repair, not decisions. Just a place. That\'s the whole point.</p>'+
      '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">🍲</div><div style="flex:1;">'+
      '<span style="font-size:.85rem;opacity:.9;">'+esc(todaysCommonsVignette())+'</span>'+
      '</div></div></article>';
  }
  window.renderCommonsPanel = renderCommonsPanel;

  const oldRenderArchiveScreenForCommons = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCommons) oldRenderArchiveScreenForCommons();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('commonsPanelWrap');
    if (existing) existing.remove();
    const panel = renderCommonsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="commonsPanelWrap">'+panel+'</div>');
  };
})();
