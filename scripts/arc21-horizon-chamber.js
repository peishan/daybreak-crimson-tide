(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE HORIZON CHAMBER. Ninth of the Arc XXI buildings to get
  // a real gameplay system, grounded directly in Ch.15's own text.
  //
  // Checked before building: the Horizon Engine already has its own full
  // system — game.horizonEngine (knowledge/residue), a dedicated Fair
  // Tide Hub tab (Research Expedition, arc9-and-systems.js), and its own
  // development-percentage bar. Ch.15 itself is explicit that this isn't
  // a new research mechanic — it's the existing work finally getting a
  // proper room ("This isn't a bigger workbench... their work has a home
  // that actually matches what it's grown into"). Knowledge/Residue also
  // stop accruing once game.arc12Complete (long since true by Arc XXI's
  // level-315 gate), so a bonus to that specific currency would be dead
  // on arrival for anyone actually reaching this content.
  //
  // So this reuses the Medical House's one-time, tiered-investment shape
  // (equipment funding → permanent stat bonus) rather than the Route
  // Observatory's per-item logging or a daily claim, but chains into
  // window.getReputationBonus('xpBonus') the same proven, already-
  // multiply-stacked aggregator point (Bonds, Morale, Fountain of Youth)
  // instead of Medical House's effectiveMaxHp/Mp — "route research and
  // dimensional measurements" reads as sharpening how fast the whole
  // crew actually learns, not sturdier bodies, which is Medical House's
  // own territory already.
  // -------------------------------------------------------------------

  const HORIZON_CHAMBER_TIERS = [
    { tier: 1, cost: 200, xpBonus: 0.01, label: 'Proper Instrumentation', desc: "Measurement tools that don't have to be borrowed from the Workshop and returned by evening." },
    { tier: 2, cost: 400, xpBonus: 0.01, label: "Erynn's Cross-Reference Desk", desc: 'A dedicated space for archive work that used to happen wherever a free table was.' },
    { tier: 3, cost: 650, xpBonus: 0.01, label: 'The Controlled Experiment Bay', desc: 'Dimensional measurements that were never safe to run in a room built for repairing sails.' }
  ];
  window.ARC21_HORIZON_CHAMBER_TIERS = HORIZON_CHAMBER_TIERS;

  function horizonChamberUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[15]);
  }
  window.horizonChamberUnlocked = horizonChamberUnlocked;

  function horizonChamberTier(){
    return Number(game.horizonChamberTier || 0);
  }
  window.horizonChamberTier = horizonChamberTier;

  function horizonChamberXpBonus(){
    return horizonChamberTier() * 0.01; // each funded tier adds 1%, matching HORIZON_CHAMBER_TIERS' own xpBonus values
  }
  window.horizonChamberXpBonus = horizonChamberXpBonus;

  function fundHorizonChamberTier(){
    const nextTier = HORIZON_CHAMBER_TIERS.find(function(t){ return t.tier === horizonChamberTier() + 1; });
    if (!nextTier) { toast('Fully equipped already.', 2800); return; }
    if ((game.gold || 0) < nextTier.cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= nextTier.cost;
    game.horizonChamberTier = nextTier.tier;
    toast('🌌 ' + nextTier.label + ' funded — Renn and Erynn\'s work moves a little faster.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.fundHorizonChamberTier = fundHorizonChamberTier;

  const oldGetReputationBonusForHorizonChamber = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    const base = (typeof oldGetReputationBonusForHorizonChamber === 'function') ? oldGetReputationBonusForHorizonChamber(statKey) : 0;
    if (statKey === 'xpBonus') return base + horizonChamberXpBonus();
    return base;
  };

  function renderHorizonChamberPanel(){
    if (!horizonChamberUnlocked()) return '';
    const currentTier = horizonChamberTier();
    let html = '<div class="panel-title" style="margin-top:16px;">🌌 The Horizon Chamber</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a bigger workbench — a home that actually matches what Renn and Erynn\'s work has grown into.</p>';
    HORIZON_CHAMBER_TIERS.forEach(function(t){
      const funded = currentTier >= t.tier;
      const isNext = currentTier === t.tier - 1;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+(funded ? '✅' : '🌌')+'</div><div style="flex:1;">'+
        '<strong>'+esc(t.label)+'</strong> <span class="story-chip">+'+Math.round(t.xpBonus*100)+'% party XP</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(t.desc)+'</span>'+
        '</div>'+
        (funded ? '<span style="font-size:.78rem;opacity:.6;">Funded</span>'
          : (isNext ? '<button class="btn btn-small" onclick="fundHorizonChamberTier()" '+((game.gold||0) < t.cost ? 'disabled' : '')+'>Fund ('+t.cost+'g)</button>'
                    : '<span style="font-size:.72rem;opacity:.5;">🔒 Locked</span>'))+
        '</div></article>';
    });
    return html;
  }
  window.renderHorizonChamberPanel = renderHorizonChamberPanel;

  const oldRenderArchiveScreenForHorizonChamber = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForHorizonChamber) oldRenderArchiveScreenForHorizonChamber();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('horizonChamberPanelWrap');
    if (existing) existing.remove();
    const panel = renderHorizonChamberPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="horizonChamberPanelWrap">'+panel+'</div>');
  };
})();
