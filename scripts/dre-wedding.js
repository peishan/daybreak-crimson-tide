(function(){
  // -------------------------------------------------------------------
  // DRE'S WEDDING — a one-time flavour story beat, triggered once San &
  // Dre's bond (scripts/hang-out-companions.js, key 'san_dre') reaches
  // its final tier (100 points). Two stages, same shape as every other
  // "pending event resolves after a day passes" pattern in this codebase
  // (see interworld-expeditions.js's game.pendingInterworldExpedition):
  //
  //   1. INVITATION — the moment the bond maxes out, San gets word of the
  //      engagement and the wedding date. Purely narrated (San's RSVP,
  //      who she's bringing, Soel tagging along) — no player choice,
  //      exactly as San described it: "it's just flavour text."
  //   2. THE WEDDING — scheduled one in-game day later. Checked on the
  //      same shared hook every other ambient Fair Tide system piggybacks
  //      on (syncArc1StoryQuestProgress, called on every voyage arrival
  //      among other places — see settlement-memories.js for the
  //      identical one-shot condition()/revealed-flag idiom this copies),
  //      so sailing anywhere advances the day and lets it fire.
  //
  // Both stages are one-shot: once done, dre-wedding never fires again.
  // -------------------------------------------------------------------

  function dreWeddingState(){
    game.dreWedding = game.dreWedding || {invited:false, scheduledDay:null, done:false};
    return game.dreWedding;
  }
  window.dreWeddingState = dreWeddingState;

  function dreBondMaxed(){
    if (typeof window.bondTier !== 'function' || !window.BOND_TRACKS || !window.BOND_TRACKS.san_dre) return false;
    const tiers = window.BOND_TRACKS.san_dre.tiers;
    return window.bondTier('san_dre') >= tiers.length - 1;
  }

  function showDreWeddingModal(title, blurb){
    setTimeout(function(){
      if (typeof showStoryModal === 'function') showStoryModal({title: title, blurb: blurb});
    }, 400);
  }

  function checkDreWedding(){
    const state = dreWeddingState();
    if (state.done) return;

    if (!state.invited) {
      if (!dreBondMaxed()) return;
      state.invited = true;
      state.scheduledDay = (game.day || 0) + 1;
      logEvent('💌 Dre is getting married.', 'good');
      if (typeof window.recordChronicleEntry === 'function') {
        window.recordChronicleEntry('Dre announced her engagement — a soldier, matching white attire, and a wedding date already picked.', '💌');
      }
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      showDreWeddingModal('💌 An Invitation',
        "Dre shows up with an envelope instead of coffee, for once.<br><br>" +
        "She's getting married — to a soldier, not from Fair Tide, from the army. He's already decided on his own wedding attire: his dress uniform, white instead of regulation colors. Dre's having a dress tailored to match.<br><br>" +
        "San doesn't need to think about it. Of course she's going. She's already decided who she's bringing — Joel. Soel, as always, invites himself along whether anyone asks or not.");
      return;
    }

    if ((game.day || 0) < state.scheduledDay) return;
    state.done = true;
    logEvent("💍 Dre's wedding.", 'good');
    if (typeof window.recordChronicleEntry === 'function') {
      window.recordChronicleEntry("Dre got married. Half of Fair Tide's old C. Adv acquaintances turned up, and so did a few surprises.", '💍');
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    showDreWeddingModal("💍 Dre's Wedding",
      "The wedding is small, bright, and entirely too white for a dock worth of sailors who own exactly one good outfit between them.<br><br>" +
      "San spots Robin across the room before she means to. He looks sharper — no blue hair, just Robin, in a uniform he clearly didn't earn, angling for a photograph as though he has any right to one. He's telling anyone who'll listen that he mentored Dre once, which was apparently close enough to get him an invitation. Dre doesn't hold grudges. She even lets him take photos, as if he were the father of the bride. He has never had children.<br><br>" +
      "San and Robin don't speak. There's nothing either of them wants to be the one to say first.<br><br>" +
      "She spends most of the afternoon with Erma — an old coworker from C. Adv, the kind of face she didn't expect to see again outside of paperwork. Joel, meanwhile, is entirely occupied with the food, reaching for his phone more than once before remembering it's dead and Mez is the only one who can charge it back up.<br><br>" +
      "Then, one by one, half the room turns out to be former C. Adv people — and every one of them wishes San a happy birthday before she's said a word about it. Dre is the most surprised of anyone; she hadn't realized, when she picked the date, that it was San's. \"I didn't plan that part,\" she says, laughing. \"I just liked the date.\"<br><br>" +
      "Afterward, San and Joel slip away for coffee before the walk back to the harbor — and the voyage home to Fair Tide.");
  }

  const oldSyncArc1ForDreWedding = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForDreWedding) oldSyncArc1ForDreWedding();
    checkDreWedding();
  };
})();
