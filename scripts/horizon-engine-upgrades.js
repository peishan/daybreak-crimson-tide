(function(){
  // -------------------------------------------------------------------
  // HORIZON ENGINE UPGRADES. The engine was finished in Arc XII and then had nothing left to do: its
  // development bar sat at 99%, Knowledge and Residue stopped accruing, and every crossing took 18 days.
  // The Engine's five subsystems (Arc X Ch.13's plan: Observation, Stabilization, Interpretation,
  // Energy Regulation, Boundary Alignment) can now be refined one after another from the Fair Tide Hub's
  // Expedition tab, paid for in gold and Dragon Blood (the one thing expeditions still bring back).
  //
  //   1. Stabilization Coils       crossings 3 days shorter
  //   2. Energy Regulator          crossings 3 days shorter
  //   3. Interpretation Core       crossing supplies cost 25% less
  //   4. Boundary Alignment Lattice crossings 3 days shorter
  //   5. Observation Array         +2% party XP
  //
  // Bought in order, once each. With none bought nothing changes: 18 days, full supplies, no bonus.
  // -------------------------------------------------------------------
  const TIERS = [
    { tier:1, label:'Stabilization Coils',        icon:'🌀', gold:1000, blood:2, desc:'Steadier doors mean a shorter way through.',                effect:'Crossings are 3 days shorter.' },
    { tier:2, label:'Energy Regulator',           icon:'⚡', gold:2000, blood:3, desc:'Less power wasted holding the door open.',                   effect:'Crossings are another 3 days shorter.' },
    { tier:3, label:'Interpretation Core',        icon:'📖', gold:3500, blood:4, desc:'Erynn and Renn read the boundary instead of guessing at it.', effect:'Crossing supplies cost 25% less.' },
    { tier:4, label:'Boundary Alignment Lattice', icon:'🧭', gold:5000, blood:5, desc:'The doorway lands where it is aimed.',                       effect:'Crossings are another 3 days shorter.' },
    { tier:5, label:'Observation Array',          icon:'🔭', gold:8000, blood:6, desc:'Everything that crosses is watched, measured and learned from.', effect:'+2% party XP.' }
  ];
  window.HORIZON_ENGINE_UPGRADE_TIERS = TIERS;
  const DAY_CUTS = { 1:3, 2:3, 4:3 };

  function tier(){ return Number(game.horizonEngineTier || 0); }
  window.horizonEngineTier = tier;
  function open(){ return !!game.arc12Complete; }

  window.horizonEngineCrossingDays = function(base){
    let cut = 0; for (let t = 1; t <= tier(); t++) cut += (DAY_CUTS[t] || 0);
    return Math.max(6, base - cut);
  };
  window.horizonEngineSupplyFactor = function(){ return tier() >= 3 ? 0.75 : 1; };

  const oldRep = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    const base = (typeof oldRep === 'function') ? oldRep.apply(this, arguments) : 0;
    return (statKey === 'xpBonus' && tier() >= 5) ? base + 0.02 : base;
  };

  window.buyHorizonEngineUpgrade = function(){
    const next = TIERS.find(function(t){ return t.tier === tier() + 1; });
    if (!next) { toast('The Engine is fully refined.', 2800); return; }
    const he = (typeof window.horizonEngineState === 'function') ? window.horizonEngineState() : { dragonBlood: 0 };
    if ((game.gold || 0) < next.gold) { toast('Not enough gold.', 2800); return; }
    if ((he.dragonBlood || 0) < next.blood) { toast('Not enough Dragon Blood. Expeditions bring it back.', 3200); return; }
    game.gold -= next.gold; he.dragonBlood -= next.blood;
    game.horizonEngineTier = next.tier;
    toast(next.icon + ' ' + next.label + ' installed. ' + next.effect, 4200);
    if (typeof logEvent === 'function') logEvent(next.icon + ' Horizon Engine: ' + next.label + ' installed. ' + next.effect, 'gold');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
    if (typeof window.renderInterworldScreen === 'function') window.renderInterworldScreen();
  };

  function panel(){
    if (!open()) return '';
    const cur = tier();
    const he = (typeof window.horizonEngineState === 'function') ? window.horizonEngineState() : { dragonBlood: 0 };
    let html = '<div class="panel-title" style="margin-top:16px;">🌌 Horizon Engine Upgrades</div>' +
      '<p style="font-size:.78rem;opacity:.7;margin-bottom:8px;">Refine the Engine\'s five subsystems, one after another. Paid in gold and 🩸 Dragon Blood (you have ' + (he.dragonBlood || 0) + '). Crossing time is now ' + window.interworldCrossingDays() + ' days.</p>';
    TIERS.forEach(function(t){
      const done = cur >= t.tier, next = cur === t.tier - 1;
      const can = (game.gold || 0) >= t.gold && (he.dragonBlood || 0) >= t.blood;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.4rem;">' + (done ? '✅' : t.icon) + '</div><div style="flex:1;">' +
        '<strong>' + t.label + '</strong><br><span style="font-size:.8rem;opacity:.85;">' + t.desc + '</span><br><span style="font-size:.78rem;color:#9be3a8;">' + t.effect + '</span></div>' +
        (done ? '<span style="font-size:.78rem;opacity:.6;">Installed</span>'
          : next ? '<button class="btn btn-small" onclick="buyHorizonEngineUpgrade()"' + (can ? '' : ' disabled') + '>' + t.gold + 'g · ' + t.blood + ' 🩸</button>'
          : '<span style="font-size:.72rem;opacity:.5;">🔒 After the one above</span>') +
        '</div></article>';
    });
    return html;
  }

  // appended to the Expedition tab of the Fair Tide Hub
  const oldHub = window.renderFairTideHub;
  if (typeof oldHub === 'function') {
    window.renderFairTideHub = function(){
      const r = oldHub.apply(this, arguments);
      try {
        const el = document.getElementById('ft-tab-expedition');
        if (el && (game.fairTideActiveTab || 'buildings') === 'expedition' && !el.querySelector('#horizonEngineUpgrades')) {
          const html = panel();
          if (html) el.insertAdjacentHTML('beforeend', '<div id="horizonEngineUpgrades">' + html + '</div>');
        }
      } catch(e) {}
      return r;
    };
  }
})();
