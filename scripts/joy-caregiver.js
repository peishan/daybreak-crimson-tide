(function(){
  // -------------------------------------------------------------------
  // ATE JOY LOOKS AFTER THE TWINS.
  //
  // Once Vaeren and Joelle are born (Arc XXXV Ch.10) Joy goes home to Fair Tide to
  // look after them, and stays there until the twins join the crew themselves
  // (Arc XLI Ch.16). Before this, nothing moved her: she stayed in the field
  // unless the player benched her by hand.
  //
  // It reuses the existing "can't be fielded right now" lock (isTrainingLocked in
  // arc9-and-systems.js), which also sends her to Fair Tide on its own and keeps
  // her off the fielding screen, with a reason. When the twins join she is free
  // again but stays at Fair Tide until you bring her back. The San & Joy bond's
  // bonus stays on while she is caring for the twins, because she is not away from
  // San, just not on the ship.
  // -------------------------------------------------------------------
  const ID = 'ate_joy';
  function bornTwins(){ return !!(game.comicProgress35 && game.comicProgress35[10]); }
  function twinsJoined(){ return !!(game.foundCompanions && game.foundCompanions.vaeren); }
  function caring(id){ return id === ID && bornTwins() && !twinsJoined(); }
  window.isJoyCaringForTwins = function(){ return caring(ID); };

  const oldLocked = window.isTrainingLocked;
  window.isTrainingLocked = function(id){
    if (caring(id)) return true;
    return oldLocked ? oldLocked.apply(this, arguments) : false;
  };
  const oldLabel = window.trainingLockLabel;
  window.trainingLockLabel = function(id){
    if (caring(id)) return 'Looking after Vaeren and Joelle at Fair Tide.';
    return oldLabel ? oldLabel.apply(this, arguments) : '';
  };

  function announce(){
    game.joyCare = game.joyCare || {};
    if (caring(ID) && !game.joyCare.started) {
      game.joyCare.started = true;
      const msg = 'Ate Joy goes home to Fair Tide to look after the twins.';
      if (typeof window.notify === 'function') window.notify({ icon: '👶', title: 'Joy goes home', text: msg, kind: 'info' });
      else if (typeof toast === 'function') toast('👶 ' + msg, 4000);
      if (typeof logEvent === 'function') logEvent('👶 ' + msg, 'gold');
    }
    if (game.joyCare.started && !game.joyCare.ended && !caring(ID) && twinsJoined()) {
      game.joyCare.ended = true;
      // She stays at Fair Tide until the player brings her back: record that as a decision.
      game.fieldingDecided = game.fieldingDecided || ['san'];
      if (game.fieldingDecided.indexOf(ID) === -1) game.fieldingDecided.push(ID);
      game.fieldedIds = (game.fieldedIds || []).filter(function(x){ return x !== ID; });
      const msg = 'The twins are on their own feet now. Ate Joy is free to sail again, whenever you want her aboard.';
      if (typeof logEvent === 'function') logEvent('👶 ' + msg, 'gold');
      if (typeof toast === 'function') toast('👶 ' + msg, 4200);
    }
  }
  const oldGetFielded = window.getFieldedIds;
  if (typeof oldGetFielded === 'function') {
    window.getFieldedIds = function(){
      try { announce(); } catch(e) {}
      return oldGetFielded.apply(this, arguments);
    };
  }

  const oldSynergy = window.bondSynergyActive;
  if (typeof oldSynergy === 'function') {
    window.bondSynergyActive = function(trackKey){
      if (trackKey === 'san_joy' && caring(ID)) return (typeof window.bondTier === 'function') && window.bondTier('san_joy') >= 1;
      return oldSynergy.apply(this, arguments);
    };
  }
})();
