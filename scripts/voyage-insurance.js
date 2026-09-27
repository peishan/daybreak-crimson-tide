(function(){
  // -------------------------------------------------------------------
  // VOYAGE INSURANCE — fourth follow-up on the design review. Originally
  // scoped as "cargo insurance," but checked handleVoyageEvent() and
  // handleDefeat() first: no event in this game actually touches
  // game.cargo at all (every non-combat voyage event is net-positive —
  // merchant tips, wreck salvage, treasure). The one real, universal
  // loss on a bad voyage is handleDefeat()'s own flat 75g + hull-damage
  // penalty on any non-training defeat — including a lost 'sea' combat
  // encounter mid-voyage. Insuring against a loss that doesn't exist
  // would be a hollow purchase, so this insures the loss that actually
  // does, and is named for what it covers.
  //
  // Doesn't touch handleDefeat()'s own penalty logic at all — wraps it,
  // lets the existing flat penalty apply exactly as it always has, then
  // refunds it as a "claim" if a policy was active at the moment of
  // defeat (gold refunded in full, hull damage refunded at half — some
  // real stakes remain even insured). One-shot: consumed on the first
  // claim, buy again for the next voyage.
  // -------------------------------------------------------------------

  const INSURANCE_COST = 50;

  function insuranceState(){
    game.voyageInsurance = game.voyageInsurance || { active: false };
    return game.voyageInsurance;
  }
  window.voyageInsuranceState = insuranceState;

  window.buyVoyageInsurance = function(){
    const state = insuranceState();
    if (state.active) { toast('Already insured for your next defeat.'); return; }
    if ((game.gold || 0) < INSURANCE_COST) { toast('Not enough gold.'); return; }
    game.gold -= INSURANCE_COST;
    state.active = true;
    toast('📜 Voyage Insurance purchased — covered against your next defeat at sea.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderTavern === 'function') renderTavern();
    if (typeof updateUI === 'function') updateUI();
  };

  function renderVoyageInsuranceStatus(){
    const el = document.getElementById('voyageInsuranceStatus');
    if (!el) return;
    const state = insuranceState();
    if (state.active) {
      el.innerHTML = '<div class="story-chip">✓ Active — covers your next defeat in full.</div>';
    } else {
      const afford = (game.gold || 0) >= INSURANCE_COST;
      el.innerHTML = '<button class="btn btn-small ' + (afford ? 'btn-success' : '') + '" ' + (afford ? '' : 'disabled') + ' onclick="buyVoyageInsurance()">📜 Buy Insurance (' + INSURANCE_COST + 'g)</button>';
    }
  }
  window.renderVoyageInsuranceStatus = renderVoyageInsuranceStatus;

  const oldRenderTavernForInsurance = window.renderTavern;
  window.renderTavern = function(){
    oldRenderTavernForInsurance();
    renderVoyageInsuranceStatus();
  };

  const oldHandleDefeatForInsurance = window.handleDefeat;
  window.handleDefeat = function(){
    const state = insuranceState();
    const wasActive = !!state.active;
    const isTrainingBout = !!(game.combatEnemy && game.combatEnemy.kind === 'training');
    const goldBefore = game.gold;
    const healthBefore = game.health;
    oldHandleDefeatForInsurance();
    if (wasActive && !isTrainingBout) {
      const goldLost = Math.max(0, goldBefore - game.gold);
      const healthLost = Math.max(0, healthBefore - game.health);
      if (goldLost > 0) game.gold += goldLost;
      if (healthLost > 0) game.health = Math.min(healthBefore, game.health + Math.round(healthLost / 2));
      state.active = false;
      toast('📜 Voyage Insurance covers the loss — ' + goldLost + 'g refunded.', 4200);
      if (typeof logEvent === 'function') logEvent('📜 Voyage Insurance claim: ' + goldLost + 'g refunded after defeat.', 'gold');
      if (typeof updateUI === 'function') updateUI();
    }
  };
})();
