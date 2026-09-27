(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE WARDEN'S HALL. Seventh of the Arc XXI buildings to get
  // a real gameplay system, grounded directly in Ch.12's own text.
  //
  // Ch.12 is explicit that Joy's Warden role is storyline-based and does
  // NOT consume a field slot (San is "careful about the distinction" —
  // she isn't becoming another combat unit sent on expeditions). Joy
  // already exists as a fielded recruit (ate_joy, core-engine.js) from
  // her Arc XX recruitment — that kit is untouched here on purpose. This
  // building is about her *other* role: coordinating Fair Tide's own
  // safety while the crew is away, which the text draws as a deliberate
  // contrast ("she's becoming the reason Fair Tide itself stays safe
  // while everyone else is out there doing exactly that").
  //
  // Checked before building: no gold-fee angle fits here the way it did
  // for the Harbour Office or Workshop — Ch.12's text never mentions
  // money, tolls, or trade at all, only coordinated safety replacing
  // "everyone handling their own corner of it separately." The one
  // existing resource that actually matches that framing is
  // game.reputation (Respected/Renowned/Legendary ranks, already read by
  // getReputationBonus() for xp/gold/crit bonuses in
  // fairtide-buildings-and-arc6.js) — a safer, better-regarded
  // settlement is exactly what reputation already represents elsewhere
  // in this game. So this reuses the same daily-claim shape proven for
  // the Harbour Office/Workshop, but pays out in reputation instead of
  // gold, calibrated well below a single combat kill's own +5 rep
  // (core-engine.js handleVictory) so it reads as a steady trickle, not
  // a way to grind rank. The rotating flavor lines walk Joy through the
  // other Arc XXI buildings already established (Harbour Office, Market
  // Quarter, Supply House, Medical House, Workshop) rather than
  // inventing a new location, matching "coordinate" rather than
  // "patrol somewhere new."
  // -------------------------------------------------------------------

  const WARDENS_REP_PER_DAY = 3;

  const WATCH_ROUNDS = [
    { icon: '🌙', text: 'A quiet round through the Market Quarter after close — nothing but a stray cat and the last stallholder locking up.' },
    { icon: '🏮', text: "Checked in on the Harbour Office's night traffic — steady, orderly, nothing to note." },
    { icon: '🔒', text: 'Walked the length of the Supply House stores — everything accounted for, same as yesterday.' },
    { icon: '🕯️', text: 'A late check on the Medical House — quiet, which is exactly what everyone wants from it.' },
    { icon: '🔧', text: 'Flagged a loose gate latch near the Workshop for Caelan; already fixed by morning.' },
    { icon: '🛡️', text: 'Nothing to report. Joy writes it down anyway — that\'s the job now.' }
  ];
  window.ARC21_WATCH_ROUNDS = WATCH_ROUNDS;

  function wardensHallUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[12]);
  }
  window.wardensHallUnlocked = wardensHallUnlocked;

  function todaysWatchRound(){
    const idx = (game.day || 0) % WATCH_ROUNDS.length;
    return WATCH_ROUNDS[idx];
  }
  window.todaysWatchRound = todaysWatchRound;

  function canClaimWardensWatch(){
    if (!wardensHallUnlocked()) return false;
    game.wardensHall = game.wardensHall || { lastClaimDay: -1 };
    return game.wardensHall.lastClaimDay !== game.day;
  }
  window.canClaimWardensWatch = canClaimWardensWatch;

  function claimWardensWatch(){
    if (!canClaimWardensWatch()) { toast('Already filed today.', 2800); return; }
    game.wardensHall = game.wardensHall || { lastClaimDay: -1 };
    game.wardensHall.lastClaimDay = game.day;
    game.reputation = (game.reputation || 0) + WARDENS_REP_PER_DAY;
    toast('🛡️ Joy files the watch report — Fair Tide\'s standing grows by ' + WARDENS_REP_PER_DAY + ' rep.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimWardensWatch = claimWardensWatch;

  function renderWardensHallPanel(){
    if (!wardensHallUnlocked()) return '';
    const claimable = canClaimWardensWatch();
    const round = todaysWatchRound();
    let html = '<div class="panel-title" style="margin-top:16px;">🛡️ The Warden\'s Hall</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Joy isn\'t going out on expeditions. She\'s the reason Fair Tide stays safe while everyone else is out there doing exactly that.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+round.icon+'</div><div style="flex:1;">'+
      '<strong>Tonight\'s Round</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(round.text)+'</span>'+
      '</div></div></article>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">📋</div><div style="flex:1;">'+
      '<strong>Watch Report</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">Coordinated instead of everyone handling their own corner of it separately — word of it travels.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimWardensWatch()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '📋 File (+' + WARDENS_REP_PER_DAY + ' rep)' : '✓ Filed Today')+
      '</button></div></article>';
    return html;
  }
  window.renderWardensHallPanel = renderWardensHallPanel;

  const oldRenderArchiveScreenForWardensHall = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForWardensHall) oldRenderArchiveScreenForWardensHall();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('wardensHallPanelWrap');
    if (existing) existing.remove();
    const panel = renderWardensHallPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="wardensHallPanelWrap">'+panel+'</div>');
  };
})();
