(function(){
  // -------------------------------------------------------------------
  // ATE JOY AT FAIR TIDE (SEQUEL ONLY).
  //
  // Through the main game (Arcs I-XLII) Ate Joy stays in the party like any other companion: the twins'
  // birth no longer sends her home. She goes back to Fair Tide with the rest of the old crew when the
  // sequel crew is set (scripts/sequel-party.js, on the first voyage), and stays there looking after
  // the settlement and the twins' home. She is not locked there: she can be fielded by hand, and any
  // chapter that calls for her can bring her along.
  //
  // The San & Joy bond's bonus stays on while she is at Fair Tide in the sequel, because she is
  // not away from San, just not on the ship.
  // -------------------------------------------------------------------
  const ID = 'ate_joy';
  function atFairTide(){
    return !!game.sequelCrewApplied && (game.fieldedIds || []).indexOf(ID) === -1;
  }
  window.isJoyCaringForTwins = function(){ return atFairTide(); };

  const oldSynergy = window.bondSynergyActive;
  if (typeof oldSynergy === 'function') {
    window.bondSynergyActive = function(trackKey){
      if (trackKey === 'san_joy' && atFairTide()) return (typeof window.bondTier === 'function') && window.bondTier('san_joy') >= 1;
      return oldSynergy.apply(this, arguments);
    };
  }
})();
