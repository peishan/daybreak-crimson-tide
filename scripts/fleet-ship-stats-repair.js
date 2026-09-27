(function(){
  // -------------------------------------------------------------------
  // FLEET SHIP STATS REPAIR — a data-migration fix, not a new code bug.
  // A ship designated 'fleet' on a browser BEFORE the service-worker
  // cache fix (V261) actually reached that browser got its
  // designation:'fleet' and status:'Joined the Fleet' saved correctly,
  // but never received .stats — designateShip() is the only place that
  // ever sets it, and it's never re-invoked for a ship that's already
  // designated (the Roster UI only offers designation buttons to
  // undesignated ships, per fairtide-buildings-and-arc6.js's own
  // render loop). So the code fix only helps ships designated AFTER it
  // landed — anything designated during the broken window stays stuck
  // showing no stats/upgrade buttons forever, exactly San's report.
  //
  // Backfills defensively on every Fair Tide Hub render, cheap and
  // idempotent (skips any ship that already has .stats) — same
  // repair-on-render pattern already used elsewhere in this codebase
  // (e.g. horizonEngineState()'s own dragonBlood backfill,
  // arc9-and-systems.js). Loaded after every other file that wraps
  // renderFairTideHub, so this backfill runs before the chain reaches
  // whichever tab is actually being rendered, roster included.
  // -------------------------------------------------------------------

  const oldRenderFairTideHubForFleetRepair = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    (game.inheritedShips || []).forEach(function(ship){
      if (ship.designation === 'fleet' && !ship.stats) {
        ship.stats = { hull: 1, cannons: 1, sails: 1, cargo: 1 };
      }
    });
    if (oldRenderFairTideHubForFleetRepair) oldRenderFairTideHubForFleetRepair();
  };
})();
