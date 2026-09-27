(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE WORKSHOP. Sixth of the Arc XXI buildings to get a
  // real gameplay system, grounded directly in Ch.10-11's own text.
  //
  // Checked before building: this game already has ship condition
  // (game.health/maxHealth) fully restored by the existing rest system
  // (freeRestAtPort/restAtTavern), and upgradeShip()'s cost is computed
  // by its caller rather than internally — so neither "free repair" nor
  // a safe upgrade discount was available without either duplicating an
  // existing mechanic or touching shared, risky rendering code. Built
  // something genuinely distinct instead, grounded in what Ch.10-11
  // actually emphasize: not a single big repair, but "the dozen small
  // maintenance jobs that never stop needing doing" (Ch.10) and a
  // literal "growing pile of other people's problems" arriving one at
  // a time (Ch.11) — Caelan fixing THINGS, plural, ongoing, not one
  // ship-wide action. Reuses the same daily-claim shape already proven
  // for the Harbour Office and Market Quarter, themed around Caelan's
  // maintenance work rather than fees.
  // -------------------------------------------------------------------

  const WORKSHOP_REVENUE_PER_DAY = 30;

  // Grounded in Ch.10's own "equipment repair, ship components, tools,
  // mechanical projects" line and Ch.11's "growing pile" framing.
  const MAINTENANCE_JOBS = [
    { icon: '⚙️', text: 'A stuck hinge on the Supply House door, finally fixed.' },
    { icon: '🔩', text: 'A cracked cargo winch, reinforced before it gave out entirely.' },
    { icon: '🪛', text: "Someone's tool kit, sorted and repaired for the third time this month." },
    { icon: '⚒️', text: 'A warped dock plank, replaced before anyone stepped wrong on it.' },
    { icon: '🧰', text: "The Market Quarter's cart wheels, all four, somehow all at once." },
    { icon: '🔧', text: 'A ship fitting nobody else recognized, identified and repaired anyway.' }
  ];
  window.ARC21_MAINTENANCE_JOBS = MAINTENANCE_JOBS;

  function workshopUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[10]);
  }
  window.workshopUnlocked = workshopUnlocked;

  function todaysMaintenanceJob(){
    const idx = (game.day || 0) % MAINTENANCE_JOBS.length;
    return MAINTENANCE_JOBS[idx];
  }
  window.todaysMaintenanceJob = todaysMaintenanceJob;

  function canClaimWorkshopRevenue(){
    if (!workshopUnlocked()) return false;
    game.workshop = game.workshop || { lastClaimDay: -1 };
    return game.workshop.lastClaimDay !== game.day;
  }
  window.canClaimWorkshopRevenue = canClaimWorkshopRevenue;

  function claimWorkshopRevenue(){
    if (!canClaimWorkshopRevenue()) { toast('Already collected today.', 2800); return; }
    game.workshop = game.workshop || { lastClaimDay: -1 };
    game.workshop.lastClaimDay = game.day;
    game.gold = (game.gold || 0) + WORKSHOP_REVENUE_PER_DAY;
    toast('⚒️ Workshop repair fees bring in ' + WORKSHOP_REVENUE_PER_DAY + 'g.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimWorkshopRevenue = claimWorkshopRevenue;

  function renderWorkshopPanel(){
    if (!workshopUnlocked()) return '';
    const claimable = canClaimWorkshopRevenue();
    const job = todaysMaintenanceJob();
    let html = '<div class="panel-title" style="margin-top:16px;">⚒️ The Workshop</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">For the first time since he arrived, what Caelan does has a name and a place — instead of just being the thing he ends up doing anyway.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+job.icon+'</div><div style="flex:1;">'+
      '<strong>Today\'s Job</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(job.text)+'</span>'+
      '</div></div></article>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">💰</div><div style="flex:1;">'+
      '<strong>Repair Fees</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">A dozen small maintenance jobs that never stop needing doing — and never stop paying, either.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimWorkshopRevenue()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '💰 Collect ' + WORKSHOP_REVENUE_PER_DAY + 'g' : '✓ Collected Today')+
      '</button></div></article>';
    return html;
  }
  window.renderWorkshopPanel = renderWorkshopPanel;

  const oldRenderArchiveScreenForWorkshop = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForWorkshop) oldRenderArchiveScreenForWorkshop();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('workshopPanelWrap');
    if (existing) existing.remove();
    const panel = renderWorkshopPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="workshopPanelWrap">'+panel+'</div>');
  };
})();
