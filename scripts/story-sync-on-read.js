(function(){
  // -------------------------------------------------------------------
  // STORY SYNC ON READ. Several later arcs hang state off the story-quest
  // sync (window.syncArc1StoryQuestProgress): Arc XXVIII registers N and
  // the masked guest as Fair Tide residents, Arc XXIX updates Sairen's
  // dossier (and N's "Away" companion), Arc XXX moves N's record on. That
  // sync only ran when the player sailed, arrived or won a fight, so
  // reading those chapters while staying at Fair Tide never ran it: N
  // could be missing from the Residents list at Arc XXVIII Ch.12.
  //
  // It now also runs (a) right after any of those chapters is read, and
  // (b) once per page load after a save is shown, to catch up a save that
  // is already past those chapters. The sync is idempotent.
  // -------------------------------------------------------------------
  function sync(){
    try { if (typeof window.syncArc1StoryQuestProgress === 'function' && typeof game !== 'undefined' && game) window.syncArc1StoryQuestProgress(); } catch(e) {}
  }
  window.syncStoryStateNow = sync;

  ['markArc28ChapterRead', 'markArc29ChapterRead', 'markArc30ChapterRead'].forEach(function(name){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){
      const r = old.apply(this, arguments);
      sync();
      if (typeof window.renderFairTideHub === 'function' && typeof game !== 'undefined' && game && game.fairTideActiveTab === 'allies' && document.getElementById('ft-tab-allies')) {
        try { window.renderFairTideHub(); } catch(e) {}
      }
      return r;
    };
  });

  let caughtUp = false;
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      if (!caughtUp && typeof gameSessionActive !== 'undefined' && gameSessionActive) { caughtUp = true; sync(); }
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
