(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE MEDICAL HOUSE. Fifth of the Arc XXI buildings to get
  // a real gameplay system, grounded directly in Ch.9's own text.
  //
  // Checked before building: this game already has a "free rest" system
  // (freeRestAtPort/restAtTavern in core-engine.js, both gated by the
  // same game.freeRestDay flag) that fully heals the party once per day.
  // A "free heal" button here would just be a third, redundant way to
  // trigger the exact same shared mechanic — not a new capability, and
  // actively confusing next to the two that already exist. Built
  // something genuinely distinct instead: Ch.9's own text is about
  // Dr. AA "listing equipment before the paint's even dry" and San
  // "letting them have it anyway" — an ongoing equipment investment,
  // not a daily action. So this is a one-time, tiered investment
  // (funding Dr. AA's equipment requests) that permanently improves
  // party vitality, reusing the exact same safe percentage-bonus
  // pattern already proven for the Fountain's Rejuvenation effect in
  // raid-mode.js — wrapped again here, correctly chained to whatever
  // that file already set up, rather than a flat number invented fresh.
  // Deliberately smaller than Rejuvenation's own 6% (this is ordinary
  // settlement infrastructure, not the story's biggest milestone).
  // -------------------------------------------------------------------

  const MEDICAL_TIERS = [
    { tier: 1, cost: 150, pct: 0.01, label: 'Basic Supplies', desc: "Bandages, splints, the everyday things Jovie ran out of constantly before this." },
    { tier: 2, cost: 300, pct: 0.01, label: "Dr. AA's First Request", desc: "Equipment listed before the paint was even dry — San regretted asking, and funded it anyway." },
    { tier: 3, cost: 500, pct: 0.01, label: 'A Proper Recovery Ward', desc: "Somewhere to actually rest and heal properly, not just get patched up and sent back out." }
  ];
  window.ARC21_MEDICAL_TIERS = MEDICAL_TIERS;

  function medicalHouseUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[9]);
  }
  window.medicalHouseUnlocked = medicalHouseUnlocked;

  function medicalHouseTier(){
    return Number(game.medicalHouseTier || 0);
  }
  window.medicalHouseTier = medicalHouseTier;

  function medicalHouseBonusPct(){
    return medicalHouseTier() * 0.01; // each funded tier adds 1%, matching MEDICAL_TIERS' own pct values
  }
  window.medicalHouseBonusPct = medicalHouseBonusPct;

  function fundMedicalTier(){
    const nextTier = MEDICAL_TIERS.find(function(t){ return t.tier === medicalHouseTier() + 1; });
    if (!nextTier) { toast('Fully equipped already.', 2800); return; }
    if ((game.gold || 0) < nextTier.cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= nextTier.cost;
    game.medicalHouseTier = nextTier.tier;
    toast('🏥 ' + nextTier.label + ' funded — the party feels a little sturdier.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.fundMedicalTier = fundMedicalTier;

  // Chained the same way every wrap in this codebase chains — reads
  // whatever effectiveMaxHp/Mp already resolves to (including
  // Rejuvenation's own bonus from raid-mode.js, if that file loaded
  // first) and adds this on top, rather than overwriting it.
  const oldEffectiveMaxHpForMedicalHouse = window.effectiveMaxHp;
  window.effectiveMaxHp = function(m){
    const base = oldEffectiveMaxHpForMedicalHouse(m);
    return base + Math.round(base * medicalHouseBonusPct());
  };
  const oldEffectiveMaxMpForMedicalHouse = window.effectiveMaxMp;
  window.effectiveMaxMp = function(m){
    const base = oldEffectiveMaxMpForMedicalHouse(m);
    return base + Math.round(base * medicalHouseBonusPct());
  };

  function renderMedicalHousePanel(){
    if (!medicalHouseUnlocked()) return '';
    const currentTier = medicalHouseTier();
    let html = '<div class="panel-title" style="margin-top:16px;">🏥 Medical House</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">A real space, finally, for healing, medicine storage, treatment, recovery — instead of whatever room happened to be free.</p>';
    MEDICAL_TIERS.forEach(function(t){
      const funded = currentTier >= t.tier;
      const isNext = currentTier === t.tier - 1;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+(funded ? '✅' : '🏥')+'</div><div style="flex:1;">'+
        '<strong>'+esc(t.label)+'</strong> <span class="story-chip">+'+Math.round(t.pct*100)+'% party vitality</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(t.desc)+'</span>'+
        '</div>'+
        (funded ? '<span style="font-size:.78rem;opacity:.6;">Funded</span>'
          : (isNext ? '<button class="btn btn-small" onclick="fundMedicalTier()" '+((game.gold||0) < t.cost ? 'disabled' : '')+'>Fund ('+t.cost+'g)</button>'
                    : '<span style="font-size:.72rem;opacity:.5;">🔒 Locked</span>'))+
        '</div></article>';
    });
    return html;
  }
  window.renderMedicalHousePanel = renderMedicalHousePanel;

  const oldRenderArchiveScreenForMedicalHouse = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForMedicalHouse) oldRenderArchiveScreenForMedicalHouse();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('medicalHousePanelWrap');
    if (existing) existing.remove();
    const panel = renderMedicalHousePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="medicalHousePanelWrap">'+panel+'</div>');
  };

  // -------------------------------------------------------------------
  // CLINIC -> MEDICAL HOUSE re-skin (San's own steer, in response to the
  // Ch.9 naming question): kept as ONE feature in the player's eyes, not
  // two separate buildings. The Clinic's existing daily free-rest button
  // (arc4-fairtide.js/fairtide-buildings-and-arc6.js) and this file's own
  // tiered HP/MP investment stay mechanically exactly as they were -- a
  // quick daily action and a permanent equipment investment answer two
  // genuinely different questions, so neither is touched. This purely
  // re-skins the Fair Tide hub's Clinic tab (button label + its own
  // flavor text) once Ch.9 is actually read, so the UI reads as the same
  // room Ch.9 describes rather than a second, unconnected building.
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForClinicRename = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForClinicRename) oldRenderFairTideHubForClinicRename();
    if (!medicalHouseUnlocked()) return;
    const btn = document.getElementById('ft-tab-btn-clinic');
    if (btn) btn.textContent = '🏥 Medical House';
    const el = document.getElementById('ft-tab-clinic');
    if (!el || (game.fairTideActiveTab || 'buildings') !== 'clinic') return;
    const clinicSeen = !!game.fairTideClinicSeen;
    const jovieHere = !!(game.fairTideRoster && game.fairTideRoster.jovie);
    let html = '<div class="panel-title">🏥 The Medical House</div><article class="quest-item">';
    html += clinicSeen
      ? '<div style="font-size:.85rem;opacity:.85;">Senedra runs the Medical House now, even if she still can\'t say why she knows how.</div>'
      : '<div style="font-size:.85rem;opacity:.9;">Senedra wanders in to look the place over — and stops dead in the doorway. Her hands are already moving before she\'s decided to move them, checking supplies, straightening equipment like she\'s done it a thousand times. She doesn\'t remember being a paramedic. Her hands clearly do.</div>';
    if (jovieHere) html += '<div style="font-size:.85rem;opacity:.85;margin-top:6px;">Jovie runs the Medical House day to day now, her own medical box open on the counter beside Senedra\'s.</div>';
    html += '<div style="margin-top:8px;"><button class="btn btn-small btn-success" onclick="window.__ctOpenFairTideClinic()">Rest &amp; Recover</button></div></article>';
    el.innerHTML = html;
  };
})();
