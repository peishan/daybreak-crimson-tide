(function(){
  // -------------------------------------------------------------------
  // SHIP PERSONALITY — the last item from San's Fair Tide Living World
  // list: per-ship stat/history tracking. Reads the player's own ship
  // (game.ship.{hull,cannons,sails,cargo}, game.shipName from the
  // Shipyard screen in core-engine.js), not the separate Fair Tide
  // fleet-management ships (game.inheritedShips, scripts/fairtide-
  // buildings-and-arc6.js) -- this is about San's own vessel developing
  // a character over the course of the whole playthrough, not the
  // fleet's trade assets.
  //
  // Wraps window.upgradeShip (core-engine.js) to track which stat gets
  // invested in most over time -- success detected the same before/
  // after way every other wrap in this codebase detects it (the stat's
  // own level only increases on an actual successful upgrade). No new
  // numeric bonus, no claim/reward: this is purely descriptive, read-
  // only flavor derived from choices the player already made, same
  // shape as veyren-weather.js and fair-tide-time-of-day.js.
  //
  // The dominant stat (whichever has been upgraded most) decides the
  // ship's trait. A genuine tie, or no upgrades at all yet, falls back
  // to a neutral "still finding her sea legs" trait rather than
  // arbitrarily picking a winner.
  // -------------------------------------------------------------------

  const TRAITS = {
    sails:   { icon: '💨', label: "The Wind's Favorite",     line: 'She catches a breeze nobody else even feels.' },
    cannons: { icon: '💥', label: 'Bristling',                line: 'Every rival gives her room before they even look twice.' },
    hull:    { icon: '🛡️', label: 'Unsinkable, Probably',     line: "She's taken plenty and kept sailing anyway." },
    cargo:   { icon: '📦', label: 'Packed to the Gunwales',   line: "There's a place for everything, and she finds room for one more thing anyway." }
  };
  window.SHIP_PERSONALITY_TRAITS = TRAITS;

  const NEUTRAL_TRAIT = { icon: '⚓', label: 'Still Finding Her Sea Legs', line: 'Barely out of dock, and already home.' };

  function shipHistoryState(){
    if (!game.shipHistory) game.shipHistory = { upgradeCounts: { hull: 0, cannons: 0, sails: 0, cargo: 0 }, totalUpgrades: 0 };
    return game.shipHistory;
  }
  window.shipHistoryState = shipHistoryState;

  function recordShipUpgrade(stat){
    if (!TRAITS[stat]) return;
    const state = shipHistoryState();
    state.upgradeCounts[stat] = (state.upgradeCounts[stat] || 0) + 1;
    state.totalUpgrades = (state.totalUpgrades || 0) + 1;
  }

  const oldUpgradeShipForPersonality = window.upgradeShip;
  window.upgradeShip = function(type, cost){
    const before = Number((game.ship && game.ship[type]) || 0);
    if (oldUpgradeShipForPersonality) oldUpgradeShipForPersonality(type, cost);
    const after = Number((game.ship && game.ship[type]) || 0);
    if (after > before) recordShipUpgrade(type);
  };

  function dominantTrait(){
    const counts = shipHistoryState().upgradeCounts;
    const keys = Object.keys(TRAITS);
    let best = null;
    keys.forEach(function(k){
      const v = counts[k] || 0;
      if (v > 0 && (!best || v > counts[best])) best = k;
    });
    if (!best) return NEUTRAL_TRAIT;
    const topCount = counts[best];
    const tied = keys.filter(function(k){ return (counts[k] || 0) === topCount; });
    if (tied.length > 1) return NEUTRAL_TRAIT; // a genuine tie stays neutral rather than picking arbitrarily
    return Object.assign({ stat: best }, TRAITS[best]);
  }
  window.shipPersonalityTrait = dominantTrait;

  function renderShipPersonalityPanel(){
    const trait = dominantTrait();
    const state = shipHistoryState();
    const name = game.shipName || 'The Daybreak';
    let html = '<div class="panel-title" style="margin-top:16px;">'+trait.icon+' '+esc(name)+' — '+esc(trait.label)+'</div>'+
      '<article class="quest-item"><span style="font-size:.82rem;opacity:.85;">'+esc(trait.line)+'</span>';
    if (state.totalUpgrades > 0) {
      html += '<br><span style="font-size:.76rem;opacity:.7;margin-top:4px;display:inline-block;">'+state.totalUpgrades+' upgrade'+(state.totalUpgrades === 1 ? '' : 's')+' made so far'+(trait.stat ? ', mostly to the '+esc(trait.stat) : '')+'.</span>';
    }
    html += '</article>';
    return html;
  }
  window.renderShipPersonalityPanel = renderShipPersonalityPanel;

  const oldRenderArchiveScreenForShipPersonality = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForShipPersonality) oldRenderArchiveScreenForShipPersonality();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('shipPersonalityPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="shipPersonalityPanelWrap">'+renderShipPersonalityPanel()+'</div>');
  };
})();
