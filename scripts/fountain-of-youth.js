(function(){
  // -------------------------------------------------------------------
  // FOUNTAIN OF YOUTH — PRESTIGE. Built as a standalone mechanic ahead
  // of any story wiring, per San's own direction — no chapter, arc, or
  // location exists for this yet; the lore and place stay deliberately
  // undiscovered until San is ready to build around it. This file is
  // meant to be linked to a chapter later via a simple discovery flag,
  // same pattern as harbourDiscovered/tideNetworkDiscovered elsewhere.
  //
  // Party-wide, not per-character — the game has exactly one shared
  // level (game.xpTotal -> level()) everywhere, with no existing
  // per-character progression concept anywhere in the codebase. San's
  // original per-character framing was explicitly a suggestion, not a
  // requirement — confirmed everyone levels together.
  //
  // Bonus stacking reuses window.getReputationBonus('xpBonus'/'goldBonus')
  // rather than touching gainXP() or the combat gold-grant directly —
  // that function is already a proven, multi-source stacking point
  // (wrapped twice elsewhere, for Bonds and Morale), so this just adds
  // a third source the same way.
  //
  // Reversal/"Rite of Reversal" mechanism deliberately NOT built yet —
  // San is still deciding between Daybreak's penalty-free recovery and
  // a costlier trade-off. Prestiging itself is real and works now;
  // undoing it is a separate, later decision.
  // -------------------------------------------------------------------

  const XP_BONUS_PER_PRESTIGE = 0.15;   // +15% XP per prestige, stacking linearly
  const GOLD_BONUS_PER_PRESTIGE = 0.10; // +10% combat gold per prestige

  function fountainState(){
    game.fountainPrestige = game.fountainPrestige || { count: 0 };
    return game.fountainPrestige;
  }
  window.fountainPrestigeState = fountainState;

  window.fountainOfYouthEligible = function(){
    return level() >= 300;
  };

  window.fountainXpBonus = function(){
    return fountainState().count * XP_BONUS_PER_PRESTIGE;
  };
  window.fountainGoldBonus = function(){
    return fountainState().count * GOLD_BONUS_PER_PRESTIGE;
  };

  window.prestigeAtFountain = function(){
    if (!window.fountainOfYouthEligible()) {
      toast('🔒 The Fountain has nothing to offer yet.');
      return;
    }
    const state = fountainState();
    const oldLevel = level();
    game.xpTotal = 0;
    state.count++;
    logEvent('✨ The crew drinks from the Fountain of Youth. Level resets to 1 — Prestige '+state.count+' begins.', 'gold');
    toast('✨ Prestige '+state.count+'! The climb begins again, faster this time.', 4000);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){
        showStoryModal({
          title: '✨ The Fountain of Youth',
          blurb: "The water doesn't feel like much of anything — not cold, not warm, barely wet at all.<br><br>But something underneath everyone's skin resets anyway. Level "+oldLevel+" becomes Level 1 again, the way it always does here.<br><br>What doesn't reset is everything that Level "+oldLevel+" actually taught them. That part stays, quietly, banked into whatever comes next.<br><br><b>Prestige "+state.count+"</b> — XP and gold now come in faster than they ever did the first time through."
        });
      }, 400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
  };

  const oldGetReputationBonusForFountain = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    const base = (typeof oldGetReputationBonusForFountain === 'function') ? oldGetReputationBonusForFountain(statKey) : 0;
    if (statKey === 'xpBonus') return base + window.fountainXpBonus();
    if (statKey === 'goldBonus') return base + window.fountainGoldBonus();
    return base;
  };

  // Simple panel on the Log screen — locked/teased below Level 300,
  // full prestige action once eligible. No dedicated screen yet since
  // there's no location to hang one off; this is a placeholder surface
  // until San builds the real one.
  window.fountainPanelHtml = function(){
    const state = fountainState();
    const eligible = window.fountainOfYouthEligible();
    if (state.count === 0 && !eligible) {
      return '<div class="panel" style="margin-top:10px;opacity:.6;">'+
        '<div class="panel-title">✨ ???</div>'+
        '<p style="font-size:.8rem;">Something waits beyond Level 300. Nobody\'s found it yet.</p></div>';
    }
    let html = '<div class="panel" style="margin-top:10px;border-color:rgba(180,220,255,.5);">'+
      '<div class="panel-title">✨ The Fountain of Youth</div>'+
      '<p style="font-size:.8rem;opacity:.85;">Prestiges so far: <b>'+state.count+'</b></p>';
    if (state.count > 0) {
      html += '<p style="font-size:.78rem;opacity:.8;">Current bonus: +'+Math.round(window.fountainXpBonus()*100)+'% XP · +'+Math.round(window.fountainGoldBonus()*100)+'% Gold</p>';
    }
    if (eligible) {
      html += '<button class="btn btn-small btn-success" onclick="prestigeAtFountain()">✨ Drink from the Fountain (Level → 1)</button>';
    } else {
      html += '<p style="font-size:.76rem;opacity:.6;">Reach Level 300 to prestige again.</p>';
    }
    html += '</div>';
    return html;
  };

  const oldRenderLogForFountain = window.renderLog;
  window.renderLog = function(){
    if (oldRenderLogForFountain) oldRenderLogForFountain();
    const container = document.getElementById('logScreen');
    if (!container) return;
    const existing = document.getElementById('fountainPanelSlot');
    if (existing) existing.remove();
    const slot = document.createElement('div');
    slot.id = 'fountainPanelSlot';
    slot.innerHTML = window.fountainPanelHtml();
    const gameContainer = container.querySelector('.game-container') || container;
    gameContainer.appendChild(slot);
  };
})();
