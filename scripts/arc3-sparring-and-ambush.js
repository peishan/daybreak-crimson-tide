(function(){
  // -------------------------------------------------------------------
  // ARC III: THE SPARRING DECK (Ch.4) AND THE DOCK AMBUSH (Ch.5).
  //
  // * Ch.4 "The First Encounter" unlocks sparring. The Training Room lives in the Fair Tide hub, and Fair Tide only opens once Arc III is finished
  //   (and the captain is Level 60), so on its own the unlock would have pointed at a place you cannot reach yet. Sparring is now also a panel on the
  //   Crew screen, the "Sparring Deck": one bout a day with a crewmate, the same bout and the same daily limit as the Training Room.
  // * Ch.5 "Together in Battle" has its minor battle: armed raiders ambush the docks. Reading the chapter starts the fight; winning it plays
  //   the chapter (the scene, then the clip) as before.
  // -------------------------------------------------------------------
  function sparUnlocked(){ return !!(game.comicProgress3 && game.comicProgress3[4]); }
  window.sparringUnlocked = sparUnlocked;
  function fairTideOpen(){ try { return typeof isPortUnlocked === 'function' && !!isPortUnlocked('fair_tide'); } catch(e) { return false; } }

  // ---- the Sparring Deck on the Crew screen ----
  function deckHtml(){
    const canTrain = typeof window.canTrainToday === 'function' ? window.canTrainToday() : true;
    let html = '<div id="sparringDeck" class="panel" style="margin-bottom:12px;"><div class="panel-title">⚔️ The Sparring Deck</div>' +
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">A bout with a crewmate on the deck. Nothing is lost if you fall, and everyone still sharpens up. One bout a day.' +
      (fairTideOpen() ? ' (The Training Room at Fair Tide shares this limit.)' : '') + '</div>';
    if (!canTrain) return html + '<div class="story-chip">Already trained today. Come back tomorrow.</div></div>';
    const party = (typeof getActiveParty === 'function') ? getActiveParty().filter(function(m){ return m.id !== 'san'; }) : [];
    if (!party.length) return html + '<div class="story-chip">No one is aboard to spar with yet.</div></div>';
    return html + party.map(function(m){
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;border-top:1px solid rgba(196,163,90,.14);"><span><strong>' + esc(m.name) + '</strong> <span style="font-size:.78rem;opacity:.75;">' + esc(m.role || '') + '</span></span>' +
        '<button class="btn btn-small btn-success" onclick="startTrainingBout(\'' + m.id + '\')">⚔️ Spar</button></div>';
    }).join('') + '</div>';
  }
  const oldRenderParty = window.renderPartyScreen;
  if (typeof oldRenderParty === 'function') {
    window.renderPartyScreen = function(){
      const r = oldRenderParty.apply(this, arguments);
      try {
        const c = document.getElementById('partyDetail');
        if (c && sparUnlocked() && !c.querySelector('#sparringDeck')) c.insertAdjacentHTML('afterbegin', deckHtml());
      } catch(e) {}
      return r;
    };
  }
  // After a bout, go back to where it was started from: the Training Room once Fair Tide is open, the Crew screen before that.
  const oldBack = window.backToTrainingRoom;
  window.backToTrainingRoom = function(){
    if (fairTideOpen() || typeof oldBack !== 'function') return oldBack ? oldBack.apply(this, arguments) : undefined;
    game.pendingPostBattle = null;
    if (typeof goScreen === 'function') goScreen('party');
    if (typeof renderPartyScreen === 'function') renderPartyScreen();
  };
  // tell the player once, the moment the chapter is read (renderStory runs at the end of the chapter's completion)
  const oldRenderStory = window.renderStory;
  if (typeof oldRenderStory === 'function') {
    window.renderStory = function(){
      const r = oldRenderStory.apply(this, arguments);
      try {
        if (sparUnlocked() && !game.sparringAnnounced) {
          game.sparringAnnounced = true;
          const msg = 'Spar with a crewmate once a day from the Crew screen. Nothing is lost if you fall.';
          if (typeof window.notify === 'function') window.notify({ icon: '⚔️', title: 'Sparring unlocked', text: msg, kind: 'info', duration: 6500 });
          else if (typeof toast === 'function') toast('⚔️ Sparring unlocked. ' + msg, 4800);
          if (typeof saveGameQuiet === 'function') saveGameQuiet();
        }
      } catch(e) {}
      return r;
    };
  }

  // ---- Ch.5: the dock ambush ----
  function ambushEnemy(){
    const base = { name: 'Dock Raiders', icon: '🏴‍☠️', hp: 150, dmg: 9, xp: 60, gold: 40, desc: 'Armed raiders hit the docks during a supply run.' };
    return (typeof scaleCrimsonEnemy === 'function') ? scaleCrimsonEnemy(base, 'harbor') : base;
  }
  const oldMark = window.markArc3ChapterRead;
  if (typeof oldMark === 'function') {
    window.markArc3ChapterRead = function(id){
      const read = !!(game.comicProgress3 && game.comicProgress3[5]);
      if (Number(id) === 5 && !read && !game.arc3AmbushWon && typeof window.arc3ObjectiveState === 'function' && window.arc3ObjectiveState() === 'complete_arc3_chapter_5' && typeof startCombat === 'function') {
        if (typeof toast === 'function') toast('⚔️ Raiders hit the docks! San takes the left, Joel the front.', 3600);
        startCombat({ kind: 'arc_story', key: 'arc3_5', enemy: ambushEnemy() });
        return;
      }
      return oldMark.apply(this, arguments);
    };
  }
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') {
    window.handleVictory = function(){
      const enemy = game.combatEnemy;
      const r = oldVictory.apply(this, arguments);
      try {
        if (enemy && enemy.kind === 'arc_story' && enemy.key === 'arc3_5' && !game.arc3AmbushWon) {
          game.arc3AmbushWon = true;
          if (typeof saveGameQuiet === 'function') saveGameQuiet();
          setTimeout(function(){ window.markArc3ChapterRead(5); }, 1300);   // the chapter's scene and clip follow the win
        }
      } catch(e) {}
      return r;
    };
  }
})();
