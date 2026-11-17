(function(){
  // -------------------------------------------------------------------
  // N'S FATE NOTICE. The fate reveal (n-fate-reveal.js) sat behind a button in
  // the Archive screen's "Temporary Resident System" panel, and a toast that
  // is gone in seven seconds, so a player could miss that there was anything to
  // find. A banner now says so: once when her fate can be revealed, and again with
  // the outcome when it is. Tapping either opens the Archive.
  // -------------------------------------------------------------------
  function openArchive(){ if (typeof goScreen === 'function') goScreen('archive'); }
  function say(n){ if (typeof window.notify === 'function') window.notify(n); }

  function check(){
    if (typeof game === 'undefined' || !game || typeof window.canRevealNFate !== 'function') return;
    if (game.nFateNoticeTold) return;
    const n = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState().n : null;
    // The button in the Archive only shows once her real name is known (Arc XXX Ch.25).
    if (window.canRevealNFate() && n && n.arc30RealName) {
      game.nFateNoticeTold = true;
      say({icon: '🌑', title: 'There is more to know about N', text: 'What really happened to her can now be revealed in the Archive.', kind: 'info', duration: 7000, onClick: openArchive, hint: 'Tap to open the Archive'});
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
    }
  }
  const oldReveal = window.revealNFate;
  if (typeof oldReveal === 'function') {
    window.revealNFate = function(){
      const could = typeof window.canRevealNFate === 'function' && window.canRevealNFate();
      const r = oldReveal.apply(this, arguments);
      try {
        const n = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState().n : null;
        if (could && n && n.trueFateRevealed) {
          game.nFateNoticeTold = true;
          say({icon: (n.trueFateRoll && n.trueFateRoll.outcomeIcon) || '🌑', title: 'N’s fate: ' + (n.trueFateLabel || 'Unknown'), text: 'It is kept in the Archive and the Chronicle.', kind: 'info', duration: 7000, onClick: openArchive, hint: 'Tap to open the Archive'});
        }
      } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) check(); } catch(e) {}
      return r;
    };
  }
})();
