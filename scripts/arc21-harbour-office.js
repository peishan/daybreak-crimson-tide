(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE HARBOUR OFFICE. Second of the Arc XXI buildings to
  // get a real gameplay system, grounded directly in Ch.5-6's own text.
  //
  // Ch.5 establishes the Office's actual function in its own words:
  // "Ships arriving, ships departing, cargo declared or not declared,
  // visiting crews needing somewhere to actually check in... paperwork,
  // schedules, a proper place to log who's coming and going." That's a
  // daily, ongoing administrative function — not a one-off decision
  // like the Council Hall — so this reuses the exact daily-claim
  // pattern already proven for trade ship income
  // (ship.tradeIncome/lastClaimDay in fairtide-buildings-and-arc6.js)
  // rather than inventing a new mechanic shape. Calibrated against that
  // same system's own claim amount (25g/ship/day) — scaled up modestly
  // since this represents the whole harbour's organized traffic, not
  // one vessel.
  //
  // Ch.6's "four ships at once" is a specific, named, one-time story
  // incident (not a repeatable event), so it's logged as a one-time
  // Harbour Log entry once that chapter is read, not turned into its
  // own mechanic — matching what the text actually describes rather
  // than inventing a recurring "surge" system around a single scene.
  // -------------------------------------------------------------------

  const HARBOUR_FEES_PER_DAY = 40;

  function harbourOfficeUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[5]);
  }
  window.harbourOfficeUnlocked = harbourOfficeUnlocked;

  function canClaimHarbourFees(){
    if (!harbourOfficeUnlocked()) return false;
    game.harbourOffice = game.harbourOffice || { lastClaimDay: -1 };
    return game.harbourOffice.lastClaimDay !== game.day;
  }
  window.canClaimHarbourFees = canClaimHarbourFees;

  function claimHarbourFees(){
    if (!canClaimHarbourFees()) { toast('Already collected today.', 2800); return; }
    game.harbourOffice = game.harbourOffice || { lastClaimDay: -1 };
    game.harbourOffice.lastClaimDay = game.day;
    game.gold = (game.gold || 0) + HARBOUR_FEES_PER_DAY;
    toast('⚓ Harbour Office collects ' + HARBOUR_FEES_PER_DAY + 'g in docking fees.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimHarbourFees = claimHarbourFees;

  function renderHarbourOfficePanel(){
    if (!harbourOfficeUnlocked()) return '';
    const claimable = canClaimHarbourFees();
    let html = '<div class="panel-title" style="margin-top:16px;">⚓ Harbour Office</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Paperwork, schedules, a proper place to log who\'s coming and going — nothing glamorous, but a genuine victory all the same.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">📋</div><div style="flex:1;">'+
      '<strong>Docking Fees</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">Organized docking means ships pay properly, instead of whoever happened to be on the dock sorting it out informally.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimHarbourFees()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '💰 Collect ' + HARBOUR_FEES_PER_DAY + 'g' : '✓ Collected Today')+
      '</button></div></article>';

    // Ch.6's "four ships at once" — a specific, one-time incident, not a
    // repeatable mechanic, logged exactly once if that chapter's been read.
    if (game.comicProgress21 && game.comicProgress21[6]) {
      html += '<article class="quest-item" style="border-left-color:rgba(232,197,71,.5);"><strong>📜 Harbour Log</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">Four ships arrived within the same hour — unthinkable a year ago, apparently just a Tuesday now. Joel directed traffic like he\'d done it before. San mostly stayed out of the way.</span></article>';
    }
    return html;
  }
  window.renderHarbourOfficePanel = renderHarbourOfficePanel;

  const oldRenderArchiveScreenForHarbourOffice = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForHarbourOffice) oldRenderArchiveScreenForHarbourOffice();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('harbourOfficePanelWrap');
    if (existing) existing.remove();
    const panel = renderHarbourOfficePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="harbourOfficePanelWrap">'+panel+'</div>');
  };
})();
