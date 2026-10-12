(function(){
  // -------------------------------------------------------------------
  // N'S FATE REVEAL — the player-facing payoff to the hidden dice-roll
  // fate system (arc28-mechanics.js's rollNFate, computed once at
  // Ch.23). Deliberately NOT shown in any comic chapter: her outcome is
  // randomized per-playthrough (San Bond + Happiness + a 1d100 roll), so
  // baking it into fixed story text would make every player's version
  // identical again, defeating the whole point of the system. Instead,
  // an achievement-style toast (San's own direction: "just like in
  // achievements"), fired one of two ways:
  //
  //   1. Automatically, the moment Arc XXXII Ch.13 ("An Empty Name") is
  //      read — the one existing chapter that actually asks "whatever
  //      happened to N?" in-story. Nobody in the story gets an answer;
  //      the player does, right as the question is raised.
  //   2. On demand, via a button on N's "Case Closed" panel (arc30-
  //      mechanics.js's renderNCaseClosedPanel) once her real name is
  //      known (Ch.25) — for players who don't want to wait for Arc 32.
  //
  // Both call the same window.revealNFate(), guarded by n.trueFateRevealed
  // so whichever fires first wins and the other becomes a no-op. The
  // in-story text ("Exact punishment unknown") never changes — this is
  // an out-of-story, player-facing addendum, not a retcon of the canon
  // mystery.
  // -------------------------------------------------------------------

  window.canRevealNFate = function(){
    const residents = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState() : null;
    const n = residents ? residents.n : null;
    return !!(n && n.trueFateKey && !n.trueFateRevealed);
  };

  window.revealNFate = function(){
    if (!window.canRevealNFate()) return;
    const n = window.fairTideResidentsState().n;
    n.trueFateRevealed = true;

    const icon = (n.trueFateRoll && n.trueFateRoll.outcomeIcon) || '🌑';
    const label = n.trueFateLabel || 'Unknown';
    const note = (n.trueFateRoll && n.trueFateRoll.outcomeNote) || '';

    toast(icon + ' N\'s Fate: ' + label + (note ? ' — ' + note : ''), 7000);
    if (typeof logEvent === 'function') {
      logEvent(icon + ' The truth about N finally surfaces: ' + label + '.', 'gold');
    }
    if (typeof window.recordChronicleEntry === 'function') {
      window.recordChronicleEntry('What really happened to N: ' + label + '. ' + note, icon);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function checkNFateAutoReveal(){
    const cp = game.comicProgress32;
    if (!cp || !cp[13]) return;
    if (!window.canRevealNFate()) return;
    window.revealNFate();
  }

  const oldSyncArc1ForNFateReveal = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForNFateReveal) oldSyncArc1ForNFateReveal();
    checkNFateAutoReveal();
  };
})();
